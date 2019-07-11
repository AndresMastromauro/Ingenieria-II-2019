import React from "react";
import $ from "jquery";

import { SwitchnAdminPage } from "./base";
import { SwitchnAdminSubastaForm } from "./forms/subastas";
import { SwitchnAPI } from '../utils/client';

class SwitchnAdminCrearSubastaPage extends React.Component {
    crearSubasta = (values) => {
        var idPropiedad = this.props.match.params.idPropiedad;
        values.propiedad = idPropiedad;
        SwitchnAPI.subastas.create(values)
            .then (() => {
                alert("Subasta creada con éxito");
                this.handleBack();
            }).catch(
            (err) => {
                alert("Ha ocurrido un error: " + err);
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
                />
            </SwitchnAdminPage>
        )
    }
}

export { SwitchnAdminCrearSubastaPage };