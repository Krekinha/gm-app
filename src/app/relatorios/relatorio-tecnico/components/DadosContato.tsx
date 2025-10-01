"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone } from "lucide-react";

interface DadosContatoProps {
  data: {
    telefone: string;
    email: string;
    endereco: string;
  };
  onChange: (field: string, value: string) => void;
}

export function DadosContato({ data, onChange }: DadosContatoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Rodapé / Contato
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone *</Label>
          <Input
            id="telefone"
            value={data.telefone}
            onChange={(e) => onChange("telefone", e.target.value)}
            placeholder="Ex: (11) 99999-9999"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">E-mail *</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="Ex: contato@empresa.com"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endereco">Endereço *</Label>
          <Input
            id="endereco"
            value={data.endereco}
            onChange={(e) => onChange("endereco", e.target.value)}
            placeholder="Ex: Rua das Flores, 123 - São Paulo/SP"
          />
        </div>
      </CardContent>
    </Card>
  );
}
