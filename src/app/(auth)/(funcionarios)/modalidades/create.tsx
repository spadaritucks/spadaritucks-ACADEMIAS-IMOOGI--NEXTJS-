'use client'

import '../../../../Assets/css/pages-styles/forms.css'
import { Plano } from '@/api/PlanosRequest'

interface createProps{
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    formRef: React.RefObject<HTMLFormElement> 
    formErrors?: { [key: string] : string[]}
}


export default function Create({handleSubmit,formRef, formErrors}:createProps) {
   

    return (
        <>
        <h2>Criar Modalidade</h2>
            <form action="" className="crud-form" onSubmit={handleSubmit} ref={formRef} >
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