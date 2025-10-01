"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";

interface DadosEmpresaProps {
  data: {
    nomeRelatorio: string;
    nomeEmpresa: string;
    cnpjEmpresa: string;
  };
  onChange: (field: string, value: string) => void;
}

export function DadosEmpresa({ data, onChange }: DadosEmpresaProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Dados da Empresa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nomeRelatorio">Nome do Relatório *</Label>
          <Input
            id="nomeRelatorio"
            value={data.nomeRelatorio}
            onChange={(e) => onChange("nomeRelatorio", e.target.value)}
            placeholder="Ex: RELATÓRIO TÉCNICO DE SERVIÇO"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="nomeEmpresa">Nome da Empresa *</Label>
          <Input
            id="nomeEmpresa"
            value={data.nomeEmpresa}
            onChange={(e) => onChange("nomeEmpresa", e.target.value)}
            placeholder="Ex: GERALDINHO MANUTENÇÕES"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cnpjEmpresa">CNPJ da Empresa *</Label>
          <Input
            id="cnpjEmpresa"
            value={data.cnpjEmpresa}
            onChange={(e) => onChange("cnpjEmpresa", e.target.value)}
            placeholder="Ex: 37.097.718/0001-58"
            maxLength={18}
          />
          <p className="text-sm text-gray-500">
            Formato: XX.XXX.XXX/XXXX-XX
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
