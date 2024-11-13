import { Usuario } from "@/api/UsuariosRequest"
import Image from "next/image";

interface DadosPessoais {
    user?: Usuario;
}

export const DadosPessoais: React.FC<DadosPessoais> = ({ user }) => {

   

    if (user) {
        return (
            <div className='info-div'>
                <Image className="user-image-modal" width={300} height={300} src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${user.foto_usuario}`} alt=""></Image>
                <div className="container-info">
                    <p className='info'><span className='info-name'>Nome Completo : </span>{user.nome}</p>
                    <p className='info'><span className='info-name'>Data de Nascimento : </span>{user.data_nascimento}</p>
                    <p className='info'><span className='info-name'>Email : </span>{user.email}</p>
                    <p className='info'><span className='info-name'>CPF : </span>{user.cpf}</p>
                    <p className='info'><span className='info-name'>Telefone : </span>{user.telefone}</p>
                    <p className='info'><span className='info-name'>RG : </span>{user.rg}</p>
                    <p className='info'><span className='info-name'>Endereço : </span>{user.logradouro}</p>
                    <p className='info'><span className='info-name'>CEP : </span>{user.cep}</p>
                    <p className='info'><span className='info-name'>Numero : </span>{user.numero}</p>
                    <p className='info'><span className='info-name'>Complemento : </span>{user.complemento}</p>
                </div>
            </div>
        )
    } else {
        return (
            <p>Nenhuma Informação Encontrada</p>
        )
    }

}