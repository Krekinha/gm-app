"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  FileText, 
  Upload, 
  Eye, 
  Download, 
  Plus, 
  Trash2,
  Link as LinkIcon,
  Unlink,
  Save
} from "lucide-react";

import { 
  relatorioTecnicoSchema, 
  RelatorioTecnicoData, 
  initialRelatorioData,
  FotoRelatorio,
  ItemTecnico,
  defaultPDFConfig
} from "@/lib/relatorio-types";
import { 
  validateImageFile, 
  fileToDataURL, 
  generatePhotoId, 
  generateItemId,
  formatFileSize,
  cleanupBlobURL
} from "@/lib/image-utils";
import { generateRelatorioPDF } from "@/lib/pdf-utils";
import { adicionarRelatorio } from "@/lib/relatorios-api";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { jsPDF } from "jspdf";

// Componente para upload de imagens
import { ImageUpload } from "./components/ImageUpload";
// Componente para formulário de dados
import { RelatorioForm } from "./components/RelatorioForm";
// Componente para preview do PDF
import { PDFPreview } from "./components/PDFPreview";
import { RelatorioSelector } from "./components/RelatorioSelector";

export default function RelatorioTecnicoPage() {
  const [fotos, setFotos] = useState<FotoRelatorio[]>([]);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string>("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [activeTab, setActiveTab] = useState("formulario");
  const [mostrarSalvarModelo, setMostrarSalvarModelo] = useState(false);
  const [nomeNovoModelo, setNomeNovoModelo] = useState("");

  // Hook para tratamento de erros
  const { showError, showSuccess, showNotification } = useErrorHandler();

  const form = useForm<RelatorioTecnicoData>({
    resolver: zodResolver(relatorioTecnicoSchema),
    defaultValues: initialRelatorioData
  });

  const { watch, setValue, getValues } = form;
  const formData = watch();

  // Função para adicionar nova foto
  const handleAddPhoto = useCallback(async (files: File[]) => {
    const newFotos: FotoRelatorio[] = [];

    for (const file of files) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        showError(validation.error, "Erro na validação da imagem");
        continue;
      }

      try {
        const dataUrl = await fileToDataURL(file);
        const foto: FotoRelatorio = {
          id: generatePhotoId(),
          file,
          dataUrl,
          numeroFigura: fotos.length + newFotos.length + 1
        };
        newFotos.push(foto);
      } catch (error) {
        console.error("Erro ao processar arquivo:", error);
        showError(error, "Erro ao processar arquivo");
      }
    }

    if (newFotos.length > 0) {
      setFotos(prev => [...prev, ...newFotos]);
    }
  }, [fotos.length, showError]);

  // Função para remover foto
  const handleRemovePhoto = useCallback((fotoId: string) => {
    setFotos(prev => {
      const foto = prev.find(f => f.id === fotoId);
      if (foto) {
        cleanupBlobURL(foto.dataUrl);
      }
      return prev.filter(f => f.id !== fotoId);
    });
  }, []);

  // Função para vincular foto a item técnico
  const handleLinkPhoto = useCallback((fotoId: string, itemId: string) => {
    setFotos(prev => prev.map(foto => 
      foto.id === fotoId 
        ? { ...foto, vinculadaA: itemId }
        : foto
    ));
  }, []);

  // Função para desvincular foto
  const handleUnlinkPhoto = useCallback((fotoId: string) => {
    setFotos(prev => prev.map(foto => 
      foto.id === fotoId 
        ? { ...foto, vinculadaA: undefined }
        : foto
    ));
  }, []);

  // Função para adicionar novo item técnico
  const handleAddItemTecnico = useCallback(() => {
    const currentItens = getValues("itensTecnicos");
    const newItem: ItemTecnico = {
      id: generateItemId(),
      descricao: "",
      fotosVinculadas: []
    };
    setValue("itensTecnicos", [...currentItens, newItem]);
  }, [getValues, setValue]);

  // Função para remover item técnico
  const handleRemoveItemTecnico = useCallback((itemId: string) => {
    const currentItens = getValues("itensTecnicos");
    if (currentItens.length > 1) {
      setValue("itensTecnicos", currentItens.filter(item => item.id !== itemId));
      
      // Desvincular fotos do item removido
      setFotos(prev => prev.map(foto => 
        foto.vinculadaA === itemId 
          ? { ...foto, vinculadaA: undefined }
          : foto
      ));
    }
  }, [getValues, setValue]);

  // Função para gerar preview do PDF
  const handleGeneratePreview = useCallback(async () => {
    setIsGeneratingPDF(true);
    try {
      const data = getValues();
      const pdf = await generateRelatorioPDF(data, fotos, defaultPDFConfig, showNotification);
      const pdfBlob = pdf.output("blob");
      const previewUrl = URL.createObjectURL(pdfBlob);
      
      // Limpar URL anterior
      if (pdfPreviewUrl) {
        cleanupBlobURL(pdfPreviewUrl);
      }
      
      setPdfPreviewUrl(previewUrl);
    } catch (error) {
      console.error("Erro ao gerar preview:", error);
      showError(error, "Erro ao gerar preview do PDF");
    } finally {
      setIsGeneratingPDF(false);
    }
  }, [getValues, fotos, pdfPreviewUrl, showError, showNotification]);

  // Função para gerar preview automático com dados de teste
  const handleTestPreview = useCallback(async () => {
    setIsGeneratingPDF(true);
    try {
      // Dados de teste baseados na imagem fornecida (Geraldinho Manutenções)
      const testData: RelatorioTecnicoData = {
        contrato: "GM-2024-001",
        valorInicial: "R$ 15.000,00",
        rq: "RQ-2024-001",
        os: "OS-2024-001",
        pedido: "PED-2024-001",
        descricaoEscopo: "Instalação e manutenção de sistemas elétricos conforme especificações técnicas. Inclui instalação de tomadas, interruptores, iluminação e verificação de toda a infraestrutura elétrica do local.",
        itensTecnicos: [
          {
            id: "item-1",
            descricao: "Instalação de 15 tomadas elétricas padrão brasileiro (NBR 14136) em pontos estratégicos conforme projeto elétrico."
          },
          {
            id: "item-2", 
            descricao: "Substituição de 8 interruptores simples por interruptores de duas seções com dimmer para controle de iluminação."
          },
          {
            id: "item-3",
            descricao: "Instalação de 12 pontos de iluminação LED com suporte para lâmpadas de 9W, incluindo fiação e caixas de passagem."
          },
          {
            id: "item-4",
            descricao: "Verificação e manutenção do quadro de distribuição principal, incluindo teste de disjuntores e aterramento."
          },
          {
            id: "item-5",
            descricao: "Instalação de sistema de aterramento conforme NBR 5410, com medição de resistência de aterramento."
          }
        ],
        nomeElaborador: "João Silva",
        cargo1: "Técnico em Eletrotécnica",
        cargo2: "Responsável Técnico",
        dataElaboracao: new Date().toLocaleDateString('pt-BR'),
        telefone: "(31) 99999-9999",
        email: "contato@geraldinhomanutencoes.com.br",
        instagram: "@geraldinhomanutencoes",
        // Dados fictícios da empresa
        razaoSocial: "Geraldinho Manutenções Ltda",
        cnpj: "12.345.678/0001-90",
        logoUrl: "/relatorio-tecnico/logo-empresa.png", // Logo fictício
        imagemFundo: "/relatorio-tecnico/fundo-pdf.jpg"
      };

      // Carregar imagens de teste automaticamente
      const testFotos: FotoRelatorio[] = [];
      const imageFiles = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'];
      
      for (let i = 0; i < imageFiles.length; i++) {
        try {
          const response = await fetch(`/relatorio-tecnico/img-test/${imageFiles[i]}`);
          const blob = await response.blob();
          const file = new File([blob], imageFiles[i], { type: 'image/jpeg' });
          
          const dataUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });

          testFotos.push({
            id: `test-foto-${i + 1}`,
            file,
            dataUrl,
            numeroFigura: i + 1
          });
        } catch (error) {
          console.warn(`Erro ao carregar imagem ${imageFiles[i]}:`, error);
        }
      }

      // Gerar PDF diretamente sem chamar generateRelatorioPDF
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const { pageWidth, pageHeight, margin, fontSize, colors } = defaultPDFConfig;
      let currentY = margin;

      // Função auxiliar para aplicar imagem de fundo
      const applyBackgroundImage = async (pageNumber: number) => {
        if (testData.imagemFundo) {
          try {
            doc.addImage(
              testData.imagemFundo, 
              "PNG", 
              0, 
              0, 
              pageWidth, 
              pageHeight,
              undefined,
              "FAST"
            );
            console.log(`Imagem de fundo aplicada na página ${pageNumber}`);
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

      // Cabeçalho com logo da empresa (se disponível)
      if (testData.logoUrl) {
        try {
          const logoImg = new Image();
          logoImg.src = testData.logoUrl;
          await new Promise((resolve) => {
            logoImg.onload = resolve;
          });
          
          const logoWidth = 30;
          const logoHeight = (logoImg.height * logoWidth) / logoImg.width;
          doc.addImage(testData.logoUrl, "PNG", margin, currentY, logoWidth, logoHeight);
          currentY += logoHeight + 5;
        } catch (error) {
          console.warn("Erro ao carregar logo da empresa:", error);
        }
      }

      // Título do relatório
      currentY = addText("RELATÓRIO TÉCNICO DE SERVIÇO", margin, currentY, pageWidth - 2 * margin, fontSize.title);
      currentY += 5;

      // Dados da empresa
      currentY = addText(testData.razaoSocial || "Geraldinho Manutenções Ltda", margin, currentY, pageWidth - 2 * margin, fontSize.subtitle);
      currentY = addText(`CNPJ: ${testData.cnpj || "12.345.678/0001-90"}`, margin, currentY, pageWidth - 2 * margin);
      currentY += 10;

      addHorizontalLine(currentY);
      currentY += 5;

      // Dados do Contrato
      const dadosContrato = `
Contrato: ${testData.contrato}
Valor Inicial: ${testData.valorInicial}
RQ: ${testData.rq}
OS: ${testData.os}
Pedido: ${testData.pedido}
      `.trim();

      currentY = addSection("DADOS DO CONTRATO", dadosContrato, currentY);

      // Escopo
      currentY = addSection("ESCOPO", testData.descricaoEscopo, currentY);

      // Descrição Técnica
      let descricaoTecnica = "";
      
      testData.itensTecnicos.forEach((item, index) => {
        descricaoTecnica += `${index + 1}. ${item.descricao}\n`;
        
        // Adicionar fotos vinculadas ao item
        const fotosItem = testFotos.filter(foto => foto.vinculadaA === item.id);
        if (fotosItem.length > 0) {
          fotosItem.forEach((foto, fotoIndex) => {
            descricaoTecnica += `   Fig. ${foto.numeroFigura || fotoIndex + 1}: [Foto vinculada]\n`;
          });
        }
        descricaoTecnica += "\n";
      });

      currentY = addSection("DESCRIÇÃO TÉCNICA", descricaoTecnica, currentY);

      // Adicionar seção de fotos apenas se houver fotos para renderizar
      if (testFotos.length > 0) {
        currentY = addSection("FOTOS DO SERVIÇO", "", currentY);
      }

      // Verificar se precisa de nova página para fotos
      if (currentY > pageHeight - 100) {
        doc.addPage();
        await applyBackgroundImage(doc.getNumberOfPages());
        currentY = margin;
      }

      // Adicionar fotos reais
      console.log(`Renderizando ${testFotos.length} fotos no PDF`);
      
      for (const foto of testFotos) {
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
            const fallbackText = `Fig. ${foto.numeroFigura || testFotos.indexOf(foto) + 1}: [Foto sem dados]`;
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

          // Adicionar legenda da foto
          const legenda = `Fig. ${foto.numeroFigura || testFotos.indexOf(foto) + 1}: Foto do serviço`;
          currentY = addText(legenda, margin, currentY, pageWidth - 2 * margin, fontSize.small);
          currentY += 2;

          // Adicionar a imagem
          doc.addImage(foto.dataUrl, "JPEG", margin, currentY, imgWidth, imgHeight);
          currentY += imgHeight + 10;

        } catch (error) {
          console.error(`Erro ao processar foto ${foto.id}:`, error);
          const fallbackText = `Fig. ${foto.numeroFigura || testFotos.indexOf(foto) + 1}: [Erro ao carregar foto]`;
          currentY = addText(fallbackText, margin, currentY, pageWidth - 2 * margin, fontSize.small);
          currentY += 10;
        }
      }

      // Rodapé com informações do elaborador
      if (currentY > pageHeight - 60) {
        doc.addPage();
        await applyBackgroundImage(doc.getNumberOfPages());
        currentY = margin;
      }

      currentY = addSection("ELABORADO POR", `
${testData.nomeElaborador}
${testData.cargo1}
${testData.cargo2}
Data: ${testData.dataElaboracao}

Contato:
Telefone: ${testData.telefone}
Email: ${testData.email}
Instagram: ${testData.instagram}
      `.trim(), currentY);

      // Gerar blob e URL do preview
      const pdfBlob = doc.output("blob");
      const previewUrl = URL.createObjectURL(pdfBlob);
      
      // Limpar URL anterior
      if (pdfPreviewUrl) {
        cleanupBlobURL(pdfPreviewUrl);
      }
      
      setPdfPreviewUrl(previewUrl);
      showSuccess("Preview de teste gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar preview de teste:", error);
      showError(error, "Erro ao gerar preview de teste");
    } finally {
      setIsGeneratingPDF(false);
    }
  }, [pdfPreviewUrl, showError, showNotification, showSuccess]);

  // Função para baixar PDF
  const handleDownloadPDF = useCallback(async () => {
    try {
      const data = getValues();
      const pdf = await generateRelatorioPDF(data, fotos, defaultPDFConfig, showNotification);
      pdf.save(`relatorio-tecnico-${data.contrato}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("Erro ao baixar PDF:", error);
      showError(error, "Erro ao baixar PDF");
    }
  }, [getValues, fotos, showError, showNotification]);

  // Função para salvar como modelo
  const handleSaveAsModel = useCallback(async () => {
    setMostrarSalvarModelo(true);
  }, []);

  const handleConfirmSaveModel = useCallback(async () => {
    if (!nomeNovoModelo.trim()) {
      showError("Por favor, digite um nome para o modelo", "Nome obrigatório");
      return;
    }

    try {
      const data = getValues();
      await adicionarRelatorio({
        nome: nomeNovoModelo.trim(),
        contrato: data.contrato,
        valorInicial: data.valorInicial,
        rq: data.rq,
        os: data.os,
        pedido: data.pedido,
        descricaoEscopo: data.descricaoEscopo,
        itensRelatorio: data.itensTecnicos.map(item => ({
          id: item.id,
          descricao: item.descricao,
          ordem: 0
        })),
        imagemFundoUrl: data.imagemFundo
      });

      showSuccess("Modelo salvo com sucesso!");
      setMostrarSalvarModelo(false);
      setNomeNovoModelo("");
    } catch (error) {
      console.error("Erro ao salvar modelo:", error);
      showError(error, "Erro ao salvar modelo");
    }
  }, [nomeNovoModelo, getValues, showError, showSuccess]);

  // Carregar imagem de fundo padrão automaticamente
  useEffect(() => {
    const loadDefaultBackgroundImage = async () => {
      // Verificar se já existe uma imagem de fundo carregada
      const currentImageFundo = getValues("imagemFundo");
      if (currentImageFundo) {
        return; // Já existe uma imagem carregada
      }

      try {
        // Carregar a imagem de fundo padrão
        const response = await fetch("/relatorio-tecnico/fundo-pdf.jpg");
        if (response.ok) {
          const blob = await response.blob();
          const dataUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
          
          // Definir a imagem de fundo padrão
          setValue("imagemFundo", dataUrl);
        }
      } catch (error) {
        console.warn("Erro ao carregar imagem de fundo padrão:", error);
        // Não mostrar erro para o usuário, pois é uma funcionalidade opcional
      }
    };

    loadDefaultBackgroundImage();
  }, [getValues, setValue]);

  // Limpar URLs ao desmontar componente
  useEffect(() => {
    return () => {
      if (pdfPreviewUrl) {
        cleanupBlobURL(pdfPreviewUrl);
      }
      fotos.forEach(foto => cleanupBlobURL(foto.dataUrl));
    };
  }, [pdfPreviewUrl, fotos]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-600" />
            Relatório Técnico de Serviço
          </h1>
          <p className="text-gray-600 mt-2">
            Crie e gere relatórios técnicos profissionais com fotos vinculadas
          </p>
        </div>

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Painel esquerdo - Formulário */}
          <div className="space-y-6">
            {/* Ações */}
            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button 
                    onClick={handleGeneratePreview}
                    disabled={isGeneratingPDF}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {isGeneratingPDF ? "Gerando..." : "Gerar Preview"}
                  </Button>
                  
                  <Button 
                    onClick={handleTestPreview}
                    disabled={isGeneratingPDF}
                    variant="secondary"
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {isGeneratingPDF ? "Gerando..." : "Testar Preview"}
                  </Button>
                  
                  <Button 
                    onClick={handleDownloadPDF}
                    variant="outline"
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Baixar PDF
                  </Button>
        </div>

                <Separator />
                
                <div className="text-sm text-gray-600">
                  <p><strong>Fotos carregadas:</strong> {fotos.length}</p>
                  <p><strong>Itens técnicos:</strong> {formData.itensTecnicos.length}</p>
          </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Formulário do Relatório
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="formulario">Dados Principais</TabsTrigger>
                    <TabsTrigger value="contratos">Modelos Salvos</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="formulario" className="space-y-6">
                    <RelatorioForm 
                      form={form}
                      fotos={fotos}
                      onAddItemTecnico={handleAddItemTecnico}
                      onRemoveItemTecnico={handleRemoveItemTecnico}
                      onLinkPhoto={handleLinkPhoto}
                      onUnlinkPhoto={handleUnlinkPhoto}
                      onAddPhoto={handleAddPhoto}
                      onRemovePhoto={handleRemovePhoto}
                      onSaveAsModel={handleSaveAsModel}
                    />
                  </TabsContent>
                  
                  <TabsContent value="contratos" className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Gerenciar Modelos Salvos</h3>
                         <RelatorioSelector
                           onSelectRelatorio={(relatorio) => {
                             // Esta função não é mais usada, mas mantida para compatibilidade
                             console.log("onSelectRelatorio chamada:", relatorio.nome);
                           }}
                           onLoadDataToForm={(relatorio) => {
                             // Carregar dados básicos do relatório
                             setValue("contrato", relatorio.contrato);
                             setValue("valorInicial", relatorio.valorInicial);
                             setValue("rq", relatorio.rq);
                             setValue("os", relatorio.os);
                             setValue("pedido", relatorio.pedido);

                             // Carregar escopo e itens técnicos
                             setValue("descricaoEscopo", relatorio.descricaoEscopo || "");
                             const itensTecnicos = relatorio.itensRelatorio?.map(item => ({
                               id: item.id,
                               descricao: item.descricao,
                               fotosVinculadas: []
                             })) || [];
                             setValue("itensTecnicos", itensTecnicos);

                             // Carregar imagem de fundo se disponível
                             if (relatorio.imagemFundoUrl) {
                               // Converter URL para dataURL
                               fetch(relatorio.imagemFundoUrl)
                                 .then(response => response.blob())
                                 .then(blob => {
                                   return new Promise<string>((resolve) => {
                                     const reader = new FileReader();
                                     reader.onload = () => resolve(reader.result as string);
                                     reader.readAsDataURL(blob);
                                   });
                                 })
                                 .then(dataUrl => {
                                   setValue("imagemFundo", dataUrl);
                                 })
                                 .catch(error => {
                                   console.warn("Erro ao carregar imagem de fundo:", error);
                                 });
                             }

                             // Navegar automaticamente para a aba do formulário
                             setActiveTab("formulario");
                           }}
                           onShowSuccess={showSuccess}
                         />
          </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
        </div>

          {/* Painel direito - Preview */}
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Preview do PDF
                </CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <PDFPreview 
                  pdfUrl={pdfPreviewUrl}
                  isGenerating={isGeneratingPDF}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal para salvar como modelo */}
      <Dialog open={mostrarSalvarModelo} onOpenChange={setMostrarSalvarModelo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Salvar como Modelo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nomeModelo">Nome do modelo *</Label>
              <Input
                id="nomeModelo"
                placeholder="Ex: ATLAS BH - Instalação Tomadas"
                value={nomeNovoModelo}
                onChange={(e) => setNomeNovoModelo(e.target.value)}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setMostrarSalvarModelo(false);
                  setNomeNovoModelo("");
                }}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleConfirmSaveModel}
                disabled={!nomeNovoModelo.trim()}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Salvar Modelo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}