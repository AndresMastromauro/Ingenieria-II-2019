import React from 'react';
/* import { SwitchnLanding } from './main'; */
import { SwitchnAdminHome } from './admin/home';
import { SwitchnAdminPropiedades } from './admin/propiedades';
import { SwitchnHome } from './portal/home';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import { Register } from "./accounts/register"
import Signup from "./accounts/Signup";

// import './App.css';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Route exact path="/" component={SwitchnHome} />
          <Route exact path="/admin" component={SwitchnAdminHome} />
          <Route exact path="/admin/propiedades" component={SwitchnAdminPropiedades} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/signup" component={Signup} />
        </Router>
      </div>
    );
  }
}

export default App;
