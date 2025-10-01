/**
 * Serviço de API para modelos de contratos (substitui localStorage)
 */

export interface ItemTecnicoPredefinido {
  id: string;
  descricao: string;
  ordem?: number;
}

export interface ContratoPredefinido {
  id: string;
  nome: string;
  contrato: string;
  valorInicial: string;
  rq: string;
  os: string;
  pedido: string;
  descricaoEscopo: string;
  itensTecnicos: ItemTecnicoPredefinido[];
  imagemFundoUrl?: string;
  dataCriacao: string;
  dataUltimaUso: string;
  usoCount: number;
}

/**
 * Carrega contratos salvos da API
 */
export async function carregarContratosSalvos(): Promise<ContratoPredefinido[]> {
  try {
    const response = await fetch('/api/contratos');
    if (!response.ok) {
      throw new Error('Erro ao carregar contratos');
    }
    
    const data = await response.json();
    return data.contratos || [];
  } catch (error) {
    console.warn("Erro ao carregar contratos salvos:", error);
    return [];
  }
}

/**
 * Adiciona um novo contrato via API
 */
export async function adicionarContrato(
  novoContrato: Omit<ContratoPredefinido, "id" | "dataCriacao" | "dataUltimaUso" | "usoCount">
): Promise<ContratoPredefinido> {
  try {
    const response = await fetch('/api/contratos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novoContrato),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao criar contrato');
    }

    const data = await response.json();
    return data.contrato;
  } catch (error) {
    console.error('Erro ao adicionar contrato:', error);
    throw error;
  }
}

/**
 * Atualiza um contrato existente via API
 */
export async function atualizarContrato(
  id: string, 
  dadosAtualizados: Partial<ContratoPredefinido>
): Promise<ContratoPredefinido | null> {
  try {
    const response = await fetch(`/api/contratos/${id}`, {
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
      throw new Error(errorData.error || 'Erro ao atualizar contrato');
    }

    const data = await response.json();
    return data.contrato;
  } catch (error) {
    console.error('Erro ao atualizar contrato:', error);
    throw error;
  }
}

/**
 * Remove um contrato via API
 */
export async function removerContrato(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/contratos/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return false;
      }
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao remover contrato');
    }

    return true;
  } catch (error) {
    console.error('Erro ao remover contrato:', error);
    return false;
  }
}

/**
 * Registra o uso de um contrato via API
 */
export async function registrarUsoContrato(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/contratos/${id}/uso`, {
      method: 'POST',
    });

    if (!response.ok) {
      console.warn('Erro ao registrar uso do contrato');
    }
  } catch (error) {
    console.warn('Erro ao registrar uso do contrato:', error);
  }
}

/**
 * Busca contratos por termo via API
 */
export async function buscarContratos(termo: string): Promise<ContratoPredefinido[]> {
  try {
    const response = await fetch(`/api/contratos?termo=${encodeURIComponent(termo)}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar contratos');
    }
    
    const data = await response.json();
    return data.contratos || [];
  } catch (error) {
    console.warn("Erro ao buscar contratos:", error);
    return [];
  }
}

/**
 * Obtém contratos mais usados via API
 */
export async function obterContratosMaisUsados(limite: number = 5): Promise<ContratoPredefinido[]> {
  try {
    const response = await fetch(`/api/contratos?filtro=maisUsados&limite=${limite}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar contratos mais usados');
    }
    
    const data = await response.json();
    return data.contratos || [];
  } catch (error) {
    console.warn("Erro ao buscar contratos mais usados:", error);
    return [];
  }
}

/**
 * Obtém contratos recentes via API
 */
export async function obterContratosRecentes(limite: number = 5): Promise<ContratoPredefinido[]> {
  try {
    const response = await fetch(`/api/contratos?filtro=recentes&limite=${limite}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar contratos recentes');
    }
    
    const data = await response.json();
    return data.contratos || [];
  } catch (error) {
    console.warn("Erro ao buscar contratos recentes:", error);
    return [];
  }
}

/**
 * Inicializa dados padrão no banco
 */
export async function inicializarDadosPadrao(): Promise<void> {
  try {
    const response = await fetch('/api/contratos/inicializar', {
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
