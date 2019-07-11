import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { LoginForm } from "../common/forms/login";
import { SwitchnPortalPage } from "./base";
import { login } from "../redux/auth/actions";
import { PropiedadCard } from './homeSinRegistrarPropiedad';
import { PropiedadCardSubasta } from './homeSinRegistrarSubasta';
import { Row, Col } from "react-bootstrap";



class SwitchnPortalLogin extends React.Component {

    onSubmit = (values) => {
        this.props.login(values.username, values.password);
    }

    render() {
        if (this.props.isAuthenticated) {
            if (this.props.user && this.props.user.is_admin) {
                return (<Redirect to="/admin" />);
            }
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
                        <PropiedadCard />
                    </Col>
                    <Col>
                        <PropiedadCardSubasta />
                    </Col>

                </Row>   
                </div>
            </SwitchnPortalPage>
        )
    }
}


const mapStateToProps = state => {
    return {
      isAuthenticated: state.auth.isAuthenticated,
      user: state.auth.user
    };
}
  
const mapDispatchToProps = dispatch => {
    return {
        login: (username, password) => {
            return dispatch(login(username, password));
        }
    };
}

SwitchnPortalLogin = connect(mapStateToProps, mapDispatchToProps)(SwitchnPortalLogin)

export { SwitchnPortalLogin }