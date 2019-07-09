import React from "react";
import { TextField, PasswordField, SubmitButton, NumberField, EmailField, DateField } from './inputs';
// import { SubmitButton } from './inputs';
import { Field, reduxForm } from 'redux-form';
import { link } from "fs";
import { Link } from "../base";




class _SignUpForm extends React.Component {
    render() {
        let {handleSubmit} = this.props;
        return (
            <form onSubmit={handleSubmit} className="row">
                <fieldset>
                    <legend>SignUp</legend>
                    {/* <div className={ this.props.errors.length > 0 ? "alert alert-danger" : '' }>
                        {this.props.errors.length > 0 && (
                            this.props.errors.map(error => (
                                <span key={error.field}>{error.message}</span>
                            ))
                        )}
                    </div> */}
                    <EmailField label={"E-mail"} name={"username"} /* onChange={this.handleUserChange} */ />
                    <EmailField label={"Repetir email"} name={"email"} /* onChange={this.handleUserChange} */ />
                    <TextField label={"Apellido"} name={"first_name"} /* onChange={this.handleUserChange} */ />
                    <TextField label={"Nombre"} name={"last_name"} /* onChange={this.handleUserChange} */ />
                    <PasswordField label={"Contraseña"} name={"password"} /* onChange={this.handlePasswordChange} */ />
                    <NumberField label={"Nro de tarjeta de credito"} name={"tarjeta_credito"}/>
                    <DateField label={"Fecha de nacimiento"} name={"fecha_nacimiento"}/>
                    <div className="form-group">
                        <SubmitButton>Registrar</SubmitButton>
                    </div>
                    <Link url={'/login'}> <small>Ya tenes cuenta? Accede</small> </Link>
                </fieldset>
            </form>
        )
    }
}

let SignUpForm = reduxForm({
    form: 'signUp-form'
})(_SignUpForm);

export { SignUpForm };