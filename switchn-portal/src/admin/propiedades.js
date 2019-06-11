import React from "react";
import { connect } from "react-redux";

import { Link } from "../common/base";
import { SwitchnAdminPage } from './base';
import { TextField } from "../common/forms/inputs";
import { loadData, cleanData } from "../redux/dataprovider/actions";

class SwitchnAdminPropiedad extends React.Component {
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
        return (
            <tr>
                <td>{propiedad.titulo}</td>
                <td>{this.getDireccion()}</td>
                <td><Link url={`/admin/propiedad/${propiedad.id}`}>Ver/Editar</Link></td>
            </tr>
        );
    }
}

class SwitchnAdminCrearPropiedad extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <SwitchnAdminPage>
               
            </SwitchnAdminPage>
        )
    }

}

class _SwitchnAdminListadoPropiedades extends React.Component {

    componentDidMount() {
        this.props.loadPropiedades();
    }

    componentWillUnmount() {
        this.props.cleanUp();
    }

    render() {
        var content;
        if (this.props.isLoading) {
            content = <tr><td>Cargando...</td></tr>;
        } else if (!this.props.propiedades || this.props.propiedades.length == 0) {
            content = <tr><td>No hay propiedades para mostrar</td></tr>;
        } else {
            content = this.props.propiedades.map(
                function(propiedad) {
                    return <SwitchnAdminPropiedad key={propiedad.id} propiedad={propiedad} />
                }
            );
        }
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">{"Nombre"}</th>
                        <th scope="col">{"Dirección"}</th>
                        <th scope="col">{"Acciones"}</th>
                    </tr>
                </thead>
                <tbody>
                    {content}
                </tbody>
            </table>
        )
    }
}

let SwitchnAdminListadoPropiedades = connect(
    state => {
        var propiedades = state.dataprovider.datamap.propiedades;
        return {
            propiedades: propiedades && propiedades.data,
            isLoading: propiedades && propiedades.loading
        }
    },
    dispatch => {
        return {
            loadPropiedades: (oParams) => dispatch(loadData("propiedades", "/ajax/propiedades", oParams)),
            cleanUp: () => dispatch(cleanData("propiedades"))
        }
    }
)(_SwitchnAdminListadoPropiedades);



export class SwitchnAdminPropiedades extends React.Component {
    render() {
        return (
            <SwitchnAdminPage title={"Propiedades"}>
                <SwitchnAdminListadoPropiedades />
            </SwitchnAdminPage>
        )
    }
}
