import api from './api';


export interface Plano {
  id: number;
  nome_plano: string;
  duracao: number;
  valor_matricula: number;
  valor_mensal: number;
  valor_total: number;
  num_modalidades: number;
  status: string;
  number_checkins: number
}

export interface Packs {
  id: number;
  nome_plano: string;
  duracao: number;
  valor_matricula: number;
  valor_mensal: number;
  valor_total: number;
  num_modalidades: number;
  status: string;
  number_checkins_especial: number;
}




// Função para buscar todos os planos
export const getPlanos = async (): Promise<Plano[]> => {
  try {
    const response = await api.get('/api/planos');

    return response.data.planos

  } catch (error) {
    console.error('Failed to fetch planos:', error);
    return [];
  }
};

// Função para buscar um plano por ID
export const getPlanoById = async (id: number): Promise<Plano> => {
  try {
    const response = await api.get(`/api/planos/${id}`);
    return response.data.plano // Verifique se a resposta está correta
  } catch (error) {
    console.error('Failed to fetch plano by ID:', error);
    throw error; // Relança o erro para que o chamador possa lidar com ele
  }
};

// Função para criar um novo plano
export const createPlano = async (planoData: FormData) => {
  try {
    const response = await api.post('/api/planos', planoData);

    return {
      status: 'true',
      message: response.data.message
    };

  } catch (error: any) {

    if (error.response && error.response.data && error.response.data.message) {
      return {
        status: 'false',
        message: error.response.data.message
      };
    }
  }
};

// Função para atualizar um plano existente
export const updatePlano = async (id: FormDataEntryValue, planoData: FormData) => {
  try {
    const response = await api.post(`/api/planos/${id}?_method=PUT`, planoData, {
      method: 'PUT',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      status: 'true',
      message: response.data.message
    };
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      return {
        status: 'false',
        message: error.response.data.message
      };
    }
  }
};

// Função para deletar um plano
export const deletePlano = async (id: FormDataEntryValue): Promise<number> => {
  try {
    const response = await api.delete(`/api/planos/${id}`);
    return response.data.message;

  } catch (error) {
    console.error('Failed to delete plano:', error);
    throw error; // Relança o erro para que o chamador possa lidar com ele
  }
};

export const getPacks = async (): Promise<Packs[]> => {
  try {
    const response = await api.get('/api/packs');
    return response.data.packs
  } catch (error) {
    console.error('Failed to fetch packs:', error);
    return [];
  }
};

export const createPack = async (packData: FormData) => {
  try {
    const response = await api.post('/api/packs', packData);
    return {
      status: 'true',
      message: response.data.message
    };
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      return {
        status: 'false',
        message: error.response.data.message
      };
    }
  }
};

export const updatePack = async (id: FormDataEntryValue, packData: FormData) => {
  try {
    const response = await api.post(`/api/packs/${id}?_method=PUT`, packData, {
      method: 'PUT',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return {
      status: 'true',
      message: response.data.message
    };
  } catch (error:any) {
    if (error.response && error.response.data && error.response.data.message) {
      return {
        status: 'false',
        message: error.response.data.message
      };
    }
  }
};

export const deletePack = async (id: FormDataEntryValue): Promise<number> => {
  try {
    const response = await api.delete(`/api/packs/${id}`);
    return response.data.message;
  } catch (error) {
    console.error('Failed to delete pack:', error);
    throw error; // Relança o erro para que o chamador possa lidar com ele
  }
};



