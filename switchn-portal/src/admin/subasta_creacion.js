import React from "react";
import $ from "jquery";

import { SwitchnAdminPage } from "./base";
import { SwitchnAdminSubastaForm } from "./forms/subastas";

class SwitchnAdminCrearSubastaPage extends React.Component {
    crearSubasta = (values) => {
        var idPropiedad = this.props.match.params.idPropiedad;
        $.ajax({
            url: `/ajax/propiedades/${idPropiedad}/subastas/`,
            data: values,
            method: "POST",
            dataType: "json"
        }).done(
            () => {
                alert("Subasta creada con éxito");
                this.handleBack();
            }
        ).fail(
            (xhr, text, err) => {
                alert("Ha ocurrido un error: " + xhr.responseText);
            }
        )
    }

    handleBack = () => {
        this.props.history.go(-1);
    }

    render() {
        return (
            <SwitchnAdminPage>
                <SwitchnAdminSubastaForm
                    handleBack={this.handleBack}
                    onSubmit={this.crearSubasta}
                    idPropiedad={this.props.match.params.idPropiedad}
                />
            </SwitchnAdminPage>
        )
    }
}

export { SwitchnAdminCrearSubastaPage };