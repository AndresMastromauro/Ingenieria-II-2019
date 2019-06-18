import React from "react";
import { connect } from "react-redux";

import { Link } from "../common/base";
import { SwitchnAdminPage } from './base';
import { loadData, cleanData } from "../redux/dataprovider/actions";
import { Button, ButtonGroup, Badge } from "react-bootstrap";

class SwitchnAdminUsuario extends React.Component {

    handleView = () => {
        alert("O.o");
        // this.props.history.push(`/admin/propiedad/${this.props.propiedad.id}`);
    }

    render() {
        var usuario = this.props.usuario;
        if (!usuario) return null;
        return (
            <tr>
                <td>{usuario.user.first_name}</td>
                <td>{usuario.user.last_name}</td>
                <td>{usuario.user.email}</td>
                <td>{usuario.membresia.tipo}</td>
                <td><Badge>{
                    (usuario.solicitud) ?
                        "Pendiente"
                        : "No"   
                }</Badge></td>
                <td>
                    <ButtonGroup>
                        <Button disabled={true} onClick={this.handleView}>Ver</Button>
                    </ButtonGroup>
                </td>
            </tr>
        );
    }
}

class SwitchnAdminListadoUsuarios extends React.Component {

    componentDidMount() {
        this.props.loadUsuarios();
    }

    componentWillUnmount() {
        this.props.cleanUp();
    }

    render() {
        var content;
        if (this.props.isLoading) {
            content = <tr><td>Cargando...</td></tr>;
        } else if (!this.props.usuarios || this.props.usuarios.length == 0) {
            content = <tr><td>No hay usuarios para mostrar</td></tr>;
        } else {
            content = this.props.usuarios.map(
                function(usuario) {
                    return <SwitchnAdminUsuario key={usuario.id} usuario={usuario} history={this.props.history} />;
                }.bind(this)
            );
        }
        return (
            <div>
                <div className="row justify-content-right">
                    <div className="col-4">
                        <Link url={"/admin"}>Volver</Link>
                        {/* {" | "}
                        <Link url={
                            window.location.pathname.endsWith('/') ?
                            "crear"
                            : "propiedades/crear"
                        }>Agregar Propiedad</Link> */}
                    </div>
                </div>
                <div className="row">
                    <table className="table">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">{"Nombre"}</th>
                                <th scope="col">{"Apellido"}</th>
                                <th scope="col">{"E-mail"}</th>
                                <th scope="col">{"Tipo Membresía"}</th>
                                <th scope="col">{"Solicitud de cambio"}</th>
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