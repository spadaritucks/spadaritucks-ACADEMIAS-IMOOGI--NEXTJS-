import api from './api'

export interface Aula {

    id: number;
    modalidade_id: number,
    nome_modalidade: string;
    data_inicio: string; // Data de início como string
    data_fim: string;
    horario: string;
    dia_semana: string;
    limite_alunos: number;
}

export const getAulas = async (dataInicio: string, dataFim: string) => {
    try {
        const response = await api.get('/api/aulas', {
            params: { data_inicio: dataInicio, data_fim: dataFim }
        });
        return response.data.aulas;
    } catch (error) {
        console.error('Erro ao consultar as aulas:', error);
        throw error;
    }
}

export const createAula = async (userData: FormData) => {
    try {
        const response = await api.post('/api/aulas', userData);

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

export const updateAula = async (id: number, userData: FormData) => {
    try {
        const response = await api.post(`/api/aulas/${id}?_method=PUT`, userData);

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

export const deleteAula = async (id: number) => {
    try {
        const response = await api.delete(`/api/aulas/${id}`);

        return response.data.message

    } catch (error) {
        console.error("Erro ao criar a aula" + error)
        throw error
    }
}