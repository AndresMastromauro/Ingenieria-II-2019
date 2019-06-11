import {
    PROPIEDADES_LOADING,
    PROPIEDADES_LOAD_OK,
    PROPIEDADES_LOAD_FAIL,
    PROPIEDAD_LOADING,
    PROPIEDAD_LOAD_FAIL,
    PROPIEDAD_LOAD_OK
} from './actions';

const initialState = {
    isLoading: false,
    propiedades: [],
    propiedad: {},
    errors: {}
}

export default function propiedades(state = initialState, action) {
    switch (action.type) {
        case PROPIEDAD_LOADING:
        case PROPIEDADES_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case PROPIEDADES_LOAD_OK:
            return {
                ...state,
                isLoading: false,
                propiedades: action.data
            };
        case PROPIEDADES_LOAD_FAIL:
        case PROPIEDAD_LOAD_FAIL:
            return {
                ...state,
                isLoading: false,
                errors: action.errors
            };
        case PROPIEDAD_LOAD_OK:
            return {
                ...state,
                isLoading: false,
                propiedad: action.data
            };
        default:
            return state;
    }
}