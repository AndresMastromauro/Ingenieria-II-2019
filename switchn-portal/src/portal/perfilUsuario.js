import React from "react";
import { Redirect } from 'react-router-dom'
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import $ from "jquery";
// import { loadData, cleanData } from "../redux/dataprovider/actions";
import { loadPropiedad, loadSubastaProp, loadReservasProp } from "../redux/propiedad/actions";
import { Link } from '../common/base';
import { SwitchnPortalPage } from './base';
import { SwitchnAPI } from "../utils/client";
import { ListadoHotale, ListadoReservas, ListadoSubastas} from "./detallePropiedad";
import { Tabs, Tab, Table } from "react-bootstrap";



class TablaSubastas extends React.Component {
    state = {
        subastas: []
    }

    cargarSubastas = (idUsuario) => {
        if (this.props.ganadas) {
            SwitchnAPI.clientes.getDetailEndpoint(idUsuario).subastas_ganadas.list()
                .then(data => this.setState({subastas: data.subastas}))
                .catch(err => console.log(err));
        } else {
            const params = {
                'include[]': 'ofertas.',
            };
            SwitchnAPI.clientes.getDetailEndpoint(idUsuario).subastas_ofertadas.list(params)
                .then(data => {
                    var {subastas} = data;
                    subastas.forEach(subasta => {
                        subasta.mejor_oferta_user = subasta.ofertas
                            .filter(o => o.cliente == idUsuario)
                                .reduce((max, o) => o.monto > max.monto ? o : max);
                    });
                    this.setState({
                        subastas
                    });
                })
                .catch(err => console.log(err));
        }
    }

    componentDidMount() {
        this.cargarSubastas(this.props.idUsuario);
    }

    render() {
        if (!this.state.subastas || this.state.subastas.length == 0) {
            return <div><h6>No hay subastas para mostrar</h6></div>
        }
        let {ganadas} = this.props;
        return (
            <Table borderless>
                <thead className="thead-dark">
                    <tr>
                        <th scope='col'>Semana</th>
                        <th scope='col'>Propiedad</th>
                        <th scope='col'>Precio Base</th>
                        <th scope='col'>
                        {
                        ganadas ?
                            'Precio Final'
                            : 'Tu mejor oferta'
                        }
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                    this.state.subastas.map(
                        function(subasta) {
                            return <ListadoSubastas ganada={ganadas} key={subasta.id} subasta={subasta} />
                        })
                    }
                </tbody>
            </Table>
        )
    }
}

class SwitchReservasPropVista extends React.Component {
    state = {
        reservas: []
    }

    cargarReservas = (idUsuario) => {
        const params = {
            'include[]': 'propiedad.',
        };
        SwitchnAPI.clientes.getDetailEndpoint(idUsuario).reservas.list(params)
                .then(data => this.setState({reservas: data.reservas}))
                .catch(err => console.log(err));
    }

    componentDidMount() {
        this.cargarReservas(this.props.idUsuario);
    }

    render() {
        if (!this.state.reservas || this.state.reservas.length == 0) {
            return <div><h6>No hay reservas para mostrar</h6></div>;
        }
        return (
            <Table borderless>
                <thead className="thead-dark">
                    <tr>
                        <th scope='col'>Semana</th>
                        <th scope='col'>Propiedad</th>
                        <th scope='col'></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.reservas.map(
                        function(reserva) {
                            return <ListadoReservas key={reserva.id} reserva={reserva} />
                        }
                    )}
                </tbody>
            </Table>
        )
    }
}


class SwitchPerfilUsuario extends React.Component {
    render() {
        var {cliente}= this.props;
        var content;
        if (this.props.isLoading) {
            content = <h2>Cargando</h2>;
        } else {
            content = <PerfilUsuario cliente={cliente} />
        }

        return (
            <div className="col">
                
                {content}
            </div>
        )
    }
}

