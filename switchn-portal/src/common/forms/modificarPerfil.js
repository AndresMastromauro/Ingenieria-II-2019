import React from "react";
import { TextField, PasswordField, SubmitButton, NumberField, EmailField, DateField } from './inputs';
// import { SubmitButton } from './inputs';
import { connect } from "react-redux";
import { Field, reduxForm, getFormValues } from "redux-form";
import { Button, ButtonGroup } from "react-bootstrap";


const CLIENTE_UPDATE_FORM_NAME = 'signUp-form';

class _ModPerfil extends React.Component {
    

    render() {
        let {handleSubmit} = this.props;
        return (
            <form onSubmit={handleSubmit} className="row">
                <fieldset>
                    <legend>Modificar informacion del perfil </legend>
                   
                    <TextField label={"Nombre"} name={"datos_personales.nombre"} /* onChange={this.handleUserChange} */ />
                    <TextField label={"Apellido"} name={"datos_personales.apellido"} /* onChange={this.handleUserChange} */ />
                    
                    <NumberField label={"Nro de tarjeta de credito"} name={"tarjeta_credito"}/>
                    <DateField label={"Fecha de nacimiento"} name={"datos_personales.fecha_nacimiento"}/>
                    <div className="form-group">
                        <ButtonGroup>
                            <Button onClick={this.props.onBackPress}>Volver</Button>
                            <Button type='submit'>Modificar</Button>
                        </ButtonGroup>
                    </div>
                    
                </fieldset>
            </form>
        )
    }
}

let ModPerfil = connect(
    state => {
        return {
            values: getFormValues(CLIENTE_UPDATE_FORM_NAME)(state)
        }
    }
)(_ModPerfil);

ModPerfil = reduxForm({
    form: CLIENTE_UPDATE_FORM_NAME
})(ModPerfil);

export { ModPerfil };