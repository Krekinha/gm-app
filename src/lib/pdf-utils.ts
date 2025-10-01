import jsPDF from "jspdf";
import { RelatorioTecnicoData, FotoRelatorio, PDFConfig, defaultPDFConfig } from "./relatorio-types";
import { buscarEmpresaPadrao } from "./empresa-database";

/**
 * Utilitários para geração de PDF do relatório técnico
 */

/**
 * Gera o PDF do relatório técnico
 */
export async function generateRelatorioPDF(
  data: RelatorioTecnicoData,
  fotos: FotoRelatorio[],
  config: PDFConfig = defaultPDFConfig
): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const { pageWidth, pageHeight, margin, fontSize, colors } = config;
  let currentY = margin;

  // Buscar dados da empresa padrão pelo ID fixo
  let empresaPadrao;
  try {
    empresaPadrao = await buscarEmpresaPadrao();
  } catch (error) {
    console.warn("Erro ao buscar empresa padrão:", error);
    // Usar dados padrão como fallback
    empresaPadrao = {
      razaoSocial: "GM MANUTENÇÕES LTDA",
      cnpj: "37.097.718/0001-58",
      logoUrl: "/relatorio-tecnico/logo.png"
    };
  }

  // Garantir que empresaPadrao não seja null
  if (!empresaPadrao) {
    empresaPadrao = {
      razaoSocial: "GM MANUTENÇÕES LTDA",
      cnpj: "37.097.718/0001-58",
      logoUrl: "/relatorio-tecnico/logo.png"
    };
  }

  // Função auxiliar para aplicar imagem de fundo em uma página
  const applyBackgroundImage = async (pageNumber: number) => {
    if (data.imagemFundo) {
      try {
        // Aplicar imagem de fundo cobrindo toda a página
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
      } catch (error) {
        console.warn(`Erro ao aplicar imagem de fundo na página ${pageNumber}:`, error);
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
      console.warn("Erro ao carregar logo:", error);
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

  // Adicionar fotos não vinculadas
  const fotosNaoVinculadas = fotos.filter(foto => !foto.vinculadaA);
  if (fotosNaoVinculadas.length > 0) {
    let fotosSection = "FOTOS ADICIONAIS\n\n";
    
    fotosNaoVinculadas.forEach((foto, index) => {
      fotosSection += `Fig. ${foto.numeroFigura || index + 1}: [Foto adicional]\n`;
    });

    currentY = addSection("FOTOS ADICIONAIS", fotosSection, currentY);
  }

  // Verificar se precisa de nova página para fotos
  if (currentY > pageHeight - 100) {
    doc.addPage();
    await applyBackgroundImage(doc.getNumberOfPages());
    currentY = margin;
  }

  // Adicionar fotos reais
  for (const foto of fotos) {
    if (currentY > pageHeight - 50) {
      doc.addPage();
      await applyBackgroundImage(doc.getNumberOfPages());
      currentY = margin;
    }

    try {
      const img = new Image();
      img.src = foto.dataUrl;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

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

      // Adicionar legenda
      const legenda = `Fig. ${foto.numeroFigura || fotos.indexOf(foto) + 1}`;
      currentY = addText(legenda, margin, currentY, maxWidth, fontSize.small);
      
      // Adicionar imagem
      doc.addImage(foto.dataUrl, "JPEG", margin, currentY, imgWidth, imgHeight);
      currentY += imgHeight + 10;
      
    } catch (error) {
      console.warn(`Erro ao adicionar foto ${foto.id}:`, error);
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
 */
export async function generatePDFPreview(
  data: RelatorioTecnicoData,
  fotos: FotoRelatorio[]
): Promise<string> {
  const pdf = await generateRelatorioPDF(data, fotos);
  const pdfBlob = pdf.output("blob");
  return URL.createObjectURL(pdfBlob);
}

/**
 * Baixa o PDF gerado
 */
export async function downloadPDF(
  data: RelatorioTecnicoData,
  fotos: FotoRelatorio[],
  filename: string = "relatorio-tecnico.pdf"
): Promise<void> {
  const pdf = await generateRelatorioPDF(data, fotos);
  pdf.save(filename);
}
