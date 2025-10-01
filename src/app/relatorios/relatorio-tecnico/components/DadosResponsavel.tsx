"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

interface DadosResponsavelProps {
  data: {
    nomeResponsavel: string;
    cargo1: string;
    cargo2: string;
    dataElaboracao: string;
  };
  onChange: (field: string, value: string) => void;
}

export function DadosResponsavel({ data, onChange }: DadosResponsavelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Elaborado Por
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nomeResponsavel">Nome *</Label>
          <Input
            id="nomeResponsavel"
            value={data.nomeResponsavel}
            onChange={(e) => onChange("nomeResponsavel", e.target.value)}
            placeholder="Ex: JOSÉ GERALDO ALEIXO"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cargo1">Cargo 1 *</Label>
            <Input
              id="cargo1"
              value={data.cargo1}
              onChange={(e) => onChange("cargo1", e.target.value)}
              placeholder="Ex: Responsável Comercial"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cargo2">Cargo 2</Label>
            <Input
              id="cargo2"
              value={data.cargo2}
              onChange={(e) => onChange("cargo2", e.target.value)}
              placeholder="Ex: Diretor Executivo"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dataElaboracao">Data de Elaboração *</Label>
          <Input
            id="dataElaboracao"
            type="date"
            value={data.dataElaboracao}
            onChange={(e) => onChange("dataElaboracao", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
