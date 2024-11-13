'use client'

import { handleNumericInput } from "@/hooks/InputNumeric";



interface BaixaPagamentoProps{
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    formRef: React.RefObject<HTMLFormElement> 
    
}


export const BaixaPagamento : React.FC<BaixaPagamentoProps> = ({handleSubmit,formRef}) => {
    return (
      <form action="" onSubmit={handleSubmit} ref={formRef}>
             <div className="form-name-input">
                    <span>Anexar Comprovante</span>
                    <input type="file" name="comprovante" id='comprovante' />
                </div>
                <div className="form-name-input">
                    <span>Valor Pago</span>
                    <input type="text" name="valor_pago" id='valor_pago' onInput={handleNumericInput} />
                </div>
                <div className="form-name-input">
                    <span>Data do Pagamento</span>
                    <input type="date" name="data_pagamento" id='data_pagamento' />
                </div>
                <div className="form-name-input">
                    <span>Comentario sobre Pagamento</span>
                    <textarea name="comentario" id="comentario" rows={4} cols={25}></textarea>
                </div>

                <div className="form-name-input" style={{ gridColumn: '1 / -1' }}>
                    <button type='submit' className='submit-button'>Enviar</button>
                </div>
                
      </form>
    )
}