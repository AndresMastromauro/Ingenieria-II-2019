import React from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import $ from "jquery";
import moment from "moment";

// import { loadData, cleanData } from "../redux/dataprovider/actions";
import { loadPropiedad } from "../redux/propiedad/actions";
import { loadData, cleanData } from "../redux/dataprovider/actions";
import { SwitchnAdminPage } from "./base";
import { SwitchnAdminPropiedadForm } from "./forms/propiedades";

import { Link } from '../common/base';
import { TextField } from "../common/forms/inputs";
import defaultPic from "../img/default-no-picture.png";
import { Button, ButtonGroup, Badge } from "react-bootstrap";

import { eliminarPropiedad } from "../redux/propiedad/actions";
import { SwitchnAPI } from "../utils/client";

class SwitchnAdminDetallePropiedad extends React.Component {
    handleDelete = () => {
        var eliminar = window.confirm("La propiedad no se eliminará si tiene reservas en curso. ¿Continuar?");
        if (eliminar) {
            SwitchnAPI.propiedades.destroy(this.props.propiedad.id)
                .then(this.handleDeleteOk)
                .catch(this.handleDeleteFail);
        }
    }
    
    handleDeleteOk = () => {
        alert("Se ha dado de baja la propiedad. Si tiene reservas en curso seguirá viéndose como 'Inactiva'");
        this.props.history.replace('/admin/propiedades');
    }

    handleDeleteFail = () => {
        alert("Ha ocurrido un error al eliminar la propiedad.");
    }

