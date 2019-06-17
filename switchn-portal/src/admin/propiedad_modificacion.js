import React from "react";
import { connect } from "react-redux";

import { SwitchnAdminPage } from "./base";
import { SwitchnAdminModificarPropiedadForm } from "./forms/propiedades";
import { modificarPropiedad } from "../redux/propiedad/actions";

/* let SwitchnAdminModificarPropiedadForm = connect(
    state => {
        return {
            initialValues: state.propiedad.data
        }
    }
)(SwitchnAdminPropiedadForm); */

class _SwitchnAdminModificarPropiedadPage extends React.Component {

    modificarPropiedad = (values) => {
        this.props.modificarPropiedad(values, this.handleModificarOk, this.handleModificarFail);
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
        return (
            <SwitchnAdminPage>
                <SwitchnAdminModificarPropiedadForm onBackPress={this.handleBack} onSubmit={this.modificarPropiedad} />
            </SwitchnAdminPage>
        )
    }
}
    
let SwitchnAdminModificarPropiedadPage = connect(
    state => {
        return {}
    },
    dispatch => {
        return {
            modificarPropiedad: (values, fnSucc, fnErr) => {
                dispatch(modificarPropiedad(values, fnSucc, fnErr))
            }
        }
    }
)(_SwitchnAdminModificarPropiedadPage);

export { SwitchnAdminModificarPropiedadPage };