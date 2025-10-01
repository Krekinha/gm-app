import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  criarRelatorioModelo,
  buscarTodosRelatorios,
  buscarRelatorioPorId,
  buscarRelatoriosPorTermo,
  atualizarRelatorioModelo,
  removerRelatorioModelo,
  registrarUsoRelatorio,
  obterRelatoriosMaisUsados,
  obterRelatoriosRecentes,
  inicializarDadosPadrao,
  type RelatorioModeloData
} from '@/lib/relatorios-database';

// Schema de validação para criação de relatório
const criarRelatorioSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  contrato: z.string().min(1, 'Contrato é obrigatório'),
  valorInicial: z.string().min(1, 'Valor inicial é obrigatório'),
  rq: z.string().min(1, 'RQ é obrigatório'),
  os: z.string().min(1, 'OS é obrigatório'),
  pedido: z.string().min(1, 'Pedido é obrigatório'),
  descricaoEscopo: z.string().min(1, 'Descrição do escopo é obrigatória'),
  imagemFundoUrl: z.string().optional(),
  itensRelatorio: z.array(z.object({
    descricao: z.string().min(1, 'Descrição do item é obrigatória'),
    ordem: z.number().optional()
  })).optional()
});

// GET /api/relatorios - Listar todos os relatórios
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filtro = searchParams.get('filtro');
    const termo = searchParams.get('termo');

    let relatorios;

    if (termo) {
      relatorios = await buscarRelatoriosPorTermo(termo);
    } else if (filtro === 'maisUsados') {
      relatorios = await obterRelatoriosMaisUsados();
    } else if (filtro === 'recentes') {
      relatorios = await obterRelatoriosRecentes();
    } else {
      relatorios = await buscarTodosRelatorios();
    }

    return NextResponse.json({ relatorios });
  } catch (error) {
    console.error('Erro ao buscar relatórios:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/relatorios - Criar novo relatório
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados
    const dadosValidados = criarRelatorioSchema.parse(body);
    
    // Criar relatório
    const relatorio = await criarRelatorioModelo(dadosValidados);
    
    return NextResponse.json({ relatorio }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Erro ao criar relatório:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
