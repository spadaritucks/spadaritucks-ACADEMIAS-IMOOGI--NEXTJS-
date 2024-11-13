'use client'
import { use, useEffect, useRef, useState } from 'react'
import '../../Assets/css/pages-styles/forms.css'
import { loginUser, Usuario } from '@/api/UsuariosRequest';
import { useModal } from '@/components/errors/errorContext';
import { redirect, usePathname, useRouter } from 'next/navigation';
import UserSession from '@/api/UserSession';
import { Main } from "@/layouts/home/layout";
import { Modal } from 'react-bootstrap';
import useCPFMask from '@/hooks/CpfFormat';
import { handleNumericInput } from '@/hooks/InputNumeric';





function login() {


    const formRef = useRef<HTMLFormElement>(null);
    const { modalServer } = useModal()
    const router = useRouter();
    const [user, setUser] = useState<Usuario>()
    const { cpf, handleChange, applyMaskToCPF } = useCPFMask();


    useEffect(() => {
        if (user) {
            user.tipo_usuario === 'aluno' ? router.push('/area_aluno') : router.push('/dashboard');
        }
    }, [user, router]);



    const handleSubmit = (e: React.FormEvent) => {

        e.preventDefault()


        if (formRef.current) {
            const formdata = new FormData(formRef.current)
            const doingLogin = async () => {

                const response = await loginUser(formdata)
                

                if (response) {
                    if (response.status === 'false') {
                        modalServer('Erro', response.message)
                    } else {
                        sessionStorage.setItem('user', JSON.stringify(response.user));
                        sessionStorage.setItem('token', response.token)
                        modalServer('Sucesso', response.message || 'Usuario Logado com Sucesso')
                        setUser(response.user)
                        response.user.tipo_usuario === 'aluno' ? router.push('/area_aluno') : router.push('/dashboard');
                    }
                }


            }

            doingLogin();
        }
    }

    return (
        <Main>
            <section className="menu-login">
                <div className="area-form">
                    <h2>Login do Usuario</h2>
                    <form action="" onSubmit={handleSubmit} ref={formRef}>
                        <div className="form-component-login">
                            <div className="form-name-input">
                                <span>Insira o seu CPF</span>
                                <input type="text" name='cpf' id="cpf" placeholder="000.000.000-00" maxLength={14} onChange={handleChange} value = {cpf} onInput={handleNumericInput} />
                            </div>
                            <div className="form-name-input">
                                <span>Insira sua Senha</span>
                                <input type="password" name="password" id='password' placeholder='Senha' />
                            </div>
                            <button type='submit' className='submit-button'>Enviar</button>
                        </div>
                    </form>

                </div>
            </section>

        </Main>
    )
}

export default login