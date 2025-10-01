"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Link as LinkIcon } from "lucide-react";
import { ItemTecnico } from "@/lib/relatorio-types";

interface ItensTecnicosProps {
  itens: ItemTecnico[];
  onAddItem: () => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateItem: (itemId: string, descricao: string) => void;
  fotosVinculadas?: { [itemId: string]: string[] };
}

export function ItensTecnicos({
  itens,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  fotosVinculadas = {}
}: ItensTecnicosProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Descrição Técnica</span>
          <Button
            type="button"
            size="sm"
            onClick={onAddItem}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar Item
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {itens.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum item técnico adicionado ainda.</p>
            <p className="text-sm">Clique em "Adicionar Item" para começar.</p>
          </div>
        ) : (
          itens.map((item, index) => (
            <div key={item.id} className="flex gap-3 items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    Item {index + 1}
                  </Badge>
                  {fotosVinculadas[item.id] && fotosVinculadas[item.id].length > 0 && (
                    <Badge variant="default" className="text-xs">
                      <LinkIcon className="h-3 w-3 mr-1" />
                      Fig. {fotosVinculadas[item.id].join(", ")}
                    </Badge>
                  )}
                </div>
                <Input
                  value={item.descricao}
                  onChange={(e) => onUpdateItem(item.id, e.target.value)}
                  placeholder={`Descrição do item ${index + 1}`}
                  className="w-full"
                />
              </div>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => onRemoveItem(item.id)}
                className="flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
        
        {itens.length > 0 && (
          <div className="text-sm text-gray-600 mt-4">
            <p>Total de itens: {itens.length}</p>
            <p className="text-xs">
              💡 Dica: Vincule fotos aos itens usando o menu nas imagens carregadas
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
