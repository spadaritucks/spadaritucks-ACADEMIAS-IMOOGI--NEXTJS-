'use client'

import { Modalidade } from '@/api/ModalidadesRequest';
import '../../../../Assets/css/pages-styles/forms.css'
import { useState } from 'react';
import Image from 'next/image';


interface ModalidadeProps {
    modalidades: Modalidade[];
    handleSubmitUpdate: (e: React.FormEvent<HTMLFormElement>) => void;
    formRef: React.RefObject<HTMLFormElement>
    formErrors?: { [key: string] : string[]}
}


export default function Update({ modalidades, handleSubmitUpdate, formRef, formErrors }: ModalidadeProps) {

    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {

        const id = e.target.value
        const selectedModalidade = modalidades.find(modalidade => modalidade.id === parseInt(id));
        if (selectedModalidade && formRef.current) {

            const form = formRef.current;
            // Atualize os campos do formulário com os dados do plano selecionado
            setPreviewImage(selectedModalidade.foto_modalidade);
            (form['nome_modalidade'] as HTMLInputElement).value = selectedModalidade.nome_modalidade.toString();
            (form['descricao_modalidade'] as HTMLInputElement).value = selectedModalidade.descricao_modalidade.toString();

        }


    }

    const handleNumericInput = (e: React.FormEvent<HTMLInputElement>) => {
        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.,]/g, ''); // Permite apenas números e vírgula/ponto
    };



    return (
        <>
            <h2>Alterar Modalidade</h2>
            {previewImage && (
                <Image src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${previewImage}`} alt="Prévia da Imagem da Modalidade" width={200} height={200} style={{ gridColumn: '1 / -1' }} />
            )}

            <form action="" className="crud-form" onSubmit={handleSubmitUpdate} ref={formRef}>

                <div className="form-name-input">
                    <span>Selecione a Modalidade</span>
                    <select name="modalidade_id" id="modalidade_id" onChange={handleInputChange}>
                        <option value="" disabled selected >Selecione</option>
                        {modalidades.map(modalidades => (
                            <option value={modalidades.id}>{modalidades.nome_modalidade}</option>

                        ))}
                    </select>
                </div>


                <div className="form-name-input">
                    <span>Foto da Modalidade</span>
                    <input type="file" name="foto_modalidade" id='foto_modalidade' />
                    {formErrors && formErrors.foto_modalidade ? <small className="error-message">{formErrors.foto_modalidade[0]}</small> : ""}
                </div>
                <div className="form-name-input">
                    <span>Nome da Modaliade</span>
                    <input type="text" name="nome_modalidade" id='nome_modalidade' />
                    {formErrors && formErrors.nome_modalidade ? <small className="error-message">{formErrors.nome_modalidade[0]}</small> : ""}
                </div>
                <div className="form-name-input">
                    <span>Descrição da Modalidade</span>
                    <input type="text" name="descricao_modalidade" id='descricao_modalidade' />
                    {formErrors && formErrors.nome_modalidade ? <small className="error-message">{formErrors.nome_modalidade[0]}</small> : ""}
                </div>

                <div className="form-name-input" style={{ gridColumn: '1 / -1' }}>
                    <button type='submit' className='submit-button'>Enviar</button>
                </div>
            </form>
        </>
    )
}