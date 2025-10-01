/**
 * Serviço de API para modelos de relatórios (substitui localStorage)
 */

export interface ItemRelatorioPredefinido {
  id: string;
  descricao: string;
  ordem?: number;
}

export interface RelatorioPredefinido {
  id: string;
  nome: string;
  contrato: string;
  valorInicial: string;
  rq: string;
  os: string;
  pedido: string;
  descricaoEscopo: string;
  itensRelatorio: ItemRelatorioPredefinido[];
  imagemFundoUrl?: string;
  dataCriacao: string;
  dataUltimaUso: string;
  usoCount: number;
}

/**
 * Carrega relatórios salvos da API
 */
export async function carregarRelatoriosSalvos(): Promise<RelatorioPredefinido[]> {
  try {
    const response = await fetch('/api/relatorios');
    if (!response.ok) {
      throw new Error('Erro ao carregar relatórios');
    }
    
    const data = await response.json();
    return data.relatorios || [];
  } catch (error) {
    console.warn("Erro ao carregar relatórios salvos:", error);
    return [];
  }
}

/**
 * Adiciona um novo relatório via API
 */
export async function adicionarRelatorio(
  novoRelatorio: Omit<RelatorioPredefinido, "id" | "dataCriacao" | "dataUltimaUso" | "usoCount">
): Promise<RelatorioPredefinido> {
  try {
    const response = await fetch('/api/relatorios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novoRelatorio),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao criar relatório');
    }

    const data = await response.json();
    return data.relatorio;
  } catch (error) {
    console.error('Erro ao adicionar relatório:', error);
    throw error;
  }
}

/**
 * Atualiza um relatório existente via API
 */
export async function atualizarRelatorio(
  id: string, 
  dadosAtualizados: Partial<RelatorioPredefinido>
): Promise<RelatorioPredefinido | null> {
  try {
    const response = await fetch(`/api/relatorios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosAtualizados),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao atualizar relatório');
    }

    const data = await response.json();
    return data.relatorio;
  } catch (error) {
    console.error('Erro ao atualizar relatório:', error);
    throw error;
  }
}

/**
 * Remove um relatório via API
 */
export async function removerRelatorio(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/relatorios/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return false;
      }
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao remover relatório');
    }

    return true;
  } catch (error) {
    console.error('Erro ao remover relatório:', error);
    return false;
  }
}

/**
 * Registra o uso de um relatório via API
 */
export async function registrarUsoRelatorio(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/relatorios/${id}/uso`, {
      method: 'POST',
    });

    if (!response.ok) {
      console.warn('Erro ao registrar uso do relatório');
    }
  } catch (error) {
    console.warn('Erro ao registrar uso do relatório:', error);
  }
}

/**
 * Busca relatórios por termo via API
 */
export async function buscarRelatorios(termo: string): Promise<RelatorioPredefinido[]> {
  try {
    const response = await fetch(`/api/relatorios?termo=${encodeURIComponent(termo)}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar relatórios');
    }
    
    const data = await response.json();
    return data.relatorios || [];
  } catch (error) {
    console.warn("Erro ao buscar relatórios:", error);
    return [];
  }
}

/**
 * Obtém relatórios mais usados via API
 */
export async function obterRelatoriosMaisUsados(limite: number = 5): Promise<RelatorioPredefinido[]> {
  try {
    const response = await fetch(`/api/relatorios?filtro=maisUsados&limite=${limite}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar relatórios mais usados');
    }
    
    const data = await response.json();
    return data.relatorios || [];
  } catch (error) {
    console.warn("Erro ao buscar relatórios mais usados:", error);
    return [];
  }
}

/**
 * Obtém relatórios recentes via API
 */
export async function obterRelatoriosRecentes(limite: number = 5): Promise<RelatorioPredefinido[]> {
  try {
    const response = await fetch(`/api/relatorios?filtro=recentes&limite=${limite}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar relatórios recentes');
    }
    
    const data = await response.json();
    return data.relatorios || [];
  } catch (error) {
    console.warn("Erro ao buscar relatórios recentes:", error);
    return [];
  }
}

/**
 * Inicializa dados padrão no banco
 */
export async function inicializarDadosPadrao(): Promise<void> {
  try {
    const response = await fetch('/api/relatorios/inicializar', {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Erro ao inicializar dados padrão');
    }
  } catch (error) {
    console.error('Erro ao inicializar dados padrão:', error);
    throw error;
  }
}
