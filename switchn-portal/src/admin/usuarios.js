import React from "react";
import { connect } from "react-redux";

import { Link } from "../common/base";
import { SwitchnAdminPage } from './base';
import { loadData, cleanData } from "../redux/dataprovider/actions";
import { Button, ButtonGroup, Badge } from "react-bootstrap";
import { SwitchnAPI } from "../utils/client";

class SwitchnAdminCliente extends React.Component {
    state = {
        busy: false
    }

    handleView = () => {
        alert("O.o");
        // this.props.history.push(`/admin/propiedad/${this.props.propiedad.id}`);
    }

    cartelito = (data) => {
        this.setState({busy: false})
        alert(data.detail);
        this.props.refresh();
    }

    aceptarSolicitud = () => {
        const continuar = window.confirm('Va a aceptar esta solicitud. ¿Está seguro?');
        if (continuar) {
            const idCliente = this.props.cliente.datos_personales.id;
            this.setState({busy: true});
            SwitchnAPI.clientes.getDetailEndpoint(idCliente).aceptarSolicitud()
                .then(this.cartelito)
                .catch(this.cartelito);
        }
    }

    rechazarSolicitud = () => {
        const continuar = window.confirm('Va a rechazar esta solicitud. ¿Está seguro?');
        if (continuar) {
            const idCliente = this.props.cliente.datos_personales.id;
            this.setState({busy: true});
            SwitchnAPI.clientes.getDetailEndpoint(idCliente).rechazarSolicitud()
                .then(this.cartelito)
                .catch(this.cartelito);
        }
    }

    render() {
        var cliente = this.props.cliente;
        if (!cliente) return null;
        let {busy} = this.state;
        return (
            <tr>
                <th scope='row'>{cliente.datos_personales.apellido}</th>
                <td>{cliente.datos_personales.nombre}</td>
                <td>{cliente.datos_personales.email}</td>
                <td>
                    <Badge variant={cliente.membresia == 'PREMIUM' ? 'success' : 'danger'}>
                        {cliente.membresia}
                    </Badge>
                </td>
                <td>
                    {
                        (cliente.solicitud) ?
                            <ButtonGroup small>
                                <Button variant="primary" disabled={busy} size='sm' onClick={!busy ? this.aceptarSolicitud : null}>Aceptar</Button>
                                <Button variant="outline-primary" disabled={busy} size='sm' onClick={!busy ? this.rechazarSolicitud : null}>Denegar</Button>
                            </ButtonGroup>
                            : <Badge variant='success'>No</Badge>
                    }
                    
                </td>
                {/* <td>
                    <ButtonGroup>
                        <Button disabled={true} onClick={this.handleView}>Ver</Button>
                    </ButtonGroup>
                </td> */}
            </tr>
        );
    }
}

const TablaClientes = (props) => {
    return (
        <>
        <table className="table">
            <thead className="thead-dark">
                <tr>
                    <th scope="col">{"Apellido"}</th>
                    <th scope="col">{"Nombre"}</th>
                    <th scope="col">{"E-mail"}</th>
                    <th scope="col">{"Tipo Membresía"}</th>
                    <th scope="col">{"Solicitud de cambio"}</th>
                    {/* <th scope="col">{"Acciones"}</th> */}
                </tr>
            </thead>
            <tbody>
                {props.children}
            </tbody>
        </table>
        </>
    )
}

class SwitchnAdminListadoUsuarios extends React.Component {
    state = {
        clientes: []
    }

    cargarClientes = () => {
        SwitchnAPI.clientes.list()
            .then(data => {
                this.setState({
                    clientes: data.clientes
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
        let {clientes} = this.state;
        return (
            <div>
                <div className="row justify-content-right">
                    <div className="col-4">
                        <Link url={"/admin"}>Volver</Link>
                    </div>
                </div>
                {!clientes ?
                    <h4>No hay clientes para mostrar</h4>
                    :
                    <div className="row">
                        <TablaClientes>
                            {
                            clientes.map(
                                function(cliente) {
                                    return (
                                        <SwitchnAdminCliente
                                            key={cliente.id}
                                            cliente={cliente}
                                            history={this.props.history}
                                            refresh={this.cargarClientes}
                                        />
                                    );
                                }.bind(this)
                            )
                            }
                        </TablaClientes>
                    </div>
                }
            </div>
        )
    }
}

SwitchnAdminListadoUsuarios = connect(
    state => {
        var usuarios = state.dataprovider.datamap.usuarios;
        return {
            usuarios: usuarios && usuarios.data,
            isLoading: usuarios && usuarios.isLoading
        }
    },
    dispatch => {
        return {
            loadUsuarios: () => dispatch(loadData("usuarios", "/ajax/profile")),
            cleanUp: () => dispatch(cleanData("usuarios"))
        }
    }
)(SwitchnAdminListadoUsuarios);

class SwitchnAdminUsuariosPage extends React.Component {
    render() {
        return (
            <SwitchnAdminPage>
                <SwitchnAdminListadoUsuarios />
            </SwitchnAdminPage>
        )
    }
}

export { SwitchnAdminUsuariosPage };