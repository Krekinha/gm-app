import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  buscarContratoPorId,
  atualizarContratoModelo,
  removerContratoModelo,
  registrarUsoContrato,
  type ContratoModeloData
} from '@/lib/contratos-database';

// Schema de validação para atualização de contrato
const atualizarContratoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').optional(),
  contrato: z.string().min(1, 'Contrato é obrigatório').optional(),
  valorInicial: z.string().min(1, 'Valor inicial é obrigatório').optional(),
  rq: z.string().min(1, 'RQ é obrigatório').optional(),
  os: z.string().min(1, 'OS é obrigatório').optional(),
  pedido: z.string().min(1, 'Pedido é obrigatório').optional(),
  descricaoEscopo: z.string().min(1, 'Descrição do escopo é obrigatória').optional(),
  imagemFundoUrl: z.string().optional(),
  itensTecnicos: z.array(z.object({
    descricao: z.string().min(1, 'Descrição do item é obrigatória'),
    ordem: z.number().optional()
  })).optional()
});

// GET /api/contratos/[id] - Buscar contrato por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do contrato é obrigatório' },
        { status: 400 }
      );
    }

    const contrato = await buscarContratoPorId(id);
    
    if (!contrato) {
      return NextResponse.json(
        { error: 'Contrato não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ contrato });
  } catch (error) {
    console.error('Erro ao buscar contrato:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/contratos/[id] - Atualizar contrato
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do contrato é obrigatório' },
        { status: 400 }
      );
    }

    // Validar dados
    const dadosValidados = atualizarContratoSchema.parse(body);
    
    // Atualizar contrato
    const contrato = await atualizarContratoModelo(id, dadosValidados);
    
    if (!contrato) {
      return NextResponse.json(
        { error: 'Contrato não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ contrato });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Erro ao atualizar contrato:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/contratos/[id] - Remover contrato
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do contrato é obrigatório' },
        { status: 400 }
      );
    }

    const sucesso = await removerContratoModelo(id);
    
    if (!sucesso) {
      return NextResponse.json(
        { error: 'Contrato não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Contrato removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover contrato:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
