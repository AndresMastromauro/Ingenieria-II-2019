import {
    USER_LOADING,
    USER_LOADED,
    LOGIN_SUCCESSFUL,
    AUTHENTICATION_ERROR,
    LOGIN_FAILED,
    LOGOUT_SUCCESSFUL
} from "./actions";

const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    isLoading: true,
    user: null,
    errors: {},
  };

function auth(state = initialState, action ="") {
    switch(action.type) {
        case USER_LOADING:
            return {
                ...state,
                isLoading: true
            };

        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true, 
                isLoading: false, 
                user: action.user
            };

        case LOGIN_SUCCESSFUL:
            localStorage.setItem("token", action.data.token);
            return {
                ...state, 
                ...action.data, 
                isAuthenticated: true, 
                isLoading: false, 
                errors: null
            };

        case AUTHENTICATION_ERROR:
        case LOGIN_FAILED:
        case LOGOUT_SUCCESSFUL:
            localStorage.removeItem("token");
            return {
                ...state,
                errors: action.data,
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false
            };

        default:
            return state;
    }
    
}

export default auth;