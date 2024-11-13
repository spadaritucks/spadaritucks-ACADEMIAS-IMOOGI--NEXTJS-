import { Modalidade } from "@/api/ModalidadesRequest";
import { Contrato, DadosFuncionario, Usuario, UsuarioModalidade } from "@/api/UsuariosRequest";
import useCPFMask from "@/hooks/CpfFormat";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface UsuariosProps {
    handleTypeUserChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    formRef?: React.RefObject<HTMLFormElement>
    user?: Usuario
    contrato?: Contrato;
    modalidade?: UsuarioModalidade[];
    funcionario?: DadosFuncionario;
    handleInputClick?: () => void
    formErrors?: { [key: string] : string[]}
    
  
}


export const Usuarios: React.FC<UsuariosProps> = ({ formErrors, handleInputClick,  user, contrato, modalidade, funcionario, handleTypeUserChange }) => {

    const [passwordInputState,setPasswordInputState] = useState<boolean>(false);
    const { cpf, handleChange, applyMaskToCPF } = useCPFMask();
    const [update, setUpdate] = useState<boolean>(false);
    const [localCpf, setLocalCpf] = useState<string>("");

    const displayPasswordInput = () =>{
        setPasswordInputState(!passwordInputState)
    }
   

    useEffect(() => {
        if (user) {
            displayPasswordInput()
            setUpdate(true)
            setLocalCpf(applyMaskToCPF(user.cpf))
        }
        
    }, [user, contrato,modalidade,funcionario]); // Executa sempre que 'user' mudar

    const handleNumericInput = (e: React.FormEvent<HTMLInputElement>) => {
        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.,]/g, ''); // Permite apenas números e vírgula/ponto
    };



    return (
        <>
            <div className="form-name-input">
                <span>Insira sua Foto</span>
                <input type="file" name="foto_usuario" id='foto_usuario' />
            </div>
            <div className="form-name-input">
                <span>Tipo de Usuario</span>
                <select name="tipo_usuario" id="tipo_usuario" onChange={handleTypeUserChange}>
                <option value="" disabled selected >Selecione</option>
                    <option value="aluno">Aluno</option>
                    <option value="funcionario">Funcionario</option>

                </select>
                {formErrors && formErrors.tipo_usuario ? <small className="error-message">{formErrors.tipo_usuario[0]}</small> : ""}
            </div>
            <div className="form-name-input">
                <span>Nome Completo</span>
                <input type="text" name='nome' id="nome" placeholder="Nome Completo" />
                {formErrors && formErrors.nome ? <small className="error-message">{formErrors.nome[0]}</small> : ""}
            </div>
            <div className="form-name-input">
                <span>Email</span>
                <input type="text" name='email' id="email" placeholder="Email" />
                {formErrors && formErrors.email ? <small className="error-message">{formErrors.email[0]}</small> : ""}
            </div>
            <div className="form-name-input">
                <span>Data de Nascimento</span>
                <input type="date" name='data_nascimento' id="data_nascimento" />
                {formErrors && formErrors.data_nascimento ? <small className="error-message">{formErrors.data_nascimento[0]}</small> : ""}
            </div>
            <div className="form-name-input">
                <span>CPF</span>
                <input
                    type="text"
                    name='cpf'
                    id="cpf"
                    maxLength={14}
                    onChange={(e) => {
                        handleChange(e);
                        setLocalCpf(applyMaskToCPF(e.currentTarget.value));
                    }}
                    value={localCpf}
                    onInput={handleNumericInput}
                />
                {formErrors && formErrors.cpf ? <small className="error-message">{formErrors.cpf[0]}</small> : ""}
            </div>
            <div className="form-name-input">
                <span>RG</span>
                <input type="text" name='rg' id="rg" placeholder="RG" onInput={handleNumericInput} />
                {formErrors && formErrors.rg ? <small className="error-message">{formErrors.rg[0]}</small> : ""}
            </div>
            <div className="form-name-input">
                <span>Telefone</span>
                <input type="text" name='telefone' id="telefone" placeholder="Telefone" onInput={handleNumericInput} />
                {formErrors && formErrors.telefone ? <small className="error-message">{formErrors.telefone[0]}</small> : ""}
            </div>
            <div className="form-name-input">
                <span>CEP</span>
                <input type="text" name='cep' id="cep" placeholder="CEP" onInput={handleNumericInput} />
                {formErrors && formErrors.cep ? <small className="error-message">{formErrors.cep[0]}</small> : ""}
            </div>
            <div className="form-name-input">
                <span>Logradouro</span>
                <input type="text" name='logradouro' id="logradouro" placeholder="Logradouro" />
                {formErrors && formErrors.logradouro ? <small className="error-message">{formErrors.logradouro[0]}</small> : ""}
            </div>
            <div className="form-name-input">
                <span>Numero da Residencia</span>
                <input type="text" name='numero' id="numero" placeholder="Numero da Residencia" onInput={handleNumericInput} />
                {formErrors && formErrors.numero ? <small className="error-message">{formErrors.numero[0]}</small> : ""}
            </div>
            <div className="form-name-input">
                <span>Complemento (Opcional)</span>
                <input type="text" name='complemento' id="complemento" placeholder="Complemento" />
                {formErrors && formErrors.complemento ? <small className="error-message">{formErrors.complemento[0]}</small> : ""}
            </div>

            <div className= {`form-name-input ${passwordInputState ? 'disabled' : ''}`} >
                <span>Senha</span>
                <input type="password" name='password' id="password" placeholder="Senha" />
                {formErrors && formErrors.password ? <small className="error-message">{formErrors.password [0]}</small> : ""}
            </div>

            <div className={`form-name-input ${passwordInputState ? 'disabled' : ''}`}>
                <span>Confirme sua senha</span>
                <input type="password" name='password_confirmation' id="password_confirmation" placeholder="Confirme a Senha" />
            </div>


        </>
    )
}