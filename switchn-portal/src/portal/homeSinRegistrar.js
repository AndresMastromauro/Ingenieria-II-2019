import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import { SwitchnPortalPage } from '../portal/base';
import { loadData } from '../redux/dataprovider/actions';
import { Button, Card} from 'react-bootstrap';
import FlexView from 'react-flexview';


export class SwitchnPortalSinRegistrar extends React.Component {
    render() {
      
      return (
      <div className='container'>
          <h3> Bienvenidos a Home Switch Home la aplicación donde
           podras encontrar la casa de tus proximas vacaciones. </h3>
         <FlexView vAlignContent='center'>
            <div className= 'col'> 
            <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src= '' />
            <Card.Body>
                <Card.Title>Aca va el titulo </Card.Title>
                <Card.Text>
                <p><small>Aca la direccion</small></p>
                <p className="article-content">Aca la descripcion</p>
                </Card.Text>
                <Button variant="primary" href={'/login'}>Login</Button>
                <Button variant="primary" href={'/login'}>Register</Button>
            </Card.Body>
            </Card>
            </div>

            <div className= 'col'> 
            <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src= '' />
            <Card.Body>
                <Card.Title>Aca va el titulo </Card.Title>
                <Card.Text>
                <p><small>Aca la direccion</small></p>
                <p className="article-content">Aca la descripcion</p>
                </Card.Text>
                <Button variant="primary" href={'/login'}>Login</Button>
                <Button variant="primary" href={'/login'}>Register</Button>
            </Card.Body>
            </Card>
            </div>
        </FlexView>
      </div>
      
      );
  }
}

export class SwitchnHomeSinRegistrar extends React.Component {
    render() {
        return (
            <SwitchnPortalPage>
                    <SwitchnPortalSinRegistrar/>
            </SwitchnPortalPage>
        );
    }
}

