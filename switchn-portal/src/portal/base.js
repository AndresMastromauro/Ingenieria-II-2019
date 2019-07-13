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
import defaultPic from "../img/default-no-picture.png";
import { Link } from "../common/base";

class SwitchnPortalNavbarTabs extends React.Component {
    render() {
        return (
            <SwitchnNavbarTabs>
                <SwitchnNavbarLink url={'/'}>Home</SwitchnNavbarLink>
                {/* <SwitchnNavbarLink url={'/subastas'}>Subastas</SwitchnNavbarLink> */}
            </SwitchnNavbarTabs>
        );
    }
}

class SwitchnPortalNavbarUserActions extends React.Component {
    render() {
        if (this.props.user) {
            return (
                <div className="navbar-nav">

                    <SwitchnNavbarLink usuario={this.props.user} url={this.props.user.url ? this.props.user.url : `/profile/${this.props.user.id}`}>
                        Logueado como <u>{this.props.user.nombre}</u>
                    </SwitchnNavbarLink>
                    {
                        this.props.user.is_admin &&
                            <SwitchnNavbarLink url={"/admin"}>Administrar</SwitchnNavbarLink>
                    }
                    <SwitchnNavbarLink url={"/logout"}>Logout</SwitchnNavbarLink>
                </div>
            );
        } else {
            return (
                <div className="navbar-nav">
                    <SwitchnNavbarLink url={"/login"}>Login</SwitchnNavbarLink>
                    <SwitchnNavbarLink url={"/registrar"}>Register</SwitchnNavbarLink>
                </div>
            )
        }
    }
}

SwitchnPortalNavbarUserActions = connect(
    (state) => {
        return {
            user: state.auth.user
        }
    }
)(SwitchnPortalNavbarUserActions);


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
            <article className={"media content-section container-fluid"}>
                <div className={"media-body row"}>
                    <div className="col-sm-4">
                        <img className="account-img" src={propiedad.image || defaultPic } />
                    </div>
                    <div className="col-sm-8">
                        <h2><a className="article-title" >{propiedad.titulo}</a></h2>
                        {/*  <!-- {% url 'app-detail_auction' pk=post.pk %} --> */}
                        <p><small>{this.getDireccion()}</small></p>
                        <p className="article-content">{propiedad.descripcion}</p>
                        <Link url={`/detaPropiedad/${this.props.propiedad.id}`}>Ver Detalle</Link>
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