class PerfilUsuario extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            disabled: true
        }}
    /*state = {
        redirect: false,
      }  */
    

    setRedirect = () => {
        this.setState({
            redirect: true
        });
    }  

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to={`modPerfil/${this.props.cliente.datos_personales.id}`} />
        }
    }

    handleSolicitar = () => {
        var {cliente} = this.props
        if (cliente){
        var solicitud = window.confirm("¿Está seguro que quiere solicitar el cambio de membresia?");
        
        if (solicitud) {
            SwitchnAPI.clientes.getDetailEndpoint(cliente.datos_personales.id)
                .hacerSolicitud()
                    .then(this.handleCloseOk)
                    .catch(this.handleCloseFail);
        }}else{
            alert("No user");
        }
    }

    handleCloseOk = () => {
        alert("Solicitud realizada. Uno de nuestros agentes la resolverá a la brevedad.");
    }

    handleCloseFail = () => {
        alert("Hubo un error al generar la solicitud");
    }

    render() {
        let flexStyle={
          display: 'flex',
          flexWrap: 'no-wrap',
          flexDirection: 'column',
          alignContent: 'center',
          justifyContent: 'center',
          
          
        }
        var {cliente} = this.props;
        if (!cliente) {
            return <div>.</div>;
        }
        let bool = cliente.solicitud;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-4"  style={flexStyle}>
                        <div className="col">
                            <div  style={{display: 'flex'}}>
                                <div>
                                {cliente.membresia.includes('PREMIUM') ?
                                    <button  disabled={bool} className="btn btn-danger" onClick={this.handleSolicitar}>Pasar a Estandar</button>
                                    : <button  disabled={bool} className="btn btn-success " onClick={this.handleSolicitar}>Pasar a Premium</button>
                                }
                                </div>
                            <div>
                    
                            {this.renderRedirect()}
                            {<button className="btn btn-warning" 
                                onClick={this.setRedirect} >Modificar Datos</button> }
                        </div>
                    </div>
                </div> 
            </div>   
            <div className="col-8">
                <table className="table table">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Datos de Usuario</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                        <tbody>
                            <tr>
                                <th scope="row">Nombre de usuario:</th>
                                <td>{cliente.datos_personales.email}</td>
                            </tr>
                            <tr>
                                <th scope="row">Apellido:</th>
                                <td>{cliente.datos_personales.apellido}</td>
                            </tr>
                            <tr>
                                <th scope="row">Nombre:</th>
                                <td>{cliente.datos_personales.nombre}</td>
                            </tr>
                            <tr>
                                <th scope="row">Tarjeta de credito:</th>
                                <td>{cliente.tarjeta_credito}</td>
                            </tr>
                            <tr>
                                <th scope="row">Fecha de nacimiento:</th>
                                <td>{cliente.datos_personales.fecha_nacimiento}</td>
                            </tr>
                            <tr>
                                <th scope="row">Membresia:</th>
                                <td>{cliente.membresia}</td>
                            </tr>
                            <tr>
                                <th scope="row">Creditos:</th>
                                <td>{cliente.creditos}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            
                        </tfoot>
                    </table>     
                </div>
            </div>
            <Tabs defaultActiveKey='reservas'>
                <Tab eventKey='reservas' title='Reservas Adjudicadas'>
                    <SwitchReservasPropVista idUsuario={cliente.datos_personales.id} />
                </Tab>
                <Tab eventKey='subastas_ganadas' title='Subastas Ganadas'>
                    <TablaSubastas ganadas idUsuario={cliente.datos_personales.id} />
                </Tab>
                <Tab eventKey='subastas_ofertadas' title='Subastas Ofertadas'>
                    <TablaSubastas idUsuario={cliente.datos_personales.id}/>
                </Tab>
            </Tabs>
            {/* <table class="table table-borderless table-hover table-sm table-active">
                <thead class="thead-dark">
                <tr>
                    <th scope="col">Reservas Directas:</th>
                    <th scope="col">Subastas Ganadas:</th>
                    <th scope="col">Subastas Ofertadas:</th>   
                </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><SwitchReservasPropVista idUsuario={cliente.datos_personales.id}/> </td>
                        <td><TablaSubastas idUsuario={cliente.datos_personales.id}/></td>
                        <td><TablaSubastas idUsuario={cliente.datos_personales.id}/></td>   
                    </tr>
                </tbody>
            </table> */}
        </div>
        );
    }
}

/*PerfilUsuario = connect(
    state => {
        return {
            profile: state.profile.data,
            subasta: state.subasta.data,
            reserva: state.reserva.data,
        }
    }
)(PerfilUsuario);*/

class _DetalleProfile extends React.Component {
    state = {
        cliente: null
    }

    cargarClientes = () => {
        const id = this.props.match.params.idProfile;
        SwitchnAPI.clientes.retrieve(id)
            .then(data => {
                this.setState({
                    cliente: data.cliente
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

        
    componentDidMount() {
        this.cargarClientes();
    }  

  
    render() {
        return (
            <SwitchnPortalPage title='Información Personal'>
                <SwitchPerfilUsuario cliente= {this.state.cliente} /*subasta= {this.props.subasta} reserva= {this.props.reserva} propiedad= {this.props.propiedad}*//>
            </SwitchnPortalPage>

        )
    }
}






export { _DetalleProfile };