import { omit } from 'lodash';

import {
    DATA_LOADING,
    DATA_LOADED,
    DATA_FAILED,
    DATA_CLEANED
} from './actions'

const initialState = {
    datamap: {}
}

function dataprovider(state = initialState, action) {
    switch (action.type) {
        case DATA_LOADING:
            var newstate = {
                ...state,
                datamap: {
                    ...state.datamap,
                    [action.key]: {
                        ...state.datamap[action.key],
                        isLoading: true
                    }
                }
            };
            return newstate;
        case DATA_LOADED:
            return {
                ...state,
                datamap: {
                    ...state.datamap,
                    [action.key]: {
                        ...state.datamap[action.key],
                        isLoading: false,
                        data: action.data
                    }
                }
            }
        case DATA_FAILED:
            return {
                ...state,
                datamap: {
                    ...state.datamap,
                    [action.key]: {
                        ...state.datamap[action.key],
                        isLoading: false,
                        errors: action.data
                    }
                }
            }
        case DATA_CLEANED:
            var newDatamap = Object.assign(state.datamap);
            delete newDatamap[action.key];
            return {
                ...state,
                datamap: newDatamap
            }
        default:
            return state;
    }
}

export default dataprovider;