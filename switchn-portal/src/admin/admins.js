import React, { Component } from "react";
import { reduxForm } from 'redux-form';
import { SwitchnAdminPage } from './base';
import { SwitchnAPI } from '../utils/client';
import { Table, ButtonGroup, Button, Modal } from "react-bootstrap";
import { TextField, EmailField, PasswordField, SubmitButton } from "../common/forms/inputs";


class FormAdmin extends Component {
    render() {
        let {props} = this;
        return (
            <form onSubmit={props.handleSubmit}>
                <TextField name='nombre' label='Nombre' />
                <TextField name='apellido' label='Apellido' />
                { !props.editing && <>
                        <EmailField name='email' label='E-mail' />
                        <PasswordField name='password' label='Contraseña' />
                        <PasswordField name='repetir-password' label='Repetir' />
                    </>
                }
                <Button type='submit'>{props.editing ? 'Guardar' : 'Crear Administrador'}</Button>
                <Button onClick={props.onHide} variant='light'>Cerrar</Button>
            </form>
        );
    }
}

FormAdmin = reduxForm({
    form: 'admin-form'
})(FormAdmin);

const FormAdminModal = (props) => (
    <Modal show={props.show} onHide={props.onHide}>
        <Modal.Header>{props.editing ? 'Edicion' : 'Nuevo administrador'}</Modal.Header>
        <Modal.Body>
            <FormAdmin
                initialValues={props.initialValues}
                onSubmit={props.onSubmit}
                onHide={props.onHide}
                editing={props.editing}
            />
        </Modal.Body>
    </Modal>
);

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
                    <Button size='sm' onClick={props.toggleActivate} variant={admin.is_active ? 'danger' : 'success'}>
                    {
                    admin.is_active ? 
                        'Desactivar'
                        : 'Activar'
                    }
                    </Button>
                    <Button size='sm' onClick={props.onEdit} variant='outline-primary'>Editar</Button>
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
                        onEdit={() => this.props.onEdit(a)}
                    />
                )
            })}
            </TablaAdmins>
        )
    }
}


class SwitchnAdminAdmins extends Component {
    state = {
        admins: [],
        showModal: false,
        editing: false,
        current: {}
    }

    handleSubmit = (adminData) => {
        if (this.state.editing) {
            SwitchnAPI.switchn_users.update(adminData.id, adminData)
                .then(() => alert('Cuenta de administrador actualizada'))
                .catch((err) => alert(`Ha ocurrido un error${err ? `: ${err.detail}` : '.'}`))
                .finally(this.cargarListado);
        } else {
            SwitchnAPI.switchn_users.create(adminData)
                .then(() => alert('Cuenta de administrador creada'))
                .catch((err) => alert(`Ha ocurrido un error${err ? `: ${err.detail}` : '.'}`))
                .finally(this.cargarListado);
        }
        this.setState({
            showModal: false,
            editing: false,
            current: {}
        });
    }

    onCloseModal = () => {
        this.setState({showModal: false});
    }

    onClickCreate = () => {
        this.setState({showModal: true})
    }

    onClickEdit = (oAdmin) => {
        this.setState({
            editing: true,
            showModal: true,
            current: oAdmin
        });
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
                    <div><Button onClick={this.onClickCreate} variant='link'>Crear Administrador</Button></div>
                {this.state.admins.length === 0 ?
                    <div><h4>No hay usuarios para mostrar</h4></div>
                    : <ListadoAdmins
                        refrescar={this.cargarListado}
                        admins={this.state.admins}
                        onEdit={this.onClickEdit}
                        />
                }
                </div>
                <FormAdminModal
                    onHide={this.onCloseModal}
                    initialValues={this.state.current}
                    onSubmit={(values) => this.handleSubmit(values)}
                    editing={this.state.editing}
                    show={this.state.showModal}
                />
            </SwitchnAdminPage>
        )
    }
}

export { SwitchnAdminAdmins };