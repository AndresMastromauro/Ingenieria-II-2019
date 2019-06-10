import {
    DATA_LOADING,
    DATA_LOADED,
    DATA_FAILED
} from './actions'

const initialState = {
    data: {},
    isLoading: false,
    errors: {}
}

function dataprovider(state = initialState, action) {
    switch (action.type) {
        case DATA_LOADING:
            return {
                ...state,
                isLoading: true
            }
        case DATA_LOADED:
            return {
                ...state,
                data: action.data,
                isLoading: false
            }
        case DATA_FAILED:
            return {
                ...state,
                isLoading: false,
                errors: action.data
            }
        default:
            return state;
    }
}

export default dataprovider;