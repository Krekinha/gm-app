/**
 * Serviço de banco de dados para dados da empresa
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface EmpresaData {
  id?: string;
  razaoSocial: string;
  cnpj: string;
  logoUrl?: string;
}

export interface EmpresaWithRelatorios extends EmpresaData {
  relatorios: {
    id: string;
    nome: string;
    contrato: string;
    valorInicial: string;
    rq: string;
    os: string;
    pedido: string;
    descricaoEscopo: string;
    imagemFundoUrl?: string;
    dataCriacao: Date;
    dataUltimaUso: Date;
    usoCount: number;
  }[];
  dataCriacao: Date;
  dataAtualizacao: Date;
}

/**
 * Cria uma nova empresa
 */
export async function criarEmpresa(dados: EmpresaData): Promise<EmpresaWithRelatorios> {
  const empresa = await prisma.empresa.create({
    data: {
      razaoSocial: dados.razaoSocial,
      cnpj: dados.cnpj,
      logoUrl: dados.logoUrl,
    },
    include: {
      relatorios: {
        orderBy: { dataUltimaUso: 'desc' }
      }
    }
  });

  return {
    id: empresa.id,
    razaoSocial: empresa.razaoSocial,
    cnpj: empresa.cnpj,
    logoUrl: empresa.logoUrl || undefined,
    relatorios: empresa.relatorios.map(relatorio => ({
      id: relatorio.id,
      nome: relatorio.nome,
      contrato: relatorio.contrato,
      valorInicial: relatorio.valorInicial,
      rq: relatorio.rq,
      os: relatorio.os,
      pedido: relatorio.pedido,
      descricaoEscopo: relatorio.descricaoEscopo,
      imagemFundoUrl: relatorio.imagemFundoUrl || undefined,
      dataCriacao: relatorio.dataCriacao,
      dataUltimaUso: relatorio.dataUltimaUso,
      usoCount: relatorio.usoCount
    })),
    dataCriacao: empresa.dataCriacao,
    dataAtualizacao: empresa.dataAtualizacao
  };
}

/**
 * Busca todas as empresas
 */
export async function buscarTodasEmpresas(): Promise<EmpresaWithRelatorios[]> {
  const empresas = await prisma.empresa.findMany({
    include: {
      relatorios: {
        orderBy: { dataUltimaUso: 'desc' }
      }
    },
    orderBy: { dataAtualizacao: 'desc' }
  });

  return empresas.map(empresa => ({
    id: empresa.id,
    razaoSocial: empresa.razaoSocial,
    cnpj: empresa.cnpj,
    logoUrl: empresa.logoUrl || undefined,
    relatorios: empresa.relatorios.map(relatorio => ({
      id: relatorio.id,
      nome: relatorio.nome,
      contrato: relatorio.contrato,
      valorInicial: relatorio.valorInicial,
      rq: relatorio.rq,
      os: relatorio.os,
      pedido: relatorio.pedido,
      descricaoEscopo: relatorio.descricaoEscopo,
      imagemFundoUrl: relatorio.imagemFundoUrl || undefined,
      dataCriacao: relatorio.dataCriacao,
      dataUltimaUso: relatorio.dataUltimaUso,
      usoCount: relatorio.usoCount
    })),
    dataCriacao: empresa.dataCriacao,
    dataAtualizacao: empresa.dataAtualizacao
  }));
}

/**
 * Busca uma empresa por ID
 */
export async function buscarEmpresaPorId(id: string): Promise<EmpresaWithRelatorios | null> {
  const empresa = await prisma.empresa.findUnique({
    where: { id },
    include: {
      relatorios: {
        orderBy: { dataUltimaUso: 'desc' }
      }
    }
  });

  if (!empresa) return null;

  return {
    id: empresa.id,
    razaoSocial: empresa.razaoSocial,
    cnpj: empresa.cnpj,
    logoUrl: empresa.logoUrl || undefined,
    relatorios: empresa.relatorios.map(relatorio => ({
      id: relatorio.id,
      nome: relatorio.nome,
      contrato: relatorio.contrato,
      valorInicial: relatorio.valorInicial,
      rq: relatorio.rq,
      os: relatorio.os,
      pedido: relatorio.pedido,
      descricaoEscopo: relatorio.descricaoEscopo,
      imagemFundoUrl: relatorio.imagemFundoUrl || undefined,
      dataCriacao: relatorio.dataCriacao,
      dataUltimaUso: relatorio.dataUltimaUso,
      usoCount: relatorio.usoCount
    })),
    dataCriacao: empresa.dataCriacao,
    dataAtualizacao: empresa.dataAtualizacao
  };
}

/**
 * Busca uma empresa por CNPJ
 */
