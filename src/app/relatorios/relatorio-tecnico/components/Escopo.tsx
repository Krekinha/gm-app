"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Target } from "lucide-react";

interface EscopoProps {
  escopo: string;
  onChange: (value: string) => void;
}

export function Escopo({ escopo, onChange }: EscopoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Escopo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="escopo">Descrição do Escopo *</Label>
          <Textarea
            id="escopo"
            value={escopo}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ex: Instalação de tomadas"
            rows={4}
            className="resize-none"
          />
          <p className="text-sm text-gray-500">
            Descreva de forma clara e objetiva o escopo dos serviços realizados.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
