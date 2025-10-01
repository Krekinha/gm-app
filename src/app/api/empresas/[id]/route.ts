import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  buscarEmpresaPorId,
  atualizarEmpresa,
  removerEmpresa,
  type EmpresaData
} from '@/lib/empresa-database';

// Schema de validação para atualização de empresa
const atualizarEmpresaSchema = z.object({
  razaoSocial: z.string().min(1, 'Razão social é obrigatória').optional(),
  cnpj: z.string().min(1, 'CNPJ é obrigatório').optional(),
  logoUrl: z.string().optional()
});

// GET /api/empresas/[id] - Buscar empresa por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID da empresa é obrigatório' },
        { status: 400 }
      );
    }

    const empresa = await buscarEmpresaPorId(id);
    
    if (!empresa) {
      return NextResponse.json(
        { error: 'Empresa não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ empresa });
  } catch (error) {
    console.error('Erro ao buscar empresa:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/empresas/[id] - Atualizar empresa
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID da empresa é obrigatório' },
        { status: 400 }
      );
    }

    // Validar dados
    const dadosValidados = atualizarEmpresaSchema.parse(body);
    
    // Atualizar empresa
    const empresa = await atualizarEmpresa(id, dadosValidados);
    
    if (!empresa) {
      return NextResponse.json(
        { error: 'Empresa não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ empresa });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Erro ao atualizar empresa:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/empresas/[id] - Remover empresa
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID da empresa é obrigatório' },
        { status: 400 }
      );
    }

    const sucesso = await removerEmpresa(id);
    
    if (!sucesso) {
      return NextResponse.json(
        { error: 'Empresa não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Empresa removida com sucesso' });
  } catch (error) {
    console.error('Erro ao remover empresa:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
