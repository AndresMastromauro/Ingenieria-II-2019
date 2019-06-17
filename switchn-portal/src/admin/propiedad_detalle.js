import React from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import $ from "jquery";

// import { loadData, cleanData } from "../redux/dataprovider/actions";
import { loadPropiedad } from "../redux/propiedad/actions";
import { loadData, cleanData } from "../redux/dataprovider/actions";
import { SwitchnAdminPage } from "./base";
import { SwitchnAdminPropiedadForm } from "./forms/propiedades";

import { Link } from '../common/base';
import { TextField } from "../common/forms/inputs";
import defaultPic from "../img/default-no-picture.png";
import { Button, ButtonGroup } from "react-bootstrap";

import { eliminarPropiedad } from "../redux/propiedad/actions";

class SwitchnAdminDetallePropiedad extends React.Component {

    handleDelete = () => {
        var eliminar = window.confirm("La propiedad no se eliminará si tiene reservas en curso. ¿Continuar?");
        if (eliminar) {
            this.props.eliminarPropiedad(this.props.propiedad.id, this.handleDeleteOk, this.handleDeleteFail);
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

SwitchnAdminDetallePropiedad = connect(
    state => {
        return {
            propiedad: state.propiedad.data
        }
    },
    dispatch => {
        return {
            eliminarPropiedad: (id, fnSucc, fnErr) => dispatch(eliminarPropiedad(id, fnSucc, fnErr))
        }
    }
)(SwitchnAdminDetallePropiedad);

class SwitchnAdminSubasta extends React.Component {
    handleClose = () => {
        alert("No hago nada, jeje");
    }

    render() {
        var subasta = this.props.subasta;
        return (
            <tr>
                <td>{subasta.fecha_inicio}</td>
                <td>{subasta.fecha_fin || "-"}</td>
                <td>{`Semana del ${subasta.reserva.semana}`}</td>
                {/* <td>
                    <Badge>
                    {
                    subasta.es_activa ? 
                        "Activa"
                        : "Inactiva"
                    }
                    </Badge>
                </td> */}
                <td>{`$${subasta.precioBase}`}</td>
                <td>
                {
                    subasta.best_offer ?
                        `$${subasta.best_offer.monto} (${subasta.best_offer.usuario})`
                        : "-"
                }
                </td>
                <td>
                    <ButtonGroup>
                        <Button onClick={this.handleClose}>Cerrar</Button>
                    </ButtonGroup>
                </td>
            </tr>
        );
    }
}

class SwitchnAdminPropiedadSubastas extends React.Component {
    componentDidMount() {
        if (this.props.propiedad) {
            this.props.loadSubastas(this.props.propiedad.id);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.propiedad && this.props.propiedad != prevProps.propiedad) {
            this.props.loadSubastas(this.props.propiedad.id)
        }
    }

    componentWillUnmount() {
        this.props.cleanUp();
    }

    render() {
        if (!this.props.propiedad) {
            return null;
        }
        var content;
        if (this.props.isLoading) {
            content = <tr><td>Cargando...</td></tr>;
        } else if (!this.props.subastas || this.props.subastas.length == 0) {
            content = <tr><td>No hay subastas para mostrar</td></tr>;
        } else {
            content = this.props.subastas.map(
                function(subasta) {
                    return <SwitchnAdminSubasta key={subasta.id} propiedad={subasta} history={this.props.history} />;
                }.bind(this)
            );
        }
        return (
            <div className="container" style={{margin: "4pt", padding: "4pt"}}>
                <div className="row">
                    <h2>Subastas</h2>
                </div>
                <div className="row">
                    <table className="table">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">{"Fecha de Inicio"}</th>
                                <th scope="col">{"Fecha de Fin"}</th>
                                <th scope="col">{"Precio Base"}</th>
                                <th scope="col">{"Mejor oferta"}</th>
                                <th scope="col">{"Acciones"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {content}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

SwitchnAdminPropiedadSubastas = connect(
    state => {
        var subastas = state.dataprovider.datamap.subastas;
        return {
            subastas: subastas && subastas.data,
            isLoading: subastas && subastas.isLoading
        }
    },
    dispatch => {
        return {
            loadSubastas: (idPropiedad) => dispatch(loadData("subastas", `/ajax/propiedades/${idPropiedad}/subastas`)),
            cleanUp: () => dispatch(cleanData("subastas"))
        }
    }
)(SwitchnAdminPropiedadSubastas);

class _SwitchnAdminPropiedadPage extends React.Component {
    componentDidMount() {
        var idPropiedad = this.props.match.params.idPropiedad;
        if (idPropiedad)
            this.props.loadPropiedad(idPropiedad);
    }
    
    componentWillUnmount() {
        // this.props.cleanUp();
    }

    render() {
        return (
            <SwitchnAdminPage title={this.props.propiedad && this.props.propiedad.titulo}>
                <SwitchnAdminDetallePropiedad history={this.props.history} />
                <SwitchnAdminPropiedadSubastas propiedad={this.props.propiedad} />
            </SwitchnAdminPage>
        )
    }
}

let SwitchnAdminPropiedadPage = connect(
    state => {
        var propiedad = state.propiedad;
        return {
            propiedad: propiedad.data,
            isLoading: propiedad.busy
        }
    },
    dispatch => {
        return {
            loadPropiedad: (id) => dispatch(loadPropiedad(id)),
            /* cleanUp: () => dispatch(cleanData("propiedad")) */
        }
    }
)(_SwitchnAdminPropiedadPage);

export { SwitchnAdminPropiedadPage };