import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { ModPerfil } from "../common/forms/modificarPerfil";
import { SwitchnPortalPage } from "./base";
// import { signUp } from "../redux/auth/actions";
import { Row, Col, Jumbotron } from "react-bootstrap";
import { SwitchnAPI } from '../utils/client';

class _SwitchnModificarPerfil extends React.Component {
        state = {
            cliente: null,
            id: null,
        }
    
        
    componentDidMount() {
       // debugger
        SwitchnAPI.clientes.retrieve(this.props.match.params.idProfile)
            .then(data => this.setState({cliente: data.cliente}))
            .catch(data => console.log(data));
    }

    modificarPerfil(values) {
        values = Object.assign(values);
        values.nombre = values.datos_personales.nombre;
        values.apellido = values.datos_personales.apellido;
        values.fecha_nacimiento = values.datos_personales.fecha_nacimiento;
        delete values['datos_personales'];
        SwitchnAPI.clientes.update(this.state.cliente.datos_personales.id, values)
            .then(this.handleModificarOk)
            .catch(this.handleModificarFail);
    }
    handleModificarOk = (data) => {
        alert("Se realizó correctamente la modificación");
        this.handleBack();
    }

    handleModificarFail = (err) => {
        alert("Ha ocurrido un error al modificar la perfil");
    }

    handleBack = () => {
        this.props.history.go(-1);
    }

    render() {
        
        return (
            <SwitchnPortalPage>
                <div className="justify-content-center">
               
                <Row>
                    <Col></Col>
                    <Col>
                        <ModPerfil onSubmit={this.modificarPerfil.bind(this)} initialValues={this.state.cliente}   onBackPress={this.handleBack}/>
                        
                    </Col>
                    <Col></Col>
                </Row>   
                   
                </div>
            </SwitchnPortalPage>
        )
    }
}


let SwitchnModificarPerfil = _SwitchnModificarPerfil;

export { SwitchnModificarPerfil }