export async function buscarEmpresaPorCnpj(cnpj: string): Promise<EmpresaWithRelatorios | null> {
  const empresa = await prisma.empresa.findUnique({
    where: { cnpj },
    include: {
      relatorios: {
        orderBy: { dataUltimaUso: 'desc' }
      }
    }
  });

  if (!empresa) return null;

  return {
    id: empresa.id,
    razaoSocial: empresa.razaoSocial,
    cnpj: empresa.cnpj,
    logoUrl: empresa.logoUrl || undefined,
    relatorios: empresa.relatorios.map(relatorio => ({
      id: relatorio.id,
      nome: relatorio.nome,
      contrato: relatorio.contrato,
      valorInicial: relatorio.valorInicial,
      rq: relatorio.rq,
      os: relatorio.os,
      pedido: relatorio.pedido,
      descricaoEscopo: relatorio.descricaoEscopo,
      imagemFundoUrl: relatorio.imagemFundoUrl || undefined,
      dataCriacao: relatorio.dataCriacao,
      dataUltimaUso: relatorio.dataUltimaUso,
      usoCount: relatorio.usoCount
    })),
    dataCriacao: empresa.dataCriacao,
    dataAtualizacao: empresa.dataAtualizacao
  };
}

/**
 * Atualiza uma empresa
 */
export async function atualizarEmpresa(id: string, dados: Partial<EmpresaData>): Promise<EmpresaWithRelatorios | null> {
  const empresa = await prisma.empresa.update({
    where: { id },
    data: {
      razaoSocial: dados.razaoSocial,
      cnpj: dados.cnpj,
      logoUrl: dados.logoUrl,
    },
    include: {
      relatorios: {
        orderBy: { dataUltimaUso: 'desc' }
      }
    }
  });

  return {
    id: empresa.id,
    razaoSocial: empresa.razaoSocial,
    cnpj: empresa.cnpj,
    logoUrl: empresa.logoUrl || undefined,
    relatorios: empresa.relatorios.map(relatorio => ({
      id: relatorio.id,
      nome: relatorio.nome,
      contrato: relatorio.contrato,
      valorInicial: relatorio.valorInicial,
      rq: relatorio.rq,
      os: relatorio.os,
      pedido: relatorio.pedido,
      descricaoEscopo: relatorio.descricaoEscopo,
      imagemFundoUrl: relatorio.imagemFundoUrl || undefined,
      dataCriacao: relatorio.dataCriacao,
      dataUltimaUso: relatorio.dataUltimaUso,
      usoCount: relatorio.usoCount
    })),
    dataCriacao: empresa.dataCriacao,
    dataAtualizacao: empresa.dataAtualizacao
  };
}

/**
 * Remove uma empresa
 */
export async function removerEmpresa(id: string): Promise<boolean> {
  try {
    await prisma.empresa.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    console.error('Erro ao remover empresa:', error);
    return false;
  }
}

/**
 * Inicializa dados padrão da empresa
 */
export async function inicializarEmpresaPadrao(): Promise<EmpresaWithRelatorios> {
  // Verificar se já existe uma empresa padrão
  const empresaExistente = await prisma.empresa.findFirst({
    where: { cnpj: "37.097.718/0001-58" }
  });

  if (empresaExistente) {
    return buscarEmpresaPorId(empresaExistente.id) as Promise<EmpresaWithRelatorios>;
  }

  // Criar empresa padrão
  const empresa = await prisma.empresa.create({
    data: {
      razaoSocial: "GM MANUTENÇÕES LTDA",
      cnpj: "37.097.718/0001-58",
      logoUrl: "/relatorio-tecnico/logo.png"
    },
    include: {
      relatorios: {
        orderBy: { dataUltimaUso: 'desc' }
      }
    }
  });

  return {
    id: empresa.id,
    razaoSocial: empresa.razaoSocial,
    cnpj: empresa.cnpj,
    logoUrl: empresa.logoUrl || undefined,
    relatorios: empresa.relatorios.map(relatorio => ({
      id: relatorio.id,
      nome: relatorio.nome,
      contrato: relatorio.contrato,
      valorInicial: relatorio.valorInicial,
      rq: relatorio.rq,
      os: relatorio.os,
      pedido: relatorio.pedido,
      descricaoEscopo: relatorio.descricaoEscopo,
      imagemFundoUrl: relatorio.imagemFundoUrl || undefined,
      dataCriacao: relatorio.dataCriacao,
      dataUltimaUso: relatorio.dataUltimaUso,
      usoCount: relatorio.usoCount
    })),
    dataCriacao: empresa.dataCriacao,
    dataAtualizacao: empresa.dataAtualizacao
  };
}
