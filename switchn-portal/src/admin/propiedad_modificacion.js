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
        this.props.modificarPropiedad(values);
    }

    render() {
        return (
            <SwitchnAdminPage>
                    <SwitchnAdminModificarPropiedadForm onSubmit={this.modificarPropiedad} />
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
            modificarPropiedad: (values) => {
                dispatch(modificarPropiedad(values))
            }
        }
    }
)(_SwitchnAdminModificarPropiedadPage);

export { SwitchnAdminModificarPropiedadPage };