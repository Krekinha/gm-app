import { NextRequest, NextResponse } from 'next/server';
import { registrarUsoRelatorio } from '@/lib/relatorios-database';

// POST /api/relatorios/[id]/uso - Registrar uso do relatório
export async function POST(
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

    await registrarUsoRelatorio(id);
    
    return NextResponse.json({ message: 'Uso registrado com sucesso' });
  } catch (error) {
    console.error('Erro ao registrar uso do relatório:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
