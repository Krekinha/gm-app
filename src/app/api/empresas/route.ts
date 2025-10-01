import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  criarEmpresa,
  buscarTodasEmpresas,
  buscarEmpresaPorId,
  buscarEmpresaPorCnpj,
  atualizarEmpresa,
  removerEmpresa,
  inicializarEmpresaPadrao,
  type EmpresaData
} from '@/lib/empresa-database';

// Schema de validação para criação de empresa
const criarEmpresaSchema = z.object({
  razaoSocial: z.string().min(1, 'Razão social é obrigatória'),
  cnpj: z.string().min(1, 'CNPJ é obrigatório'),
  logoUrl: z.string().optional()
});

// GET /api/empresas - Listar todas as empresas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cnpj = searchParams.get('cnpj');

    let empresas;

    if (cnpj) {
      const empresa = await buscarEmpresaPorCnpj(cnpj);
      empresas = empresa ? [empresa] : [];
    } else {
      empresas = await buscarTodasEmpresas();
    }

    return NextResponse.json({ empresas });
  } catch (error) {
    console.error('Erro ao buscar empresas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/empresas - Criar nova empresa
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados
    const dadosValidados = criarEmpresaSchema.parse(body);
    
    // Criar empresa
    const empresa = await criarEmpresa(dadosValidados);
    
    return NextResponse.json({ empresa }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Erro ao criar empresa:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
