"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";

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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Dados do Contrato
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
      </CardContent>
    </Card>
  );
}
