import React from "react";
import { TextField, PasswordField, SubmitButton, NumberField, EmailField } from './inputs';
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
                    <PasswordField label={"Confirmar Contraseña"} name={"password2"} /* onChange={this.handlePasswordChange} */ />
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