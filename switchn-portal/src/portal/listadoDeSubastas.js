import React from "react";
import { connect } from "react-redux";

import { Link } from "../common/base";
import { SwitchnAPI } from "../utils/client";
import { SwitchnAdminPage } from './base';
import { TextField } from "../common/forms/inputs";
import { loadData, cleanData } from "../redux/dataprovider/actions";
import { loadSubastaProp } from "../redux/propiedad/actions";
import { Button } from "react-bootstrap";



export class ListadoSubastas extends React.Component {
    render() {
        var subasta = this.props.subasta;
        return (
            <tr>
                <td>{subasta.reserva.semana}</td>
                <td>{subasta.precioBase}</td>
                <td><Link url="/">Detalle</Link> </td>
            </tr>
        );
    }
}

export class ListadoReservas extends React.Component {
   
    render() {
        var reserva = this.props.reserva;
        return (
            <tr>
                <td>{reserva.semana}</td>
                
                <td><Link url={`/detaPropiedad/${this.props.reserva.propiedad}`}>Detalle</Link> </td>
            </tr>
        );
    }
}

export class ListadoHotale extends React.Component {
    render() {
        var hotsale = this.props.hotsale;
        return (
            <tr>
                <td>{hotsale.semana}</td>
                <td>{hotsale.precio}</td>
                <td><Link url="/">Detalle</Link> </td>
            </tr>
        );
    }
}
