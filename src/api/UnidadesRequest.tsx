import api from './api';

export interface Unidade {
    id: number
    imagem_unidade: string | null,
    nome_unidade: string,
    endereco: string,
    grade: string | null,
    descricao: string

};

export const getUnidades = async (): Promise<Unidade[]> => {
    try {
        const response = await api.get('api/unidades');

        return response.data.unidades

    } catch (error) {
        console.error('Failed to fetch unit:', error);
        return [];
    }
}

export const getUnidadeById = async (id: number): Promise<Unidade[]> => {
    try {
        const response = await api.get(`api/unidades/${id}`);

        return response.data.unidade

    } catch (error) {
        console.error('Failed to fetch unit:', error);
        throw error;
    }
}

export const createUnidade = async (unidadeData: FormData) => {
    try {
        const response = await api.post(`api/unidades`, unidadeData);

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
}


export const updateUnidade = async (id: FormDataEntryValue, unidadeData: FormData) => {
    try {
        const response = await api.post(`api/unidades/${id}?_method=PUT`, unidadeData,{
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
}

export const deleteUnidade = async (id: FormDataEntryValue): Promise<number> => {
    try {
        const response = await api.delete(`api/unidades/${id}`);

        return response.data.message

    } catch (error) {
        console.error('Failed to delete unit:', error);
        throw error;
    }
}
