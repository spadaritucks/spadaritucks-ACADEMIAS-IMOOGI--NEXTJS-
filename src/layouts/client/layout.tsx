import ClientMainNavbar from "@/components/ClientMainNavbar";
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { ModalEditUserProvider, useUserEditModal } from '@/components/user-modals-edit/EditUserContext';
import EditUserModal from '@/components/user-modals-edit/EditUserModal';
import Navbar from "@/components/navbar/component";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useModal } from "@/components/errors/errorContext";
import { updatePassword, updateUserClient, Usuario } from "@/api/UsuariosRequest";
import LogoutIcon from '@mui/icons-material/Logout';
import './layout.css'


export const ClientMain: FC<{ children: ReactNode }> = ({ children }) => {

    const [user, setUser] = useState<Usuario>()
    const { modalServer } = useModal();
    const { showModal } = useUserEditModal();
    const [formErrors, setFormErros] = useState<{ [key: string]: string[] }>({})
    const formRef = useRef<HTMLFormElement>(null);
    const formRefPassword = useRef<HTMLFormElement>(null);


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

    const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (formRef.current && user) {

            const formdata = new FormData(formRef.current)
            formdata.append('_method', 'PUT')


            const response = await updateUserClient(user.id, formdata)
            if (response) {
                if (response.status === 'false') {
                    if (typeof response.message === 'object') {

                        setFormErros(response.message)

                        modalServer("Erro", 'Preencha os campos necessarios!')

                    } else {
                        modalServer("Erro", response.message)
                    }
                } else {
                    modalServer("Erro", response.message)
                }
            }
            else {
                modalServer('Erro', 'Confirme corretamente a sua senha')
            }

        }
    }

    const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (formRefPassword.current && user) {
            const formdata = new FormData(formRefPassword.current)
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

    const userModal = () => {
        showModal('Editar Usuario', <UserDadosForm formErrors={formErrors} formref={formRef} handleUpdateSubmit={handleUpdateSubmit} user={user} />)
    }

    const modalPassword = () => {
        showModal('Alterar Senha', <PasswordForm handleUpdatePassword={handleUpdatePassword} formRefPassword={formRefPassword} />)
    }

    const handleUserArea = () => {
        showModal('Configurações', <UserModal handleUpdatePassword={handleUpdatePassword} formref={formRef} modalPassword={modalPassword} userModal={userModal} />)
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
                <a href='/area_aluno'><div className='side-link'><DashboardIcon />Menu</div></a>
                <a href='/carteira'><div className='side-link'><AccountBoxIcon />Carteira</div></a>
                <a href='/grade'><div className='side-link'><SportsMartialArtsIcon />Reservar Aula</div></a>
            </Navbar>
            {children}



        </>
    )
}

interface UserForms {

    handleUpdateSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    handleUpdatePassword?: (e: React.FormEvent<HTMLFormElement>) => void;
    modalPassword?: () => void
    userModal?: () => void
    formref?: React.RefObject<HTMLFormElement>
    formRefPassword?: React.RefObject<HTMLFormElement>
    user?: Usuario
    formErrors?: { [key: string]: string[] }
}

export const UserModal: React.FC<UserForms> = ({ handleUpdatePassword, handleUpdateSubmit, formref, modalPassword, userModal }) => {

    return (

        <div className='user-menu'>
            {userModal ? <button className='btn-userDados' onClick={() => userModal()}> Editar Dados Pessoais</button> : ""}
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

export const UserDadosForm: React.FC<UserForms> = ({ handleUpdateSubmit, formref, user, formErrors }) => {



    const handleInputClick = () => {
        if (user && formref?.current) {
            const form = formref.current;
            (form['nome'] as HTMLInputElement).value = user.nome.toString();
            (form['email'] as HTMLInputElement).value = user.email.toString();
            (form['data_nascimento'] as HTMLInputElement).value = user.data_nascimento.toString();
            (form['cpf'] as HTMLInputElement).value = user.cpf.toString();
            (form['rg'] as HTMLInputElement).value = user.rg.toString();
            (form['telefone'] as HTMLInputElement).value = user.telefone.toString();
            (form['cep'] as HTMLInputElement).value = user.cep.toString();
            (form['logradouro'] as HTMLInputElement).value = user.logradouro.toString();
            (form['numero'] as HTMLInputElement).value = user.numero.toString();
            user.complemento ? (form['complemento'] as HTMLInputElement).value = user.complemento.toString() : ''


        }
    }

    useEffect(() => {
        handleInputClick();
    }, [user])



    return (
        <form onSubmit={handleUpdateSubmit} ref={formref} className='crud-form' >
            <div className="form-name-input">
                <span>Insira sua Foto</span>
                <input type="file" name="foto_usuario" id='foto_usuario' />
            </div>
            <div className="form-name-input">
                <span>Nome Completo</span>
                <input type="text" name='nome' id="nome" placeholder="Nome Completo" />
                {formErrors && formErrors.nome ? <small className="error-message">{formErrors.nome[0]}</small> : ""}
            </div>
            <div className="form-name-input">
                <span>Email</span>
                <input type="text" name='email' id="email" placeholder="Email" />
                {formErrors && formErrors.email ? <small className="error-message">{formErrors.email[0]}</small> : ""}
            </div>
            <div className="form-name-input">
                <span>Data de Nascimento</span>
                <input type="date" name='data_nascimento' id="data_nascimento" />
                {formErrors && formErrors.data_nascimento ? <small className="error-message">{formErrors.data_nascimento[0]}</small> : ""}
            </div>
            <div className="form-name-input">
                <span>CPF</span>
                <input type="text" name='cpf' id="cpf" placeholder="CPF" />
                {formErrors && formErrors.cpf ? <small className="error-message">{formErrors.cpf[0]}</small> : ""}
            </div>
            <div className="form-name-input">
                <span>RG</span>
                <input type="text" name='rg' id="rg" placeholder="RG" />
                {formErrors && formErrors.rg ? <small className="error-message">{formErrors.rg[0]}</small> : ""}
            </div>
            <div className="form-name-input">
                <span>Telefone</span>
                <input type="text" name='telefone' id="telefone" placeholder="Telefone" />
                {formErrors && formErrors.telefone ? <small className="error-message">{formErrors.telefone[0]}</small> : ""}
            </div>
            <div className="form-name-input">
                <span>CEP</span>
                <input type="text" name='cep' id="cep" placeholder="CEP" />
                {formErrors && formErrors.cep ? <small className="error-message">{formErrors.cep[0]}</small> : ""}
            </div>
            <div className="form-name-input">
                <span>Logradouro</span>
                <input type="text" name='logradouro' id="logradouro" placeholder="Logradouro" />
                {formErrors && formErrors.logradouro ? <small className="error-message">{formErrors.logradouro[0]}</small> : ""}
            </div>
            <div className="form-name-input">
                <span>Numero da Residencia</span>
                <input type="text" name='numero' id="numero" placeholder="Numero da Residencia" />
                {formErrors && formErrors.numero ? <small className="error-message">{formErrors.numero[0]}</small> : ""}
            </div>
            <div className="form-name-input">
                <span>Complemento (Opcional)</span>
                <input type="text" name='complemento' id="complemento" placeholder="Complemento" />
                {formErrors && formErrors.complemento ? <small className="error-message">{formErrors.complemento[0]}</small> : ""}
            </div>

            <div className="form-name-input" style={{ gridColumn: '1 / -1' }}>
                <button type='submit' className='submit-button'>Enviar</button>
            </div>
        </form>
    )
}