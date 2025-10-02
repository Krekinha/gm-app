"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Clock, 
  Star, 
  Trash2,
  Download
} from "lucide-react";
import {
  RelatorioPredefinido,
  carregarRelatoriosSalvos,
  registrarUsoRelatorio,
  removerRelatorio
} from "@/lib/relatorios-api";

interface RelatorioSelectorProps {
  onSelectRelatorio: (relatorio: RelatorioPredefinido) => void;
  onLoadDataToForm: (relatorio: RelatorioPredefinido) => void;
  onShowSuccess: (message: string, title?: string) => void;
}

export function RelatorioSelector({ 
  onSelectRelatorio,
  onLoadDataToForm,
  onShowSuccess
}: RelatorioSelectorProps) {
  const [relatorios, setRelatorios] = useState<RelatorioPredefinido[]>([]);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "maisUsados" | "recentes">("todos");

  // Carregar relatórios ao montar componente
  useEffect(() => {
    const carregarRelatorios = async () => {
      try {
        const relatoriosCarregados = await carregarRelatoriosSalvos();
        setRelatorios(relatoriosCarregados);
      } catch (error) {
        console.error('Erro ao carregar relatórios:', error);
        setRelatorios([]);
      }
    };
    
    carregarRelatorios();
  }, []);

  // Filtrar relatórios baseado na busca e filtro
  const relatoriosFiltrados = React.useMemo(() => {
    let resultado = relatorios;

    // Aplicar filtro (agora usando os dados já carregados)
    if (filtro === "maisUsados") {
      resultado = [...relatorios].sort((a, b) => b.usoCount - a.usoCount).slice(0, 10);
    } else if (filtro === "recentes") {
      resultado = [...relatorios].sort((a, b) => 
        new Date(b.dataUltimaUso).getTime() - new Date(a.dataUltimaUso).getTime()
      ).slice(0, 10);
    }

    // Aplicar busca
    if (busca.trim()) {
      const termoLower = busca.toLowerCase();
      resultado = resultado.filter(relatorio => 
        relatorio.nome.toLowerCase().includes(termoLower) ||
        relatorio.contrato.toLowerCase().includes(termoLower) ||
        relatorio.rq.toLowerCase().includes(termoLower) ||
        relatorio.os.toLowerCase().includes(termoLower) ||
        relatorio.pedido.toLowerCase().includes(termoLower)
      );
    }

    return resultado;
  }, [relatorios, busca, filtro]);

  const handleLoadDataToForm = async (relatorio: RelatorioPredefinido) => {
    try {
      await registrarUsoRelatorio(relatorio.id);
      onLoadDataToForm(relatorio);
      onShowSuccess(`Dados do modelo "${relatorio.nome}" carregados com sucesso!`, "Modelo Carregado");
      // Recarregar relatórios para atualizar contadores
      const relatoriosAtualizados = await carregarRelatoriosSalvos();
      setRelatorios(relatoriosAtualizados);
    } catch (error) {
      console.warn('Erro ao registrar uso do relatório:', error);
      onLoadDataToForm(relatorio);
      onShowSuccess(`Dados do modelo "${relatorio.nome}" carregados!`, "Modelo Carregado");
    }
  };

  const handleRemoveRelatorio = async (id: string) => {
    if (confirm("Tem certeza que deseja remover este modelo?")) {
      try {
        const sucesso = await removerRelatorio(id);
        if (sucesso) {
          setRelatorios(await carregarRelatoriosSalvos());
        } else {
          alert('Erro ao remover modelo.');
        }
      } catch (error) {
        console.error('Erro ao remover relatório:', error);
        alert('Erro ao remover modelo. Tente novamente.');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Modelos Pré-definidos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar modelos..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtros */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={filtro === "todos" ? "default" : "outline"}
            onClick={() => setFiltro("todos")}
            className="flex items-center gap-1"
          >
            <Search className="h-4 w-4" />
            Todos
          </Button>
          <Button
            size="sm"
            variant={filtro === "maisUsados" ? "default" : "outline"}
            onClick={() => setFiltro("maisUsados")}
            className="flex items-center gap-1"
          >
            <Star className="h-4 w-4" />
            Mais Usados
          </Button>
          <Button
            size="sm"
            variant={filtro === "recentes" ? "default" : "outline"}
            onClick={() => setFiltro("recentes")}
            className="flex items-center gap-1"
          >
            <Clock className="h-3 w-3" />
            Recentes
          </Button>
        </div>

        {/* Lista de modelos */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {relatoriosFiltrados.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum modelo encontrado</p>
              <p className="text-sm">Tente ajustar os filtros ou criar um novo modelo</p>
            </div>
          ) : (
            relatoriosFiltrados.map((relatorio) => (
              <div
                key={relatorio.id}
                className="border rounded-lg p-3 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {relatorio.nome}
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div><strong>Contrato:</strong> {relatorio.contrato}</div>
                      <div><strong>Valor:</strong> {relatorio.valorInicial}</div>
                      <div><strong>RQ:</strong> {relatorio.rq}</div>
                      <div><strong>OS:</strong> {relatorio.os}</div>
                      <div className="col-span-2"><strong>Pedido:</strong> {relatorio.pedido}</div>
                      <div className="col-span-2"><strong>Escopo:</strong> {relatorio.descricaoEscopo}</div>
                      <div className="col-span-2">
                        <strong>Itens Técnicos:</strong>
                        <div className="mt-1 space-y-1">
                          {relatorio.itensRelatorio?.slice(0, 3).map((item, index) => (
                            <div key={item.id} className="text-xs text-gray-500 flex items-start">
                              <span className="mr-2">•</span>
                              <span>{item.descricao}</span>
                            </div>
                          ))}
                          {relatorio.itensRelatorio && relatorio.itensRelatorio.length > 3 && (
                            <div className="text-xs text-gray-400 italic">
                              +{relatorio.itensRelatorio.length - 3} itens adicionais...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    {relatorio.usoCount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        {relatorio.usoCount}
                      </Badge>
                    )}
                    
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="default"
                        onClick={() => handleLoadDataToForm(relatorio)}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-4 w-4" />
                        Carregar
                      </Button>
                      
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveRelatorio(relatorio.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Estatísticas */}
        <div className="text-xs text-gray-500 border-t pt-3">
          <div className="flex justify-between">
            <span>Total: {relatorios.length} modelos</span>
            <span>Mostrando: {relatoriosFiltrados.length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
