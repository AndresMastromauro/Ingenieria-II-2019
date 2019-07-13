import React from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import $ from "jquery";
// import { loadData, cleanData } from "../redux/dataprovider/actions";
import { loadPropiedad, loadSubastaProp, loadReservasProp } from "../redux/propiedad/actions";
import { Link } from '../common/base';
import { SwitchnPortalPage } from './base';
import { SwitchnAPI } from "../utils/client";

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
             
    

        
    
    componentWillUnmount() {
        // this.props.cleanUp();
    }

    
    render() {
        var {cliente} = this.props;
        if (!cliente) {
            return null;
        }
        return (
            <div className="container">
                <div className="row">
                    <div className="col-4"  style={{display: "flex-row"}}>
                        <img  className="rounded-circle" src={cliente.image || `${process.env.REACT_APP_PUBLIC_URL}/default-no-picture.png` } style={{width: "50%"}} />
                        <div className="col-4" style={{display: "flex"}}>
                        <div>{ cliente.solicitud ? <button className="btn btn-danger">Pasar a Estandar</button> : 
                                <button className="btn btn-success" >Pasar a Premium</button> } </div>
                            <div>    {<button className="btn btn-warning" >Modificar Datos</button> }</div>
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
                                {/* <tr>
                                    <th scope="row">Tipo:</th>
                                    <td>{propiedad.tipo.descripcion}</td>
                                </tr> */}
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
                                <th scope="col">Subastas Adjudicadad:</th>
                                <th scope="col">Hotsales Adjudicados:</th>      
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                
                               {/*<td><SwitchReservasPropVista reserva={reserva}/> </td>
                                <td><SwitchSubastasPropVista subasta={subasta}/></td>
                            <td><SwitchHotsalePropVista/></td>*/}
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
                <SwitchPerfilUsuario cliente= {this.state.cliente} subasta= {this.props.subasta} reserva= {this.props.reserva} propiedad= {this.props.propiedad}/>
            </SwitchnPortalPage>

        )
    }
}

/*let SwitchnDetallePropiedadUser = connect(
    state => {
        var profile = state.profile;
        return {
            profile: profile.data,
            isLoading: profile.busy
        }
    },
    dispatch => {
        return {
            loadProfile: (id) => dispatch(loadProfile(id)),
            loadSubastaProp: (id) => dispatch(loadSubastaProp('subasta',id)),
            loadReservasProp: (id) => dispatch(loadReservasProp('reserva',id))
            ///cleanUp: () => dispatch(cleanData("propiedad"))
        }
    }
)(_DetalleProfile); */




export { _DetalleProfile };