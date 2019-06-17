import React from "react";
import { TextField, PasswordField, SubmitButton, NumberField, EmailField, DateField } from './inputs';
// import { SubmitButton } from './inputs';
import { Field, reduxForm } from 'redux-form';
import { link } from "fs";
import { Link } from "../base";




class _SingUpForm extends React.Component {
    render() {
        let {handleSubmit} = this.props;
        return (
            <form onSubmit={handleSubmit} className="row">
                <fieldset>
                    <legend>SingUp</legend>
                    {/* <div className={ this.props.errors.length > 0 ? "alert alert-danger" : '' }>
                        {this.props.errors.length > 0 && (
                            this.props.errors.map(error => (
                                <span key={error.field}>{error.message}</span>
                            ))
                        )}
                    </div> */}
                    <EmailField label={"E-mail"} name={"username"} /* onChange={this.handleUserChange} */ />
                    <TextField label={"Apellido"} name={"first_name"} /* onChange={this.handleUserChange} */ />
                    <TextField label={"Nombre"} name={"last_name"} /* onChange={this.handleUserChange} */ />
                    <EmailField label={"Repetir email"} name={"email"} /* onChange={this.handleUserChange} */ />
                    <PasswordField label={"Contraseña"} name={"password"} /* onChange={this.handlePasswordChange} */ />
                    <NumberField label={"Nro de tarjeta de credito"} name={"profile.tarjeta_credito"}/>
                    <DateField label={"Fecha de nacimiento"} name={"profile.fecha_nacimiento"}/>
                    <div className="form-group">
                        <SubmitButton>Registrar</SubmitButton>
                    </div>
                    <Link url={'/login'}> <small>Ya tenes cuenta? Accede</small> </Link>
                </fieldset>
            </form>
        )
    }
}

let SingUpForm = reduxForm({
    form: 'singUp-form'
})(_SingUpForm);

export { SingUpForm };