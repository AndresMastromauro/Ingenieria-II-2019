import React from "react";
import { connect } from "react-redux";

import { Link } from "../common/base";
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
                <td><Button variant="info" size="sm">Pujar</Button></td>
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
                <td>reserva.precio</td>
                <td><Button variant="info" size="sm">Reservar</Button> </td>
            </tr>
        );
    }
}

export class ListadoHotale extends React.Component {
    render() {
        var hotsale = "";
        return (
            <tr>
                <td>hotsale.emana</td>
                <td>hotsale.precio</td>
                <td><Button variant="info" size="sm">Reservar</Button> </td>
            </tr>
        );
    }
}
