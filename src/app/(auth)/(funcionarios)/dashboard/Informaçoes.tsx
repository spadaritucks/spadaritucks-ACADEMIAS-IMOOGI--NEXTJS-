import { Packs } from "@/api/PlanosRequest";
import { Contrato, DadosFuncionario, Usuario, UsuarioModalidade } from "@/api/UsuariosRequest"
import Image from "next/image";

interface Informacoes {
    contrato?: Contrato;
    modalidade?: UsuarioModalidade[]
    funcionario?: DadosFuncionario
    pack?: Packs
}

export const Informacoes: React.FC<Informacoes> = ({ contrato, modalidade, funcionario, pack }) => {

    if (contrato && modalidade) {
        return (
            <div className='info-div'>
                <div className="container-info">
                    <p className='info'><span className='info-name'>Plano :  </span>{contrato.nome_plano}</p>
                    {pack ? <p className='info'><span className='info-name'>Pack Extra :  </span>{pack.nome_plano}</p> : null}

                    {modalidade.map((modalidade, index) => (
                        <p key={index} className='info'><span className='info-name'>Modalidade {index + 1} :  </span>{modalidade.nome_modalidade}</p>
                    ))}
                    {contrato.data_inicio ? <p className='info'><span className='info-name'>Data de Inicio:  </span>{contrato.data_inicio}</p> : ''}
                    {contrato.data_renovacao ? <p className='info'><span className='info-name'>Data de Renovação :  </span>{contrato.data_renovacao}</p>: ''}
                    {contrato.data_vencimento ? <p className='info'><span className='info-name'>Data de Vencimento :  </span>{contrato.data_vencimento}</p>: ''}
                    {contrato.valor_plano ? <p className='info'><span className='info-name'>Valor do Plano :  </span>{contrato.valor_plano.replace('.', ',')}</p> : ''}
                    {contrato.desconto ? <p className='info'><span className='info-name'>Desconto :  </span>{contrato.desconto.replace('.', ',')}</p> : ''}
                    {contrato.parcelas ? <p className='info'><span className='info-name'>Parcelas :  </span>{contrato.parcelas}</p> : ''}
                    <p className='info'><span className='info-name'>Observações :  </span>{contrato.observacoes}</p>
                </div>
            </div>
        )

    } else if (funcionario) {
        return (
            <div className='info-div'>
                <p className='info'><span className='info-name'>Tipo do Funcionario :  </span>{funcionario.tipo_funcionario}</p>
                <p className='info'><span className='info-name'>Cargo:  </span>{funcionario.cargo}</p>
                <p className='info'><span className='info-name'>Atividades :  </span>{funcionario.atividades}</p>
            </div>)
    } else {
        return (
            <p>Nenhuma Informação Encontrada</p>
        )
    }

}