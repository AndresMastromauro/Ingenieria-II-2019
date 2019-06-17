import React from "react";
import { connect } from "react-redux";
import $ from "jquery";

import { SwitchnAdminPage } from "./base";
import { SwitchnAdminCrearPropiedadForm } from "./forms/propiedades";
import { crearPropiedad } from "../redux/propiedad/actions";

class _SwitchnAdminCrearPropiedadPage extends React.Component {

    crearPropiedad = (values) => {
        this.props.crearPropiedad(values);
    }

    render() {
        return (
            <SwitchnAdminPage>
                    <SwitchnAdminCrearPropiedadForm onSubmit={this.crearPropiedad} />
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
            crearPropiedad: (values) => dispatch(crearPropiedad(values))
        }
    }
)(_SwitchnAdminCrearPropiedadPage);

export { SwitchnAdminCrearPropiedadPage };