import { NextRequest, NextResponse } from 'next/server';
import { inicializarDadosPadrao } from '@/lib/relatorios-database';

// POST /api/relatorios/inicializar - Inicializar dados padrão
export async function POST(request: NextRequest) {
  try {
    await inicializarDadosPadrao();
    
    return NextResponse.json({ 
      message: 'Dados padrão inicializados com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao inicializar dados padrão:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
