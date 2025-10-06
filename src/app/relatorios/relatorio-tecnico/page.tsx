"use client";

import { Eye, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
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
import { Textarea } from "@/components/ui/textarea";

// Componente do Formulário
function FormComponent() {
  return (
    <div className="bg-white/95 dark:bg-card/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-border max-h-[80vh] overflow-y-auto lg:max-h-none">
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Configurações do Relatório</h2>
        </div>

        <FieldSet>
          <FieldGroup>
            <div className="flex gap-3">
              <Button className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                Visualizar Relatório
              </Button>
              <Button variant="outline" className="flex-1">
                <Upload className="h-4 w-4 mr-2" />
                Importar Modelo
              </Button>
            </div>

            <Field>
              <FieldLabel>Dados do contrato</FieldLabel>
              <FieldContent>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel className="text-sm font-medium text-muted-foreground mb-1 block">
                      Data Inicial
                    </FieldLabel>
                    <Input type="date" placeholder="Data inicial" />
                  </div>
                  <div>
                    <FieldLabel className="text-sm font-medium text-muted-foreground mb-1 block">
                      Data Final
                    </FieldLabel>
                    <Input type="date" placeholder="Data final" />
                  </div>
                </div>
                <FieldDescription>
                  Defina o período para análise dos dados
                </FieldDescription>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Departamento</FieldLabel>
              <FieldContent>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">
                      Todos os Departamentos
                    </SelectItem>
                    <SelectItem value="vendas">Vendas</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="ti">Tecnologia da Informação</SelectItem>
                    <SelectItem value="rh">Recursos Humanos</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="operacoes">Operações</SelectItem>
                  </SelectContent>
                </Select>
                <FieldDescription>
                  Filtre por departamento específico ou todos
                </FieldDescription>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Formato de Saída</FieldLabel>
              <FieldContent>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel (XLSX)</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                  </SelectContent>
                </Select>
                <FieldDescription>
                  Escolha o formato do arquivo de saída
                </FieldDescription>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Observações Adicionais</FieldLabel>
              <FieldContent>
                <Textarea
                  placeholder="Digite observações ou comentários adicionais para o relatório..."
                  className="min-h-[100px] resize-none"
                />
                <FieldDescription>
                  Adicione comentários ou observações específicas
                </FieldDescription>
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
    <div className="bg-white/95 dark:bg-card/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-border flex flex-col">
      <div className="flex items-center gap-3 pb-4 border-b-2 border-gray-200 dark:border-border mb-6">
        <FileText className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">Relatório Técnico</h2>
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
    <div className="flex-1 grid grid-cols-[30%_70%] xl:grid-cols-[35%_65%] lg:grid-cols-1 gap-8 p-8 max-w-7xl mx-auto w-full">
      <FormComponent />
      <PreviewComponent />
    </div>
  );
}
