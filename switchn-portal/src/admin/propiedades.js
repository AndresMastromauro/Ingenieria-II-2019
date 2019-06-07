import React from "react";
import { Link } from "../common/base";
import { SwitchnAdminPage } from './base';
import { AJAXDataProvider } from "../common/utils";

class SwitchnAdminPropiedad extends React.Component {
    render() {
        var propiedad = this.props.propiedad;
        return (
            <tr>
                <td>{propiedad.titulo}</td>
                <td>{propiedad.direccion}</td>
                <td><Link url={`/admin/propiedad/${propiedad.id}`}>Ver/Editar</Link></td>
            </tr>
        );
    }
}

class _SwitchnAdminListadoPropiedades extends React.Component {
    /* Este espera estar envuelto en un AJAXDataProvider */
    render() {
        var propiedades = this.props.data.map(
            function(propiedad) {
                return <SwitchnAdminPropiedad key={propiedad.id} propiedad={propiedad} />
            }
        );
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
                    {propiedades}
                </tbody>
            </table>
        )
    }
}

class SwitchnAdminListadoPropiedades extends React.Component {
    render() {
        return (
            <AJAXDataProvider dataSourceURL={'/ajax/propiedades'}>
                <_SwitchnAdminListadoPropiedades />
            </AJAXDataProvider>
        );
    }
}


export class SwitchnAdminPropiedades extends React.Component {
    render() {
        return (
            <SwitchnAdminPage title={"Propiedades"}>
                <SwitchnAdminListadoPropiedades />
            </SwitchnAdminPage>
        )
    }
}
