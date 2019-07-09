import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { SignUpForm } from "../common/forms/signUp";
import { SwitchnPortalPage } from "./base";
// import { signUp } from "../redux/auth/actions";
import { Row, Col, Jumbotron } from "react-bootstrap";
import { SwitchnAPI } from '../utils/client';

class _SwitchnPortalSignUp extends React.Component {

    onSubmit = (values) => {
        if (values.username !== values.email) {
            alert("El email no coincide");
        } else {
            // this.props.signUp(values, this.handleSignUpOk, this.handleSignUpFail);
            SwitchnAPI.clientes.create(values)
                .then(this.handleSignUpOk)
                .catch(this.handleSignUpFail);
        }
    }

    handleSignUpOk = () => {
        alert("Te registraste existosamente!");
        this.props.history.replace("/login");
    }

    handleSignUpFail = () => {
        alert("Ha ocurrido un error");
    }

    render() {
        if (this.props.isAuthenticated) {
            return (<Redirect to="/" />);
        }
        return (
            <SwitchnPortalPage>
                <div className="justify-content-center">
                <Row>
                    <Col>
                        <SignUpForm onSubmit={this.onSubmit}/>
                    </Col>
                    <Col>
                        <Jumbotron>
                    <h1>Beneficios de registrarte</h1>
                    <p>
                        Podrás acceder a toda nuestra gama de alojamientos listos para que 
                        puedas disfrutar de las vacaciones de tus sueños.
                        Regístrate hoy mismo y accede a las mejores subastas, o hazte miembro
                        premium y elige donde alojarte sin ningún tipo de restricciones.
                        <br></br>
                        <span>Precio Usuario Premium: $5000 por mes.</span>
                        <span>Precio Usuario Standard: $2000 por mes.</span>

                    </p>

                    </Jumbotron>
                    </Col>


                </Row>   
                </div>
            </SwitchnPortalPage>
        )
    }
}


/* const mapStateToProps = state => {
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
        signUp: (values, fnSuccess, fnError) => {
            return dispatch(signUp(values, fnSuccess, fnError));
        }
    };
} */

// let SwitchnPortalSignUp = connect(mapStateToProps, mapDispatchToProps)(_SwitchnPortalSignUp)
let SwitchnPortalSignUp = _SwitchnPortalSignUp;

export { SwitchnPortalSignUp }

