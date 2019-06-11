import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import auth from './auth/reducer';
import propiedades from './propiedades/reducer';
import dataprovider from './dataprovider/reducer';

export default combineReducers({
    auth,
    propiedades,
    dataprovider,
    form: formReducer
});