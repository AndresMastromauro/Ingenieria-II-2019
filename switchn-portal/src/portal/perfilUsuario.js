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



class SwitchSubastasPropVista extends React.Component {
    state = {
        subastas: []
    }

    cargarReserva = (idUsuario) => {
        SwitchnAPI.clientes.getDetailEndpoint(idUsuario).subastas_ganadas.list()
                .then(data => this.setState({subastas: data.subastas}))
                .catch(err => console.log(err));
    }

    componentDidMount() {
        this.cargarReserva(this.props.idUsuario);
    }
    render() {
        var content;
        if (this.props.isLoading) {
            content = <h2>Cargando</h2>;
        } else if (!this.state.subastas || this.state.subastas.length == 0) {
            content = <h6>No hay subastas para mostrar</h6>;
        } else {
            content = this.state.subastas.map(
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
    state = {
        reservas: []
    }

    cargarReserva = (idUsuario) => {
        SwitchnAPI.clientes.getDetailEndpoint(idUsuario).reservas.list()
                .then(data => this.setState({reservas: data.reservas}))
                .catch(err => console.log(err));
    }

    componentDidMount() {
        this.cargarReserva(this.props.idUsuario);
    }

   

    render() {
        var content;
        if (this.state.isLoading) {
            content = <h2>Cargando</h2>;
        } else if (!this.state.reservas || this.state.reservas.length == 0) {
            content = <h6>No hay reservas para mostrar</h6>;
        } else {
            content = this.state.reservas.map(
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


class SwitchPerfilUsuario extends React.Component {
    render() {
        var {cliente}= this.props;
        var content;
        if (this.props.isLoading) {
            content = <h2>Cargando</h2>;
        } else {
            content = <PerfilUsuario cliente={this.props.cliente} />
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
        }
    /*state = {
        redirect: false,
      }  
      setRedirect = () => {
        this.setState({
          redirect: true
        })*/
      }  
      renderRedirect = () => {
        if (this.state.redirect) {
          return <Redirect to={`modPerfil/${this.props.cliente.datos_personales.id}`} />
        }
      }
   

    componentWillUnmount() {
        // this.props.cleanUp();
    }

    handleSolicitar = () => {
        var {cliente} = this.props
        if (cliente){
        var solicitud = window.confirm("¿Está seguro que quiere solicitar el cambio de membresia?");
        
        if (solicitud) {
            SwitchnAPI.clientes.solicitud(`${cliente.datos_personales.id}/solicitud`)
                .then(this.handleCloseOk)
                .catch(this.handleCloseFail);
        }}else{
            alert("No user");
        }
    }

    handleCloseOk = () => {
        alert("Mambresia cambiada");
        // this.props.refreshSubastas();
    }

    handleCloseFail = () => {
        alert("Hubo un error al cambiar la membresia");
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
            return null;
        }
        let bool = this.props.cliente.solicitud;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-4"  style={flexStyle}>
                        <div className="col">
                        <div  style={{display: 'flex'}}>
                        <div>{cliente.membresia.includes('PREMIUM') ? <button  disabled={bool} className="btn btn-danger"   onClick={this.handleSolicitar}>Pasar a Estandar</button> : 
                               
                                <button  disabled={bool} className="btn btn-success " onClick={this.handleSolicitar} >Pasar a Premium</button> } </div>
                            <div>
                    
                            {this.renderRedirect()}
                            {<button className="btn btn-warning" 
                            onClick={this.setRedirect} >Modificar Datos</button> }</div>
                    </div>
                    </div> 
                    </div>
                   
                    <div className="col-8">
                        <table className="table table">
                        <thead class="thead-dark">
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
                <table class="table table-borderless table-hover table-sm table-active">
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
                                <td><SwitchSubastasPropVista idUsuario={cliente.datos_personales.id}/></td>
                                <td><SwitchSubastasPropVista idUsuario={cliente.datos_personales.id}/></td>
                                
                            </tr>
                            </tbody>
                            </table>
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
            <SwitchnPortalPage>
                <SwitchPerfilUsuario cliente= {this.state.cliente} /*subasta= {this.props.subasta} reserva= {this.props.reserva} propiedad= {this.props.propiedad}*//>
            </SwitchnPortalPage>

        )
    }
}






export { _DetalleProfile };