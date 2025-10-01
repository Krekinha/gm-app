import { NextRequest, NextResponse } from 'next/server';
import { inicializarEmpresaPadrao } from '@/lib/empresa-database';

// POST /api/empresas/inicializar - Inicializar empresa padrão
export async function POST(request: NextRequest) {
  try {
    const empresa = await inicializarEmpresaPadrao();
    
    return NextResponse.json({ 
      message: 'Empresa padrão inicializada com sucesso',
      empresa 
    });
  } catch (error) {
    console.error('Erro ao inicializar empresa padrão:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
