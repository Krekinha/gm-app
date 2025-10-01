"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Upload, 
  Eye, 
  Download, 
  Plus, 
  Trash2,
  Link as LinkIcon,
  Unlink
} from "lucide-react";

import { 
  relatorioTecnicoSchema, 
  RelatorioTecnicoData, 
  initialRelatorioData,
  FotoRelatorio,
  ItemTecnico
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

// Componente para upload de imagens
import { ImageUpload } from "./components/ImageUpload";
// Componente para formulário de dados
import { RelatorioForm } from "./components/RelatorioForm";
// Componente para preview do PDF
import { PDFPreview } from "./components/PDFPreview";
import { ContratoSelector } from "./components/ContratoSelector";

export default function RelatorioTecnicoPage() {
  const [fotos, setFotos] = useState<FotoRelatorio[]>([]);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string>("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [activeTab, setActiveTab] = useState("formulario");

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
        alert(validation.error);
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
        alert("Erro ao processar arquivo");
      }
    }

    if (newFotos.length > 0) {
      setFotos(prev => [...prev, ...newFotos]);
    }
  }, [fotos.length]);

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
      const pdf = await generateRelatorioPDF(data, fotos);
      const pdfBlob = pdf.output("blob");
      const previewUrl = URL.createObjectURL(pdfBlob);
      
      // Limpar URL anterior
      if (pdfPreviewUrl) {
        cleanupBlobURL(pdfPreviewUrl);
      }
      
      setPdfPreviewUrl(previewUrl);
    } catch (error) {
      console.error("Erro ao gerar preview:", error);
      alert("Erro ao gerar preview do PDF");
    } finally {
      setIsGeneratingPDF(false);
    }
  }, [getValues, fotos, pdfPreviewUrl]);

  // Função para baixar PDF
  const handleDownloadPDF = useCallback(async () => {
    try {
      const data = getValues();
      const pdf = await generateRelatorioPDF(data, fotos);
      pdf.save(`relatorio-tecnico-${data.contrato}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("Erro ao baixar PDF:", error);
      alert("Erro ao baixar PDF");
    }
  }, [getValues, fotos]);

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
                    />
                  </TabsContent>
                  
                  <TabsContent value="contratos" className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Gerenciar Modelos Salvos</h3>
                      <ContratoSelector
                        onSelectContrato={(contrato) => {
                          // Carregar dados básicos do contrato
                          setValue("contrato", contrato.contrato);
                          setValue("valorInicial", contrato.valorInicial);
                          setValue("rq", contrato.rq);
                          setValue("os", contrato.os);
                          setValue("pedido", contrato.pedido);
                          
                          // Carregar escopo e itens técnicos
                          setValue("descricaoEscopo", contrato.descricaoEscopo || "");
                          const itensTecnicos = contrato.itensTecnicos?.map(item => ({
                            id: item.id,
                            descricao: item.descricao,
                            fotosVinculadas: []
                          })) || [];
                          setValue("itensTecnicos", itensTecnicos);
                          
                          // Voltar para a aba principal
                          setActiveTab("formulario");
                        }}
                        onSaveCurrentContrato={(dados) => {
                          // Implementar salvamento do contrato atual
                          console.log("Salvando contrato:", dados);
                        }}
                        currentData={{
                          contrato: formData.contrato,
                          valorInicial: formData.valorInicial,
                          rq: formData.rq,
                          os: formData.os,
                          pedido: formData.pedido,
                          descricaoEscopo: formData.descricaoEscopo,
                          itensTecnicos: formData.itensTecnicos
                        }}
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
    </div>
  );
}