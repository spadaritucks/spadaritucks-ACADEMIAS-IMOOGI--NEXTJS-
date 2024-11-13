'use client'


import '../../../../Assets/css/pages-styles/forms.css'
import { useState } from 'react';
import Image from 'next/image';
import { Unidade } from '@/api/UnidadesRequest';


interface UnidadesProps {
    unidades: Unidade[];
    handleSubmitUpdate: (e: React.FormEvent<HTMLFormElement>) => void;
    formRef: React.RefObject<HTMLFormElement>
    formErrors?: { [key: string] : string[]}
}


export default function Update({ unidades, handleSubmitUpdate, formRef,formErrors }: UnidadesProps

) {

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [previewGrade, setPreviewGrade] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {

        const id = e.target.value
        const selectedUnidade = unidades.find(unidade => unidade.id === parseInt(id));
        if (selectedUnidade && formRef.current) {

            const form = formRef.current;

            // Atualize os campos do formulário com os dados do plano selecionado
            setPreviewImage(selectedUnidade.imagem_unidade);
            (form['nome_unidade'] as HTMLInputElement).value = selectedUnidade.nome_unidade.toString();
            (form['endereco'] as HTMLInputElement).value = selectedUnidade.endereco.toString();
            setPreviewGrade(selectedUnidade.grade);
            (form['descricao'] as HTMLInputElement).value = selectedUnidade.descricao.toString();

        }

    }




    return (
        <>
            <h2>Alterar Unidade</h2>
            {previewImage && (
                <Image src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${previewImage}`} alt="Prévia da Imagem da Modalidade" width={200} height={200} style={{ gridColumn: '1 / -1' }} />
            )}

            <form action="" className="crud-form" onSubmit={handleSubmitUpdate} ref={formRef}>

                <div className="form-name-input">
                    <span>Selecione a Unidade</span>
                    <select name="unidade_id" id="unidade_id" onChange={handleInputChange}>
                        <option value="" disabled selected >Selecione</option>
                        {unidades.map(unidades => (
                            <option value={unidades.id}>{unidades.nome_unidade}</option>

                        ))}
                    </select>
                </div>


                <div className="form-name-input">
                    <span>Foto da Unidade</span>
                    <input type="file" name="imagem_unidade" id='imagem_unidade' />
                    {formErrors && formErrors.imagem_unidade ? <small className="error-message">{formErrors.imagem_unidade[0]}</small> : ""}
                </div>
                <div className="form-name-input">
                    <span>Nome da Unidade</span>
                    <input type="text" name="nome_unidade" id='nome_unidade' />
                    {formErrors && formErrors.nome_unidade ? <small className="error-message">{formErrors.nome_unidade[0]}</small> : ""}
                </div>

                <div className="form-name-input">
                    <span>Endereço da Unidade</span>
                    <input type="text" name="endereco" id='endereco' />
                    {formErrors && formErrors.endereco ? <small className="error-message">{formErrors.endereco[0]}</small> : ""}
                </div>

                <div className="form-name-input">
                    <span>Grade Horaria</span>
                    <input type="file" name="grade" id='grade' />
                    {formErrors && formErrors.grade ? <small className="error-message">{formErrors.grade[0]}</small> : ""}
                </div>
                <div className="form-name-input">
                    <span>Descrição da Unidade</span>
                    <input type="text" name="descricao" id='descricao' />
                    {formErrors && formErrors.descricao ? <small className="error-message">{formErrors.descricao[0]}</small> : ""}
                </div>
                <div className="form-name-input" style={{ gridColumn: '1 / -1' }}>
                    <button type='submit' className='submit-button'>Enviar</button>
                </div>
            </form>
        </>
    )
}