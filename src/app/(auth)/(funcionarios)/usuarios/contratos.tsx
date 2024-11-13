'use client';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { getPacks, getPlanos, Packs, Plano } from '@/api/PlanosRequest';
import { getModalidade, Modalidade } from '@/api/ModalidadesRequest';
import '../../../../Assets/css/pages-styles/forms.css'
import { Contrato, createUser, UsuarioModalidade } from '@/api/UsuariosRequest';
import { useModal } from '@/components/errors/errorContext';
import { Usuario } from '@/api/UsuariosRequest';

interface UsuariosProps {
    user?: Usuario //---> Verificação se o formulario é de edição
    modalidade?: UsuarioModalidade[];
    contrato?: Contrato;
    handleInputClick?: () => void
    toogleInputModalidade?: () => void
    toogleSecondInputModalidade?: () => void
    setInputModalidadeState?: Dispatch<SetStateAction<boolean>>
    inputModalidadeState?: boolean;
    secondInputModalidadeState?: boolean;
    setSecondInputModalidadeState?: Dispatch<SetStateAction<boolean>>
  
    
    formErrors?: { [key: string]: string[] }
}



export const Contratos: React.FC<UsuariosProps> = ({ toogleSecondInputModalidade, secondInputModalidadeState, setSecondInputModalidadeState, formErrors, user, contrato, modalidade, inputModalidadeState, setInputModalidadeState, toogleInputModalidade }) => {
    const [planos, setPlanos] = useState<Plano[]>([]);
    const [modalidades, setModalidades] = useState<Modalidade[]>([]);
    const [inputVisibility, setInputVisibility] = useState<boolean>(false)
    const [packs, setPacks] = useState<Packs[]>([]);
    const [packVisibility, setPackVisibility] = useState<boolean>(false);

    const [contratosInputVisibility, setContratosInputVisibility] = useState<boolean>(false)

    



    const dataInputState = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.options[e.target.selectedIndex];
        const selectedPlano = value.innerHTML

        if(selectedPlano === "Gympass" || selectedPlano === "Totalpass"){
            setContratosInputVisibility(true)
        }else{
            setContratosInputVisibility(false)
        }

        
}

    const inputModalidadeVisibility = () => {
        setInputVisibility(!inputVisibility) //Visibilidade do Input das Modalidaddes
    }

    const tooglePackVisibility = () => {
        setPackVisibility(!packVisibility)

    }

    const handleNumericInput = (e: React.FormEvent<HTMLInputElement>) => {
        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.,]/g, ''); // Permite apenas números e vírgula/ponto
    };


    useEffect(() => {
        if (user) {
            inputModalidadeVisibility()
        }
    }, [user, contrato, modalidade])

    useEffect(() => {
        const fetchPlanos = async () => {
            try {
                const planos = await getPlanos();
                setPlanos(planos);
            } catch (error) {
                console.error('Failed to fetch planos:', error);
            }
        };

        const fetchModalidades = async () => {
            try {
                const modalidades = await getModalidade();
                setModalidades(modalidades);
            } catch (error) {
                console.error('Failed to fetch modalidades:', error);
            }
        };

        const fetchPacks = async () => {
            try {
                const packs = await getPacks();
                setPacks(packs);
            } catch (error) {
                console.error('Failed to fetch packs:', error);
            }

        };
        fetchPacks()
        fetchPlanos();
        fetchModalidades();
    }, []);

    return (


        <>
            <div className="form-name-input">
                <span>Plano</span>
                <select name="planos_id" id="planos_id" onChange={dataInputState}>
                    <option value="" disabled selected >Selecione</option>
                    {planos.map((plano) => (
                        <option value={plano.id}>
                            {plano.nome_plano}
                        </option>
                    ))}
                </select>
                <button className='insertMoreOne' onClick={tooglePackVisibility} disabled={inputVisibility} type='button'>Incluir Pack?</button>
                {formErrors && formErrors.planos_id ? <small className="error-message">{formErrors.modalidade_id[0]}</small> : ""}
            </div>

            <div className={`form-name-input ${!packVisibility ? `disabled` : ''}`} >
                <span>Pack</span>
                <select name="packs_id" id="packs_id">
                    <option value="" disabled selected >Selecione</option>
                    {packs.map((pack) => (
                        <option value={pack.id}>
                            {pack.nome_plano}
                        </option>
                    ))}
                    {formErrors && formErrors.pack_id ? <small className="error-message">{formErrors.pack_id[0]}</small> : ""}
                </select>

            </div>




            <div className={`form-name-input ${inputVisibility ? `disabled` : ''}`} >
                <span>Modalidade 1</span>
                <select name="modalidade_id[]" id="modalidade_id" disabled={inputVisibility} >
                    <option value="" disabled selected >Selecione</option>
                    {modalidades.map((modalidade) => (
                        <option value={modalidade.id}>
                            {modalidade.nome_modalidade}
                        </option>
                    ))}

                </select>
                {formErrors && formErrors.modalidade_id ? <small className="error-message">{formErrors.modalidade_id[0]}</small> : ""}
                <button type="button" className='insertMoreOne' onClick={toogleInputModalidade}>+ 1 Modalidade</button>
            </div>
            <div className={`form-name-input ${inputModalidadeState ? `flex` : 'none'}`}  >
                <span>Modalidade 2</span>
                <select name="modalidade_id[]" id="modalidade_id" disabled={!inputModalidadeState}>
                    <option value="" disabled selected >Selecione</option>
                    {modalidades.map((modalidade) => (
                        <option value={modalidade.id}>
                            {modalidade.nome_modalidade}
                        </option>
                    ))}
                </select>
                <button type="button" className='insertMoreOne' onClick={toogleSecondInputModalidade}>+ 1 Modalidade</button>
            </div>

            <div className={`form-name-input ${secondInputModalidadeState ? `flex` : 'none'}`}  >
                <span>Modalidade 3</span>
                <select name="modalidade_id[]" id="modalidade_id" disabled={!secondInputModalidadeState}>
                    <option value="" disabled selected >Selecione</option>
                    {modalidades.map((modalidade) => (
                        <option value={modalidade.id}>
                            {modalidade.nome_modalidade}
                        </option>
                    ))}
                </select>
             
            </div>


            <div className="form-name-input">
                <span>Data de Inicio</span>
                <input type="date" name='data_inicio' id="data_inicio" disabled={contratosInputVisibility

                } />
                {formErrors && formErrors.data_inicio ? <small className="error-message">{formErrors.data_inicio[0]}</small> : ""}
            </div><div className="form-name-input">
                <span>Data de Renovação</span>
                <input type="date" name='data_renovacao' id="data_renovacao" disabled={contratosInputVisibility

                } />
                {formErrors && formErrors.data_renovacao ? <small className="error-message">{formErrors.data_renovacao[0]}</small> : ""}
            </div><div className="form-name-input">
                <span>Data de Vencimento</span>
                <input type="date" name='data_vencimento' id="data_vencimento" disabled={contratosInputVisibility

                } />
                {formErrors && formErrors.data_vencimento ? <small className="error-message">{formErrors.data_vencimento[0]}</small> : ""}
            </div><div className="form-name-input">
                <span>Valor do Plano</span>
                <input type="text" name='valor_plano' id="valor_plano"  onInput={handleNumericInput}  disabled={contratosInputVisibility

                } />
                {formErrors && formErrors.valor_plano ? <small className="error-message">{formErrors.valor_plano[0]}</small> : ""}

            </div><div className="form-name-input">
                <span>Desconto (em %)</span>
                <input type="text" name='desconto' id="desconto" disabled={contratosInputVisibility} onInput={handleNumericInput} />
                {formErrors && formErrors.desconto ? <small className="error-message">{formErrors.desconto[0]}</small> : ""}
            </div><div className="form-name-input">
                <span>Parcelas</span>
                <input type="text" name='parcelas' id="parcelas" onInput={handleNumericInput}  disabled={contratosInputVisibility

                } />
                {formErrors && formErrors.parcelas ? <small className="error-message">{formErrors.parcelas[0]}</small> : ""}
            </div><div className="form-name-input">
                <span>Observações</span>
                <input type="text" name='observacoes' id="observacoes" />
                {formErrors && formErrors.observacoes ? <small className="error-message">{formErrors.observacoes[0]}</small> : ""}
            </div>

        </>


    );
};


