import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { LoginForm } from "../common/forms/login";
import { SwitchnPortalPage } from "./base";
import { login } from "../redux/auth/actions";
import { PropiedadCard } from './homeSinRegistrarPropiedad';
import { PropiedadCardSubasta } from './homeSinRegistrarSubasta';
import { Row, Col } from "react-bootstrap";



class _SwitchnPortalLogin extends React.Component {

    onSubmit = (values) => {
        this.props.login(values.username, values.password);
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
                        <LoginForm onSubmit={this.onSubmit}/>
                    </Col>
                    <Col>
                        <PropiedadCard/>
                    </Col>
                    <Col>
                        <PropiedadCardSubasta/>
                    </Col>

                </Row>   
                </div>
            </SwitchnPortalPage>
        )
    }
}


const mapStateToProps = state => {
    /* let errors = [];
    if (state.auth.errors) {
      errors = Object.keys(state.auth.errors).map(field => {
        return {field, message: state.auth.errors[field]};
      });
    } */
    return {
    //   errors: state.auth.errors,
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

let SwitchnPortalLogin = connect(mapStateToProps, mapDispatchToProps)(_SwitchnPortalLogin)

export { SwitchnPortalLogin }