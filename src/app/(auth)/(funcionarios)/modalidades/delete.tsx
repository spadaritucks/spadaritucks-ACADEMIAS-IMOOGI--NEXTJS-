'use client'


import '../../../../Assets/css/pages-styles/forms.css'
import { Modalidade } from '@/api/ModalidadesRequest';


interface ModalidadeProps {
    modalidades: Modalidade[];
    handleSubmitDelete: (e: React.FormEvent<HTMLFormElement>) => void
    formRef: React.RefObject<HTMLFormElement>
}



export default function Delete({ modalidades, handleSubmitDelete, formRef }: ModalidadeProps) {

    return (
        <>
            <h2>Deletar Modalidade</h2>
            <form action="" className="crud-form" onSubmit={handleSubmitDelete} ref={formRef} >
                <div className="form-name-input">
                    <span>Selecione a Modalidade</span>

                    <select name="modalidade_id" id="modalidade_id">
                        <option value="" disabled selected >Selecione</option>
                        {modalidades.map(modalidade => (
                            <option value={modalidade.id}>{modalidade.nome_modalidade}</option>
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