    handleEdit = () => {
        this.props.history.push(`${this.props.propiedad.id}/editar`);
    }

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
        var {propiedad} = this.props;
        if (!propiedad) {
            return null;
        }
        return (
            <div className="container" style={{margin: "4pt", padding: "4pt"}}>
                <div className="row">
                    <Link url={"/admin/propiedades"}>Volver</Link>
                </div>
                <div className="row">
                    <h2>Información General</h2>
                </div>
                <div className="row">
                    <div className="col-4">
                        <img src={propiedad.image || defaultPic } style={{width: "100%"}} />
                    </div>
                    <div className="col-8">
                        <table className="table table-stripped">
                            <tbody>
                                <tr>
                                    <th scope="row">Titulo:</th>
                                    <td>{propiedad.titulo}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Descripción:</th>
                                    <td>{propiedad.descripcion}</td>
                                </tr>
                                {/* <tr>
                                    <th scope="row">Tipo:</th>
                                    <td>{propiedad.tipo.descripcion}</td>
                                </tr> */}
                                <tr>
                                    <th scope="row">Direccion:</th>
                                    <td>{this.getDireccion()}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th scope="row">Acciones</th>
                                    <td>
                                        <a href={"javascript:void(0)"} onClick={this.handleEdit}>Editar</a>
                                        {" | "}
                                        <a href={"javascript:void(0)"} onClick={this.handleDelete}>Eliminar</a>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

class SwitchnAdminSubasta extends React.Component {
    handleClose = () => {
        var cerrar = window.confirm("¿Está seguro de cerrar la subasta?");
        if (cerrar) {
            SwitchnAPI.subastas.destroy(this.props.subasta.id)
                .then(this.handleCloseOk)
                .catch(this.handleCloseFail);
        }
    }

    handleCloseOk = () => {
        alert("Subasta cerrada con éxito");
        // this.props.refreshSubastas();
    }

    handleCloseFail = () => {
        alert("Hubo un error al cerrar la subasta");
    }

    render() {
        function formatFecha(fecha) {
            return moment(fecha).format("L");
        }
        var subasta = this.props.subasta;
        if (!subasta) return null;
        return (
            <tr>
                <td>{formatFecha(subasta.fecha_inicio)}</td>
                <td>{ (subasta.fecha_fin && formatFecha(subasta.fecha_fin)) || "-"}</td>
                <td>{`Semana del ${formatFecha(subasta.semana)}`}</td>
                <td>
                    <Badge>
                    {
                    subasta.es_activa ? 
                        "Abierta"
                        : "Cerrada"
                    }
                    </Badge>
                </td>
                <td>{`$${subasta.precio_base}`}</td>
                <td>
                {
                    subasta.precio_actual ?
                        `$${subasta.precio_actual}`
                        : "-"
                }
                </td>
                <td>
                {
                    subasta.ganador ? 
                        `${subasta.ganador.apellido.toUpperCase()}, ${subasta.ganador.nombre}`
                        : "-"
                }
                </td>
                <td>
                    <ButtonGroup>
                        { subasta.es_activa ? 
                            <Button onClick={this.handleClose}>Cerrar</Button>
                            : null
                        }
                    </ButtonGroup>
                </td>
            </tr>
        );
    }
}

const TablaSubastas = (props) => {
    return (
        <>
            <table className="table">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">{"Fecha de Inicio"}</th>
                        <th scope="col">{"Fecha de Fin"}</th>
                        <th scope="col">{"Semana"}</th>
                        <th scope="col">{"Estado"}</th>
                        <th scope="col">{"Precio Base"}</th>
                        <th scope="col">{"Mejor oferta"}</th>
                        <th scope="col">{"Ganador"}</th>
                        <th scope="col">{"Acciones"}</th>
                    </tr>
                </thead>
                <tbody>
                    {props.children}
                </tbody>
            </table>
        </>
    )
}

class SwitchnAdminPropiedadSubastas extends React.Component {
    state = {
        subastas: []
    }

    cargarSubastas(idPropiedad) {
        SwitchnAPI.propiedades.getDetailEndpoint(idPropiedad)
            .subastas.list({'include[]': 'ganador.*'})
                .then(data => {
                    this.setState({
                        subastas: data.subastas
                    });
                })
                .catch(err => console.log(err));
    }

    componentDidMount() {
        if (this.props.propiedad) {
            this.cargarSubastas(this.props.propiedad.id)
        }
    }
    

    componentDidUpdate(prevProps) {
        if (this.props.propiedad && this.props.propiedad != prevProps.propiedad) {
            this.cargarSubastas(this.props.propiedad.id);
        }
    }

    refreshSubastas = () => {
        this.cargarSubastas(this.props.propiedad.id);
    }

    render() {
        if (!this.props.propiedad) {
            return null;
        }
        return (
            <div className="container" style={{margin: "4pt", padding: "4pt"}}>
                <div className="row">
                    <h2>Subastas</h2>
                </div>
            { !this.state.subastas || this.state.subastas.length == 0 ?
                <div>
                    <h4>No hay subastas para mostrar</h4>
                </div>
                : 
                <div className="row">
                    <Link url={`/admin/propiedad/${this.props.propiedad.id}/subastas/crear`}>Crear Subasta</Link>
                    <TablaSubastas>
                        {this.state.subastas.map(
                            function(subasta) {
                                return(
                                    <SwitchnAdminSubasta
                                        key={subasta.id}
                                        subasta={subasta}
                                        refreshSubastas={this.refreshSubastas}
                                        history={this.props.history}
                                    />
                                )
                            }.bind(this)
                        )}
                    </TablaSubastas>
                </div>   
                }
            </div>
        )
    }
}

class SwitchnAdminPropiedadPage extends React.Component {
    state = {
        propiedad: null
    }

    componentDidMount() {
        const id = this.props.match.params.idPropiedad;
        SwitchnAPI.propiedades.retrieve(id)
            .then(data => this.setState({propiedad: data.propiedad}))
            .catch(err => console.log(err));
    }

    render() {
        return (
            <SwitchnAdminPage title={this.state.propiedad && this.state.propiedad.titulo}>
                <SwitchnAdminDetallePropiedad history={this.props.history} propiedad={this.state.propiedad} />
                <SwitchnAdminPropiedadSubastas history={this.props.history} propiedad={this.state.propiedad} />
            </SwitchnAdminPage>
        )
    }
}

export { SwitchnAdminPropiedadPage };