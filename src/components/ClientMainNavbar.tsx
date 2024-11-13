import Image from 'next/image'
import UserSession from '@/api/UserSession';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';
import '@/Assets/css/components-styles/AuthNav.css'
import { ReactNode, useEffect, useRef, useState } from 'react';
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
import { updatePassword, updateUserClient, Usuario } from '../api/UsuariosRequest';
import { useModal } from '@/components/errors/errorContext';
import { useUserEditModal } from './user-modals-edit/EditUserContext';
import "@/Assets/css/pages-styles/forms.css"
import { UserDadosForm } from '@/layouts/client/layout';
import { PasswordForm } from './MainAdmNavbar';

interface userForms {

    handleUpdateSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    handleUpdatePassword?: (e: React.FormEvent<HTMLFormElement>) => void;
    modalPassword?: () => void
    userModal?: () => void
    formref?: React.RefObject<HTMLFormElement>
    formRefPassword?: React.RefObject<HTMLFormElement>
    user?: Usuario
    formErrors?: { [key: string]: string[] }
}


export default function ClientMainNavbar() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const formRefPassword = useRef<HTMLFormElement>(null);
    const { modalServer } = useModal();
    const { showModal } = useUserEditModal();
    const [formErrors, setFormErros] = useState<{ [key: string]: string[] }>({})
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
        showModal('Configurações', <UserModa handleUpdatePassword={handleUpdatePassword} formref={formRef} modalPassword={modalPassword} userModal={userModal} />)
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






