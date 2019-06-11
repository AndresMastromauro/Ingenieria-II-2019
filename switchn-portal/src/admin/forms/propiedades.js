import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";

class _SwitchnAdminPropiedadForm extends React.Component {
    render() {
        let {handleSubmit} = this.props;
        var propiedad = this.props.propiedad;
        if (!propiedad) return null;
        return (
            <form className="row" onSubmit={handleSubmit}>
                <div className="col-md-4">
                    <img src={propiedad.image} style={{width: "100%"}} />
                    {/* <Link to={""}>Cambiar Imagen</Link> */}
                </div>
                <div className="col-md-8">
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <Field name="titulo" component="input" type="text" />
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">Descripción:</th>
                                <td>{propiedad.descripcion}</td>
                            </tr>
                            <tr>
                                <th scope="row">Tipo:</th>
                                <td>{propiedad.tipo.descripcion}</td>
                            </tr>
                            <tr>
                                <th scope="row">Direccion:</th>
                                {/* <td>{this.getDireccion()}</td> */}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </form>
        );
    }
}

const SwitchnAdminPropiedadForm = reduxForm({
    form: 'crear-propiedad'
})(_SwitchnAdminPropiedadForm);

export { SwitchnAdminPropiedadForm };