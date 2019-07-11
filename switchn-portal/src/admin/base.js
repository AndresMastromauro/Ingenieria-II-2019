import React from "react";
import { connect } from "react-redux";

import {
    SwitchnHeader,
    SwitchnMainContainer,
    SwitchnNavbar,
    SwitchnNavbarLink,
    SwitchnNavbarTabs
} from "../common/base";


class SwitchnAdminNavbarUserActions extends React.Component {
    render() {
        if (this.props.user) {
            let {user} = this.props;
            const UserName = user.url ?
                (props) => <SwitchnNavbarLink url={user.url}>{props.children}</SwitchnNavbarLink>
                : (props) => <span className="nav-item nav-link">{props.children}</span>;
            return (
                <div className="navbar-nav">
                    <UserName>Bienvenido <u>{user.apellido}, {user.nombre}</u></UserName>
                    <SwitchnNavbarLink url={"/"}>Ver Sitio</SwitchnNavbarLink>
                    <SwitchnNavbarLink url={"/logout"}>Logout</SwitchnNavbarLink>
                </div>
            );
        }
    }
}

SwitchnAdminNavbarUserActions = connect(
    (state) => {
        return {
            user: state.auth.user
        }
    }
)(SwitchnAdminNavbarUserActions);

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