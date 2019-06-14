import React from "react";
import { connect } from "react-redux";
import $ from "jquery";

import { SwitchnAdminPage } from "./base";
import { SwitchnAdminPropiedadForm } from "./forms/propiedades";

class _SwitchnAdminCrearPropiedadPage extends React.Component {

    crearPropiedad = (values) => {
        $.ajax({
            url: "/ajax/propiedades/",
            data: values,
            dataType: "json",
            method: "POST",
            beforeSend: xhr => { xhr.setRequestHeader("Authorization", `Token ${this.props.token}`)}
        }).done(
            data => alert(data)
        ).fail(
            (xhr, text, err) => alert(err.toString())
        );
    }

    render() {
        return (
            <SwitchnAdminPage>
                <SwitchnAdminPropiedadForm onSubmit={this.crearPropiedad} />
            </SwitchnAdminPage>
        )
    }
}
    
let SwitchnAdminCrearPropiedadPage = connect(
    state => {
        return {
            authtoken: state.auth.token
        }
    }
)(_SwitchnAdminCrearPropiedadPage);

export { SwitchnAdminCrearPropiedadPage };