import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  buscarRelatorioPorId,
  atualizarRelatorioModelo,
  removerRelatorioModelo,
  registrarUsoRelatorio,
  type RelatorioModeloData
} from '@/lib/relatorios-database';

// Schema de validação para atualização de relatório
const atualizarRelatorioSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').optional(),
  contrato: z.string().min(1, 'Contrato é obrigatório').optional(),
  valorInicial: z.string().min(1, 'Valor inicial é obrigatório').optional(),
  rq: z.string().min(1, 'RQ é obrigatório').optional(),
  os: z.string().min(1, 'OS é obrigatório').optional(),
  pedido: z.string().min(1, 'Pedido é obrigatório').optional(),
  descricaoEscopo: z.string().min(1, 'Descrição do escopo é obrigatória').optional(),
  imagemFundoUrl: z.string().optional(),
  itensRelatorio: z.array(z.object({
    descricao: z.string().min(1, 'Descrição do item é obrigatória'),
    ordem: z.number().optional()
  })).optional()
});

// GET /api/relatorios/[id] - Buscar relatório por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do relatório é obrigatório' },
        { status: 400 }
      );
    }

    const relatorio = await buscarRelatorioPorId(id);
    
    if (!relatorio) {
      return NextResponse.json(
        { error: 'Relatório não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ relatorio });
  } catch (error) {
    console.error('Erro ao buscar relatório:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/relatorios/[id] - Atualizar relatório
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do relatório é obrigatório' },
        { status: 400 }
      );
    }

    // Validar dados
    const dadosValidados = atualizarRelatorioSchema.parse(body);
    
    // Atualizar relatório
    const relatorio = await atualizarRelatorioModelo(id, dadosValidados);
    
    if (!relatorio) {
      return NextResponse.json(
        { error: 'Relatório não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ relatorio });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Erro ao atualizar relatório:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/relatorios/[id] - Remover relatório
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do relatório é obrigatório' },
        { status: 400 }
      );
    }

    const sucesso = await removerRelatorioModelo(id);
    
    if (!sucesso) {
      return NextResponse.json(
        { error: 'Relatório não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Relatório removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover relatório:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
