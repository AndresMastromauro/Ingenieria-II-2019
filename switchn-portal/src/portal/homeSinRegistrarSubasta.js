import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import { SwitchnPortalPage } from './base';
import { loadData, cleanData } from '../redux/dataprovider/actions';
import { Button, Card} from 'react-bootstrap';
import FlexView from 'react-flexview';

import { SwitchnAPI }  from '../utils/client';

import defaultPic from "../img/default-no-picture.png";


class HomeSinRegCardSubasta extends React.Component {
    state = {
        subasta: null
    }

    componentDidMount(){
        // this.props.loadSubasta()
        SwitchnAPI.subastas.random()
            .then(data => {
                this.setState({subasta: data})
            })
            .catch(err => {
                console.log(err);
            })
    }

    componentWillUnmount(){
        // this.props.cleanUp()
    }

    render(){
        if (!this.state.subasta){
            return null
        }

        return (
            <FlexView vAlignContent='center'>
            <div className= 'col'> 
            <Card border='success' style={{ width: '18rem' } }>
            <Card.Header>EN SUBASTA!!!</Card.Header>
            <Card.Img variant="top" src= {this.state.subasta.propiedad.image || defaultPic } />
            <Card.Body>
                
                <Card.Title>{this.state.subasta.propiedad.titulo} </Card.Title>
                
                <Card.Subtitle>
                    <small>{this.state.subasta.propiedad.direccion.pais.nombre} -</small>
                    <small>  {this.state.subasta.propiedad.direccion.provincia.nombre} -</small>
                    <small>  {this.state.subasta.propiedad.direccion.localidad.nombre}</small>
                </Card.Subtitle>
                <Card.Subtitle> <small>Semana: {this.state.subasta.semana} </small></Card.Subtitle>
                <Card.Text>
                <span>Precio base: {this.state.subasta.precio_base}</span>
                </Card.Text>
                             
            </Card.Body>
            </Card>
            </div>
        </FlexView>
         
                 
        )
    }
}

let PropiedadCardSubasta = connect(
    state => {
        return {
            subasta: state.dataprovider.datamap.subasta && state.dataprovider.datamap.subasta.data
        }
    },
    dispatch => {
        return {
            loadSubasta: () => {
                dispatch(loadData('subasta', '/ajax/subastaRandom/'))
            },
            cleanUp: () => {
                dispatch(cleanData('subasta')) }
            }
        }
)(HomeSinRegCardSubasta);


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