import {
    PROPIEDAD_LOADING,
    PROPIEDAD_LOAD_FAIL,
    PROPIEDAD_LOAD_OK,
    PROPIEDAD_CREATING,
    PROPIEDAD_CREATE_FAIL,
    PROPIEDAD_CREATE_OK,
    PROPIEDAD_UPDATING,
    PROPIEDAD_UPDATE_FAIL,
    PROPIEDAD_UPDATE_OK,
    PROPIEDAD_DELETING,
    PROPIEDAD_DELETE_FAIL,
    PROPIEDAD_DELETE_OK,

} from './actions';

const initialState = {
    busy: false,
    data: null,
    error: null
}

export default function propiedad(state = initialState, action) {
    switch (action.type) {
        case PROPIEDAD_LOADING:
        case PROPIEDAD_CREATING:
        case PROPIEDAD_UPDATING:
        case PROPIEDAD_DELETING:
            return {
                ...state,
                busy: true,
                error: null
            };
        case PROPIEDAD_LOAD_FAIL:
        case PROPIEDAD_CREATE_FAIL:
        case PROPIEDAD_UPDATE_FAIL:
        case PROPIEDAD_DELETE_FAIL:
            return {
                ...state,
                busy: false,
                error: action.error
            };
        case PROPIEDAD_LOAD_OK:
        case PROPIEDAD_CREATE_OK:
        case PROPIEDAD_UPDATE_OK:
            return {
                ...state,
                busy: false,
                data: action.data
            };
        case PROPIEDAD_DELETE_OK:
            return {
                ...state,
                busy: false,
                data: null
            }
        default:
            return state;
    }
}