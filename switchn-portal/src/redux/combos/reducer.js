import {
    CALLES_LOADING,
    CALLES_LOAD_OK,
    CALLES_LOAD_FAIL,
    LOCALIDADES_LOADING,
    LOCALIDADES_LOAD_OK,
    LOCALIDADES_LOAD_FAIL,
    PROVINCIAS_LOADING,
    PROVINCIAS_LOAD_OK,
    PROVINCIAS_LOAD_FAIL,
    PAISES_LOADING,
    PAISES_LOAD_OK,
    PAISES_LOAD_FAIL,
} from "./actions";

const initialState = {
    calles: {
        isLoading: false,
        data: [],
        errors: {}
    },
    localidades: {
        isLoading: false,
        data: [],
        errors: {}
    },
    provincias: {
        isLoading: false,
        data: [],
        errors: {}
    },
    paises: {
        isLoading: false,
        data: [],
        errors: {}
    },
}

export function combos (state = initialState, action) {
    switch (action.type) {
        case CALLES_LOADING:
            return {
                ...state,
                calles: {
                    ...calles,
                    isLoading: true
                }
            };
        case CALLES_LOAD_OK:
            return {
                ...state,
                calles: {
                    ...calles,
                    isLoading: false,
                    data: action.data
                }
            };
        case CALLES_LOAD_FAIL
    }
}