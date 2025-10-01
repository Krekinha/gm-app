"use client";

import React, { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  FileText,
  Loader2
} from "lucide-react";

interface PDFPreviewProps {
  pdfUrl: string;
  isGenerating: boolean;
}

export function PDFPreview({ 
  pdfUrl, 
  isGenerating
}: PDFPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Preview do PDF
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100vh-200px)]">
        {pdfUrl ? (
          <iframe
            ref={iframeRef}
            src={pdfUrl}
            className="w-full h-full border-0"
            title="Preview do Relatório Técnico"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Eye className="h-16 w-16 mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Nenhum preview disponível</h3>
            <p className="text-sm text-center mb-4">
              Preencha os dados do formulário e clique em "Gerar Preview" para visualizar o PDF
            </p>
            {isGenerating && (
              <div className="flex items-center gap-2 text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Gerando PDF...</span>
              </div>
            )}
          </div>
        )}
        
        {/* Status do PDF */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 border">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  Preview
                </Badge>
              </div>
              <div className="text-gray-500">
                {pdfUrl ? "Preview disponível" : "Aguardando preview"}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
