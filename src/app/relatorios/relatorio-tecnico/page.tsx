"use client";

import { Eye, FileText, Upload } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Empresa {
  id: string;
  razaoNome: string;
  cnpjCpf: string;
}
interface Tomador {
  id: string;
  empresa: Empresa;
  unidade: Empresa;
  camposPersonalizados: CampoPersonalizado[];
}

interface CampoPersonalizado {
  id: string;
  nome: string;
  valor: string;
}

const contratoItems: Tomador[] = [
  {
    id: "1",
    empresa: {
      id: "1",
      razaoNome: "MANSERV",
      cnpjCpf: "1234567890",
    },
    unidade: {
      id: "2",
      razaoNome: "ATLAS-UBERLANDIA",
      cnpjCpf: "45678985489",
    },
    camposPersonalizados: [
      {
        id: "1",
        nome: "RQ",
        valor: "RQ123456",
      },
    ],
  },
  {
    id: "2",
    empresa: {
      id: "1",
      razaoNome: "MANSERV",
      cnpjCpf: "1234567890",
    },
    unidade: {
      id: "2",
      razaoNome: "HUAWEI-BH",
      cnpjCpf: "3214567890",
    },
    camposPersonalizados: [
      {
        id: "2",
        nome: "OC",
        valor: "OC123456",
      },
    ],
  },
];

// Componente do Formulário
function FormComponent() {
  // Estados para controlar a seleção do contrato
  const [selectedContratoId, setSelectedContratoId] = useState<
    string | undefined
  >();
  const [_selectedTomador, setSelectedTomador] = useState<
    Tomador | undefined
  >();

  // Função para gerar opções do Select baseadas nos dados de contratoItems
  const generateContratoOptions = () => {
    return contratoItems.map((item) => ({
      value: item.id,
      label: `${item.empresa.razaoNome}/${item.unidade.razaoNome}`,
    }));
  };

  // Função para formatar o texto de exibição
  const _formatContratoLabel = (tomador: Tomador) => {
    return `${tomador.empresa.razaoNome}/${tomador.unidade.razaoNome}`;
  };

  // Função para capturar o tomador selecionado e seus dados
  const handleContratoChange = (value: string) => {
    const tomador = contratoItems.find((item) => item.id === value);
    setSelectedContratoId(value);
    setSelectedTomador(tomador);
  };

  // Gerar opções dinâmicas
  const contratoOptions = generateContratoOptions();

  return (
    <div
      className="bg-white/95 dark:bg-card/95 backdrop-blur-sm rounded-2xl 
      p-8 shadow-2xl border border-white/20 dark:border-border max-h-[80vh] 
      overflow-y-auto overflow-x-hidden min-w-fit"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-6 w-6 text-primary flex-shrink-0" />
          <h2 className="text-xl font-semibold truncate">Configurações</h2>
        </div>

        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldContent>
                <div className="flex flex-row flex-wrap gap-3">
                  <Button
                    variant="outline"
                    className="min-w-fit flex-1 text-secondary-foreground"
                  >
                    <Upload className="h-4 w-4 mr-1 text-green-500" />
                    Importar Modelo
                  </Button>
                  <Button
                    variant="default"
                    className="min-w-fit flex-1 text-primary-foreground bg-primary"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Visualizar Relatório
                  </Button>
                </div>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel className="text-secondary-foreground">
                Dados do contrato
              </FieldLabel>
              <FieldContent className="flex flex-col sm:flex-row gap-3">
                <Field className="flex-1 sm:w-[60%]">
                  <FieldLabel className="text-muted-foreground">
                    Empresa/Contrato
                  </FieldLabel>
                  <FieldContent>
                    <Select
                      value={selectedContratoId}
                      onValueChange={handleContratoChange}
                    >
                      <SelectTrigger className="w-full bg-input text-foreground">
                        <SelectValue placeholder="Selecione a empresa/contrato" />
                      </SelectTrigger>
                      <SelectContent>
                        {contratoOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>
                <Field className="flex-1 sm:w-[40%]">
                  <FieldLabel htmlFor="valor" className="text-muted-foreground">
                    Valor inicial
                  </FieldLabel>
                  <Input
                    className="w-full bg-input text-foreground"
                    type="text"
                    placeholder="ex: 1.500,00"
                  />
                </Field>
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>
      </div>
    </div>
  );
}

// Componente de Preview
function PreviewComponent() {
  return (
    <div className="bg-white/95 dark:bg-card/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-border/50 flex flex-col">
      <div className="flex items-center gap-3 pb-4 border-b-2 border-gray-200 dark:border-border mb-6">
        <FileText className="h-6 w-6 text-primary flex-shrink-0" />
        <h2 className="text-xl font-semibold truncate">Relatório Técnico</h2>
      </div>

      {/* Skeleton do Preview */}
      <div className="flex-1 space-y-4">
        <div className="animate-pulse">
          {/* Header Skeleton */}
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>

          {/* Content Skeleton */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>

          <div className="mt-8">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RelatoriosTecnicoPage() {
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-[40%_60%] xl:grid-cols-[35%_65%] gap-8 p-4 lg:p-8 max-w-7xl mx-auto w-full">
      <FormComponent />
      <PreviewComponent />
    </div>
  );
}
