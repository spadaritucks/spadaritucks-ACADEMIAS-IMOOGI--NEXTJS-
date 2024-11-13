import Image from "next/image";
import Carrosel from "../components/Carrossel";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Assets/css/pages-styles/home.css'
import aula from '../../public/mestre_aula.jpeg'
import { Main } from "@/layouts/home/layout";


export default function Home() {



  return (
    <Main>
      <>
        <section className="menu">
          <div className="carrosel-area">
            <Carrosel />
          </div>
          <div className="sobre">
            <div className="conteudo">
              <h1>SOBRE AS ACADEMIAS IMOOGI</h1>
              <p>Inaugurada em Novembro de 2012, pelo Grão Mestre Jeferson da Silva, foi criada com o intuito
                de tornar-se o maior modelo de franquia desse segmento, abrangendo em um único espaço todas as
                modalidades conhecidas e praticadas pelo mundo das lutas, esportes de combate,
                defesa pessoal e artes marciais.

                Trabalhamos na melhoria continua da sáude fisica, sistema imunológico e ajudando familias brasileiras
                no combate á obesidade, sedentarismo, Stress, Esquizofrenia, doenças cardiovasculares, alzheimer,
                borderline, ansiedade e a maior doença do século<span className="doenca-seculo"> A DEPRESSÃO.</span>
              </p>
            </div>
            <div className="conteudo">
              <Image className="home-image" src={aula} alt=""></Image>
              <h2>AULA DE BOXE - IMOOGI UNIDADE MARECHAL</h2>
              <p>Ministrada por Grão Mestre Jeferson da Silva</p>
            </div>

          </div>
        </section>


      </>
    </Main>
  );

}
