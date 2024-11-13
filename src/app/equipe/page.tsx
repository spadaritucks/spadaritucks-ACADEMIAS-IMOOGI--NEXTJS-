'use client'
import { DadosFuncionario, getUsers, Usuario } from "@/api/UsuariosRequest";
import Image from "next/image";
import { useEffect, useState } from "react";
import '../../Assets/css/pages-styles/equipe.css'
import { Main } from "@/layouts/home/layout";

export default function equipe() {

    const [usuarioDados, setUsuarioDados] = useState<Usuario[]>([])
    const [userFuncionario, setUserFuncionario] = useState<Usuario[]>([])
    const [equipeDados, setEquipeDados] = useState<DadosFuncionario[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

  

    useEffect(() => {
        setIsLoading(true)
        try{
            const fetchEquipe = async () => {
                const response = await getUsers();
                setUsuarioDados(response.usuarios);
                const funcionarios = response.usuarios.filter((usuario: Usuario) => usuario.tipo_usuario === 'funcionario');
                setUserFuncionario(funcionarios);
                setEquipeDados(response.funcionarios);
            }
            fetchEquipe();
        }catch(error){
            console.log(error)
        }finally{
            setIsLoading(false)
        }
       
    }, []);

    if(isLoading){
        return(
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                <p className="ml-2">Carregando dados...</p>
            </div>
        )
    }

    return (
        <Main>
            <section className="home">
                <h1>Nossa Equipe</h1>
                <div className="equipe-container">
                    {userFuncionario.map(user => {
                        const equipe = equipeDados.find(equipe => equipe.usuario_id === user.id);
                        return equipe ? (
                            <div key={user.id} className="membro" defaultValue={user.id}>
                                <Image className="membro-image" src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${user.foto_usuario}`} width={300} height={300} alt="" />
                                <h2>{user.nome}</h2>
                                <p>{equipe.cargo}</p>
                                <p>{equipe.atividades}</p>
                            </div>
                        ) : null;
                    })}
                </div>
            </section>
        </Main>
    )
}