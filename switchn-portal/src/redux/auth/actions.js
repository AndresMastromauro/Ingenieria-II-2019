import $ from "jquery";

export const USER_LOADING = "USER_LOADING";
export const USER_LOADED = "USER_LOADED";
export const LOGIN_SUCCESSFUL = "LOGIN_SUCCESSFUL";
export const AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR";
export const LOGIN_FAILED = "LOGIN_FAILED";
export const LOGOUT_SUCCESSFUL = "LOGOUT_SUCCESSFUL";

function userLoaded(oUser) {
    return {
        type: USER_LOADED,
        data: {
            user: oUser
        }
    }
}

function authError(err) {
    return {
        type: AUTHENTICATION_ERROR,
        data: {
            errors: err
        }
    }
}

export const loadUser = () => {
    return (dispatch, getState) => {
        dispatch({type: USER_LOADING});
        const token = getState().auth.token;
        $.ajax({
            url: '/auth',
            dataType: 'json',
            beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization",`Token ${token}`)
            }
        }).done(
            (data) => { return dispatch(userLoaded(data)) }
        ).fail(
            (xhr, status, err) => { return dispatch(authError(err)) }
        );
    }
}