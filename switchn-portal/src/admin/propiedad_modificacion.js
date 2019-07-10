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

    modificarPropiedad = (values) => {
        values.calle = values.direccion.calle.id;
        values.numero = values.direccion.numero ;
        values.dpto = values.direccion.dpto || '';
        values.piso = values.direccion.piso || '';
        delete values['direccion'];
        SwitchnAPI.propiedades.update(this.state.propiedad.id, values)
            .then(this.handleModificarOk)
            .catch(this.handleModificarFail);
    }

    handleModificarOk = () => {
        alert("Se realizó correctamente la modificación");
        this.handleBack();
    }

    handleModificarFail = () => {
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