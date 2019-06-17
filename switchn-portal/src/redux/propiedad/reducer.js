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
    PROPIEDAD_LISTADO_LOADING,
    PROPIEDAD_LISTADO_LOAD_OK,
    PROPIEDAD_LISTADO_LOAD_FAIL,
    PROPIEDAD_SELECTED,
    PROPIEDAD_UNSELECTED

} from './actions';

const initialState = {
    busy: false,
    listadoPropiedades: [],
    data: null,
    error: null
}

export default function propiedad(state = initialState, action) {
    switch (action.type) {
        case PROPIEDAD_LOADING:
        case PROPIEDAD_CREATING:
        case PROPIEDAD_UPDATING:
        case PROPIEDAD_DELETING:
        case PROPIEDAD_LISTADO_LOADING:
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
        case PROPIEDAD_LISTADO_LOAD_OK:
            return {
                ...state,
                busy: false,
                listadoPropiedades: action.data
            }
        case PROPIEDAD_LISTADO_LOAD_FAIL:
            return {
                ...state,
                busy: false,
                listadoPropiedades: [],
                error: action.error
            }
        case PROPIEDAD_SELECTED:
        case PROPIEDAD_LOAD_OK:
        case PROPIEDAD_CREATE_OK:
        case PROPIEDAD_UPDATE_OK:
            return {
                ...state,
                busy: false,
                data: action.data
            };
        case PROPIEDAD_UNSELECTED:
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