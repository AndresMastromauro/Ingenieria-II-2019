import React from "react";
import { Button, Tabs, Tab, Card } from "react-bootstrap";
import { reduxForm } from "redux-form";
import { connect } from "react-redux";
import moment from 'moment';
import { Link } from '../common/base';
import { WeekField } from '../common/forms/select';
import { SwitchnPortalPage } from './base';
import { ListadoSubastas, ListadoReservas, ListadoHotale } from "./listadoDeSubastas"
import defaultPic from '../img/default-no-picture.png';
import { SubmitButton } from "../common/forms/inputs";
import { SwitchnAPI } from "../utils/client";




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


class DetallePropiedadSubastasEntry extends React.Component {
    render() {
        var {subasta} = this.props;
        return (
            <tr>
                <td>Semana del {moment(subasta.semana).format("L")}</td>
                <td>${subasta.precio_base}</td>
                <td>${subasta.precio_actual}</td>
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
            <div /* className="row" */>
                {/* <h2>Subastas disponibles</h2> */}
                { 
            !subastas || subastas.length === 0 ?
                <h2>No hay subastas para mostrar</h2>
                :
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
                }
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
        let {user} = this.props;
        let disabled = user.membresia !== 'PREMIUM';
        return (
            <form onSubmit={this.props.handleSubmit}>
                <Card>
                    <Card.Body>
                        <Card.Title>Reserva Directa</Card.Title>
                        <WeekField
                            disabled={disabled}
                            offsetSemanaDesde={26}
                            offsetSemanaHasta={53}
                            name="semana" />
                        <SubmitButton disabled={disabled}>Reservar</SubmitButton>
                        {disabled && <small>Solo para clientes premium</small>}
                    </Card.Body>
                </Card>
            </form>
        )
    }
}

ReservaDirectaForm = reduxForm({
    form: "reserva-directa"
})(ReservaDirectaForm);

class DetallePropiedadReservaDirecta extends React.Component {
    // TODO: Bloquear cuando user no es premium
    onSubmit = (values) => {
        const id = this.props.idPropiedad;
        SwitchnAPI.propiedades.getDetailEndpoint(id).reservaDirecta(values)
            .then(data => alert(data.detail))
            .catch(data => alert(data.detail));
    }

    render() { 
        return (<ReservaDirectaForm user={this.props.user} onSubmit={this.onSubmit} />);
    }
}

DetallePropiedadReservaDirecta = connect(
    state => {
        return {
            user: state.auth.user
        }
    }
)(DetallePropiedadReservaDirecta);

class SwitchnPortalHotsale extends React.Component {
    handleBuy = () => {
        SwitchnAPI.hotsales.getDetailEndpoint(this.props.hotsale.id)
            .comprarHotsale()
                .then(data => alert('Hotsale comprado exitosamente'))
                .catch(err => console.log(err));
    }

    render() {
        let {hotsale} = this.props;
        return (
            <>
            <tr>
                <td>{moment(hotsale.semana).format('L')}</td>
                <td>{hotsale.precio ? '$'.concat(hotsale.precio) : '-'}</td>
                <td> 
                    <Button variant='success' onClick={this.handleBuy}>Comprar</Button>
                </td>
            </tr>
            </>
        )
    }
}

const TablaHotsales = (props) => {
    return (
        <>
        <table className="table">
            <thead className="thead-dark">
                <tr>
                    <th scope="col">{"Semana"}</th>
                    <th scope="col">{"Precio"}</th>
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

class SwitchnPortalPropiedadHotsales extends React.Component {
    state = {
        hotsales: []
    }

    cargarHotsales = (idPropiedad) => {
        SwitchnAPI.propiedades.getDetailEndpoint(idPropiedad)
            .hotsales.list()
                .then(data => this.setState({hotsales: data.hotsales.filter(h => h.es_activo)}))
                .catch(err => console.log(err));
    }

    componentDidMount() {
        this.cargarHotsales(this.props.propiedad.id);
    }

    render() {
        if (!this.props.propiedad) {
            return null;
        }
        return (
            <div className="container" style={{margin: "4pt", padding: "4pt"}}>
            { !this.state.hotsales || this.state.hotsales.length == 0 ?
                <div>
                    <h4>No hay hotsales para mostrar</h4>
                </div>
                : 
                <div className="row">
                    <TablaHotsales>
                        {this.state.hotsales.map(
                            function(hotsale) {
                                return(
                                    <SwitchnPortalHotsale
                                        key={hotsale.id}
                                        hotsale={hotsale}
                                        refreshHotsales={() => this.cargarHotsales(this.props.propiedad.id)}
                                        history={this.props.history}
                                    />
                                )
                            }.bind(this)
                        )}
                    </TablaHotsales>
                </div>   
                }
            </div>
        )
    }
}

class DetallePropiedad extends React.Component {
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
        var {subasta} = propiedad.subastas;
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
                    <div className="col-8">
                        <Tabs defaultActiveKey='subastas'>
                            <Tab eventKey='subastas' title='Subastas'>
                                <DetallePropiedadSubastas subastas={subasta} />
                            </Tab>
                            <Tab eventKey='hotsales' title='Hotsales'>
                                <SwitchnPortalPropiedadHotsales propiedad={propiedad} />
                            </Tab>
                        </Tabs>
                    </div>
                    <div className="col-4">
                        <DetallePropiedadReservaDirecta idPropiedad={propiedad.id} />
                    </div>
                </div>
            </div>
        );
    }
}



class SwitchnDetallePropiedad extends React.Component {  
    state = {
        propiedad: null
    }

    componentDidMount() {
        const id = this.props.match.params.idPropiedad;
        SwitchnAPI.propiedades.retrieve(id, {"include[]": "subastas."})
            .then(data => { this.setState({propiedad: data.propiedad})})
            .catch(err => { console.log(err) });
    }

    render() {
        let {propiedad} = this.state;
        return (
            <SwitchnPortalPage title={propiedad && propiedad.titulo}>
                <DetallePropiedad propiedad={propiedad}/>
            </SwitchnPortalPage>

        )
    }
}

export { SwitchnDetallePropiedad , ListadoHotale, ListadoReservas, ListadoSubastas };