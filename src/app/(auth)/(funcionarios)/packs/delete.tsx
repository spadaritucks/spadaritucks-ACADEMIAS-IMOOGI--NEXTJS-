'use client'

import { Packs, Plano } from '@/api/PlanosRequest';
import '../../../../Assets/css/pages-styles/forms.css'


interface PlanosProps {
    packs: Packs[];
    handleSubmitDelete: (e: React.FormEvent<HTMLFormElement>) => void
    formRef: React.RefObject<HTMLFormElement>
}



export default function Delete({packs, handleSubmitDelete, formRef }: PlanosProps) {

    return (
        <>
            <h2>Deletar Pack</h2>
            <form action="" className="crud-form" onSubmit={handleSubmitDelete} ref={formRef} >
                <div className="form-name-input">
                   
                    <span>Selecione o Plano</span>

                    <select name="pack_id" id="pack_id" defaultValue='default'>
                    <option value="default" disabled selected >Selecione</option>
                        {packs.map(packs => (
                            <option value={packs.id}>{packs.nome_plano}</option>
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