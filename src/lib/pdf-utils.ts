import jsPDF from "jspdf";
import { RelatorioTecnicoData, FotoRelatorio, PDFConfig, defaultPDFConfig } from "./relatorio-types";

/**
 * Tipo para callback de notificação
 */
export type NotificationCallback = (type: "error" | "warning" | "success" | "info", message: string, title?: string) => void;

/**
 * Busca empresa por CNPJ via API
 */
async function buscarEmpresaPorCnpjAPI(cnpj: string): Promise<any> {
  const response = await fetch(`/api/empresas/buscar?cnpj=${encodeURIComponent(cnpj)}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Erro ao buscar empresa");
  }
  
  return response.json();
}

/**
 * Utilitários para geração de PDF do relatório técnico
 */

/**
 * Gera o PDF do relatório técnico
 * @param data - Dados do relatório técnico
 * @param fotos - Array de fotos do relatório
 * @param config - Configurações do PDF (opcional)
 * @param onNotification - Callback para notificações (opcional)
 */
export async function generateRelatorioPDF(
  data: RelatorioTecnicoData,
  fotos: FotoRelatorio[],
  config: PDFConfig = defaultPDFConfig,
  onNotification?: NotificationCallback
): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const { pageWidth, pageHeight, margin, fontSize, colors } = config;
  let currentY = margin;

  // Buscar dados da empresa padrão pelo CNPJ fixo
  let empresaPadrao;
  try {
    empresaPadrao = await buscarEmpresaPorCnpjAPI("37.097.718/0001-58");
  } catch (error) {
    const errorMessage = "Erro ao buscar empresa padrão no banco de dados";
    if (onNotification) {
      onNotification("error", errorMessage, "Erro de Conexão");
    }
    throw new Error(`${errorMessage}: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  if (!empresaPadrao) {
    const errorMessage = "Empresa padrão não encontrada no banco de dados. Verifique se os dados da empresa estão cadastrados corretamente.";
    if (onNotification) {
      onNotification("error", errorMessage, "Empresa não encontrada");
    }
    throw new Error(errorMessage);
  }

  // Função auxiliar para aplicar imagem de fundo em uma página
  const applyBackgroundImage = async (pageNumber: number) => {
    if (data.imagemFundo) {
      try {
        // IMPORTANTE: A imagem de fundo deve ser aplicada PRIMEIRO para ficar atrás de todos os elementos
        // O jsPDF renderiza elementos na ordem em que são adicionados
        doc.addImage(
          data.imagemFundo, 
          "PNG", 
          0, 
          0, 
          pageWidth, 
          pageHeight,
          undefined,
          "FAST" // Modo rápido para melhor performance
        );
        
        // Log para debug (pode ser removido em produção)
        console.log(`Imagem de fundo aplicada na página ${pageNumber} - posição: (0,0) até (${pageWidth},${pageHeight})`);
      } catch (error) {
        const errorMessage = `Erro ao aplicar imagem de fundo na página ${pageNumber}`;
        console.warn(errorMessage, error);
        if (onNotification) {
          onNotification("error", errorMessage, "Erro de Imagem de Fundo");
        }
      }
    }
  };

  // Aplicar imagem de fundo na primeira página
  await applyBackgroundImage(1);

  // Função auxiliar para adicionar texto com quebra de linha
  const addText = (text: string, x: number, y: number, maxWidth: number, size: number = fontSize.normal) => {
    doc.setFontSize(size);
    doc.setTextColor(colors.text);
    
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * (size * 0.35));
  };

  // Função auxiliar para adicionar linha horizontal
  const addHorizontalLine = (y: number) => {
    doc.setDrawColor(colors.border);
    doc.line(margin, y, pageWidth - margin, y);
  };

  // Função auxiliar para adicionar seção
  const addSection = (title: string, content: string, y: number): number => {
    let newY = addText(title, margin, y, pageWidth - 2 * margin, fontSize.subtitle);
    newY += 2;
    newY = addText(content, margin, newY, pageWidth - 2 * margin);
    newY += 5;
    addHorizontalLine(newY);
    return newY + 3;
  };

  // Cabeçalho
  if (empresaPadrao.logoUrl) {
    try {
      // Adicionar logo se disponível
      const logoImg = new Image();
      logoImg.src = empresaPadrao.logoUrl;
      await new Promise((resolve) => {
        logoImg.onload = resolve;
      });
      
      const logoWidth = 30;
      const logoHeight = (logoImg.height * logoWidth) / logoImg.width;
      doc.addImage(empresaPadrao.logoUrl, "PNG", margin, currentY, logoWidth, logoHeight);
      currentY += logoHeight + 5;
    } catch (error) {
      const errorMessage = "Erro ao carregar logo da empresa";
      console.warn(errorMessage, error);
      if (onNotification) {
        onNotification("error", errorMessage, "Erro de Logo");
      }
    }
  }

  // Título do relatório
  currentY = addText("RELATÓRIO TÉCNICO DE SERVIÇO", margin, currentY, pageWidth - 2 * margin, fontSize.title);
  currentY += 5;

  // Dados da empresa
  currentY = addText(empresaPadrao.razaoSocial, margin, currentY, pageWidth - 2 * margin, fontSize.subtitle);
  currentY = addText(`CNPJ: ${empresaPadrao.cnpj}`, margin, currentY, pageWidth - 2 * margin);
  currentY += 10;

  addHorizontalLine(currentY);
  currentY += 5;

  // Dados do Contrato
  const dadosContrato = `
Contrato: ${data.contrato}
Valor Inicial: ${data.valorInicial}
RQ: ${data.rq}
OS: ${data.os}
Pedido: ${data.pedido}
  `.trim();

  currentY = addSection("DADOS DO CONTRATO", dadosContrato, currentY);

  // Escopo
  currentY = addSection("ESCOPO", data.descricaoEscopo, currentY);

  // Descrição Técnica
  let descricaoTecnica = "";
  
  data.itensTecnicos.forEach((item, index) => {
    descricaoTecnica += `${index + 1}. ${item.descricao}\n`;
    
    // Adicionar fotos vinculadas ao item
    const fotosItem = fotos.filter(foto => foto.vinculadaA === item.id);
    if (fotosItem.length > 0) {
      fotosItem.forEach((foto, fotoIndex) => {
        descricaoTecnica += `   Fig. ${foto.numeroFigura || fotoIndex + 1}: [Foto vinculada]\n`;
      });
    }
    descricaoTecnica += "\n";
  });

  currentY = addSection("DESCRIÇÃO TÉCNICA", descricaoTecnica, currentY);

  // Adicionar seção de fotos apenas se houver fotos para renderizar
  if (fotos.length > 0) {
    currentY = addSection("FOTOS DO SERVIÇO", "", currentY);
  }

  // Verificar se precisa de nova página para fotos
  if (currentY > pageHeight - 100) {
    doc.addPage();
    await applyBackgroundImage(doc.getNumberOfPages());
    currentY = margin;
  }

  // Adicionar fotos reais
  console.log(`Renderizando ${fotos.length} fotos no PDF`);
  
  for (const foto of fotos) {
    console.log(`Processando foto ${foto.id}:`, {
      hasDataUrl: !!foto.dataUrl,
      dataUrlLength: foto.dataUrl?.length || 0,
      numeroFigura: foto.numeroFigura,
      vinculadaA: foto.vinculadaA
    });
    
    if (currentY > pageHeight - 50) {
      doc.addPage();
      await applyBackgroundImage(doc.getNumberOfPages());
      currentY = margin;
    }

    try {
      if (!foto.dataUrl) {
        console.warn(`Foto ${foto.id} não possui dataUrl`);
        const fallbackText = `Fig. ${foto.numeroFigura || fotos.indexOf(foto) + 1}: [Foto sem dados]`;
        currentY = addText(fallbackText, margin, currentY, pageWidth - 2 * margin, fontSize.small);
        currentY += 10;
        continue;
      }
      
      const img = new Image();
      img.src = foto.dataUrl;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      console.log(`Imagem carregada com sucesso: ${img.width}x${img.height}`);

      // Calcular dimensões da imagem
      const maxWidth = pageWidth - 2 * margin;
      const maxHeight = 80;
      
      let imgWidth = img.width;
      let imgHeight = img.height;
      
      if (imgWidth > maxWidth) {
        imgHeight = (imgHeight * maxWidth) / imgWidth;
        imgWidth = maxWidth;
      }
      
      if (imgHeight > maxHeight) {
        imgWidth = (imgWidth * maxHeight) / imgHeight;
        imgHeight = maxHeight;
      }

      console.log(`Dimensões calculadas: ${imgWidth}x${imgHeight}`);

      // Adicionar legenda
      const legenda = `Fig. ${foto.numeroFigura || fotos.indexOf(foto) + 1}`;
      currentY = addText(legenda, margin, currentY, maxWidth, fontSize.small);
      
      // Adicionar imagem
      console.log(`Adicionando imagem na posição Y: ${currentY}`);
      doc.addImage(foto.dataUrl, "JPEG", margin, currentY, imgWidth, imgHeight);
      currentY += imgHeight + 10;
      console.log(`Imagem adicionada com sucesso. Nova posição Y: ${currentY}`);
      
    } catch (error) {
      const errorMessage = `Erro ao adicionar foto ${foto.id}: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMessage, error);
      if (onNotification) {
        onNotification("error", errorMessage, "Erro de Foto");
      }
      
      // Adicionar texto de fallback para a foto que falhou
      const fallbackText = `Fig. ${foto.numeroFigura || fotos.indexOf(foto) + 1}: [Erro ao carregar imagem]`;
      currentY = addText(fallbackText, margin, currentY, pageWidth - 2 * margin, fontSize.small);
      currentY += 10;
    }
  }

  // Elaborado por
  const elaboradoPor = `
Nome: ${data.nomeElaborador}
Cargo 1: ${data.cargo1}
Cargo 2: ${data.cargo2}
Data: ${data.dataElaboracao}
  `.trim();

  currentY = addSection("ELABORADO POR", elaboradoPor, currentY);

  // Rodapé
  const rodape = `
${empresaPadrao.razaoSocial}
CNPJ: ${empresaPadrao.cnpj}
Telefone: ${data.telefone}
Email: ${data.email}
Instagram: ${data.instagram}
  `.trim();

  // Adicionar rodapé e fundo em todas as páginas
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Aplicar imagem de fundo se não foi aplicada ainda
    if (data.imagemFundo && i > 1) {
      await applyBackgroundImage(i);
    }
    
    // Adicionar rodapé no final da página
    const footerY = pageHeight - margin;
    addText(rodape, margin, footerY, pageWidth - 2 * margin, fontSize.small);
  }

  return doc;
}

/**
 * Gera preview do PDF como blob URL
 * @param data - Dados do relatório técnico
 * @param fotos - Array de fotos do relatório
 * @param onError - Callback para tratamento de erros (opcional)
 */
export async function generatePDFPreview(
  data: RelatorioTecnicoData,
  fotos: FotoRelatorio[],
  onNotification?: NotificationCallback
): Promise<string> {
  try {
    const pdf = await generateRelatorioPDF(data, fotos, defaultPDFConfig, onNotification);
    const pdfBlob = pdf.output("blob");
    return URL.createObjectURL(pdfBlob);
  } catch (error) {
    const errorMessage = "Erro ao gerar preview do PDF";
    if (onNotification) {
      onNotification("error", errorMessage, "Erro de Preview");
    }
    throw error;
  }
}

/**
 * Baixa o PDF gerado
 * @param data - Dados do relatório técnico
 * @param fotos - Array de fotos do relatório
 * @param filename - Nome do arquivo (opcional)
 * @param onError - Callback para tratamento de erros (opcional)
 */
export async function downloadPDF(
  data: RelatorioTecnicoData,
  fotos: FotoRelatorio[],
  filename: string = "relatorio-tecnico.pdf",
  onNotification?: NotificationCallback
): Promise<void> {
  try {
    const pdf = await generateRelatorioPDF(data, fotos, defaultPDFConfig, onNotification);
    pdf.save(filename);
  } catch (error) {
    const errorMessage = "Erro ao baixar PDF";
    if (onNotification) {
      onNotification("error", errorMessage, "Erro de Download");
    }
    throw error;
  }
}

/**
 * Função de teste para verificar se a imagem de fundo está sendo renderizada corretamente
 * Esta função gera um PDF simples com apenas a imagem de fundo e alguns elementos de teste
 */
export async function testBackgroundImageRendering(
  backgroundImageDataUrl: string,
  config: PDFConfig = defaultPDFConfig
): Promise<jsPDF> {
  const { pageWidth, pageHeight, margin, fontSize } = config;
  
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  // 1. PRIMEIRO: Aplicar imagem de fundo (deve ficar atrás de tudo)
  if (backgroundImageDataUrl) {
    try {
      doc.addImage(
        backgroundImageDataUrl,
        "PNG",
        0,
        0,
        pageWidth,
        pageHeight,
        undefined,
        "FAST"
      );
      console.log("✅ Imagem de fundo aplicada PRIMEIRO - deve ficar atrás de todos os elementos");
    } catch (error) {
      console.error("❌ Erro ao aplicar imagem de fundo:", error);
    }
  }

  // 2. SEGUNDO: Adicionar elementos de teste (devem ficar na frente da imagem)
  doc.setFontSize(fontSize.title);
  doc.setTextColor(255, 0, 0); // Texto vermelho para destacar
  doc.text("TESTE DE RENDERIZAÇÃO", margin, margin + 20);
  
  doc.setFontSize(fontSize.normal);
  doc.setTextColor(0, 0, 255); // Texto azul
  doc.text("Este texto deve aparecer NA FRENTE da imagem de fundo", margin, margin + 40);
  
  // Adicionar um retângulo colorido para teste
  doc.setFillColor(255, 255, 0); // Amarelo
  doc.rect(margin, margin + 60, 50, 20, "F");
  
  doc.setTextColor(0, 0, 0); // Texto preto
  doc.text("Retângulo amarelo", margin + 5, margin + 75);

  console.log("✅ Elementos de teste adicionados DEPOIS da imagem de fundo");
  console.log("📋 Ordem de renderização:");
  console.log("   1. Imagem de fundo (atrás)");
  console.log("   2. Texto vermelho (frente)");
  console.log("   3. Texto azul (frente)");
  console.log("   4. Retângulo amarelo (frente)");

  return doc;
}
