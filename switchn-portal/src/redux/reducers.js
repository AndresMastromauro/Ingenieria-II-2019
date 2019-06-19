import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import auth from './auth/reducer';
import {propiedad, subasta, reserva} from './propiedad/reducer';
import dataprovider from './dataprovider/reducer';

export default combineReducers({
    auth,
    propiedad,
    subasta,
    reserva,
    dataprovider,
    form: formReducer
});