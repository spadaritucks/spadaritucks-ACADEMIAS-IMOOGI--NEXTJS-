'use client'


import { Unidade } from '@/api/UnidadesRequest';
import '../../../../Assets/css/pages-styles/forms.css'



interface UnidadesProps {
    unidades: Unidade[];
    handleSubmitDelete: (e: React.FormEvent<HTMLFormElement>) => void
    formRef: React.RefObject<HTMLFormElement>
    
}



export default function Delete({ unidades, handleSubmitDelete, formRef }: UnidadesProps) {

    return (
        <>
            <h2>Deletar Unidade</h2>
            <form action="" className="crud-form" onSubmit={handleSubmitDelete} ref={formRef} >
                <div className="form-name-input">
                    <span>Selecione a Unidade</span>
                    <select name="unidade_id" id="unidade_id">
                        <option value="" disabled selected >Selecione</option>
                        {unidades.map(unidade => (
                            <option value={unidade.id}>{unidade.nome_unidade}</option>
                        ))}
                    </select>
                </div>
                <div className="form-name-input" style={{ gridColumn: '1 / -1' }}>
                    <button type='submit' className='submit-button'>Deletar</button>
                </div>
            </form>
        </>
    )
}