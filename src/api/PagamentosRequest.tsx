import api from "./api";

export interface PagamentoMensal {
    id: number;
    usuario_id: number;
    comprovante: string;
    valor_pago: number;
    data_pagamento: string;
    comentario: string;
    comentario_adm: string;
}

export const getPagamentosMensais = async () => {
    try {
        const response = await api.get('/api/pagamentos_mensais');
        return response.data.pagamentos
    } catch (error) {
        console.error('Failed to fetch pagamentos mensais:', error);
        throw error;
    }
};

export const postPagamentosMensais = async (pagamento: FormData) => {
    try {
        const response = await api.post('/api/pagamentos_mensais', pagamento);
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
}


export const putPagamentosMensais = async (id: number, pagamento: FormData) => {
    try {
        const response = await api.post(`/api/pagamentos_mensais/${id}?_method=PUT`, pagamento);
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
}       
