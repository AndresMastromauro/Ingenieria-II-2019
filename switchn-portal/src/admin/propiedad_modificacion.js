import React from "react";
import { connect } from "react-redux";

import { SwitchnAdminPage } from "./base";
import { SwitchnAdminModificarPropiedadForm } from "./forms/propiedades";
import { modificarPropiedad } from "../redux/propiedad/actions";
import { SwitchnAPI } from "../utils/client";

/* let SwitchnAdminModificarPropiedadForm = connect(
    state => {
        return {
            initialValues: state.propiedad.data
        }
    }
)(SwitchnAdminPropiedadForm); */

class SwitchnAdminModificarPropiedadPage extends React.Component {
    state = {
        propiedad: null
    }

    componentDidMount() {
        const id = this.props.match.params.idPropiedad;
        SwitchnAPI.propiedades.retrieve(id)
            .then(data => this.setState({propiedad: data.propiedad}))
            .catch(data => console.log(data));
    }

    limpiarDireccion = (direccion) => {
        var camposConCambios = Object.keys(direccion).filter(
            key => {
                return direccion[key] !== this.state.propiedad.direccion[key]
            }
        );
        var camposParaEnviar = {};
        camposConCambios.forEach(
            campo => camposParaEnviar[campo] = direccion[campo]
        );
        return camposParaEnviar;
    }

    limpiarDatos = (values) => {
        var camposConCambios = Object.keys(values).filter(
            key => {
                return values[key] !== this.state.propiedad[key]
            }
        );
        var camposParaEnviar = {};
        camposConCambios.forEach(
            campo => camposParaEnviar[campo] = values[campo]
        );
        if ('direccion' in camposParaEnviar) {
            debugger;
            camposParaEnviar.direccion = this.limpiarDireccion(camposParaEnviar.direccion);
            if (Object.keys(camposParaEnviar.direccion).length == '0') {
                delete camposParaEnviar['direccion'];
            } else {
                let {direccion} = camposParaEnviar;
                if (direccion.calle) {
                    camposParaEnviar.calle = direccion.calle.id;
                }
                if (direccion.numero) {
                    camposParaEnviar.numero = direccion.numero;
                }
                if (direccion.dpto) {
                    camposParaEnviar.dpto = direccion.dpto || '';
                }
                if (direccion.piso) {
                    camposParaEnviar.piso = direccion.piso || '';
                }
            }
        }
        camposParaEnviar.id = this.state.propiedad.id;
        return camposParaEnviar;
    }

    modificarPropiedad = (values) => {
        values = this.limpiarDatos(values);
        SwitchnAPI.propiedades.update(this.state.propiedad.id, values)
            .then(this.handleModificarOk)
            .catch(this.handleModificarFail);
    }

    handleModificarOk = (data) => {
        alert("Se realizó correctamente la modificación");
        this.handleBack();
    }

    handleModificarFail = (err) => {
        alert("Ha ocurrido un error al modificar la propiedad");
    }

    handleBack = () => {
        this.props.history.go(-1);
    }

    render() {
        if (!this.state.propiedad) return null;
        return (
            <SwitchnAdminPage>
                <SwitchnAdminModificarPropiedadForm onBackPress={this.handleBack} onSubmit={this.modificarPropiedad} initialValues={this.state.propiedad} />
            </SwitchnAdminPage>
        )
    }
}


export { SwitchnAdminModificarPropiedadPage };