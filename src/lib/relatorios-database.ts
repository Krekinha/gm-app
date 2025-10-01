/**
 * Serviço de banco de dados para modelos de relatórios
 */

import { PrismaClient } from '@prisma/client';
import { inicializarEmpresaPadrao, buscarEmpresaPorCnpj } from './empresa-database';

const prisma = new PrismaClient();

export interface ItemRelatorioData {
  id?: string;
  descricao: string;
  ordem?: number;
}

export interface RelatorioModeloData {
  id?: string;
  nome: string;
  contrato: string;
  valorInicial: string;
  rq: string;
  os: string;
  pedido: string;
  descricaoEscopo: string;
  imagemFundoUrl?: string;
  empresaId?: string;
  itensRelatorio?: ItemRelatorioData[];
}

export interface RelatorioModeloWithItens extends RelatorioModeloData {
  itensRelatorio: ItemRelatorioData[];
  empresaId: string;
  dataCriacao: Date;
  dataUltimaUso: Date;
  usoCount: number;
}

/**
 * Cria um novo modelo de relatório
 */
export async function criarRelatorioModelo(dados: RelatorioModeloData): Promise<RelatorioModeloWithItens> {
  // Se não foi fornecida empresaId, usar empresa padrão com CNPJ fixo
  let empresaId = dados.empresaId;
  if (!empresaId) {
    const empresaPadrao = await buscarEmpresaPorCnpj("37.097.718/0001-58");
    
    if (!empresaPadrao) {
      throw new Error("Empresa padrão não encontrada no banco de dados. Verifique se os dados da empresa estão cadastrados corretamente.");
    }
    
    empresaId = empresaPadrao.id;
  }

  const relatorio = await prisma.relatorioModelo.create({
    data: {
      nome: dados.nome,
      contrato: dados.contrato,
      valorInicial: dados.valorInicial,
      rq: dados.rq,
      os: dados.os,
      pedido: dados.pedido,
      descricaoEscopo: dados.descricaoEscopo,
      imagemFundoUrl: dados.imagemFundoUrl,
      empresaId: empresaId!,
      itensRelatorio: {
        create: dados.itensRelatorio?.map((item, index) => ({
          descricao: item.descricao,
          ordem: item.ordem || index
        })) || []
      }
    },
    include: {
      itensRelatorio: {
        orderBy: { ordem: 'asc' }
      }
    }
  });

  return {
    id: relatorio.id,
    nome: relatorio.nome,
    contrato: relatorio.contrato,
    valorInicial: relatorio.valorInicial,
    rq: relatorio.rq,
    os: relatorio.os,
    pedido: relatorio.pedido,
    descricaoEscopo: relatorio.descricaoEscopo,
    imagemFundoUrl: relatorio.imagemFundoUrl || undefined,
    empresaId: relatorio.empresaId,
    itensRelatorio: relatorio.itensRelatorio.map(item => ({
      id: item.id,
      descricao: item.descricao,
      ordem: item.ordem
    })),
    dataCriacao: relatorio.dataCriacao,
    dataUltimaUso: relatorio.dataUltimaUso,
    usoCount: relatorio.usoCount
  };
}

/**
 * Busca todos os modelos de relatórios da empresa padrão
 */
export async function buscarTodosRelatorios(): Promise<RelatorioModeloWithItens[]> {
  // Buscar empresa padrão pelo CNPJ fixo
  const empresaPadrao = await buscarEmpresaPorCnpj("37.097.718/0001-58");
  
  if (!empresaPadrao) {
    throw new Error("Empresa padrão não encontrada no banco de dados. Verifique se os dados da empresa estão cadastrados corretamente.");
  }
  
  const relatorios = await prisma.relatorioModelo.findMany({
    where: {
      empresaId: empresaPadrao.id
    },
    include: {
      itensRelatorio: {
        orderBy: { ordem: 'asc' }
      }
    },
    orderBy: { dataUltimaUso: 'desc' }
  });

  return relatorios.map(relatorio => ({
    id: relatorio.id,
    nome: relatorio.nome,
    contrato: relatorio.contrato,
    valorInicial: relatorio.valorInicial,
    rq: relatorio.rq,
    os: relatorio.os,
    pedido: relatorio.pedido,
    descricaoEscopo: relatorio.descricaoEscopo,
    imagemFundoUrl: relatorio.imagemFundoUrl || undefined,
    empresaId: relatorio.empresaId,
    itensRelatorio: relatorio.itensRelatorio.map(item => ({
      id: item.id,
      descricao: item.descricao,
      ordem: item.ordem
    })),
    dataCriacao: relatorio.dataCriacao,
    dataUltimaUso: relatorio.dataUltimaUso,
    usoCount: relatorio.usoCount
  }));
}

