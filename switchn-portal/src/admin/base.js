import React from "react";
import { connect } from "react-redux";

import {
    SwitchnHeader,
    SwitchnMainContainer,
    SwitchnNavbar,
    SwitchnNavbarLink,
    SwitchnNavbarTabs
} from "../common/base";


class _SwitchnAdminNavbarUserActions extends React.Component {
    render() {
        if (this.props.user) {
            return (
                <div className="navbar-nav">
                    <SwitchnNavbarLink url={this.props.user.url ? this.props.user.url : ''}>
                        Logueado como <u>{this.props.user.username}</u>
                    </SwitchnNavbarLink>
                    <SwitchnNavbarLink url={"/"}>Ver Sitio</SwitchnNavbarLink>
                    <SwitchnNavbarLink url={"/logout"}>Logout</SwitchnNavbarLink>
                </div>
            );
        }
    }
}

let SwitchnAdminNavbarUserActions = connect(
    (state) => {
        return {
            user: state.auth.user
        }
    },
    (dispatch) => {return {}}
)(_SwitchnAdminNavbarUserActions);

class SwitchnAdminNavbarTabs extends React.Component {
    render() {
        return (
            <SwitchnNavbarTabs>
                <SwitchnNavbarLink url={'/admin/propiedades'}>Propiedades</SwitchnNavbarLink>
                <SwitchnNavbarLink url={'/admin/usuarios'}>Usuarios</SwitchnNavbarLink>
            </SwitchnNavbarTabs>
        );
    }
}

class SwitchnAdminHeader extends React.Component {
    render() {
        return (
            <SwitchnHeader title={this.props.title}>
                <SwitchnNavbar brandURL={'/admin'}>
                    <SwitchnAdminNavbarTabs />
                    <SwitchnAdminNavbarUserActions />
                </SwitchnNavbar>
            </SwitchnHeader>
        )
    }
}


export class SwitchnAdminPage extends React.Component {
    render() {
        return (
            <div>
                <SwitchnAdminHeader title={this.props.title} />
                <SwitchnMainContainer>
                    {this.props.children}
                </SwitchnMainContainer>
            </div>
        )
    }
}