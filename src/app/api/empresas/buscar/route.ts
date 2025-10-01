import { NextRequest, NextResponse } from "next/server";
import { buscarEmpresaPorCnpj } from "@/lib/empresa-database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cnpj = searchParams.get("cnpj");

    if (!cnpj) {
      return NextResponse.json(
        { error: "CNPJ é obrigatório" },
        { status: 400 }
      );
    }

    const empresa = await buscarEmpresaPorCnpj(cnpj);
    
    if (!empresa) {
      return NextResponse.json(
        { error: "Empresa não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(empresa);
  } catch (error) {
    console.error("Erro ao buscar empresa:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
