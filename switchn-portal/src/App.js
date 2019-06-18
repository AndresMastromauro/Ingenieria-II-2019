import React from 'react';
import { BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import { Provider, connect } from 'react-redux';
/* import { SwitchnLanding } from './main'; */
import { SwitchnAdminHome } from './admin/home';
import { SwitchnAdminPropiedades } from './admin/propiedades';
import { SwitchnAdminPropiedadPage } from './admin/propiedad_detalle';
import { SwitchnAdminCrearPropiedadPage } from './admin/propiedad_creacion';
import { SwitchnAdminModificarPropiedadPage } from './admin/propiedad_modificacion';
import { SwitchnHome } from './portal/home';
import { SwitchnPortalLogin } from './portal/login';
import {SwitchnPortalSingUp} from './portal/signup';
import { SwitchnPortalLogout } from './portal/logout';
import {SwitchnDetallePropiedad} from './portal/detallePropiedad';
import { loadUser } from "./redux/auth/actions";
import { store } from './redux/store';
import { SwitchnAdminCrearSubastaPage } from './admin/subasta_creacion';

// import './App.css';



class _App extends React.Component {
  componentDidMount() {
    this.props.loadUser();
  }

  PrivateRoute = ({component: ChildComponent, ...rest}) => {
    return (
      <Route {...rest} render={(props) => {
        if (this.props.auth.isLoading) {
          return (<h2>Cargando...</h2>);
        } else if (!this.props.auth.isAuthenticated) {
          return (<Redirect to="/login" />);
        } else {
          return (<ChildComponent {...props} />);
        }
      }} />
    );
  }

  render() {
    let {PrivateRoute} = this;
    return (
        <div className="App">
            <Router>
              <PrivateRoute exact path="/" component={SwitchnHome} />
              <Route exact path="/login" component={SwitchnPortalLogin} />
              <Route exact path="/registrar" component={SwitchnPortalSingUp} />
              <PrivateRoute exact path="/detaPropiedad/:idPropiedad" component={SwitchnDetallePropiedad} />
              <PrivateRoute exact path="/admin" component={SwitchnAdminHome} />
              <PrivateRoute exact path="/admin/propiedades" component={SwitchnAdminPropiedades} />
              <PrivateRoute exact strict path="/admin/propiedad/:idPropiedad" component={SwitchnAdminPropiedadPage} />
              <PrivateRoute exact path="/admin/propiedad/:idPropiedad/editar" component={SwitchnAdminModificarPropiedadPage} />
              <PrivateRoute exact path="/admin/propiedad/:idPropiedad/subastas/crear" component={SwitchnAdminCrearSubastaPage} />
              <PrivateRoute exact path="/admin/propiedades/crear" component={SwitchnAdminCrearPropiedadPage} />
              <PrivateRoute exact path="/logout" component={SwitchnPortalLogout} />
            </Router>
        </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadUser: () => {
      return dispatch(loadUser());
    }
  }
}

let App = connect(mapStateToProps, mapDispatchToProps)(_App);


class SwitchnApp extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
}

export default SwitchnApp;
