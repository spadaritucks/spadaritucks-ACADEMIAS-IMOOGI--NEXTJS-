'use client'

import { Plano } from '@/api/PlanosRequest';
import '../../../../Assets/css/pages-styles/forms.css'
import { useState } from 'react';
import EditUserModal from '@/components/user-modals-edit/EditUserModal';
import { useUserEditModal } from '@/components/user-modals-edit/EditUserContext';
import { ModalSimple } from '@/components/modal';


interface PlanosProps {
    planos: Plano[];
    handleSubmitDelete: (e: React.FormEvent<HTMLFormElement>) => void
    formRef: React.RefObject<HTMLFormElement>
    formErrors?: { [key: string] : string[]}
}





export default function Delete({ planos, handleSubmitDelete, formRef }: PlanosProps) {

    const [modalSubmit, setModalSubmit] = useState<boolean>(false)
    const { showModal } = useUserEditModal()

    // const handleModalSubmit = () => {
    //     setModalSubmit(true)
    //     showModal('Confirmar',
    //         <>
    //             <button type='submit'>Sim</button>
    //             <button>Não</button >
    //         </>
    //     )
    // }

    return (
        <>
            <h2>Deletar Contratos</h2>
            <form action="" className="crud-form" onSubmit={handleSubmitDelete} ref={formRef} >
                <div className="form-name-input">

                    <span>Selecione o Plano</span>
                    <select name="planos_id" id="planos_id" defaultValue='default'>
                        <option value="default" disabled selected >Selecione</option>
                        {planos.map(planos => (
                            <option value={planos.id}>{planos.nome_plano}</option>
                        ))}
                    </select>
                </div>

                {/* {modalSubmit && <ModalSimple modalShow={modalSubmit} modalTitle='Tem certeza da exclusão?' modalBody={
                    <>
                        <button type='submit'>Sim</button>
                        <button>Não</button >
                    </>
                } />} */}
                <div className="form-name-input" style={{ gridColumn: '1 / -1' }}>
                    <button type='submit' className='submit-button'>Deletar</button>
                </div>



            </form>

        </>
    )
}