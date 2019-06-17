import React from "react";
import { connect } from "react-redux";
import {
    SwitchnHeader,
    SwitchnMainContainer,
    SwitchnNavbar,
    SwitchnNavbarLink,
    SwitchnNavbarTabs
} from "../common/base";
import { Button, Card} from 'react-bootstrap';

class SwitchnPortalNavbarTabs extends React.Component {
    render() {
        return (
            <SwitchnNavbarTabs>
                <SwitchnNavbarLink url={'/'}>Home</SwitchnNavbarLink>
                <SwitchnNavbarLink url={'/subastas'}>Subastas</SwitchnNavbarLink>
            </SwitchnNavbarTabs>
        );
    }
}

class _SwitchnPortalNavbarUserActions extends React.Component {
    render() {
        if (this.props.user) {
            return (
                <div className="navbar-nav">
                    <SwitchnNavbarLink url={this.props.user.url ? this.props.user.url : ''}>
                        Logueado como <u>{this.props.user.username}</u>
                    </SwitchnNavbarLink>
                    <SwitchnNavbarLink url={"/logout"}>Logout</SwitchnNavbarLink>
                </div>
            );
        } else {
            return (
                <div className="navbar-nav">
                    <SwitchnNavbarLink url={"/login"}>Login</SwitchnNavbarLink>
                    <SwitchnNavbarLink url={"/signup"}>Register</SwitchnNavbarLink>
                </div>
            )
        }
    }
}

let SwitchnPortalNavbarUserActions = connect(
    (state) => {
        return {
            user: state.auth.user
        }
    },
    (dispatch) => {return {}}
)(_SwitchnPortalNavbarUserActions);


class SwitchnPortalHeader extends React.Component {
    render() {
        return (
            <SwitchnHeader title={this.props.title}>
                <SwitchnNavbar brandURL="/">
                    <SwitchnPortalNavbarTabs />
                    <SwitchnPortalNavbarUserActions user={this.props.user} />
                </SwitchnNavbar>
            </SwitchnHeader>
        );
    }
}

export class SwitchnPortalPropiedad extends React.Component {
    getDireccion() {
        var oDireccion = this.props.propiedad.direccion;
        var sDireccion = `${oDireccion.calle.nombre} #${oDireccion.numero}`;
        if (oDireccion.piso) {
            sDireccion += `, ${oDireccion.piso}`;
            if (oDireccion.dpto) {
                sDireccion += `${oDireccion.dpto}`;
            }
        }
        sDireccion += `. ${oDireccion.localidad.nombre}, `;
        sDireccion += `${oDireccion.provincia.nombre}, ${oDireccion.pais.nombre}.`;
        return sDireccion;
    }

    render() {
        var propiedad = this.props.propiedad;
        return (
            <article className="media content-section container-fluid">
                <div className="media-body row">
                    <div className="col-sm-4">
                        <img className="account-img" src={propiedad.image.data} />
                    </div>
                    <div className="col-sm-8">
                        <h2><a className="article-title" >{propiedad.titulo}</a></h2>
                        {/*  <!-- {% url 'app-detail_auction' pk=post.pk %} --> */}
                        <p><small>{this.getDireccion()}</small></p>
                        <p className="article-content">{propiedad.descripcion}</p>
                    </div>
                </div>
            </article>
        );
    }
}


export class SwitchnPortalPage extends React.Component {
    render() {
        return (
            <div>
                <SwitchnPortalHeader title={this.props.title} />
                <SwitchnMainContainer>
                    {this.props.children}
                </SwitchnMainContainer>
            </div>
        )
    }
}

