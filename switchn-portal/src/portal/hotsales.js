import React, { Component } from 'react';
import { Row, Col, Card, Button, Modal, Image } from 'react-bootstrap';
import moment from 'moment';

import { SwitchnPortalPage } from './base';
import { SwitchnAPI } from '../utils/client.js';
import defaultPic from '../img/default-no-picture.png';


class HotsaleCard extends Component {
    state = {
        showInfo: false
    }

    show = () => {
        this.setState({showInfo: true});
    }
    hide = () => {
        this.setState({showInfo: false});
    }

    handleBuy = () => {
        const ok = window.confirm(`Va a realizar una compra por $${this.props.hotsale.precio}. ¿Está seguro?`);
        if (ok) {
            SwitchnAPI.hotsales.getDetailEndpoint(this.props.hotsale.id)
                .comprarHotsale()
                    .then(data => {
                        alert(data.detail);
                        this.props.refrescar();
                    })
                    .catch(err => {
                        alert('Ha ocurrido un error');
                        console.log(err);
                    });
        }
        this.hide();
    };

    render() {
        let {hotsale} = this.props;
        let {propiedad} = hotsale;
        const formatDireccion = (dir) => `${dir.pais.nombre}. ${dir.localidad.nombre}, ${dir.provincia.nombre}`;
        const formatSemana = (sem) => <b>Semana del {moment(hotsale.semana).format('D [de] MMMM')}</b>;
        return (
            <>
            <Col xs={4}>
                <Card>
                    <Card.Body>
                        <Card.Img variant='top' src={propiedad.image || defaultPic} />
                        <Card.Title><b>{propiedad.titulo}</b></Card.Title>
                        <Card.Subtitle>{formatDireccion(propiedad.direccion)}</Card.Subtitle>
                        {/* <Card.Subtitle>{propiedad.descripcion}</Card.Subtitle> */}
                        <Card.Text>
                            {formatSemana(hotsale.semana)} <br />
                            ${hotsale.precio} <br />
                        </Card.Text>
                        <Button onClick={this.show}>Ver más</Button>
                    </Card.Body>
                </Card>
            </Col>
            <Modal show={this.state.showInfo} onHide={this.hide}>
                <Modal.Header>Hotsale</Modal.Header>
                <Modal.Body>
                    <Row>
                        { /* propiedad.image && <Col xs={4}><Image rounded src={propiedad.image} /></Col> */ }
                        <Col /*xs={propiedad.image ? 8 : 12} */>
                            <h4><b>{propiedad.titulo}</b></h4>
                            <p>{propiedad.descripcion}</p>
                            <p>
                                <small>
                                    {formatSemana(hotsale.semana)}<br/>
                                    Compra esta semana ahora por ${hotsale.precio}
                                </small>
                            </p>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleBuy}>Comprar</Button>
                    <Button onClick={this.hide} variant='light'>Cerrar</Button>
                </Modal.Footer>
            </Modal>
            </>
        )
    }
}

class SwitchnPortalListadoHotsales extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hotsales: []
        }
    }

    cargarHotsales = () => {
        var params = {
            'filter{es_activo}': true,
            'include[]': 'propiedad.'
        };
        SwitchnAPI.hotsales.list(params)
            .then(data => {
                this.setState({hotsales: data.hotsales});
                this.forceUpdate();
            })
            .catch(err => console.log(err));
    }

    componentDidMount() {
        this.cargarHotsales();
    }

    render() {
        let {hotsales} = this.state;
        return (
            <Row>
            {hotsales.length > 0 ?
                hotsales.map(
                    hotsale => (
                        <HotsaleCard refrescar={this.cargarHotsales} key={hotsale.id} hotsale={hotsale} />
                    ))
                : <Col><h3>No hay hotsales disponibles</h3></Col>
            }
            </Row>
        )
    }
}

const SwitchnPortalHotsalesPage = (props) => {
    return (
        <SwitchnPortalPage title="Hotsales">
            <SwitchnPortalListadoHotsales />
        </SwitchnPortalPage>
    )
}

export { SwitchnPortalHotsalesPage };
