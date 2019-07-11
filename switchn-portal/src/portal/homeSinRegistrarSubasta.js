import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import { SwitchnPortalPage } from './base';
import { loadData, cleanData } from '../redux/dataprovider/actions';
import { Button, Card} from 'react-bootstrap';
import FlexView from 'react-flexview';
import moment from 'moment';

import { SwitchnAPI }  from '../utils/client';

import defaultPic from "../img/default-no-picture.png";


class PropiedadCardSubasta extends React.Component {
    state = {
        subasta: null
    }

    componentDidMount(){
        // this.props.loadSubasta()
        SwitchnAPI.subastas.random()
            .then(data => {
                this.setState({subasta: data.subasta})
            })
            .catch(err => {
                console.log(err);
            })
    }

    render(){
        if (!this.state.subasta){
            return null
        }
        let {subasta} = this.state;
        let {propiedad} = subasta;
        let {direccion} = propiedad;
        const format = (direccion) =>  `${direccion.pais.nombre}. ${direccion.localidad.nombre}, ${direccion.provincia.nombre}.`;
        return (
            <FlexView vAlignContent='center'>
            <div className= 'col'> 
            <Card border='success' style={{ width: '18rem' } }>
            <Card.Header>EN SUBASTA!!!</Card.Header>
            <Card.Img variant="top" src= {propiedad.image || defaultPic } />
            <Card.Body>
                <Card.Title>{propiedad.titulo} </Card.Title>
                <Card.Subtitle>
                    <small>{format(direccion)}</small>
                </Card.Subtitle>
                <Card.Subtitle><small>Semana: {subasta.semana}</small></Card.Subtitle>
                <Card.Text>
                    <span>Precio base: {subasta.precio_actual}</span>
                </Card.Text>     
            </Card.Body>
            </Card>
            </div>
        </FlexView>
         
                 
        )
    }
}


export class SwitchnPortalSinRegistrar extends React.Component {
    render() {
      
      return (
      <div className='container'>
          <h3> Bienvenidos a Home Switch Home la aplicación donde
           podras encontrar la casa de tus proximas vacaciones. </h3>
      </div>
      
      );
  }
}

export class SwitchnHomeSinRegistrar extends React.Component {
    render() {
        return (
            <SwitchnPortalPage>
                    <PropiedadCardSubasta/>
            </SwitchnPortalPage>
        );
    }
}

export { PropiedadCardSubasta };