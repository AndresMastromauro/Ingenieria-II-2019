import React from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";

import { loadData, cleanData } from "../redux/dataprovider/actions";
import { SwitchnAdminPage } from "./base";
import { SwitchnAdminPropiedadForm } from "./forms/propiedades";

import { Link } from '../common/base';
import { TextField } from "../common/forms/inputs";

class SwitchnAdminDetallePropiedad extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            propiedad: null
        }
    }

    getDireccion() {
        var oDireccion = this.props.propiedad.direccion;
        var sDireccion = `${oDireccion.calle.nombre} #${oDireccion.numero}`;
        if (oDireccion.piso) {
            sDireccion += `, ${oDireccion.piso}`;
            if (oDireccion.dpto) {
                sDireccion += `${oDireccion.dpto}`;
            }
        }
        sDireccion += `. ${oDireccion.localidad.nombre}, `;
        sDireccion += `${oDireccion.provincia.nombre}, ${oDireccion.pais.nombre}.`;
        return sDireccion;
    }

    componentDidUpdate(prevProps) {
        if (this.props.propiedad !== prevProps.propiedad) {
            this.setState({propiedad: this.props.propiedad});
        }
    }

    handleEditTitulo(e) {}

    render() {
        var propiedad = this.state.propiedad;
        if (!propiedad) return null;
        return (
            <div className="container">
                <SwitchnAdminPropiedadForm propiedad={propiedad}/>
                {/* <div className="row">
                    <div className="col-md-4">
                        <img src={propiedad.image} style={{width: "100%"}} />
                        <Link to={""}>Cambiar Imagen</Link>
                    </div>
                    <div className="col-md-8">
                        <form>
                            <table>
                                <tbody>
                                    <tr>
                                        <td><TextField label="Titulo" name="titulo" value={propiedad.titulo} onChange={this.handleEditTitulo} /></td>
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
                                        <td>{this.getDireccion()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    </div>
                </div> */}
            </div>
        );
    }
}

class _SwitchnAdminPropiedadPage extends React.Component {
    componentDidMount() {
        var idPropiedad = this.props.match.params.idPropiedad;
        if (idPropiedad)
            this.props.loadPropiedad(idPropiedad);
    }
    componentWillUnmount() {
        this.props.cleanUp();
    }
    render() {
        return (
            <SwitchnAdminPage>
                <SwitchnAdminDetallePropiedad propiedad={this.props.propiedad} />
            </SwitchnAdminPage>
        )
    }
}

let SwitchnAdminPropiedadPage = connect(
    state => {
        var propiedad = state.dataprovider.datamap.propiedad;
        return {
            propiedad: propiedad && propiedad.data,
            isLoading: propiedad && propiedad.isLoading
        }
    },
    dispatch => {
        return {
            loadPropiedad: (id) => dispatch(loadData("propiedad", `/ajax/propiedades/${id}`)),
            cleanUp: () => dispatch(cleanData("propiedad"))
        }
    }
)(_SwitchnAdminPropiedadPage);

export { SwitchnAdminPropiedadPage };