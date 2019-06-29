import React from "react";
import { TextField, PasswordField, SubmitButton } from './inputs';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { Link } from "../base";
import { Alert } from 'react-bootstrap';

let LoginErrors = (props) => {
    var alerts = null;
    if (props.errors.length > 0) {
        alerts = props.errors.map(
            (err, i) => <Alert key={i} variant="danger">{err}</Alert>
        );
    }
    return alerts;
}

LoginErrors = connect(
    state => {
        return {
            errors: state.auth.errors
        }
    }
)(LoginErrors);

class _LoginForm extends React.Component {
    render() {
        let {handleSubmit} = this.props;
        return (
            <form onSubmit={handleSubmit} className="row">
                <fieldset className="col">
                    <legend>Login</legend>
                    <TextField label={"E-mail"} name={"username"} /* onChange={this.handleUserChange} */ />
                    <PasswordField label={"Contraseña"} name={"password"} /* onChange={this.handlePasswordChange} */ />
                    <div className="form-group">
                        <SubmitButton>Acceder</SubmitButton>
                    </div>
                    <LoginErrors />
                    <Link url={'/registrar'}><small>¿No tenés cuenta? ¡Registrate!</small></Link>
                </fieldset>
            </form>
        )
    }
}


let LoginForm = reduxForm({
    form: 'login-form'
})(_LoginForm);

export { LoginForm };

