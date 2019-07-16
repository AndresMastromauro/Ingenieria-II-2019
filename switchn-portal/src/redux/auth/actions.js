import { SwitchnAPI } from '../../utils/client';
import { SHOW_OVERLAY, HIDE_OVERLAY } from '../overlay/overlay';

export const USER_LOADING = "USER_LOADING";
export const USER_LOADED = "USER_LOADED";
export const LOGIN_SUCCESSFUL = "LOGIN_SUCCESSFUL";
export const AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR";
export const LOGIN_FAILED = "LOGIN_FAILED";
export const LOGOUT_SUCCESSFUL = "LOGOUT_SUCCESSFUL";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAIL = "REGISTER_FAIL";

function userLoaded(oData) {
    return {
        type: USER_LOADED,
        data: oData
    }
}

function authError(err) {
    return {
        type: AUTHENTICATION_ERROR,
        data: {
            data: err
        }
    }
}

function signUpSuccessful(oData) {
    return {
        type: REGISTER_SUCCESS,
        data: oData
    }
}

function signUpFailed(oData) {
    return {
        type: REGISTER_FAIL,
        data: oData
    }
}

function loginSuccessful(oData) {
    return {
        type: LOGIN_SUCCESSFUL,
        data: oData
    }
}

function loginFailed(oData) {
    return {
        type: LOGIN_FAILED,
        data: oData
    }
}


export const loadUser = () => {
    return (dispatch, getState) => {
        dispatch({type: USER_LOADING});
        dispatch({type: SHOW_OVERLAY});
        var token = getState().auth.token
        if (token == null) {
            token = localStorage.getItem("token");
        }
        if (token == null) {
            dispatch({type: HIDE_OVERLAY});
            return dispatch(authError(null));  
        }
        return SwitchnAPI.getUserData(token)
            .then(data => dispatch(
                userLoaded({
                        token: token,
                        user: data
                    })
                )
            ).catch(err => dispatch(authError(err || []))
            ).finally(() => dispatch({type: HIDE_OVERLAY}));
    }
}

export const login = (username, password) => {
    return (dispatch, getState) => {
        dispatch({type: SHOW_OVERLAY});
        return SwitchnAPI.login(username, password)
            .then(data => {
                dispatch(loginSuccessful(data))
            }).catch(err => {
                dispatch(loginFailed(err || []))
            }).finally(() => dispatch({type: HIDE_OVERLAY}))
    }
}

export const logout = () => {
    return (dispatch, getState) => {
        dispatch({type: SHOW_OVERLAY});
        return SwitchnAPI.logout()
            .then(() => dispatch({type: LOGOUT_SUCCESSFUL}))
            .catch((err) => { throw(err) })
            .finally(() => dispatch({type: HIDE_OVERLAY}))
    }
}
