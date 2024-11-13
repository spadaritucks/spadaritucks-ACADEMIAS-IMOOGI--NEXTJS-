'use client'

import '../../../../Assets/css/pages-styles/forms.css'


interface createProps{
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    formRef: React.RefObject<HTMLFormElement> 
    formErrors?: { [key: string] : string[]}
}


export default function Create({handleSubmit,formRef,formErrors}:createProps) {

    return (
        <>
        <h2>Criar Unidade</h2>
            <form action="" className="crud-form" onSubmit={handleSubmit} ref={formRef} >
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