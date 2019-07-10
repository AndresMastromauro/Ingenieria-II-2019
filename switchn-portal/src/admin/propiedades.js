import React from "react";
import { connect } from "react-redux";

import { Link } from "../common/base";
import { SwitchnAdminPage } from './base';
import { TextField } from "../common/forms/inputs";
import { loadData, cleanData } from "../redux/dataprovider/actions";
import { Button, ButtonGroup, Badge } from "react-bootstrap";
import { SwitchnAPI } from "../utils/client";

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

    handleView = () => {
        this.props.history.push(`/admin/propiedad/${this.props.propiedad.id}`);
    }

    render() {
        var propiedad = this.props.propiedad;
        return (
            <tr>
                <th scope="row">{propiedad.titulo}</th>
                <td>{this.getDireccion()}</td>
                <td>
                    <Badge>
                    {
                    propiedad.es_activa ? 
                        "Activa"
                        : "Inactiva"
                    }
                    </Badge>
                </td>
                <td>
                    <ButtonGroup>
                        <Button onClick={this.handleView}>Ver</Button>
                    </ButtonGroup>
                </td>
            </tr>
        );
    }
}


class SwitchnAdminListadoPropiedades extends React.Component {
    state = {
        propiedades: []
    }

    componentDidMount() {
        // this.props.loadPropiedades();
        SwitchnAPI.propiedades.list()
            .then(data => this.setState({propiedades: data.propiedades}))
            .catch(err => console.log(err));
    }

    render() {
        var content;
        if (this.props.isLoading) {
            content = <tr><td>Cargando...</td></tr>;
        } else if (!this.state.propiedades || this.state.propiedades.length == 0) {
            content = <tr><td>No hay propiedades para mostrar</td></tr>;
        } else {
            content = this.state.propiedades.map(
                function(propiedad) {
                    return <SwitchnAdminPropiedad key={propiedad.id} propiedad={propiedad} history={this.props.history} />;
                }.bind(this)
            );
        }
        return (
            <div>
                <div className="row justify-content-right">
                    <div className="col-4">
                        <Link url={"/admin"}>Volver</Link>
                        {" | "}
                        <Link url={
                            window.location.pathname.endsWith('/') ?
                            "crear"
                            : "propiedades/crear"
                        }>Agregar Propiedad</Link>
                    </div>
                </div>
                <div className="row">
                    <table className="table">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">{"Nombre"}</th>
                                <th scope="col">{"Dirección"}</th>
                                <th scope="col">{"Estado"}</th>
                                <th scope="col">{"Acciones"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {content}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

/* let SwitchnAdminListadoPropiedades = connect(
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
)(_SwitchnAdminListadoPropiedades); */



export class SwitchnAdminPropiedades extends React.Component {
    render() {
        return (
            <SwitchnAdminPage title={"Propiedades"}>
                <SwitchnAdminListadoPropiedades history={this.props.history} />
            </SwitchnAdminPage>
        )
    }
}
