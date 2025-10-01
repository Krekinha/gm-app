/**
 * Serviço de banco de dados para modelos de contratos
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ItemTecnicoData {
  id?: string;
  descricao: string;
  ordem?: number;
}

export interface ContratoModeloData {
  id?: string;
  nome: string;
  contrato: string;
  valorInicial: string;
  rq: string;
  os: string;
  pedido: string;
  descricaoEscopo: string;
  imagemFundoUrl?: string;
  itensTecnicos?: ItemTecnicoData[];
}

export interface ContratoModeloWithItens extends ContratoModeloData {
  itensTecnicos: ItemTecnicoData[];
  dataCriacao: Date;
  dataUltimaUso: Date;
  usoCount: number;
}

/**
 * Cria um novo modelo de contrato
 */
export async function criarContratoModelo(dados: ContratoModeloData): Promise<ContratoModeloWithItens> {
  const contrato = await prisma.contratoModelo.create({
    data: {
      nome: dados.nome,
      contrato: dados.contrato,
      valorInicial: dados.valorInicial,
      rq: dados.rq,
      os: dados.os,
      pedido: dados.pedido,
      descricaoEscopo: dados.descricaoEscopo,
      imagemFundoUrl: dados.imagemFundoUrl,
      itensTecnicos: {
        create: dados.itensTecnicos?.map((item, index) => ({
          descricao: item.descricao,
          ordem: item.ordem || index
        })) || []
      }
    },
    include: {
      itensTecnicos: {
        orderBy: { ordem: 'asc' }
      }
    }
  });

  return {
    id: contrato.id,
    nome: contrato.nome,
    contrato: contrato.contrato,
    valorInicial: contrato.valorInicial,
    rq: contrato.rq,
    os: contrato.os,
    pedido: contrato.pedido,
    descricaoEscopo: contrato.descricaoEscopo,
    imagemFundoUrl: contrato.imagemFundoUrl,
    itensTecnicos: contrato.itensTecnicos.map(item => ({
      id: item.id,
      descricao: item.descricao,
      ordem: item.ordem
    })),
    dataCriacao: contrato.dataCriacao,
    dataUltimaUso: contrato.dataUltimaUso,
    usoCount: contrato.usoCount
  };
}

/**
 * Busca todos os modelos de contratos
 */
export async function buscarTodosContratos(): Promise<ContratoModeloWithItens[]> {
  const contratos = await prisma.contratoModelo.findMany({
    include: {
      itensTecnicos: {
        orderBy: { ordem: 'asc' }
      }
    },
    orderBy: { dataUltimaUso: 'desc' }
  });

  return contratos.map(contrato => ({
    id: contrato.id,
    nome: contrato.nome,
    contrato: contrato.contrato,
    valorInicial: contrato.valorInicial,
    rq: contrato.rq,
    os: contrato.os,
    pedido: contrato.pedido,
    descricaoEscopo: contrato.descricaoEscopo,
    imagemFundoUrl: contrato.imagemFundoUrl,
    itensTecnicos: contrato.itensTecnicos.map(item => ({
      id: item.id,
      descricao: item.descricao,
      ordem: item.ordem
    })),
    dataCriacao: contrato.dataCriacao,
    dataUltimaUso: contrato.dataUltimaUso,
    usoCount: contrato.usoCount
  }));
}

/**
 * Busca um modelo de contrato por ID
 */
export async function buscarContratoPorId(id: string): Promise<ContratoModeloWithItens | null> {
  const contrato = await prisma.contratoModelo.findUnique({
    where: { id },
    include: {
      itensTecnicos: {
        orderBy: { ordem: 'asc' }
      }
    }
  });

  if (!contrato) return null;

  return {
    id: contrato.id,
    nome: contrato.nome,
    contrato: contrato.contrato,
    valorInicial: contrato.valorInicial,
    rq: contrato.rq,
    os: contrato.os,
    pedido: contrato.pedido,
    descricaoEscopo: contrato.descricaoEscopo,
    imagemFundoUrl: contrato.imagemFundoUrl,
    itensTecnicos: contrato.itensTecnicos.map(item => ({
      id: item.id,
      descricao: item.descricao,
      ordem: item.ordem
    })),
    dataCriacao: contrato.dataCriacao,
    dataUltimaUso: contrato.dataUltimaUso,
    usoCount: contrato.usoCount
  };
}

/**
 * Busca modelos por termo de pesquisa
 */
