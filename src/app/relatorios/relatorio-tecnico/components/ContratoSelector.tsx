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
  Plus,
  Save,
  Trash2,
  Edit,
  Check,
  X
} from "lucide-react";
import { 
  ContratoPredefinido,
  carregarContratosSalvos,
  buscarContratos,
  obterContratosMaisUsados,
  obterContratosRecentes,
  registrarUsoContrato,
  adicionarContrato,
  removerContrato
} from "@/lib/contratos-predefinidos";

interface ContratoSelectorProps {
  onSelectContrato: (contrato: ContratoPredefinido) => void;
  onSaveCurrentContrato: (dados: {
    contrato: string;
    valorInicial: string;
    rq: string;
    os: string;
    pedido: string;
  }) => void;
  currentData?: {
    contrato: string;
    valorInicial: string;
    rq: string;
    os: string;
    pedido: string;
  };
}

export function ContratoSelector({ 
  onSelectContrato, 
  onSaveCurrentContrato,
  currentData 
}: ContratoSelectorProps) {
  const [contratos, setContratos] = useState<ContratoPredefinido[]>([]);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "maisUsados" | "recentes">("todos");
  const [mostrarSalvar, setMostrarSalvar] = useState(false);
  const [nomeNovoContrato, setNomeNovoContrato] = useState("");

  // Carregar contratos ao montar componente
  useEffect(() => {
    setContratos(carregarContratosSalvos());
  }, []);

  // Filtrar contratos baseado na busca e filtro
  const contratosFiltrados = React.useMemo(() => {
    let resultado = contratos;

    // Aplicar filtro
    switch (filtro) {
      case "maisUsados":
        resultado = obterContratosMaisUsados(10);
        break;
      case "recentes":
        resultado = obterContratosRecentes(10);
        break;
      default:
        resultado = contratos;
    }

    // Aplicar busca
    if (busca.trim()) {
      resultado = buscarContratos(busca);
    }

    return resultado;
  }, [contratos, busca, filtro]);

  const handleSelectContrato = (contrato: ContratoPredefinido) => {
    registrarUsoContrato(contrato.id);
    onSelectContrato(contrato);
    setContratos(carregarContratosSalvos()); // Recarregar para atualizar contadores
  };

  const handleSaveContrato = () => {
    if (!currentData || !nomeNovoContrato.trim()) return;

    const novoContrato = adicionarContrato({
      nome: nomeNovoContrato.trim(),
      ...currentData
    });

    setContratos(carregarContratosSalvos());
    setNomeNovoContrato("");
    setMostrarSalvar(false);
  };

  const handleRemoveContrato = (id: string) => {
    if (confirm("Tem certeza que deseja remover este modelo?")) {
      removerContrato(id);
      setContratos(carregarContratosSalvos());
    }
  };

  const canSaveContrato = currentData && 
    currentData.contrato.trim() && 
    currentData.valorInicial.trim() && 
    currentData.rq.trim() && 
    currentData.os.trim() && 
    currentData.pedido.trim();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Modelos Pré-definidos
          </span>
          <div className="flex gap-2">
            {canSaveContrato && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setMostrarSalvar(!mostrarSalvar)}
                className="flex items-center gap-1"
              >
                <Save className="h-4 w-4" />
                Salvar Atual
              </Button>
            )}
          </div>
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
          >
            Todos
          </Button>
          <Button
            size="sm"
            variant={filtro === "maisUsados" ? "default" : "outline"}
            onClick={() => setFiltro("maisUsados")}
            className="flex items-center gap-1"
          >
            <Star className="h-3 w-3" />
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

        {/* Formulário para salvar modelo atual */}
        {mostrarSalvar && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-blue-800">Salvar Modelo Atual</h4>
            <div className="space-y-2">
              <Input
                placeholder="Nome do modelo (ex: ATLAS BH - Instalação Tomadas)"
                value={nomeNovoContrato}
                onChange={(e) => setNomeNovoContrato(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveContrato}
                  disabled={!nomeNovoContrato.trim()}
                  className="flex items-center gap-1"
                >
                  <Check className="h-4 w-4" />
                  Salvar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setMostrarSalvar(false);
                    setNomeNovoContrato("");
                  }}
                  className="flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de modelos */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {contratosFiltrados.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum modelo encontrado</p>
              <p className="text-sm">Tente ajustar os filtros ou criar um novo modelo</p>
            </div>
          ) : (
            contratosFiltrados.map((contrato) => (
              <div
                key={contrato.id}
                className="border rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer group"
                onClick={() => handleSelectContrato(contrato)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {contrato.nome}
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div><strong>Contrato:</strong> {contrato.contrato}</div>
                      <div><strong>Valor:</strong> {contrato.valorInicial}</div>
                      <div><strong>RQ:</strong> {contrato.rq}</div>
                      <div><strong>OS:</strong> {contrato.os}</div>
                      <div className="col-span-2"><strong>Pedido:</strong> {contrato.pedido}</div>
                      <div className="col-span-2"><strong>Escopo:</strong> {contrato.descricaoEscopo}</div>
                      <div className="col-span-2">
                        <strong>Itens Técnicos:</strong>
                        <div className="mt-1 space-y-1">
                          {contrato.itensTecnicos?.slice(0, 3).map((item, index) => (
                            <div key={item.id} className="text-xs text-gray-500 flex items-start">
                              <span className="mr-2">•</span>
                              <span>{item.descricao}</span>
                            </div>
                          ))}
                          {contrato.itensTecnicos && contrato.itensTecnicos.length > 3 && (
                            <div className="text-xs text-gray-400 italic">
                              +{contrato.itensTecnicos.length - 3} itens adicionais...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {contrato.usoCount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        {contrato.usoCount}
                      </Badge>
                    )}
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveContrato(contrato.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Estatísticas */}
        <div className="text-xs text-gray-500 border-t pt-3">
          <div className="flex justify-between">
            <span>Total: {contratos.length} modelos</span>
            <span>Mostrando: {contratosFiltrados.length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
