import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm, getFormValues } from "redux-form";
import { TipoPropiedadChoiceField, WeekField, PaisChoiceField, ProvinciaChoiceField, LocalidadChoiceField, CalleChoiceField } from "../../common/forms/select";
import { TextField, TextAreaField, NumberField } from "../../common/forms/inputs";
import { ImagePicker } from "../../common/forms/imagepicker";

const PROPIEDAD_FORM_NAME = "crear-propiedad";

class __SwitchnAdminPropiedadForm extends React.Component {
    render() {
        let {handleSubmit} = this.props;
        let {values} = this.props;
        /* var propiedad = this.props.propiedad;
        if (!propiedad) return null; */
        return (
            <form className="row" onSubmit={handleSubmit}>
                <div className="col-8">
                    <div className="row">
                        <legend>Información General</legend>
                        <div className="col-8">
                            <TextField label={"Titulo"} name={"titulo"} />
                        </div>
                        <div className="col-4">
                            <TipoPropiedadChoiceField label={"Tipo de Propiedad"} name={"tipo"} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md">
                            <TextAreaField label={"Descripción"} name={"descripcion"} />
                        </div>
                    </div>
                    <div className="row">
                        <legend>Direccion</legend>
                        <div className="col-md">
                            <PaisChoiceField name={"pais"} />
                        </div>
                        <div className="col-md">
                            <ProvinciaChoiceField name={"provincia"} pais={values && values.pais} />
                        </div>
                        <div className="col-md">
                            <LocalidadChoiceField name={"localidad"} provincia={values && values.provincia} />
                        </div>
                    </div>
                    <div className="row form-group">
                        <div className="col-4">
                            <CalleChoiceField name={"calle"} localidad={values && values.localidad} />
                        </div>
                        <div className="col-2">
                            <NumberField label={"Nº"} name={"numero"} />
                        </div>
                        <div className="col-2">
                            <NumberField label={"Piso"} name={"piso"} />
                        </div>
                        <div className="col-2">
                            <TextField label={"Dpto."} name={"dpto"} />
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <legend>Foto</legend>
                    <ImagePicker name="image" />
                </div>
            </form>
        );
    }
}



let _SwitchnAdminPropiedadForm = connect(
    state => {
        return {
            values: getFormValues(PROPIEDAD_FORM_NAME)(state)
        }
    }
)(__SwitchnAdminPropiedadForm);

const SwitchnAdminPropiedadForm = reduxForm({
    form: PROPIEDAD_FORM_NAME
})(_SwitchnAdminPropiedadForm);

export { SwitchnAdminPropiedadForm };