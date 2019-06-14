import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import { SwitchnPortalPage } from '../portal/base';
import { loadData, cleanData } from '../redux/dataprovider/actions';
import { Button, Card} from 'react-bootstrap';
import FlexView from 'react-flexview';


class HomeSinRegCard extends React.Component {

    componentDidMount(){
        this.props.loadPropiedad()
    }

    componentWillUnmount(){
        this.props.cleanUp()
    }

    render(){
        if (this.props.propiedad === undefined){
            return null
        }

        return (
            <FlexView vAlignContent='center'>
            <div className= 'col'> 
            <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src= {this.props.propiedad[0].image} />
            <Card.Body>
                <Card.Title>{this.props.propiedad[0].titulo} </Card.Title>
                <Card.Text>
                <span><small>Aca la direccion</small></span>
                <span className="article-content">{this.props.propiedad[0].descripcion}</span>
                </Card.Text>
               
            </Card.Body>
            </Card>
            </div>
        </FlexView>
         
                 
        )
    }
}

let PropiedadCard = connect(
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

