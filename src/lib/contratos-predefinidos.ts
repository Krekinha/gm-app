/**
 * Sistema de gerenciamento de contratos pré-carregados
 */

export interface ItemTecnicoPredefinido {
  id: string;
  descricao: string;
}

export interface ContratoPredefinido {
  id: string;
  nome: string;
  contrato: string;
  valorInicial: string;
  rq: string;
  os: string;
  pedido: string;
  descricaoEscopo: string;
  itensTecnicos: ItemTecnicoPredefinido[];
  imagemFundoUrl?: string; // URL para pré-carregar imagem de fundo
  dataCriacao: string;
  dataUltimaUso: string;
  usoCount: number;
}

// Contratos pré-definidos baseados no exemplo do PDF
export const contratosPredefinidos: ContratoPredefinido[] = [
  {
    id: "atlas-bh-001",
    nome: "ATLAS BH - Instalação Tomadas",
    contrato: "ATLAS BH",
    valorInicial: "R$ 850,00",
    rq: "RQ13853907",
    os: "50007",
    pedido: "OC10845507",
    descricaoEscopo: "Instalação de tomadas e pontos elétricos",
    itensTecnicos: [
      {
        id: "item-1",
        descricao: "Módulo acrescentado TV"
      },
      {
        id: "item-2",
        descricao: "Ponto tomada condulete para cafeteira"
      },
      {
        id: "item-3",
        descricao: "Instalação de tomada dupla no escritório"
      },
      {
        id: "item-4",
        descricao: "Verificação de aterramento"
      },
      {
        id: "item-5",
        descricao: "Teste de funcionamento das tomadas"
      }
    ],
    imagemFundoUrl: "/relatorio-tecnico/fundo-pdf.jpg",
    dataCriacao: new Date().toISOString(),
    dataUltimaUso: new Date().toISOString(),
    usoCount: 0
  },
  {
    id: "atlas-bh-002",
    nome: "ATLAS BH - Manutenção Elétrica",
    contrato: "ATLAS BH",
    valorInicial: "R$ 1.200,00",
    rq: "RQ13853908",
    os: "50008",
    pedido: "OC10845508",
    descricaoEscopo: "Manutenção preventiva e corretiva do sistema elétrico",
    itensTecnicos: [
      {
        id: "item-1",
        descricao: "Substituição de disjuntores defeituosos"
      },
      {
        id: "item-2",
        descricao: "Verificação e ajuste de tensão nos quadros"
      },
      {
        id: "item-3",
        descricao: "Instalação de iluminação de emergência"
      },
      {
        id: "item-4",
        descricao: "Teste de funcionamento dos dispositivos de proteção"
      },
      {
        id: "item-5",
        descricao: "Inspeção visual dos cabos e conexões"
      },
      {
        id: "item-6",
        descricao: "Medição de resistência de aterramento"
      },
      {
        id: "item-7",
        descricao: "Verificação de continuidade dos circuitos"
      }
    ],
    imagemFundoUrl: "/relatorio-tecnico/fundo-pdf.jpg",
    dataCriacao: new Date().toISOString(),
    dataUltimaUso: new Date().toISOString(),
    usoCount: 0
  },
  {
    id: "empresa-abc-001",
    nome: "Empresa ABC - Projeto Completo",
    contrato: "ABC CONSTRUÇÕES",
    valorInicial: "R$ 2.500,00",
    rq: "RQ12345678",
    os: "12345",
    pedido: "OC98765432",
    descricaoEscopo: "Projeto elétrico completo para nova construção",
    itensTecnicos: [
      {
        id: "item-1",
        descricao: "Instalação do quadro de distribuição principal"
      },
      {
        id: "item-2",
        descricao: "Cabeamento estruturado para rede de dados"
      },
      {
        id: "item-3",
        descricao: "Sistema de iluminação LED com dimmer"
      },
      {
        id: "item-4",
        descricao: "Instalação de ar condicionado central"
      },
      {
        id: "item-5",
        descricao: "Sistema de segurança e monitoramento"
      },
      {
        id: "item-6",
        descricao: "Automação residencial básica"
      },
      {
        id: "item-7",
        descricao: "Instalação de sistema de alarme"
      },
      {
        id: "item-8",
        descricao: "Configuração de rede Wi-Fi"
      },
      {
        id: "item-9",
        descricao: "Instalação de sistema de som ambiente"
      },
      {
        id: "item-10",
        descricao: "Teste e comissionamento de todos os sistemas"
      }
    ],
    imagemFundoUrl: "/relatorio-tecnico/fundo-pdf.jpg",
    dataCriacao: new Date().toISOString(),
    dataUltimaUso: new Date().toISOString(),
    usoCount: 0
  }
];

