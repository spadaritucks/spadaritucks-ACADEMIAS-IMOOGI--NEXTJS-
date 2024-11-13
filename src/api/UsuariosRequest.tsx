
import api from './api';


export interface Contrato {
  id: number;
  usuario_id: number;
  planos_id: number;
  packs_id: number;
  data_inicio: string;
  data_renovacao: string;
  data_vencimento: string;
  desconto: string;
  observacoes: string;
  parcelas: number;
  valor_plano: string;
  nome_plano: string
}

export interface UsuarioModalidade {
  id: number;
  usuario_id: number;
  modalidade_id: number;
  nome_modalidade: string;
}

export interface DadosFuncionario {
  id: number;
  usuario_id: number;
  tipo_funcionario: string;
  cargo: string;
  atividades: string
}

export interface Usuario {
  find(arg0: (user: any) => any): unknown;
  id: number;
  foto_usuario: string;
  tipo_usuario: string;
  nome: string;
  email: string;
  data_nascimento: string;
  cpf: string;
  rg: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: number;
  complemento: string;
}
// Função para buscar todos os usuários
export const getUsers = async () => {
  try {
    const response = await api.get('/api/usuarios');

    return response.data.userData // Verifique se a resposta está correta
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
};

// Função para buscar um usuário por ID
export const getUserById = async (id: number) => {
  try {
    const response = await api.get(`/api/usuarios/${id}`);
    return response.data.userData; // Verifique se a resposta está correta
  } catch (error) {
    console.error('Failed to fetch user by ID:', error);
    throw error; // Relança o erro para que o chamador possa lidar com ele
  }
};

// Função para criar um novo usuário
export const createUser = async (userData: FormData) => {
  try {
    const response = await api.post('/api/usuarios', userData);

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

// Função para atualizar um usuário existente
export const updateUser = async (id: number, userData: FormData) => {
  try {
    const response = await api.post(`/api/usuarios/${id}?_method=PUT`, userData);
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

export const updateUserModalidade = async (id: number, userData: FormData) => {
  try {
    const response = await api.post(`/api/user_modalidade/${id}?_method=PUT`, userData);
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


export const updateUserClient = async (id: number, userData: FormData) => {
  try {
    const response = await api.post(`/api/usuario_client/${id}?_method=PUT`, userData);

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


export const updatePassword = async (id: number, userData: FormData) => {
  try {

    const response = await api.post(`/api/user_password/${id}_method=PUT`, userData)
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

// Função para deletar um usuário
export const deleteUser = async (id: number) => {
  try {
    const response = await api.delete(`/api/usuarios/${id}`);
    return response.data.message;
  } catch (error) {
    console.error('Failed to delete user:', error);
    throw error; // Relança o erro para que o chamador possa lidar com ele
  }
};

export const loginUser = async (userData: FormData) => {
  try {
    const response = await api.post('/api/login', userData);

    return {
      status: 'true',
      message: response.data.message,
      token : response.data.token,
      user: response.data.user,
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


