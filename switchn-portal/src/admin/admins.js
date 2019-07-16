import React, { Component } from "react";

import { SwitchnAdminPage } from './base';
import { SwitchnAPI } from '../utils/client';
import { Table, ButtonGroup, Button } from "react-bootstrap";


const TablaAdmins = (props) => {
    return (
        <Table>
            <thead className='thead-dark'>
                <tr>
                    <th scope='col'>Apellido</th>
                    <th scope='col'>Nombre</th>
                    <th scope='col'>E-mail</th>
                    <th scope='col'>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {props.children}
            </tbody>
        </Table>
    )
}

const RowAdmin = (props) => {
    let {admin} = props;
    return (
        <tr>
            <th scope='row'>{admin.apellido}</th>
            <td>{admin.nombre}</td>
            <td>{admin.email}</td>
            <td>
                <ButtonGroup>
                    <Button onClick={props.toggleActivate} variant={admin.is_active ? 'danger' : 'success'}>
                    {
                    admin.is_active ? 
                        'Desactivar'
                        : 'Activar'
                    }
                    </Button>
                </ButtonGroup>
            </td>
        </tr>
    );
}

class ListadoAdmins extends Component {
    toggleActivate = (adminData) => {
        var is_active = !adminData.is_active;
        SwitchnAPI.switchn_users.update(adminData.id, {is_active})
            .then(data => alert(`${is_active ? 'Activado' : 'Desactivado'} exitosamente.`))
            .catch(err => alert(`Se ha producido un error: ${err.detail}`))
            .finally(this.props.refrescar)
    }
    render() {
        return (
            <TablaAdmins>
            {this.props.admins.map(a => {
                return (
                    <RowAdmin
                        key={a.id}
                        admin={a}
                        toggleActivate={() => this.toggleActivate(a)}
                    />
                )
            })}
            </TablaAdmins>
        )
    }
}


class SwitchnAdminAdmins extends Component {
    state = {
        admins: []
    }

    cargarListado = () => {
        SwitchnAPI.switchn_users.list()
            .then(data => this.setState({admins: data.switchn_users}))
            .catch(err => console.log(err));
    }

    componentDidMount() {
        this.cargarListado();
    }

    render() {
        return (
            <SwitchnAdminPage title="Administradores">
                <div className='row'>
                {this.state.admins.length === 0 ?
                    <div><h4>No hay usuarios para mostrar</h4></div>
                    : <ListadoAdmins refrescar={this.cargarListado} admins={this.state.admins} />
                }
                </div>
            </SwitchnAdminPage>
        )
    }
}

export { SwitchnAdminAdmins };