"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  X, 
  Image as ImageIcon,
  FileImage,
  Eye
} from "lucide-react";
import { validateImageFile, fileToDataURL, formatFileSize, cleanupBlobURL } from "@/lib/image-utils";

interface BackgroundImageUploadProps {
  backgroundImage?: string;
  onSetBackgroundImage: (dataUrl: string) => void;
  onRemoveBackgroundImage: () => void;
}

export function BackgroundImageUpload({
  backgroundImage,
  onSetBackgroundImage,
  onRemoveBackgroundImage
}: BackgroundImageUploadProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    try {
      const dataUrl = await fileToDataURL(file);
      onSetBackgroundImage(dataUrl);
    } catch (error) {
      console.error("Erro ao processar arquivo:", error);
      alert("Erro ao processar arquivo");
    }
  }, [onSetBackgroundImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"]
    },
    multiple: false,
    maxFiles: 1
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileImage className="h-5 w-5" />
          Imagem de Fundo do PDF
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          <p>Esta imagem será aplicada como fundo em todas as páginas do PDF.</p>
          <p className="text-xs text-gray-500 mt-1">
            Recomendado: Imagem com transparência ou baixa opacidade para não interferir na leitura.
          </p>
        </div>

        {!backgroundImage ? (
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-300 hover:border-gray-400"
              }
            `}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              {isDragActive ? "Solte a imagem aqui" : "Arraste uma imagem ou clique para selecionar"}
            </p>
            <p className="text-sm text-gray-500">
              JPG, PNG, WebP até 5MB
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Esta imagem será usada como papel timbrado
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Preview da imagem de fundo */}
            <div className="relative">
              <div className="aspect-[210/297] rounded-lg overflow-hidden bg-gray-100 border">
                <img
                  src={backgroundImage}
                  alt="Imagem de fundo"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Overlay com informações */}
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                <div className="opacity-0 hover:opacity-100 transition-opacity duration-200 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      const newWindow = window.open();
                      if (newWindow) {
                        newWindow.document.write(`
                          <html>
                            <head><title>Preview - Imagem de Fundo</title></head>
                            <body style="margin:0; padding:20px; background:#f5f5f5;">
                              <div style="max-width:600px; margin:0 auto; background:white; padding:20px; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                                <h2 style="margin:0 0 20px 0; color:#333;">Preview da Imagem de Fundo</h2>
                                <div style="aspect-ratio:210/297; border:1px solid #ddd; border-radius:4px; overflow:hidden;">
                                  <img src="${backgroundImage}" style="width:100%; height:100%; object-fit:cover;" />
                                </div>
                                <p style="margin:20px 0 0 0; color:#666; font-size:14px;">
                                  Esta imagem será aplicada como fundo em todas as páginas do PDF.
                                </p>
                              </div>
                            </body>
                          </html>
                        `);
                      }
                    }}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      cleanupBlobURL(backgroundImage);
                      onRemoveBackgroundImage();
                    }}
                    className="flex items-center gap-1"
                  >
                    <X className="h-4 w-4" />
                    Remover
                  </Button>
                </div>
              </div>
              
              {/* Badge de status */}
              <Badge 
                variant="default" 
                className="absolute top-2 left-2 text-xs"
              >
                <ImageIcon className="h-3 w-3 mr-1" />
                Fundo Ativo
              </Badge>
            </div>

            {/* Informações da imagem */}
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Imagem de fundo carregada
                </span>
                <Badge variant="outline" className="text-xs">
                  Papel Timbrado
                </Badge>
              </div>
            </div>

            {/* Botão para trocar imagem */}
            <div
              {...getRootProps()}
              className="border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
            >
              <input {...getInputProps()} />
              <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Clique para trocar a imagem de fundo
              </p>
            </div>
          </div>
        )}

        {/* Dicas de uso */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Dicas para melhor resultado:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Use imagens com transparência (PNG) ou baixa opacidade</li>
            <li>• Resolução recomendada: 2480x3508px (300 DPI para A4)</li>
            <li>• Evite imagens muito coloridas que possam interferir na leitura</li>
            <li>• Teste o preview antes de gerar o PDF final</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