/**
 * Busca um modelo de relatório por ID
 */
export async function buscarRelatorioPorId(id: string): Promise<RelatorioModeloWithItens | null> {
  const relatorio = await prisma.relatorioModelo.findUnique({
    where: { id },
    include: {
      itensRelatorio: {
        orderBy: { ordem: 'asc' }
      }
    }
  });

  if (!relatorio) return null;

  return {
    id: relatorio.id,
    nome: relatorio.nome,
    contrato: relatorio.contrato,
    valorInicial: relatorio.valorInicial,
    rq: relatorio.rq,
    os: relatorio.os,
    pedido: relatorio.pedido,
    descricaoEscopo: relatorio.descricaoEscopo,
    imagemFundoUrl: relatorio.imagemFundoUrl || undefined,
    empresaId: relatorio.empresaId,
    itensRelatorio: relatorio.itensRelatorio.map(item => ({
      id: item.id,
      descricao: item.descricao,
      ordem: item.ordem
    })),
    dataCriacao: relatorio.dataCriacao,
    dataUltimaUso: relatorio.dataUltimaUso,
    usoCount: relatorio.usoCount
  };
}

/**
 * Busca modelos por termo de pesquisa
 */
export async function buscarRelatoriosPorTermo(termo: string): Promise<RelatorioModeloWithItens[]> {
  const relatorios = await prisma.relatorioModelo.findMany({
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
      itensRelatorio: {
        orderBy: { ordem: 'asc' }
      }
    },
    orderBy: { dataUltimaUso: 'desc' }
  });

  return relatorios.map(relatorio => ({
    id: relatorio.id,
    nome: relatorio.nome,
    contrato: relatorio.contrato,
    valorInicial: relatorio.valorInicial,
    rq: relatorio.rq,
    os: relatorio.os,
    pedido: relatorio.pedido,
    descricaoEscopo: relatorio.descricaoEscopo,
    imagemFundoUrl: relatorio.imagemFundoUrl || undefined,
    empresaId: relatorio.empresaId,
    itensRelatorio: relatorio.itensRelatorio.map(item => ({
      id: item.id,
      descricao: item.descricao,
      ordem: item.ordem
    })),
    dataCriacao: relatorio.dataCriacao,
    dataUltimaUso: relatorio.dataUltimaUso,
    usoCount: relatorio.usoCount
  }));
}

/**
 * Atualiza um modelo de relatório
 */
export async function atualizarRelatorioModelo(id: string, dados: Partial<RelatorioModeloData>): Promise<RelatorioModeloWithItens | null> {
  // Primeiro, atualizar o relatório
  const relatorioAtualizado = await prisma.relatorioModelo.update({
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
      itensRelatorio: {
        orderBy: { ordem: 'asc' }
      }
    }
  });

  // Se há itens técnicos para atualizar
  if (dados.itensRelatorio) {
    // Remover itens existentes
    await prisma.itemRelatorio.deleteMany({
      where: { relatorioModeloId: id }
    });

    // Criar novos itens
    await prisma.itemRelatorio.createMany({
      data: dados.itensRelatorio.map((item, index) => ({
        relatorioModeloId: id,
        descricao: item.descricao,
        ordem: item.ordem || index
      }))
    });

    // Buscar o relatório atualizado com os novos itens
    const relatorioFinal = await prisma.relatorioModelo.findUnique({
      where: { id },
      include: {
        itensRelatorio: {
          orderBy: { ordem: 'asc' }
        }
      }
    });

    if (!relatorioFinal) return null;

    return {
      id: relatorioFinal.id,
      nome: relatorioFinal.nome,
      contrato: relatorioFinal.contrato,
      valorInicial: relatorioFinal.valorInicial,
      rq: relatorioFinal.rq,
      os: relatorioFinal.os,
      pedido: relatorioFinal.pedido,
      descricaoEscopo: relatorioFinal.descricaoEscopo,
      imagemFundoUrl: relatorioFinal.imagemFundoUrl || undefined,
      empresaId: relatorioFinal.empresaId,
      itensRelatorio: relatorioFinal.itensRelatorio.map(item => ({
        id: item.id,
        descricao: item.descricao,
        ordem: item.ordem
      })),
      dataCriacao: relatorioFinal.dataCriacao,
      dataUltimaUso: relatorioFinal.dataUltimaUso,
      usoCount: relatorioFinal.usoCount
    };
  }

  return {
    id: relatorioAtualizado.id,
    nome: relatorioAtualizado.nome,
    contrato: relatorioAtualizado.contrato,
    valorInicial: relatorioAtualizado.valorInicial,
    rq: relatorioAtualizado.rq,
    os: relatorioAtualizado.os,
    pedido: relatorioAtualizado.pedido,
    descricaoEscopo: relatorioAtualizado.descricaoEscopo,
    imagemFundoUrl: relatorioAtualizado.imagemFundoUrl || undefined,
    empresaId: relatorioAtualizado.empresaId,
    itensRelatorio: relatorioAtualizado.itensRelatorio.map(item => ({
      id: item.id,
      descricao: item.descricao,
      ordem: item.ordem
    })),
    dataCriacao: relatorioAtualizado.dataCriacao,
    dataUltimaUso: relatorioAtualizado.dataUltimaUso,
    usoCount: relatorioAtualizado.usoCount
  };
}

