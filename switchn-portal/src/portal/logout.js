import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { SwitchnPortalPage } from "./base";
import { logout } from '../redux/auth/actions';

class _SwitchnPortalLogout extends React.Component {
    componentDidMount() {
        this.props.logout();
    }
    render() {
        if (!this.props.isAuthenticated) {
            return <Redirect to="/" />
        }
        return (
            <SwitchnPortalPage>
                <div>Cerrando Sesión...</div>
            </SwitchnPortalPage>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => { return dispatch(logout()) }
    }
}

let SwitchnPortalLogout = connect(mapStateToProps, mapDispatchToProps)(_SwitchnPortalLogout);

export { SwitchnPortalLogout };