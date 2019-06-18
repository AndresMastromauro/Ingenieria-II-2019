import React from "react";
import { connect } from "react-redux";

import { Link } from "../common/base";
import { SwitchnAdminPage } from './base';
import { TextField } from "../common/forms/inputs";
import { loadData, cleanData } from "../redux/dataprovider/actions";
import { loadSubastaProp } from "../redux/propiedad/actions";


export class ListadoSubastas extends React.Component {
    render() {
        var subasta = this.props.subasta;
        return (
            <tr>
                <td>{subasta.reserva.semana}</td>
                <td>{subasta.precioBase}</td>
                <td></td>
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
                <td>{reserva.precio}</td>
                <td></td>
            </tr>
        );
    }
}