// Chave para localStorage
const STORAGE_KEY = "relatorio_contratos_predefinidos";

/**
 * Carrega contratos salvos do localStorage
 */
export function carregarContratosSalvos(): ContratoPredefinido[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : contratosPredefinidos;
    }
  } catch (error) {
    console.warn("Erro ao carregar contratos salvos:", error);
  }
  return contratosPredefinidos;
}

/**
 * Salva contratos no localStorage
 */
export function salvarContratos(contratos: ContratoPredefinido[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contratos));
  } catch (error) {
    console.warn("Erro ao salvar contratos:", error);
  }
}

/**
 * Adiciona um novo contrato
 */
export function adicionarContrato(novoContrato: Omit<ContratoPredefinido, "id" | "dataCriacao" | "dataUltimaUso" | "usoCount">): ContratoPredefinido {
  const contratos = carregarContratosSalvos();
  const contrato: ContratoPredefinido = {
    ...novoContrato,
    id: `contrato_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    dataCriacao: new Date().toISOString(),
    dataUltimaUso: new Date().toISOString(),
    usoCount: 0
  };
  
  contratos.push(contrato);
  salvarContratos(contratos);
  return contrato;
}

/**
 * Atualiza um contrato existente
 */
export function atualizarContrato(id: string, dadosAtualizados: Partial<ContratoPredefinido>): ContratoPredefinido | null {
  const contratos = carregarContratosSalvos();
  const index = contratos.findIndex(c => c.id === id);
  
  if (index !== -1) {
    contratos[index] = { ...contratos[index], ...dadosAtualizados };
    salvarContratos(contratos);
    return contratos[index];
  }
  
  return null;
}

/**
 * Remove um contrato
 */
export function removerContrato(id: string): boolean {
  const contratos = carregarContratosSalvos();
  const index = contratos.findIndex(c => c.id === id);
  
  if (index !== -1) {
    contratos.splice(index, 1);
    salvarContratos(contratos);
    return true;
  }
  
  return false;
}

/**
 * Registra o uso de um contrato (atualiza contador e data)
 */
export function registrarUsoContrato(id: string): void {
  const contratos = carregarContratosSalvos();
  const contrato = contratos.find(c => c.id === id);
  
  if (contrato) {
    contrato.usoCount += 1;
    contrato.dataUltimaUso = new Date().toISOString();
    salvarContratos(contratos);
  }
}

/**
 * Busca contratos por nome ou dados
 */
export function buscarContratos(termo: string): ContratoPredefinido[] {
  const contratos = carregarContratosSalvos();
  const termoLower = termo.toLowerCase();
  
  return contratos.filter(contrato => 
    contrato.nome.toLowerCase().includes(termoLower) ||
    contrato.contrato.toLowerCase().includes(termoLower) ||
    contrato.rq.toLowerCase().includes(termoLower) ||
    contrato.os.toLowerCase().includes(termoLower) ||
    contrato.pedido.toLowerCase().includes(termoLower)
  );
}

/**
 * Obtém contratos mais usados
 */
export function obterContratosMaisUsados(limite: number = 5): ContratoPredefinido[] {
  const contratos = carregarContratosSalvos();
  return contratos
    .sort((a, b) => b.usoCount - a.usoCount)
    .slice(0, limite);
}

/**
 * Obtém contratos recentes
 */
export function obterContratosRecentes(limite: number = 5): ContratoPredefinido[] {
  const contratos = carregarContratosSalvos();
  return contratos
    .sort((a, b) => new Date(b.dataUltimaUso).getTime() - new Date(a.dataUltimaUso).getTime())
    .slice(0, limite);
}
