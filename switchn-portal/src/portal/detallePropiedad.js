import React from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import $ from "jquery";
// import { loadData, cleanData } from "../redux/dataprovider/actions";
import { loadPropiedad, loadSubastaProp, loadReservasProp } from "../redux/propiedad/actions";
import { Link } from '../common/base';
import { SwitchnPortalPage } from './base';
import { Row, Col } from "react-bootstrap";
import {ListadoSubastas, ListadoReservas} from "./listadoDeSubastas"

class SwitchSubastasPropVista extends React.Component {
    render() {
        var content;
        if (this.props.isLoading) {
            content = <h2>Cargando</h2>;
        } else if (!this.props.subasta || this.props.subasta.length == 0) {
            content = <h6>No hay subastas para mostrar</h6>;
        } else {
            content = this.props.subasta.map(
                function(subasta) {
                    return <ListadoSubastas key={subasta.id} subasta={subasta} />
                }
            );
        }
        return (
            <div className="col-sm-8">
                {content}
            </div>
        )
    }
}

class SwitchReservasPropVista extends React.Component {
    render() {
        var content;
        if (this.props.isLoading) {
            content = <h2>Cargando</h2>;
        } else if (!this.props.reserva || this.props.reserva.length == 0) {
            content = <h6>No hay reservas para mostrar</h6>;
        } else {
            content = this.props.reserva.map(
                function(reserva) {
                    return <ListadoReservas key={reserva.id} reserva={reserva} />
                }
            );
        }
        return (
            <div className="col-sm-8">
                {content}
            </div>
        )
    }
}


class DetallePropiedad extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false
        }
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
        var {subasta} = this.props;
        var {reserva} = this.props;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-4">
                        <img src={propiedad.image || `${process.env.REACT_APP_PUBLIC_URL}/default-no-picture.png` } style={{width: "100%"}} />
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
                            </tfoot>
                        </table>
                        <table class="table table-borderless table-hover table-sm table-active">
                            <thead>
                            <tr>
                                <th scope="col">Reservas Disponibles:</th>
                                <th scope="col">Subastas Disponibles:</th>   
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td> <SwitchReservasPropVista reserva={reserva}/> </td>
                                <td><SwitchSubastasPropVista subasta={subasta}/></td>
                            </tr>
                            </tbody>
                            </table>
                    </div>
                </div>
            </div>
        );
    }
}

DetallePropiedad = connect(
    state => {
        return {
            propiedad: state.propiedad.data,
            subasta: state.subasta.data,
            reserva: state.reserva.data,
        }
    }
)(DetallePropiedad);

class _DetallePropiedad extends React.Component {
    
    
    componentDidMount() {
        var idPropiedad = this.props.match.params.idPropiedad;
        
        if (idPropiedad)
            this.props.loadPropiedad(idPropiedad);
            this.props.loadSubastaProp(idPropiedad);
            this.props.loadReservasProp(idPropiedad)
                        
    }

        
    
    componentWillUnmount() {
        // this.props.cleanUp();
    }

    render() {
        return (
            <SwitchnPortalPage>
                <DetallePropiedad subasta= {this.props.subasta} reserva= {this.props.reserva} propiedad= {this.props.propiedad}/>
            </SwitchnPortalPage>

        )
    }
}

let SwitchnDetallePropiedad = connect(
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
            loadSubastaProp: (id) => dispatch(loadSubastaProp('subasta',id)),
            loadReservasProp: (id) => dispatch(loadReservasProp('reserva',id))
            /* cleanUp: () => dispatch(cleanData("propiedad")) */
        }
    }
)(_DetallePropiedad);

export { SwitchnDetallePropiedad };