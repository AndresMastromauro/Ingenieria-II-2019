import React from "react";
import { connect } from "react-redux";
import { TextField, PasswordField, SubmitButton } from './inputs';
import { login } from "../../redux/auth/actions";

class _LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            password: '',
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
    }

    handleUserChange(e) {
        this.setState({user: e.target.value});
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.login(this.state.user, this.state.password);
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <fieldset>
                    <legend>Login</legend>
                    {/* <div className={ this.props.errors.length > 0 ? "alert alert-danger" : '' }>
                        {this.props.errors.length > 0 && (
                            this.props.errors.map(error => (
                                <span key={error.field}>{error.message}</span>
                            ))
                        )}
                    </div> */}
                    <TextField label={"E-mail"} name="username" onChange={this.handleUserChange} />
                    <PasswordField label={"Contraseña"} name="password" onChange={this.handlePasswordChange} />
                   <SubmitButton>Acceder</SubmitButton>
                </fieldset>
            </form>
        )
    }
}

const mapStateToProps = state => {
    let errors = [];
    if (state.auth.errors) {
      errors = Object.keys(state.auth.errors).map(field => {
        return {field, message: state.auth.errors[field]};
      });
    }
    return {
      errors,
      isAuthenticated: state.auth.isAuthenticated
    };
}
  
const mapDispatchToProps = dispatch => {
    return {
        login: (username, password) => {
            return dispatch(login(username, password));
        }
    };
}

let LoginForm = connect(mapStateToProps, mapDispatchToProps)(_LoginForm);

export { LoginForm };

