import React from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { reduxForm } from "redux-form";
import moment from 'moment';
import $ from "jquery";

// import { loadData, cleanData } from "../redux/dataprovider/actions";
import { loadPropiedad, loadSubastaProp, loadReservasProp } from "../redux/propiedad/actions";
import { Link } from '../common/base';
import { WeekField } from '../common/forms/select';
import { SwitchnPortalPage } from './base';
import { ListadoSubastas, ListadoReservas, ListadoHotale } from "./listadoDeSubastas"
import defaultPic from '../img/default-no-picture.png';
import { SubmitButton } from "../common/forms/inputs";




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

class SwitchHotsalePropVista extends React.Component {
    render() {
        var content;
        if (this.props.isLoading) {
            content = <h2>Cargando</h2>;
        } else if (!this.props.reserva || this.props.reserva.length >= 0) {
            content = <h6>No hay hotsales para mostrar</h6>;
        } else {
            content = this.props.reserva.map(
                function(reserva) {
                    return <ListadoHotale/>
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

class DetallePropiedadVentas extends React.Component {
    state = {
        component: (props) => null
    }
    handleSubastas = (e) => {
        this.setState({
            component: (props) => <DetallePropiedadSubastas subastas={this.props.subastas} />
        });
    }
    handleHotsales = (e) => {
        this.setState({
            component: (props) => null
        });
    }

    render() {
        let Component = this.state.component;
        return (
            <div>
                <div className="row">
                    <div className="col">
                        <a href="javascript:void(0)" onClick={this.handleSubastas}>Subastas</a>
                    </div>
                    <div className="col">
                        <a href="javascript:void(0)" onClick={this.handleHotsales}>Hotsales</a>
                    </div>
                </div>
                <Component />
            </div>
        )
    }
}


class DetallePropiedadSubastasEntry extends React.Component {
    render() {
        var {subasta} = this.props;
        return (
            <tr>
                <td>Semana del {moment(subasta.reserva.semana).format("L")}</td>
                <td>${subasta.precioBase}</td>
                <td>${
                    subasta.best_offer ?
                        subasta.best_offer.monto
                        : subasta.precioBase}
                </td>
                <td><Button variant="info"></Button></td>
            </tr>
        )
    }
}

class DetallePropiedadSubastas extends React.Component {
    render() {
        var content = null;
        var {subastas} = this.props;
        if (subastas) {
            content = subastas.map(
                (sub, i) => <DetallePropiedadSubastasEntry key={i} subasta={sub} />
            );
        }
        return (
            <div className="row">
                <h2>Subastas disponibles</h2>
                <table className="table table-borderless table-hover table-sm table-active">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Fecha</th>
                            <th scope="col">Precio Base</th>
                            <th scope="col">Precio Actual</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {content}
                    </tbody>
                </table>
            </div>
        )
    }
}

class DetallePropiedadHotsales extends React.Component {
    render() {
        return (
            <div className="row">
                <h2>Hotsales disponibles</h2>
                <table className="table table-borderless table-hover table-sm table-active">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Fecha</th>
                            <th scope="col">Precio</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        )
    }
}

class ReservaDirectaForm extends React.Component {
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <WeekField />
                <SubmitButton>Reservar</SubmitButton>
            </form>
        )
    }
}

ReservaDirectaForm = reduxForm({
    form: "reserva-directa"
})(ReservaDirectaForm);

class DetallePropiedadReservaDirecta extends React.Component {
    render() {
        return (
            <div>
                <h2>Reserva Directa</h2>
                <ReservaDirectaForm />
            </div>
        );
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
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <DetallePropiedadReservaDirecta />
                    </div>
                    <div className="col">
                        <DetallePropiedadSubastas subastas={subasta} />
                    </div>
                    {/* <div className="col">
                        <DetallePropiedadHotsales hotsales={hotsale} />
                    </div> */}
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
        
        if (idPropiedad) {
            this.props.loadPropiedad(idPropiedad);
            this.props.loadSubastaProp(idPropiedad);
            this.props.loadReservasProp(idPropiedad)
        }
                        
    }

        
    
    componentWillUnmount() {
        // this.props.cleanUp();
    }

    render() {
        return (
            <SwitchnPortalPage>
                <DetallePropiedad subasta={this.props.subasta} reserva={this.props.reserva} propiedad={this.props.propiedad}/>
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