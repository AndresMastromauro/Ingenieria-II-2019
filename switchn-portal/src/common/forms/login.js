import React from "react";
import { TextField, PasswordField } from './inputs';

export class LoginForm extends React.Component {
    render() {
        return (
            <form onSubmit={this.props.onSubmit}>
                <TextField label={"E-mail"} />
                <PasswordField label={"Contraseña"} />
                <button type="submit">Acceder</button>
            </form>
        )
    }
}

