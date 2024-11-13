"use client"

import { getPlanos, Plano } from "@/api/PlanosRequest"
import { Main } from "@/layouts/home/layout";
import { useEffect, useState } from "react"
import '@/Assets/css/pages-styles/catalogo.css'
import Link from "next/link"
import { Checkin, getCheckins } from "@/api/ReservasRequest"



export default function Catalogo() {

    const [planos, setPlanos] = useState<Plano[]>([])
    const [checkins, setCheckins] = useState<Checkin[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)


    useEffect(() => {
        setIsLoading(true)
        try {
            const fetchPlanos = async () => {
                const listaPlanos = await getPlanos();
                const plano = listaPlanos.filter(listaPlanos => listaPlanos.status == "Ativo")
                setPlanos(plano)
            }
            fetchPlanos()


        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }

    }, [])



    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                <p className="ml-2">Carregando dados...</p>
            </div>
        )
    }

    return (
        <Main>
            <section className="catalogo-menu">
                <h1>Catalogo de Planos</h1>
                <div className="container-catalogo">
                    {planos.map(plano => (
                        <div className="plano">
                            <h2 className="plano-title">{plano.nome_plano}</h2>
                            <p className="number-modalidades" >({plano.num_modalidades == 1 ? plano.num_modalidades + " Modalidade" : plano.num_modalidades + " Modalidades"} com {plano.number_checkins} checkins semanais)</p>
                            <p className="month-value"><span style={{ fontSize: 22 }}>{plano.valor_matricula > 0 ? " R$ " + plano.valor_matricula + " (Ativação) " : "Ativação Isenta"}<br /> <span style={{ fontSize: 24, fontWeight: 'bold' }}>R$ {plano.valor_mensal} mensais <br /> (no cartão de credito)</span></span> </p>
                            <p className="total-value"> Total do Plano : R$ {plano.valor_total}</p>

                            <Link href='https://api.whatsapp.com/send/?phone=11977010020&text&type=phone_number&app_absent=0' className="purchase-btn">Matricule-se</Link>
                        </div>

                    ))}

                    <div className="plano">
                        <h2 className="plano-title">Outras Opções <br />(Clique Abaixo)</h2>
                        

                        <Link href='https://api.whatsapp.com/send/?phone=11977010020&text&type=phone_number&app_absent=0' className="purchase-btn">Whatsapp</Link>
                    </div>
                </div>
            </section>
        </Main>
    )

}