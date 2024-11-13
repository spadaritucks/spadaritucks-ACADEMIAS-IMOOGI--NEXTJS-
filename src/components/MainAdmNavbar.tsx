import Image from 'next/image'
import UserSession from '@/api/UserSession';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';
import '@/Assets/css/components-styles/AuthNav.css'
import { useEffect, useRef, useState } from 'react';
import Logo from '../../public/logo.jpg'
import Link from 'next/link';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Avatar } from '@chakra-ui/react'
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { useModal } from './errors/errorContext';
import { useUserEditModal } from './user-modals-edit/EditUserContext';
import {updatePassword, Usuario } from '../api/UsuariosRequest';

interface userForms {

    handleUpdatePassword?: (e: React.FormEvent<HTMLFormElement>) => void;
    modalPassword?: () => void
    formref?: React.RefObject<HTMLFormElement>
    formRefPassword?: React.RefObject<HTMLFormElement>

}


export default function MainAdmNavbar() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const formRefPassword = useRef<HTMLFormElement>(null);
    const { modalServer } = useModal();
    const { showModal } = useUserEditModal();
    const [user, setUser] = useState<Usuario>()


    useEffect(() => {
        const userResponse = sessionStorage.getItem('user');
        if (userResponse) {
            setUser(JSON.parse(userResponse));
        }
    }, [])


    const toggleMenu = () => {
        setOpen(!open);
    }


    const handleLogout = () => {
        const token = sessionStorage.getItem('token');
        if (token) {
            const destroy = async () => {
                
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user')
                sessionStorage.clear();
               
            }

            destroy()
            router.push('/login');
        }
    };

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



    const modalPassword = () => {
        showModal('Alterar Senha', <PasswordForm handleUpdatePassword={handleUpdatePassword} formRefPassword={formRefPassword} />)
    }

    const handleUserArea = () => {
        showModal('Configurações', <UserModal handleUpdatePassword={handleUpdatePassword} formref={formRef} modalPassword={modalPassword} />)
    }


    if (user) {
        let fotoUsuario = user.foto_usuario;
        let nomeCompleto = user.nome;
        let partesNome = nomeCompleto.split(' ')
        let nome = partesNome.slice(0, 2).join(' ')
        const url = `${process.env.NEXT_PUBLIC_API_URL}/storage/${fotoUsuario}`;



        return (
            <>

                <div className="auth-bar">
                    <Image width={162} height={33} className="nav-bar-logo" src={Logo} alt="Imoogi" />
                    <div className={`authbar-style ${open ? 'open' : ''}`}>
                        <div className='side-link-routes'>
                            <Link href='/dashboard'><div className='side-link'><DashboardIcon />Dashboard</div></Link>
                            <Link href='/planos'><div className='side-link'><AccountBoxIcon />Planos e Contratos</div></Link>
                            <Link href='/packs'><div className='side-link'><AccountBoxIcon />Packs</div></Link>
                            <Link href='/modalidades'><div className='side-link'><SportsMartialArtsIcon />Modalidades</div></Link>
                            <Link href='/unidade'> <div className='side-link'><LocationOnIcon />Unidades</div></Link>
                            <Link href='/usuarios'> <div className='side-link'><NoteAltIcon />Cadastro de Usuarios</div></Link>
                            <Link href='/aulas'> <div className='side-link'><NoteAltIcon />Aulas</div></Link>


                        </div>

                        <div className='users-info' >
                            <p className='session-name' onClick={() => handleUserArea()}><Avatar src={`${url}`} sx={{ margin: 2 }} />{nome}</p>
                            <p className='logout' onClick={handleLogout}><LogoutIcon sx={{ margin: 0.5, fontSize: 30, cursor: 'pointer' }}></LogoutIcon>Logout</p>
                        </div>
                    </div>



                    <div className="btn-hamburguer" onClick={toggleMenu}>
                        {!open ? <MenuIcon sx={{ fontSize: 45 }} /> : <CloseSharpIcon sx={{ fontSize: 45 }} />}
                    </div>
                </div>




            </>
        )
    }
}


export const UserModal: React.FC<userForms> = ({ handleUpdatePassword, formref, modalPassword }) => {

    return (

        <div className='user-menu'>
            {modalPassword ? <button className='btn-password' onClick={() => modalPassword()} >Alterar senha</button> : ""}
        </div>
    )
}

export const PasswordForm: React.FC<userForms> = ({ handleUpdatePassword, formRefPassword }) => {

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
