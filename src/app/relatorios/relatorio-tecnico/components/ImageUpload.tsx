"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  X, 
  Link as LinkIcon, 
  Unlink,
  Image as ImageIcon
} from "lucide-react";
import { FotoRelatorio } from "@/lib/relatorio-types";
import { formatFileSize } from "@/lib/image-utils";

interface ImageUploadProps {
  onAddPhoto: (files: File[]) => void;
  fotos: FotoRelatorio[];
  onRemovePhoto: (fotoId: string) => void;
  onLinkPhoto?: (fotoId: string, itemId: string) => void;
  onUnlinkPhoto?: (fotoId: string) => void;
  maxPhotos: number;
}

export function ImageUpload({
  onAddPhoto,
  fotos,
  onRemovePhoto,
  maxPhotos
}: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (fotos.length + acceptedFiles.length > maxPhotos) {
      alert(`Máximo de ${maxPhotos} fotos permitidas`);
      return;
    }
    onAddPhoto(acceptedFiles);
  }, [onAddPhoto, fotos.length, maxPhotos]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"]
    },
    multiple: true,
    maxFiles: maxPhotos - fotos.length
  });

  return (
    <div className="space-y-4">
      {/* Área de upload */}
      <Card>
        <CardContent className="p-6">
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
              {isDragActive ? "Solte as imagens aqui" : "Arraste imagens ou clique para selecionar"}
            </p>
            <p className="text-sm text-gray-500">
              JPG, PNG, WebP até 5MB cada
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {fotos.length} de {maxPhotos} fotos utilizadas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Lista de fotos */}
      {fotos.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Fotos Carregadas</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {fotos.map((foto) => (
                <div key={foto.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={foto.dataUrl}
                      alt={`Foto ${foto.numeroFigura}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Overlay com informações */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onRemovePhoto(foto.id)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Badge com número da figura */}
                  <Badge 
                    variant="secondary" 
                    className="absolute top-2 left-2 text-xs"
                  >
                    Fig. {foto.numeroFigura}
                  </Badge>
                  
                  {/* Status de vinculação */}
                  {foto.vinculadaA && (
                    <Badge 
                      variant="default" 
                      className="absolute top-2 right-2 text-xs"
                    >
                      <LinkIcon className="h-3 w-3 mr-1" />
                      Vinculada
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            
            {/* Informações das fotos */}
            <div className="mt-4 text-sm text-gray-600 space-y-1">
              {fotos.map((foto) => (
                <div key={foto.id} className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Fig. {foto.numeroFigura} - {foto.file.name}
                  </span>
                  <span className="text-gray-500">
                    {formatFileSize(foto.file.size)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
