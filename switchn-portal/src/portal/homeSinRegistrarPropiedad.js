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
        // this.props.loadPropiedad()
        SwitchnAPI.propiedades.random()
            .then(data => {
                this.setState({propiedad: data.propiedad});
            })
    }

    componentWillUnmount(){
        // this.props.cleanUp()
    }

    render(){
        if (!this.state.propiedad){
            return null
        }

        return (
            <FlexView vAlignContent='center'>
            <div className= 'col'> 
            <Card border= 'info' style={{ width: '18rem' }}>
            <Card.Header>NUESTRAS PROPIEDADES</Card.Header>
            <Card.Img variant="top" src= {this.state.propiedad.image || defaultPic } />
            <Card.Body>
                <Card.Title>{this.state.propiedad.titulo} </Card.Title>
                <Card.Subtitle><small>{this.state.propiedad.direccion.pais.nombre} - 
                {this.state.propiedad.direccion.provincia.nombre} - 
                {this.state.propiedad.direccion.localidad.nombre}</small></Card.Subtitle>
                <Card.Text>
                    
                <span className="article-content"><small></small></span>
                <span className="article-content">{this.state.propiedad.descripcion}</span>
                </Card.Text>
               
            </Card.Body>
            </Card>
            </div>
        </FlexView>
         
                 
        )
    }
}

/* let PropiedadCard = connect(
    state => {
        return { propiedad: state.dataprovider.datamap.propiedad && state.dataprovider.datamap.propiedad.data }
    },
    dispatch => {
        return {
            loadPropiedad: () => {
                dispatch(loadData('propiedad', '/ajax/propiedadRandom'))
            },
            cleanUp: () => {
                dispatch(cleanData('propiedad')) }
            }
        }
)(HomeSinRegCard);
 */

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

