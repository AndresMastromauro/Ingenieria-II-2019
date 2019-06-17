import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import auth from './auth/reducer';
import propiedad from './propiedad/reducer';
import dataprovider from './dataprovider/reducer';

export default combineReducers({
    auth,
    propiedad,
    dataprovider,
    form: formReducer
});