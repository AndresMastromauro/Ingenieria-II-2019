import React from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import $ from "jquery";

import { loadData, cleanData } from "../redux/dataprovider/actions";
import { SwitchnAdminPage } from "./base";
import { SwitchnAdminPropiedadForm } from "./forms/propiedades";

import { Link } from '../common/base';
import { TextField } from "../common/forms/inputs";

class SwitchnAdminDetallePropiedad extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false
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
    
    render() {
        var propiedad = this.props.propiedad;
        if (!propiedad) return null;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-4">
                        <img src={propiedad.image} style={{width: "100%"}} />
                    </div>
                    <div className="col-8">
                        <form>
                            <table className="table table-stripped">
                                <tbody>
                                    <tr>
                                        <th scope="row">Titulo:</th>
                                        <td>{propiedad.titulo}</td>
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
                                    <tr>
                                        <td><Link url={`${propiedad.id}/editar`}>Editar Información</Link></td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    </div>
                </div>
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
            <SwitchnAdminPage title={this.props.propiedad && this.props.propiedad.titulo}>
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