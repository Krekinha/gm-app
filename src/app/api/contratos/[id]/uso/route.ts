import { NextRequest, NextResponse } from 'next/server';
import { registrarUsoContrato } from '@/lib/contratos-database';

// POST /api/contratos/[id]/uso - Registrar uso do contrato
export async function POST(
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

    await registrarUsoContrato(id);
    
    return NextResponse.json({ message: 'Uso registrado com sucesso' });
  } catch (error) {
    console.error('Erro ao registrar uso do contrato:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
