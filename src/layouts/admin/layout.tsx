'use client'
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import Navbar from "@/components/navbar/component";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import UserSession from "@/api/UserSession";
import { updatePassword, Usuario } from "@/api/UsuariosRequest";
import { useModal } from "@/components/errors/errorContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import './layout.css'
import router, { useRouter } from "next/router";
import LogoutIcon from '@mui/icons-material/Logout';
import { useUserEditModal } from "@/components/user-modals-edit/EditUserContext";



export const AdmMain: FC<{ children: ReactNode }> = ({ children }) => {

    const [user, setUser] = useState<Usuario>()
    const { modalServer } = useModal();
    const formRef = useRef<HTMLFormElement>(null);
    const { showModal } = useUserEditModal();
    const [formErrors, setFormErros] = useState<{ [key: string]: string[] }>({})
    

    //Função para efetuar o logout
    const handleLogout = () => {
        const token = sessionStorage.getItem('token');
        if (token) {
            const destroy = async () => {
                
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user')
                sessionStorage.clear();
               
            }

            destroy()
            window.location.href = '/login' 
        }
    };


    useEffect(() => {
        //Coletando os dados do usuario logado
        const userJson = sessionStorage.getItem('user')
        if (userJson) {
            setUser(JSON.parse(userJson));
        } else {
            modalServer('Erro Inesperado', 'Não foi possível carregar os dados do usuário')
        }




    }, [])

    const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (formRef.current && user) {
            const formdata = new FormData(formRef.current)
            formdata.append('_method', 'PUT')

            if (formdata.get('password') === formdata.get('password_confirmation')) {
                formdata.delete('password_confirmation');
                const responsePassword = await updatePassword(user.id, formdata)
                console.log(formdata)
                if (responsePassword) {
                    if (responsePassword.status === 'false') {
                        modalServer('Mensagem', responsePassword.message); // Aqui você acessa apenas a mensagem

                    } else {
                        modalServer('Mensagem', responsePassword.message); // Aqui também


                    }
                }
            }

        }
    }

    const modalPassword = () => {
        showModal('Alterar Senha', <PasswordForm handleUpdatePassword={handleUpdatePassword} formRefPassword={formRef} />)
    }

    const handleUserArea = () => {
        showModal('Configurações', <UserModal handleUpdatePassword={handleUpdatePassword} formref={formRef} modalPassword={modalPassword} />)
    }


    //Manipulando dados do Usuario Logado
    const dadosUsuario = () => {
        let fotoUsuario = user?.foto_usuario;
        let nomeCompleto = user?.nome;
        let partesNome = nomeCompleto?.split(' ')
        let nome = partesNome?.slice(0, 2).join(' ')

        const url = `${process.env.NEXT_PUBLIC_API_URL}/storage/${fotoUsuario}`;

        return {
            nome,
            url
        }
    }

    const dados = dadosUsuario();
    const { url, nome } = dados || { url: '', nome: '' };


    
    return (
        <>


            <Navbar>
                <div className="user-area" onClick={handleUserArea}>
                    <Avatar>
                        <AvatarImage src={url} width={200} />
                    </Avatar>
                    <p className="user-name">{nome}</p>
                </div>
                <p className='logout' onClick={handleLogout}><LogoutIcon sx={{ margin: 0.5, fontSize: 30, cursor: 'pointer' }}></LogoutIcon>Logout</p>
                <a href='/dashboard'><DashboardIcon />Dashboard</a>
                <a href='/planos'><AccountBoxIcon />Planos e Contratos</a>
                <a href='/packs'><AccountBoxIcon />Packs</a>
                <a href='/modalidades'><SportsMartialArtsIcon />Modalidades</a>
                <a href='/unidade'><LocationOnIcon />Unidades</a>
                <a href='/usuarios'><NoteAltIcon />Cadastro de Usuarios</a>
                <a href='/aulas'><NoteAltIcon />Aulas</a>
            </Navbar>
            {children}


        </>
    )



}

interface UserForms {

    handleUpdatePassword?: (e: React.FormEvent<HTMLFormElement>) => void;
    modalPassword?: () => void
    formref?: React.RefObject<HTMLFormElement>
    formRefPassword?: React.RefObject<HTMLFormElement>

}

export const UserModal: React.FC<UserForms> = ({ handleUpdatePassword, formref, modalPassword }) => {

    return (

        <div className='user-menu'>
            {modalPassword ? <button className='btn-password' onClick={() => modalPassword()} >Alterar senha</button> : ""}
        </div>
    )
}

export const PasswordForm: React.FC<UserForms> = ({ handleUpdatePassword, formRefPassword }) => {

    return (
        <form onSubmit={handleUpdatePassword} ref={formRefPassword} className='crud-form' >
            <div className="form-name-input">
                <span>Nova Senha</span>
                <input type="password" name="password" id='password' placeholder='Nova Senha' />
            </div>
            <div className="form-name-input">
                <span>Confirme sua Senha</span>
                <input type="password" name="password_confirmation" id='password_confirmation' placeholder='Confirme a Senha' />
            </div>

            <div className="form-name-input" style={{ gridColumn: '1 / -1' }}>
                <button type='submit' className='submit-button'>Enviar</button>
            </div>
        </form>
    )
}