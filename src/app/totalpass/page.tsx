import Image from "next/image";
import '../../Assets/css/pages-styles/parceiros.css'
import Totalpass from '../../../public/totalpass.png'
import { Main } from "@/layouts/home/layout";

export default function totalpass() {
    return (
        <Main>
            <section className="menu">
                <Image src={Totalpass} alt="" width={400}></Image>
                <div className="descricaoEmpresa">
                    <h2>Como Funciona?</h2>
                    <p>O Totalpass é um beneficio voltado para empresas no qual
                        os seus colaboradores e empresas parceiras tem acesso a
                        inumeras academias atraves de uma assinatura
                    </p>
                    <h2>Como acessar as aulas?</h2>
                    <p>O Cliente Totalpass deve possuir o <strong>Plano TP3</strong> adiante e
                        adquirir os equipamentos necessarios em nossa Loja no São Bernardo Plaza Shopping.
                        Para realizar o check-in, basta enviar o codigo token para nossos atendentes validarem
                        no sistema do Totalpass
                    </p>

                    <button className="atendimento-totalpass"><a href="https://api.whatsapp.com/send/?phone=5511988537726&text&type=phone_number&app_absent=0">Atendimento IMOOGI - Whatsapp</a></button>
                </div>
            </section>
        </Main>
    )
}