/**
 * Remove um modelo de relatório
 */
export async function removerRelatorioModelo(id: string): Promise<boolean> {
  try {
    await prisma.relatorioModelo.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    console.error('Erro ao remover relatório:', error);
    return false;
  }
}

/**
 * Registra o uso de um relatório (atualiza contador e data)
 */
export async function registrarUsoRelatorio(id: string): Promise<void> {
  await prisma.relatorioModelo.update({
    where: { id },
    data: {
      usoCount: { increment: 1 },
      dataUltimaUso: new Date()
    }
  });
}

/**
 * Obtém relatórios mais usados
 */
export async function obterRelatoriosMaisUsados(limite: number = 5): Promise<RelatorioModeloWithItens[]> {
  const relatorios = await prisma.relatorioModelo.findMany({
    include: {
      itensRelatorio: {
        orderBy: { ordem: 'asc' }
      }
    },
    orderBy: { usoCount: 'desc' },
    take: limite
  });

  return relatorios.map(relatorio => ({
    id: relatorio.id,
    nome: relatorio.nome,
    contrato: relatorio.contrato,
    valorInicial: relatorio.valorInicial,
    rq: relatorio.rq,
    os: relatorio.os,
    pedido: relatorio.pedido,
    descricaoEscopo: relatorio.descricaoEscopo,
    imagemFundoUrl: relatorio.imagemFundoUrl || undefined,
    empresaId: relatorio.empresaId,
    itensRelatorio: relatorio.itensRelatorio.map(item => ({
      id: item.id,
      descricao: item.descricao,
      ordem: item.ordem
    })),
    dataCriacao: relatorio.dataCriacao,
    dataUltimaUso: relatorio.dataUltimaUso,
    usoCount: relatorio.usoCount
  }));
}

/**
 * Obtém relatórios recentes
 */
export async function obterRelatoriosRecentes(limite: number = 5): Promise<RelatorioModeloWithItens[]> {
  const relatorios = await prisma.relatorioModelo.findMany({
    include: {
      itensRelatorio: {
        orderBy: { ordem: 'asc' }
      }
    },
    orderBy: { dataUltimaUso: 'desc' },
    take: limite
  });

  return relatorios.map(relatorio => ({
    id: relatorio.id,
    nome: relatorio.nome,
    contrato: relatorio.contrato,
    valorInicial: relatorio.valorInicial,
    rq: relatorio.rq,
    os: relatorio.os,
    pedido: relatorio.pedido,
    descricaoEscopo: relatorio.descricaoEscopo,
    imagemFundoUrl: relatorio.imagemFundoUrl || undefined,
    empresaId: relatorio.empresaId,
    itensRelatorio: relatorio.itensRelatorio.map(item => ({
      id: item.id,
      descricao: item.descricao,
      ordem: item.ordem
    })),
    dataCriacao: relatorio.dataCriacao,
    dataUltimaUso: relatorio.dataUltimaUso,
    usoCount: relatorio.usoCount
  }));
}

/**
 * Inicializa dados padrão no banco
 */
export async function inicializarDadosPadrao(): Promise<void> {
  const relatoriosExistentes = await prisma.relatorioModelo.count();
  
  if (relatoriosExistentes === 0) {
    // Inicializar empresa padrão primeiro
    const empresaPadrao = await inicializarEmpresaPadrao();
    
    const relatoriosPadrao = [
      {
        nome: "ATLAS BH - Instalação Tomadas",
        contrato: "ATLAS BH",
        valorInicial: "R$ 850,00",
        rq: "RQ13853907",
        os: "50007",
        pedido: "OC10845507",
        descricaoEscopo: "Instalação de tomadas e pontos elétricos",
        imagemFundoUrl: "/relatorio-tecnico/fundo-pdf.jpg",
        empresaId: empresaPadrao.id,
        itensRelatorio: [
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
        empresaId: empresaPadrao.id,
        itensRelatorio: [
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
        empresaId: empresaPadrao.id,
        itensRelatorio: [
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

    for (const relatorio of relatoriosPadrao) {
      await criarRelatorioModelo(relatorio);
    }
  }
}
