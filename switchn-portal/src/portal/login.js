import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { LoginForm } from "../common/forms/login";
import { SwitchnPortalPage } from "./base";

class _SwitchnPortalLogin extends React.Component {
    render() {
        if (this.props.isAuthenticated) {
            return (<Redirect to="/" />);
        }
        return (
            <SwitchnPortalPage>
                <div className="justify-content-center">
                    <LoginForm />
                </div>
            </SwitchnPortalPage>
        )
    }
}

const mapDispatchToProps = () => {return {}}
const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    }
}

let SwitchnPortalLogin = connect(mapStateToProps, mapDispatchToProps)(_SwitchnPortalLogin)

export { SwitchnPortalLogin }