export async function buscarContratosPorTermo(termo: string): Promise<ContratoModeloWithItens[]> {
  const contratos = await prisma.contratoModelo.findMany({
    where: {
      OR: [
        { nome: { contains: termo, mode: 'insensitive' } },
        { contrato: { contains: termo, mode: 'insensitive' } },
        { rq: { contains: termo, mode: 'insensitive' } },
        { os: { contains: termo, mode: 'insensitive' } },
        { pedido: { contains: termo, mode: 'insensitive' } }
      ]
    },
    include: {
      itensTecnicos: {
        orderBy: { ordem: 'asc' }
      }
    },
    orderBy: { dataUltimaUso: 'desc' }
  });

  return contratos.map(contrato => ({
    id: contrato.id,
    nome: contrato.nome,
    contrato: contrato.contrato,
    valorInicial: contrato.valorInicial,
    rq: contrato.rq,
    os: contrato.os,
    pedido: contrato.pedido,
    descricaoEscopo: contrato.descricaoEscopo,
    imagemFundoUrl: contrato.imagemFundoUrl,
    itensTecnicos: contrato.itensTecnicos.map(item => ({
      id: item.id,
      descricao: item.descricao,
      ordem: item.ordem
    })),
    dataCriacao: contrato.dataCriacao,
    dataUltimaUso: contrato.dataUltimaUso,
    usoCount: contrato.usoCount
  }));
}

/**
 * Atualiza um modelo de contrato
 */
export async function atualizarContratoModelo(id: string, dados: Partial<ContratoModeloData>): Promise<ContratoModeloWithItens | null> {
  // Primeiro, atualizar o contrato
  const contratoAtualizado = await prisma.contratoModelo.update({
    where: { id },
    data: {
      nome: dados.nome,
      contrato: dados.contrato,
      valorInicial: dados.valorInicial,
      rq: dados.rq,
      os: dados.os,
      pedido: dados.pedido,
      descricaoEscopo: dados.descricaoEscopo,
      imagemFundoUrl: dados.imagemFundoUrl
    },
    include: {
      itensTecnicos: {
        orderBy: { ordem: 'asc' }
      }
    }
  });

  // Se há itens técnicos para atualizar
  if (dados.itensTecnicos) {
    // Remover itens existentes
    await prisma.itemTecnico.deleteMany({
      where: { contratoModeloId: id }
    });

    // Criar novos itens
    await prisma.itemTecnico.createMany({
      data: dados.itensTecnicos.map((item, index) => ({
        contratoModeloId: id,
        descricao: item.descricao,
        ordem: item.ordem || index
      }))
    });

    // Buscar o contrato atualizado com os novos itens
    const contratoFinal = await prisma.contratoModelo.findUnique({
      where: { id },
      include: {
        itensTecnicos: {
          orderBy: { ordem: 'asc' }
        }
      }
    });

    if (!contratoFinal) return null;

    return {
      id: contratoFinal.id,
      nome: contratoFinal.nome,
      contrato: contratoFinal.contrato,
      valorInicial: contratoFinal.valorInicial,
      rq: contratoFinal.rq,
      os: contratoFinal.os,
      pedido: contratoFinal.pedido,
      descricaoEscopo: contratoFinal.descricaoEscopo,
      imagemFundoUrl: contratoFinal.imagemFundoUrl,
      itensTecnicos: contratoFinal.itensTecnicos.map(item => ({
        id: item.id,
        descricao: item.descricao,
        ordem: item.ordem
      })),
      dataCriacao: contratoFinal.dataCriacao,
      dataUltimaUso: contratoFinal.dataUltimaUso,
      usoCount: contratoFinal.usoCount
    };
  }

  return {
    id: contratoAtualizado.id,
    nome: contratoAtualizado.nome,
    contrato: contratoAtualizado.contrato,
    valorInicial: contratoAtualizado.valorInicial,
    rq: contratoAtualizado.rq,
    os: contratoAtualizado.os,
    pedido: contratoAtualizado.pedido,
    descricaoEscopo: contratoAtualizado.descricaoEscopo,
    imagemFundoUrl: contratoAtualizado.imagemFundoUrl,
    itensTecnicos: contratoAtualizado.itensTecnicos.map(item => ({
      id: item.id,
      descricao: item.descricao,
      ordem: item.ordem
    })),
    dataCriacao: contratoAtualizado.dataCriacao,
    dataUltimaUso: contratoAtualizado.dataUltimaUso,
    usoCount: contratoAtualizado.usoCount
  };
}

/**
 * Remove um modelo de contrato
 */
export async function removerContratoModelo(id: string): Promise<boolean> {
  try {
    await prisma.contratoModelo.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    console.error('Erro ao remover contrato:', error);
    return false;
  }
}

/**
 * Registra o uso de um contrato (atualiza contador e data)
 */
export async function registrarUsoContrato(id: string): Promise<void> {
  await prisma.contratoModelo.update({
    where: { id },
    data: {
      usoCount: { increment: 1 },
      dataUltimaUso: new Date()
    }
  });
}

/**
 * Obtém contratos mais usados
 */
export async function obterContratosMaisUsados(limite: number = 5): Promise<ContratoModeloWithItens[]> {
  const contratos = await prisma.contratoModelo.findMany({
    include: {
      itensTecnicos: {
        orderBy: { ordem: 'asc' }
      }
    },
    orderBy: { usoCount: 'desc' },
    take: limite
  });

  return contratos.map(contrato => ({
    id: contrato.id,
    nome: contrato.nome,
    contrato: contrato.contrato,
    valorInicial: contrato.valorInicial,
    rq: contrato.rq,
    os: contrato.os,
    pedido: contrato.pedido,
    descricaoEscopo: contrato.descricaoEscopo,
    imagemFundoUrl: contrato.imagemFundoUrl,
    itensTecnicos: contrato.itensTecnicos.map(item => ({
      id: item.id,
      descricao: item.descricao,
      ordem: item.ordem
    })),
    dataCriacao: contrato.dataCriacao,
    dataUltimaUso: contrato.dataUltimaUso,
    usoCount: contrato.usoCount
  }));
}

