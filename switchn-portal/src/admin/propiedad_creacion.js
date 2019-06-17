import React from "react";
import { connect } from "react-redux";
import $ from "jquery";

import { SwitchnAdminPage } from "./base";
import { SwitchnAdminCrearPropiedadForm } from "./forms/propiedades";
import { crearPropiedad } from "../redux/propiedad/actions";

class _SwitchnAdminCrearPropiedadPage extends React.Component {

    crearPropiedad = (values) => {
        this.props.crearPropiedad(values, this.handleCreacionOk, this.handleCreacionFail);
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
    
let SwitchnAdminCrearPropiedadPage = connect(
    state => {
        return {}
    },
    dispatch => {
        return {
            crearPropiedad: (values, fnSucc, fnErr) => dispatch(crearPropiedad(values, fnSucc, fnErr))
        }
    }
)(_SwitchnAdminCrearPropiedadPage);

export { SwitchnAdminCrearPropiedadPage };