'use client'
import '../../../../Assets/css/pages-styles/forms.css'

interface UsuariosProps {
    formErrors?: { [key: string] : string[]}
}


export const Funcionario:React.FC<UsuariosProps> = ({formErrors}) => {


    return (

        <>
            <div className="form-name-input">
                <span>Tipo do Funcionario</span>

                <select name="tipo_funcionario" id="tipo_funcionario">
                    <option value="" disabled selected >Selecione</option>
                    <option value="professor">Professor</option>
                    <option value="administrador">Administrador</option>
                    {formErrors && formErrors.tipo_funcionario ? <small className="error-message">{formErrors.tipo_funcionario[0]}</small> : ""}
                </select>
            </div><div className="form-name-input">
                <span>Cargo</span>
                <input type="text" name='cargo' id="cargo" placeholder="Cargo" />
                {formErrors && formErrors.cargo ? <small className="error-message">{formErrors.cargo[0]}</small> : ""}
            </div><div className="form-name-input">
                <span>Atividades</span>
                <input type="text" name='atividades' id="atividades" placeholder="Atividades" />
                {formErrors && formErrors.atividades ? <small className="error-message">{formErrors.atividades[0]}</small> : ""}
            </div>
        </>


    )
}