/**
 * Obtém contratos recentes
 */
export async function obterContratosRecentes(limite: number = 5): Promise<ContratoModeloWithItens[]> {
  const contratos = await prisma.contratoModelo.findMany({
    include: {
      itensTecnicos: {
        orderBy: { ordem: 'asc' }
      }
    },
    orderBy: { dataUltimaUso: 'desc' },
    take: limite
  });

  return contratos.map(contrato => ({
    id: contrato.id,
    nome: contrato.nome,
    contrato: contrato.contrato,
    valorInicial: contrato.valorInicial,
    rq: contrato.rq,
    os: contrato.os,
    pedido: contrato.pedido,
    descricaoEscopo: contrato.descricaoEscopo,
    imagemFundoUrl: contrato.imagemFundoUrl,
    itensTecnicos: contrato.itensTecnicos.map(item => ({
      id: item.id,
      descricao: item.descricao,
      ordem: item.ordem
    })),
    dataCriacao: contrato.dataCriacao,
    dataUltimaUso: contrato.dataUltimaUso,
    usoCount: contrato.usoCount
  }));
}

/**
 * Inicializa dados padrão no banco
 */
export async function inicializarDadosPadrao(): Promise<void> {
  const contratosExistentes = await prisma.contratoModelo.count();
  
  if (contratosExistentes === 0) {
    const contratosPadrao = [
      {
        nome: "ATLAS BH - Instalação Tomadas",
        contrato: "ATLAS BH",
        valorInicial: "R$ 850,00",
        rq: "RQ13853907",
        os: "50007",
        pedido: "OC10845507",
        descricaoEscopo: "Instalação de tomadas e pontos elétricos",
        imagemFundoUrl: "/relatorio-tecnico/fundo-pdf.jpg",
        itensTecnicos: [
          { descricao: "Módulo acrescentado TV", ordem: 0 },
          { descricao: "Ponto tomada condulete para cafeteira", ordem: 1 },
          { descricao: "Instalação de tomada dupla no escritório", ordem: 2 },
          { descricao: "Verificação de aterramento", ordem: 3 },
          { descricao: "Teste de funcionamento das tomadas", ordem: 4 }
        ]
      },
      {
        nome: "ATLAS BH - Manutenção Elétrica",
        contrato: "ATLAS BH",
        valorInicial: "R$ 1.200,00",
        rq: "RQ13853908",
        os: "50008",
        pedido: "OC10845508",
        descricaoEscopo: "Manutenção preventiva e corretiva do sistema elétrico",
        imagemFundoUrl: "/relatorio-tecnico/fundo-pdf.jpg",
        itensTecnicos: [
          { descricao: "Substituição de disjuntores defeituosos", ordem: 0 },
          { descricao: "Verificação e ajuste de tensão nos quadros", ordem: 1 },
          { descricao: "Instalação de iluminação de emergência", ordem: 2 },
          { descricao: "Teste de funcionamento dos dispositivos de proteção", ordem: 3 },
          { descricao: "Inspeção visual dos cabos e conexões", ordem: 4 },
          { descricao: "Medição de resistência de aterramento", ordem: 5 },
          { descricao: "Verificação de continuidade dos circuitos", ordem: 6 }
        ]
      },
      {
        nome: "Empresa ABC - Projeto Completo",
        contrato: "ABC CONSTRUÇÕES",
        valorInicial: "R$ 2.500,00",
        rq: "RQ12345678",
        os: "12345",
        pedido: "OC98765432",
        descricaoEscopo: "Projeto elétrico completo para nova construção",
        imagemFundoUrl: "/relatorio-tecnico/fundo-pdf.jpg",
        itensTecnicos: [
          { descricao: "Instalação do quadro de distribuição principal", ordem: 0 },
          { descricao: "Cabeamento estruturado para rede de dados", ordem: 1 },
          { descricao: "Sistema de iluminação LED com dimmer", ordem: 2 },
          { descricao: "Instalação de ar condicionado central", ordem: 3 },
          { descricao: "Sistema de segurança e monitoramento", ordem: 4 },
          { descricao: "Automação residencial básica", ordem: 5 },
          { descricao: "Instalação de sistema de alarme", ordem: 6 },
          { descricao: "Configuração de rede Wi-Fi", ordem: 7 },
          { descricao: "Instalação de sistema de som ambiente", ordem: 8 },
          { descricao: "Teste e comissionamento de todos os sistemas", ordem: 9 }
        ]
      }
    ];

    for (const contrato of contratosPadrao) {
      await criarContratoModelo(contrato);
    }
  }
}
