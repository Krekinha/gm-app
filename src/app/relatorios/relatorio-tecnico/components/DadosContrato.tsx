"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Search, 
  Plus,
  CheckCircle
} from "lucide-react";
import { ContratoPredefinido } from "@/lib/contratos-predefinidos";
import { ContratoSelector } from "./ContratoSelector";

interface DadosContratoProps {
  data: {
    contrato: string;
    valorInicial: string;
    rq: string;
    os: string;
    pedido: string;
  };
  onChange: (field: string, value: string) => void;
}

export function DadosContrato({ data, onChange }: DadosContratoProps) {
  const [activeTab, setActiveTab] = useState("manual");

  const handleSelectContrato = (contrato: ContratoPredefinido) => {
    onChange("contrato", contrato.contrato);
    onChange("valorInicial", contrato.valorInicial);
    onChange("rq", contrato.rq);
    onChange("os", contrato.os);
    onChange("pedido", contrato.pedido);
    setActiveTab("manual"); // Volta para a aba manual após seleção
  };

  const handleSaveCurrentContrato = (dados: typeof data) => {
    // Esta função será chamada pelo ContratoSelector
    // Os dados já estão no estado atual do formulário
  };

  const isDataComplete = data.contrato.trim() && 
    data.valorInicial.trim() && 
    data.rq.trim() && 
    data.os.trim() && 
    data.pedido.trim();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Dados do Contrato
          {isDataComplete && (
            <Badge variant="default" className="ml-2">
              <CheckCircle className="h-3 w-3 mr-1" />
              Completo
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Preenchimento Manual
            </TabsTrigger>
            <TabsTrigger value="predefinidos" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Contratos Salvos
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contrato">Contrato *</Label>
                <Input
                  id="contrato"
                  value={data.contrato}
                  onChange={(e) => onChange("contrato", e.target.value)}
                  placeholder="Ex: ATLAS BH"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valorInicial">Valor Inicial *</Label>
                <Input
                  id="valorInicial"
                  value={data.valorInicial}
                  onChange={(e) => onChange("valorInicial", e.target.value)}
                  placeholder="Ex: R$ 850,00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rq">RQ *</Label>
                <Input
                  id="rq"
                  value={data.rq}
                  onChange={(e) => onChange("rq", e.target.value)}
                  placeholder="Ex: RQ13853907"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="os">OS *</Label>
                <Input
                  id="os"
                  value={data.os}
                  onChange={(e) => onChange("os", e.target.value)}
                  placeholder="Ex: 50007"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="pedido">Pedido *</Label>
                <Input
                  id="pedido"
                  value={data.pedido}
                  onChange={(e) => onChange("pedido", e.target.value)}
                  placeholder="Ex: OC10845507"
                />
              </div>
            </div>
            
            {/* Dica para usar contratos salvos */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                💡 <strong>Dica:</strong> Se você usa contratos similares frequentemente, 
                vá para a aba "Contratos Salvos" para carregar dados pré-definidos ou 
                salvar este contrato para uso futuro.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="predefinidos" className="mt-4">
            <ContratoSelector
              onSelectContrato={handleSelectContrato}
              onSaveCurrentContrato={handleSaveCurrentContrato}
              currentData={data}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
