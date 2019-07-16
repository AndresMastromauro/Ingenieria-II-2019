import React from "react";
import { SwitchnPortalPage } from './base';
import { SwitchnAPI } from "../utils/client";
import { ListadoHotale, ListadoReservas, ListadoSubastas} from "./detallePropiedad";
import { Tabs, Tab, Table, Button, Modal, Col, Badge } from "react-bootstrap";
import { ModPerfil } from "../common/forms/modificarPerfil";
import moment from 'moment';



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

const PagoRow = (props) => (
    <tr>
        <th scope='row'>{moment(props.pago.fecha).format('L')}</th>
        <td>{props.pago.detalle || '(no registra)'}</td>
        <td><b>${props.pago.monto}</b></td>
        <td>
            <Badge variant={props.pago.pendiente ? 'danger' : 'success'}>
                {props.pago.pendiente ? 'PENDIENTE' : 'CANCELADO'}
            </Badge>
        </td>
    </tr>
)

class TablaPagos extends React.Component {
    state = {
        pagos: []
    }

    cargarPagos = () => {
        const id = this.props.idUsuario;
        SwitchnAPI.clientes.getDetailEndpoint(id)
            .pagos.list()
                .then((data) => this.setState({pagos: data.pagos}))
                .catch((err) => alert('Algo salió mal'));
    }

    componentDidMount() {
        this.cargarPagos();
    }

    render() {
        debugger;
        return (
            <Table borderless>
                <thead className="thead-dark">
                    <tr>
                        <th scope='col'>Fecha</th>
                        <th scope='col'>Detalle</th>
                        <th scope='col'>Monto</th>
                        <th scope='col'>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    this.state.pagos.map(
                        function(pago, i) {
                            return <PagoRow key={i} pago={pago} />
                        })
                    }
                </tbody>
            </Table>
        );
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


class EditarPerfilModal extends React.Component {
    render() {
        let {props} = this;
        return (
            <Modal show={props.show} onHide={props.onHide}>
                <Modal.Header>Editar</Modal.Header>
                <Modal.Body>
                    <Col>
                        <ModPerfil onSubmit={props.onSubmit} initialValues={props.initialValues} onBackPress={props.onHide} />
                    </Col>
                </Modal.Body>
            </Modal>
        );
    }
}

class SwitchnPerfilUsuario extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            disabled: true,
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
            return null;
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
                                <Button onClick={this.props.handleEdit} variant='warning'>
                                    Modificar Datos
                                </Button>
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
                                    <td>{moment(cliente.datos_personales.fecha_nacimiento).format('D [de] MMMM [de] Y')}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Membresia:</th>
                                    <td>
                                        <Badge variant={cliente.membresia == 'PREMIUM' ? 'success' : 'danger'}>
                                        {cliente.membresia}
                                        </Badge>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Creditos:</th>
                                    <td>{cliente.creditos}</td>
                                </tr>
                            </tbody>
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
                    <Tab eventKey='pagos' title='Pagos'>
                        <TablaPagos idUsuario={cliente.datos_personales.id} />
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

class DetalleProfile extends React.Component {
    state = {
        cliente: null,
        showModal: false
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
            });
    }

    handleModificar = (values) => {
        values = Object.assign(values);
        const id = values.datos_personales.id;
        values.nombre = values.datos_personales.nombre;
        values.apellido = values.datos_personales.apellido;
        values.fecha_nacimiento = values.datos_personales.fecha_nacimiento;
        // delete values['datos_personales'];
        SwitchnAPI.clientes.update(id, values)
            .then(this.handleModificarOk)
            .catch(this.handleModificarFail)
            .finally(this.handleHideModal);
    }
    handleModificarOk = () => {
        alert("Se realizó correctamente la modificación");
        this.cargarClientes();
    }

    handleModificarFail = (err) => {
        alert("Ha ocurrido un error al modificar la perfil");
    }

    handleShowModal = () => {
        this.setState({showModal: true});
    }

    handleHideModal = () => {
        this.setState({showModal: false});
    }

        
    componentDidMount() {
        this.cargarClientes();
    }  

  
    render() {
        return (
            <SwitchnPortalPage title='Información Personal'>
                <SwitchnPerfilUsuario cliente={this.state.cliente} handleEdit={this.handleShowModal} refrescar={this.cargarClientes}/>
                <EditarPerfilModal show={this.state.showModal} onSubmit={this.handleModificar} initialValues={this.state.cliente} onHide={this.handleHideModal} />
            </SwitchnPortalPage>

        )
    }
}






export { DetalleProfile as _DetalleProfile };