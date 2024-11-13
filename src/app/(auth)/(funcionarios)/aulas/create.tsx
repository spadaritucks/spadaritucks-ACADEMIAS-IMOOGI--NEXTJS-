'use client'

import { useEffect, useState } from 'react';
import '../../../../Assets/css/pages-styles/forms.css'
import { Plano } from '@/api/PlanosRequest'
import { getModalidade, Modalidade } from '@/api/ModalidadesRequest';

interface createProps {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    formRef: React.RefObject<HTMLFormElement>
    diasDaSemana?: string[]
    formErrors?: { [key: string] : string[]}
}


export default function Create({ handleSubmit, formRef, diasDaSemana , formErrors}: createProps) {


    const [modalidades, setModalidades] = useState<Modalidade[]>([])

    useEffect(() => {
        const fetchModalidades = async () => {
            const response = await getModalidade();
            setModalidades(response);

        }

        fetchModalidades()
    }, [])

    const handleNumericInput = (e: React.FormEvent<HTMLInputElement>) => {
        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.,]/g, ''); // Permite apenas números e vírgula/ponto
    };

    return (
        <>

            <form action="" className="crud-form" onSubmit={handleSubmit} ref={formRef} >
                <div className="form-name-input">
                    <span>Modalidade Praticada</span>
                    <select name="modalidade_id" id="modalidade_id">
                        <option value="" disabled selected >Selecione</option>
                        {modalidades.map(modalidade => (
                            <option value={modalidade.id}>{modalidade.nome_modalidade}</option>
                        ))}
                    </select>
                    {formErrors && formErrors.modalidade_id ? <small className="error-message">{formErrors.modalidade_id[0]}</small> : ""}
                </div>
                
                <div className="form-name-input">
                    <span>Selecione o Dia da Semana</span>
                    <div className="grid-checkbox">
                        {diasDaSemana?.map((dia, index) => (
                            <label key={index} className='grid-checkbox-item' >
                                <input type="checkbox" name='dia_semana' value={index} /><p className='checkbox-text'>{dia}</p>
                            </label>
                        ))}
                    </div>
                    {formErrors && formErrors.dia_semana ? <small className="error-message">{formErrors.dia_semana[0]}</small> : ""}
                </div>

                <div className="form-name-input">
                    <span>Data de Inicio</span>
                    <input type="date" name="data_inicio" id='data_inicio' />
                    {formErrors && formErrors.data_inicio ? <small className="error-message">{formErrors.data_inicio[0]}</small> : ""}
                </div>

                <div className="form-name-input">
                    <span>Data Final</span>
                    <input type="date" name="data_fim" id='data_fim' />
                    {formErrors && formErrors.data_fim ? <small className="error-message">{formErrors.data_fim[0]}</small> : ""}
                </div>
                <div className="form-name-input">
                    <span>Horario da Aula</span>
                    <input type="time" name="horario" id='horario' />
                    {formErrors && formErrors.horario ? <small className="error-message">{formErrors.horario[0]}</small> : ""}
                </div>
                <div className="form-name-input">
                    <span>Limite de Alunos</span>
                    <input type="text" name="limite_alunos" id='limite_alunos' onInput={handleNumericInput} />
                    {formErrors && formErrors.limite_alunos ? <small className="error-message">{formErrors.limite_alunos[0]}</small> : ""}
                </div>


                <div className="form-name-input" style={{ gridColumn: '1 / -1' }}>
                    <button type='submit' className='submit-button'>Enviar</button>
                </div>

            </form>
        </>
    )
}