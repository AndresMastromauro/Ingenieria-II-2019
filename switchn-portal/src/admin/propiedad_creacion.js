import React from "react";
import { connect } from "react-redux";
import $ from "jquery";

import { SwitchnAdminPage } from "./base";
import { SwitchnAdminCrearPropiedadForm } from "./forms/propiedades";
import { crearPropiedad } from "../redux/propiedad/actions";
import { SwitchnAPI } from "../utils/client";

class SwitchnAdminCrearPropiedadPage extends React.Component {

    crearPropiedad = (values) => {
        values.calle = values.direccion.calle.id;
        values.numero = values.direccion.numero;
        values.piso = values.direccion.piso || '';
        values.dpto = values.direccion.dpto || '';
        delete values['direccion'];
        SwitchnAPI.propiedades.create(values)
            .then(this.handleCreacionOk)
            .catch(this.handleCreacionFail);
    }

    handleBack = () => {
        this.props.history.go(-1);
    }

    handleCreacionOk = () => {
        alert("Se creó con éxito la propiedad");
        this.handleBack();
    }

    handleCreacionFail = () => {
        alert("Ha ocurrido un error al crear la propiedad");
    }

    render() {
        return (
            <SwitchnAdminPage>
                    <SwitchnAdminCrearPropiedadForm onBackPress={this.handleBack} onSubmit={this.crearPropiedad} />
            </SwitchnAdminPage>
        )
    }
}

export { SwitchnAdminCrearPropiedadPage };