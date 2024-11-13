import Image from "next/image";
import '../../Assets/css/pages-styles/parceiros.css'
import Gympass from '../../../public/gympass-logo.png'
import { Main } from "@/layouts/home/layout";

export default function gympass() {

    return (
        <Main>
            <section className="menu">
                <Image src={Gympass} alt="" width={400}></Image>
                <div className="descricaoEmpresa">
                    <h2>Como Funciona?</h2>
                    <p>O Gympass é um beneficio voltado para empresas no qual
                        os seus colaboradores e empresas parceiras tem acesso a
                        inumeras academias atraves de uma assinatura
                    </p>
                    <h2>Como acessar as aulas?</h2>
                    <p>O Cliente Gympass deve possuir o <strong> Plano Silver</strong> adiante e
                        adquirir os equipamentos necessarios em nossa Loja no São Bernardo Plaza Shopping.
                        Para realiar o check-in, basta comunicar os nossos atendentes ou professores para
                        que o check-in seja validado
                    </p>

                    <button className="atendimento-gympass"><a href="https://api.whatsapp.com/send/?phone=5511988537726&text&type=phone_number&app_absent=0">Atendimento IMOOGI - Whatsapp</a></button>
                </div>
            </section>
        </Main>
    )
}