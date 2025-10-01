import { z } from "zod";

// Tipos para os itens técnicos
export interface ItemTecnico {
  id: string;
  descricao: string;
  fotosVinculadas: string[]; // IDs das fotos
}

// Tipos para as fotos do relatório
export interface FotoRelatorio {
  id: string;
  file: File;
  dataUrl: string;
  numeroFigura?: number;
  vinculadaA?: string; // ID do item técnico
}

// Schema de validação Zod para o relatório técnico
export const relatorioTecnicoSchema = z.object({
  // Cabeçalho
  nomeRelatorio: z.string().min(1, "Nome do relatório é obrigatório"),
  logoEmpresa: z.string().optional(),
  nomeEmpresa: z.string().min(1, "Nome da empresa é obrigatório"),
  cnpjEmpresa: z.string().min(14, "CNPJ deve ter 14 dígitos"),
  
  // Dados do Contrato
  contrato: z.string().min(1, "Contrato é obrigatório"),
  valorInicial: z.string().min(1, "Valor inicial é obrigatório"),
  rq: z.string().min(1, "RQ é obrigatório"),
  os: z.string().min(1, "OS é obrigatório"),
  pedido: z.string().min(1, "Pedido é obrigatório"),
  
  // Escopo
  descricaoEscopo: z.string().min(1, "Descrição do escopo é obrigatória"),
  
  // Descrição Técnica
  itensTecnicos: z.array(z.object({
    id: z.string(),
    descricao: z.string().min(1, "Descrição do item é obrigatória")
  })).min(1, "Pelo menos um item técnico é obrigatório"),
  
  // Elaborado por
  nomeElaborador: z.string().min(1, "Nome do elaborador é obrigatório"),
  cargo1: z.string().min(1, "Cargo 1 é obrigatório"),
  cargo2: z.string().min(1, "Cargo 2 é obrigatório"),
  dataElaboracao: z.string().min(1, "Data de elaboração é obrigatória"),
  
  // Rodapé
  nomeEmpresaRodape: z.string().min(1, "Nome da empresa no rodapé é obrigatório"),
  cnpjRodape: z.string().min(14, "CNPJ no rodapé deve ter 14 dígitos"),
  telefone: z.string().min(1, "Telefone é obrigatório"),
  email: z.string().email("Email deve ser válido"),
  instagram: z.string().min(1, "Instagram é obrigatório"),
  
  // Configurações
  imagemFundo: z.string().optional()
});

// Tipo inferido do schema
export type RelatorioTecnicoData = z.infer<typeof relatorioTecnicoSchema>;

// Dados iniciais padrão
export const initialRelatorioData: RelatorioTecnicoData = {
  nomeRelatorio: "Relatório Técnico de Serviço",
  nomeEmpresa: "",
  cnpjEmpresa: "",
  contrato: "",
  valorInicial: "",
  rq: "",
  os: "",
  pedido: "",
  descricaoEscopo: "",
  itensTecnicos: [
    {
      id: "1",
      descricao: ""
    }
  ],
  nomeElaborador: "",
  cargo1: "",
  cargo2: "",
  dataElaboracao: new Date().toLocaleDateString("pt-BR"),
  nomeEmpresaRodape: "",
  cnpjRodape: "",
  telefone: "",
  email: "",
  instagram: ""
};

// Configurações do PDF
export interface PDFConfig {
  pageWidth: number;
  pageHeight: number;
  margin: number;
  fontSize: {
    title: number;
    subtitle: number;
    normal: number;
    small: number;
  };
  colors: {
    primary: string;
    secondary: string;
    text: string;
    border: string;
  };
}

export const defaultPDFConfig: PDFConfig = {
  pageWidth: 210, // A4 width in mm
  pageHeight: 297, // A4 height in mm
  margin: 20,
  fontSize: {
    title: 16,
    subtitle: 14,
    normal: 12,
    small: 10
  },
  colors: {
    primary: "#1e40af", // blue-800
    secondary: "#64748b", // slate-500
    text: "#1e293b", // slate-800
    border: "#e2e8f0" // slate-200
  }
};
