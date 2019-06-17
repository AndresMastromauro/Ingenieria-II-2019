import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm, getFormValues } from "redux-form";
import { TipoPropiedadChoiceField, WeekField, PaisChoiceField, ProvinciaChoiceField, LocalidadChoiceField, CalleChoiceField } from "../../common/forms/select";
import { TextField, TextAreaField, NumberField, SubmitButton } from "../../common/forms/inputs";
import { ImagePicker } from "../../common/forms/imagepicker";

const PROPIEDAD_CREATE_FORM_NAME = "crear-propiedad";
const PROPIEDAD_UPDATE_FORM_NAME = "modificar-propiedad";

class SwitchnAdminPropiedadForm extends React.Component {

    render() {
        var direccion;

        let {handleSubmit} = this.props;
        let {values} = this.props;
        let {initialValues} = this.props;
        
        if (values) {
            direccion = values.direccion;
        } else if (initialValues) {
            direccion = initialValues.direccion;
        }
        /* var propiedad = this.props.propiedad;
        if (!propiedad) return null; */
        return (
            <form className="row" onSubmit={handleSubmit}>
                <div className="col-8">
                    <div className="row">
                        <legend>Información General</legend>
                        <div className="col">
                            <TextField label={"Titulo"} name={"titulo"} />
                        </div>
                       {/*  <div className="col-4">
                            <TipoPropiedadChoiceField label={"Tipo de Propiedad"} name={"tipo.id"} />
                        </div> */}
                    </div>
                    <div className="row">
                        <div className="col-md">
                            <TextAreaField label={"Descripción"} name={"descripcion"} />
                        </div>
                    </div>
                    <div className="row">
                        <legend>Direccion</legend>
                        <div className="col-md">
                            <PaisChoiceField name={"direccion.pais.id"} />
                        </div>
                        <div className="col-md">
                            <ProvinciaChoiceField name={"direccion.provincia.id"} pais={direccion && direccion.pais && direccion.pais.id} />
                        </div>
                        <div className="col-md">
                            <LocalidadChoiceField name={"direccion.localidad.id"} provincia={direccion && direccion.provincia && direccion.provincia.id} />
                        </div>
                    </div>
                    <div className="row form-group">
                        <div className="col-6">
                            <CalleChoiceField name={"direccion.calle.id"} localidad={direccion && direccion.localidad && direccion.localidad.id} />
                        </div>
                        <div className="col-2">
                            <NumberField label={"Nº"} name={"direccion.numero"} />
                        </div>
                        <div className="col-2">
                            <NumberField label={"Piso"} name={"direccion.piso"} />
                        </div>
                        <div className="col-2">
                            <TextField label={"Dpto."} name={"direccion.dpto"} />
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <legend>Foto</legend>
                    <ImagePicker name="image" />
                </div>
                    <div className="col">
                        <SubmitButton>Guardar Propiedad</SubmitButton>
                    </div>
            </form>
        );
    }
}




let SwitchnAdminCrearPropiedadForm = connect(
    state => {
        return {
            /* initialValues: state.propiedad.data || {}, */
            /* propiedad: state.propiedad.data, */
            values: getFormValues(PROPIEDAD_CREATE_FORM_NAME)(state)
        }
    }
)(SwitchnAdminPropiedadForm);

let SwitchnAdminModificarPropiedadForm = connect(
    state => {
        return {
            values: getFormValues(PROPIEDAD_UPDATE_FORM_NAME)(state)
        }
    }
)(SwitchnAdminPropiedadForm);

SwitchnAdminCrearPropiedadForm = reduxForm({
    form: PROPIEDAD_CREATE_FORM_NAME
})(SwitchnAdminCrearPropiedadForm);

SwitchnAdminModificarPropiedadForm = reduxForm({
    form: PROPIEDAD_UPDATE_FORM_NAME
})(SwitchnAdminModificarPropiedadForm);

SwitchnAdminModificarPropiedadForm = connect(
    state => {
        return {
            initialValues: state.propiedad.data || {},
        }
    }
)(SwitchnAdminModificarPropiedadForm);

export { SwitchnAdminCrearPropiedadForm, SwitchnAdminModificarPropiedadForm };