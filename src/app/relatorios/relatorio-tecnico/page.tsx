"use client";

import { Eye, FileText, Upload } from "lucide-react";
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

// Componente do Formulário
function FormComponent() {
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
                    className="min-w-fit flex-1 justify-center whitespace-nowrap"
                  >
                    <Eye className="h-4 w-4 mr-1 text-blue-500" />
                    Visualizar Relatório
                  </Button>
                  <Button
                    variant="outline"
                    className="min-w-fit flex-1 justify-center whitespace-nowrap"
                  >
                    <Upload className="h-4 w-4 mr-1 text-green-500" />
                    Importar Modelo
                  </Button>
                </div>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Dados do contrato</FieldLabel>
              <FieldContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <Field>
                    <FieldLabel>Empres/Contrato</FieldLabel>
                    <FieldContent>
                      <Select>
                        <SelectTrigger className="w-full min-w-[160px]">
                          <SelectValue placeholder="Selecione a empresa/contrato" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vendas">
                            MANSERV/ATLAS-UBERLANDIA
                          </SelectItem>
                          <SelectItem value="operacoes">
                            MANSERV/HUAWEI-BH
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FieldContent>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="valor">Valor inicial</FieldLabel>
                    <Input type="text" placeholder="ex: 1.500,00" />
                  </Field>
                </div>
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
