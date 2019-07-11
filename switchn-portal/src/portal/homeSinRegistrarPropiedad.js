import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import { SwitchnPortalPage } from './base';
import { loadData, cleanData } from '../redux/dataprovider/actions';
import { Button, Card} from 'react-bootstrap';
import FlexView from 'react-flexview';

import { SwitchnAPI } from '../utils/client';

import defaultPic from "../img/default-no-picture.png";





class HomeSinRegCard extends React.Component {
    state = {
        propiedad: null
    }

    componentDidMount(){
        SwitchnAPI.propiedades.random()
            .then(data => {
                this.setState({propiedad: data.propiedad});
            })
    }

    render(){
        if (!this.state.propiedad){
            return null
        }
        let {propiedad} = this.state;
        let {direccion} = propiedad;
        const format = (direccion) =>  `${direccion.pais.nombre}. ${direccion.localidad.nombre}, ${direccion.provincia.nombre}.`;
        return (
            <FlexView vAlignContent='center'>
                <div className= 'col'> 
                    <Card border= 'info' style={{ width: '18rem' }}>
                    <Card.Header>NUESTRAS PROPIEDADES</Card.Header>
                    <Card.Img variant="top" src= {propiedad.image || defaultPic } />
                    <Card.Body>
                        <Card.Title>{propiedad.titulo} </Card.Title>
                        <Card.Subtitle>
                            <small>
                                {format(direccion)}
                            </small>
                        </Card.Subtitle>
                        <Card.Text>
                        <span className="article-content"><small></small></span>
                        <span className="article-content">{propiedad.descripcion}</span>
                        </Card.Text>
                        
                    </Card.Body>
                    </Card>
                </div>
            </FlexView>
         
                 
        )
    }
}


let PropiedadCard = HomeSinRegCard;

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
                <PropiedadCard/>
            </SwitchnPortalPage>
        );
    }
}

export { PropiedadCard };

