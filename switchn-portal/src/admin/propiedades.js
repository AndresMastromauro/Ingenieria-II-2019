import React from "react";
import { Link } from "../common/base";
import { SwitchnListadoPropiedades } from "../common/listados";
import { SwitchnAdminPage } from './base';

class SwitchnAdminPropiedad extends React.Component {
    render() {
        var propiedad = this.props.propiedad;
        return (
            <tr>
                <th scope="row">{"·"}</th>
                <td>{propiedad.titulo}</td>
                <td>{propiedad.direccion}</td>
                <td><Link url={`admin/propiedad/${propiedad.id}`}>Ver/Editar</Link></td>
            </tr>
        );
    }
}

export class SwitchnAdminPropiedades extends React.Component {
    render() {
        return (
            <SwitchnAdminPage title={"Propiedades"}>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">{"Nombre"}</th>
                            <th scope="col">{"Dirección"}</th>
                            <th scope="col">{"Acciones"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <SwitchnListadoPropiedades render={
                            p => (<SwitchnAdminPropiedad propiedad={p} />)} />
                    </tbody>
                </table>
            </SwitchnAdminPage>
        )
    }
}
