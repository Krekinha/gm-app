import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  criarContratoModelo,
  buscarTodosContratos,
  buscarContratoPorId,
  buscarContratosPorTermo,
  atualizarContratoModelo,
  removerContratoModelo,
  registrarUsoContrato,
  obterContratosMaisUsados,
  obterContratosRecentes,
  inicializarDadosPadrao,
  type ContratoModeloData
} from '@/lib/contratos-database';

// Schema de validação para criação de contrato
const criarContratoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  contrato: z.string().min(1, 'Contrato é obrigatório'),
  valorInicial: z.string().min(1, 'Valor inicial é obrigatório'),
  rq: z.string().min(1, 'RQ é obrigatório'),
  os: z.string().min(1, 'OS é obrigatório'),
  pedido: z.string().min(1, 'Pedido é obrigatório'),
  descricaoEscopo: z.string().min(1, 'Descrição do escopo é obrigatória'),
  imagemFundoUrl: z.string().optional(),
  itensTecnicos: z.array(z.object({
    descricao: z.string().min(1, 'Descrição do item é obrigatória'),
    ordem: z.number().optional()
  })).optional()
});

// GET /api/contratos - Listar todos os contratos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filtro = searchParams.get('filtro');
    const termo = searchParams.get('termo');

    let contratos;

    if (termo) {
      contratos = await buscarContratosPorTermo(termo);
    } else if (filtro === 'maisUsados') {
      contratos = await obterContratosMaisUsados();
    } else if (filtro === 'recentes') {
      contratos = await obterContratosRecentes();
    } else {
      contratos = await buscarTodosContratos();
    }

    return NextResponse.json({ contratos });
  } catch (error) {
    console.error('Erro ao buscar contratos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/contratos - Criar novo contrato
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados
    const dadosValidados = criarContratoSchema.parse(body);
    
    // Criar contrato
    const contrato = await criarContratoModelo(dadosValidados);
    
    return NextResponse.json({ contrato }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Erro ao criar contrato:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
