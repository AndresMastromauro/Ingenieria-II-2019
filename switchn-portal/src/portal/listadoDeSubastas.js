import React from "react";

import { Link } from "../common/base";
import moment from "moment";

const FormatPropiedad = (props) => {
    let {propiedad} = props;
    if (!propiedad)
        return null;
    let {direccion: {pais, provincia, localidad}} = propiedad;
    return <><b>{propiedad.titulo}</b> ({localidad.nombre}, {provincia.nombre}, {pais.nombre})</>
}

const FormatFecha = (props) => {
    let {fecha} = props;
    if (!fecha)
        return null;
    return <>{moment(fecha).format('D [de] MMMM (Y)')}</>
}

export class ListadoSubastas extends React.Component {
    render() {
        var subasta = this.props.subasta;
        return (
            <tr>
                <th scope='row'><FormatFecha fecha={subasta.semana} /></th>
                <td><FormatPropiedad propiedad={subasta.propiedad} /></td>
                <td>${subasta.precio_base}</td>
                <td>
                { this.props.ganada ?
                    `$${subasta.precio_actual}`
                    : `$${subasta.mejor_oferta_user.monto}`
                }
                </td>
                {/* <td><Link url="/">Detalle</Link></td> */}
            </tr>
        );
    }
}

export class ListadoReservas extends React.Component {
    render() {
        var reserva = this.props.reserva;
        return (
            <tr>
                <th scope='row'><FormatFecha fecha={reserva.semana} /></th>
                <td><FormatPropiedad propiedad={reserva.propiedad} /></td>
                <td><Link url={`/detaPropiedad/${this.props.reserva.propiedad.id}`}>Ver Propiedad</Link> </td>
            </tr>
        );
    }
}

export class ListadoHotale extends React.Component {
    render() {
        var hotsale = this.props.hotsale;
        return (
            <tr>
                <td><FormatFecha fecha={hotsale.semana} /></td>
                {/* <td>{hotsale.propiedad.titulo}</td> */}
                <td>${hotsale.precio}</td>
                {/* <td><Link url="/">Detalle</Link> </td> */}
            </tr>
        );
    }
}
