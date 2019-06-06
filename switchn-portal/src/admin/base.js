import React from "react";
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
            return (
                <div className="navbar-nav">
                    <SwitchnNavbarLink url={"/logout"}>Logout</SwitchnNavbarLink>
                </div>
            );
        }
        return null;
    }
}

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
                    <SwitchnAdminNavbarUserActions user={this.props.user} />
                </SwitchnNavbar>
            </SwitchnHeader>
        )
    }
}


export class SwitchnAdminPage extends React.Component {
    render() {
        return (
            <div>
                <SwitchnAdminHeader title={this.props.title} user={this.props.user} />
                <SwitchnMainContainer user={this.props.user}>
                    {this.props.children}
                </SwitchnMainContainer>
            </div>
        )
    }
}