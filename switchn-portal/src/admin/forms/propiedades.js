import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { TipoPropiedadChoiceField } from "../../common/forms/select";
import { TextField, TextAreaField } from "../../common/forms/inputs";

class _SwitchnAdminPropiedadForm extends React.Component {
    render() {
        let {handleSubmit} = this.props;
        /* var propiedad = this.props.propiedad;
        if (!propiedad) return null; */
        return (
            <form className="row" onSubmit={handleSubmit}>
                <div className="col-md-4">
                    {/* <img src={propiedad.image} style={{width: "100%"}} /> */}
                    {/* <Link to={""}>Cambiar Imagen</Link> */}
                </div>
                <div className="col-md-8">
                    <TextField label={"Titulo"} name={"titulo"} />
                    <TextAreaField label={"Descripción"} name={"descripcion"} />
                    <TipoPropiedadChoiceField name={"tipo"} />
                    { /* TODO: Direccion */}
                </div>
            </form>
        );
    }
}

const SwitchnAdminPropiedadForm = reduxForm({
    form: 'crear-propiedad'
})(_SwitchnAdminPropiedadForm);

export { SwitchnAdminPropiedadForm };