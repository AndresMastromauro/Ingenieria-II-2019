import React from "react";
import { TextField, PasswordField, SubmitButton, NumberField } from './inputs';
// import { SubmitButton } from './inputs';
import { Field, reduxForm } from 'redux-form';

class _LoginForm extends React.Component {
    render() {
        let {handleSubmit} = this.props;
        return (
            <form onSubmit={handleSubmit} className="row">
                <fieldset>
                    <legend>Login</legend>
                    {/* <div className={ this.props.errors.length > 0 ? "alert alert-danger" : '' }>
                        {this.props.errors.length > 0 && (
                            this.props.errors.map(error => (
                                <span key={error.field}>{error.message}</span>
                            ))
                        )}
                    </div> */}
                    <TextField label={"E-mail"} name={"username"} /* onChange={this.handleUserChange} */ />
                    <PasswordField label={"Contraseña"} name={"password"} /* onChange={this.handlePasswordChange} */ />
                    <div className="form-group">
                        <SubmitButton>Acceder</SubmitButton>
                    </div>
                </fieldset>
            </form>
        )
    }
}


let LoginForm = reduxForm({
    form: 'login-form'
})(_LoginForm);

export { LoginForm };

