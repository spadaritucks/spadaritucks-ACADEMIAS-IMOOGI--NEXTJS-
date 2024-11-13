'use client'
import { getModalidade, Modalidade } from "@/api/ModalidadesRequest"
import Image from "next/image"
import { useEffect, useState } from "react"
import '../../Assets/css/pages-styles/unidades_modalidades.css'
import { Main } from "@/layouts/home/layout";

export default function modalidade() {

    const [modalidades, setModalidades] = useState<Modalidade[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)



    useEffect(() => {
        setIsLoading(true)
      try{
          const fetchModalidades = async () => {
            const response = await getModalidade();
            setModalidades(response);

        }
        fetchModalidades()
      }catch(error){
        console.log(error)
      }finally{
        setIsLoading(false)
      }
    })

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
            <section className="area-modalidades">
                <h2>Modalidades Academias IMOOGI</h2>
                <div className="modalidades-container">
                    {modalidades.map(modalidade => (
                        <div className="modalidade">
                            <Image className="modalidade-imagem" width={400} height={400} alt="" src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${modalidade.foto_modalidade}`}></Image>
                            <h2 className="modalidade-title">{modalidade.nome_modalidade}</h2>
                            <p className="modalidade-endereco">{modalidade.descricao_modalidade}</p>
                        </div>
                    ))}

                </div>
            </section>
        </Main>

    )
}