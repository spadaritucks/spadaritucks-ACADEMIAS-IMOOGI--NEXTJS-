'use client'

import '../../../../Assets/css/pages-styles/forms.css'
import { Packs, Plano } from '@/api/PlanosRequest'

interface PlanosProps {
    packs: Packs[];
    handleSubmitUpdate: (e: React.FormEvent<HTMLFormElement>) => void;
    formRef: React.RefObject<HTMLFormElement>
    formErrors?: { [key: string] : string[]}
}


export default function Update({ packs, handleSubmitUpdate, formRef,formErrors }: PlanosProps) {

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value
        const selectedPlano = packs.find(packs => packs.id === parseInt(id));
        if (selectedPlano && formRef.current) {

            const form = formRef.current;

            // Atualize os campos do formulário com os dados do plano selecionado
            (form['nome_plano'] as HTMLInputElement).value = selectedPlano.nome_plano.toString();
            (form['duracao'] as HTMLInputElement).value = selectedPlano.duracao.toString();
            (form['valor_matricula'] as HTMLInputElement).value = selectedPlano.valor_matricula.toString().replace('.', ',');
            (form['valor_mensal'] as HTMLInputElement).value = selectedPlano.valor_mensal.toString().replace('.', ',');
            (form['valor_total'] as HTMLInputElement).value = selectedPlano.valor_total.toString().replace('.', ',');
            (form['num_modalidades'] as HTMLSelectElement).value = selectedPlano.num_modalidades.toString();
            (form['status'] as HTMLSelectElement).value = selectedPlano.status;
            (form['number_checkins_especial'] as HTMLInputElement).value = selectedPlano.number_checkins_especial.toString();
        }


    }

    const handleNumericInput = (e: React.FormEvent<HTMLInputElement>) => {
        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.,]/g, ''); // Permite apenas números e vírgula/ponto
    };



    return (
        <>
            <h2>Alterar Pack</h2>
            <form action="" className="crud-form" onSubmit={handleSubmitUpdate} ref={formRef}>

                <div className="form-name-input">
                    <span>Selecione o Plano</span>
                    <select name="pack_id" id="pack_id" onChange={handleInputChange}>
                        <option value="" disabled selected >Selecione</option>
                        {packs.map(packs => (
                            <option value={packs.id}>{packs.nome_plano}</option>

                        ))}
                    </select>
                </div>

                <div className="form-name-input">
                    <span>Nome do Plano</span>
                    <input type="text" name="nome_plano" id='nome_plano' />
                    {formErrors && formErrors.nome_plano ? <small className="error-message">{formErrors.nome_plano[0]}</small> : ""}
                </div>
                <div className="form-name-input">
                    <span>Duração (em meses)</span>
                    <input type="text" name="duracao" id='duracao'  onInput={handleNumericInput} />
                    {formErrors && formErrors.duracao ? <small className="error-message">{formErrors.duracao[0]}</small> : ""}
                </div>
                <div className="form-name-input">
                    <span>Valor da Matricula</span>
                    <input type="text" name="valor_matricula" id='valor_matricula'  onInput={handleNumericInput} />
                    {formErrors && formErrors.valor_matricula ? <small className="error-message">{formErrors.valor_matricula [0]}</small> : ""}
                </div>
                <div className="form-name-input">
                    <span>Valor Mensal</span>
                    <input type="text" name="valor_mensal" id='valor_mensal'  onInput={handleNumericInput} />
                    {formErrors && formErrors.valor_mensal ? <small className="error-message">{formErrors.valor_mensal[0]}</small> : ""}
                </div>
                <div className="form-name-input">
                    <span>Valor Total</span>
                    <input type="text" name="valor_total" id='valor_total'  onInput={handleNumericInput} />
                    {formErrors && formErrors.valor_total ? <small className="error-message">{formErrors.valor_total[0]}</small> : ""}
                </div>
                <div className="form-name-input">
                    <span>N° Modalidades</span>
                    <select name="num_modalidades" id="num_modalidades" defaultValue='default'>
                        <option value='default' disabled selected>Selecione</option>
                        <option value="1">1 Modalidade</option>
                        <option value="2">2 Modalidades</option>
                    </select>
                    {formErrors && formErrors.num_modalidades ? <small className="error-message">{formErrors.num_modalidades [0]}</small> : ""}

                </div>
                <div className="form-name-input">
                    <span>Status do Plano</span>
                    <select name="status" id="status" defaultValue='default'>
                        <option value='default' selected disabled>Selecione</option>
                        <option value="Ativo">Ativo</option>
                        <option value="Inativo">Inativo</option>
                    </select>
                    {formErrors && formErrors.status ? <small className="error-message">{formErrors.status [0]}</small> : ""}

                </div>

                <div className="form-name-input">
                    <span>Check-in Permitidos p/ Semana</span>
                    <input type="text" name="number_checkins_especial" id='number_checkins_especial'  onInput={handleNumericInput} />
                    {formErrors && formErrors.number_checkins ? <small className="error-message">{formErrors.number_checkins [0]}</small> : ""}
                </div>

                <div className="form-name-input" style={{ gridColumn: '1 / -1' }}>
                    <button type='submit' className='submit-button'>Enviar</button>
                </div>
            </form>
        </>
    )
}