import $ from "jquery";

export const USER_LOADING = "USER_LOADING";
export const USER_LOADED = "USER_LOADED";
export const LOGIN_SUCCESSFUL = "LOGIN_SUCCESSFUL";
export const AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR";
export const LOGIN_FAILED = "LOGIN_FAILED";
export const LOGOUT_SUCCESSFUL = "LOGOUT_SUCCESSFUL";

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
            errors: err
        }
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
        var token = getState().auth.token
        if (token === null) {
            token = localStorage.getItem("token");
        }
        if (token === null) {
            dispatch(authError(null))
        }
        $.ajax({
            url: '/auth/user',
            dataType: 'json',
            beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization",`Token ${token}`)
            }
        }).done(
            (data) => {
                $.ajaxSetup({
                    beforeSend: (xhr) => xhr.setRequestHeader("Authorization", `Token ${token}`)
                });
                dispatch(userLoaded({
                    user: data,
                    token: token
                }));
        }).fail(
            (xhr, status, err) => {dispatch(authError(null)) }
        );
    }
}

export const login = (username, password) => {
    return (dispatch, getState) => {
        return $.ajax({
            url: "/auth/login/",
            method: "POST",
            data: {
                username: username,
                password: password
            },
            dataType: "json"
        }).done(
            (data) => dispatch(loginSuccessful(data))
        ).fail(
            function (xhr, status, err) {
                if (xhr.status === 403 || xhr.status === 401) {
                    dispatch(authError(xhr.responseJSON.detail));
                } else {
                    dispatch(loginFailed(xhr.responseJSON.non_field_errors));
                }
            }
        )
    }
}

export const logout = () => {
    return (dispatch, getState) => {
        if (getState().auth.isAuthenticated) {
            $.ajax({
                url: "/auth/logout/",
                method: "POST",
                dataType: "json",
                beforeSend: (xhr) => { xhr.setRequestHeader("Authorization", `Token ${getState().auth.token}`)}
            }).done((data) => {
                $.ajaxSetup({
                    beforeSend: (xhr) => {}
                });
                dispatch({type: LOGOUT_SUCCESSFUL});
            }).fail( (xhr, status, err) =>{
                throw(err);
            })
        }
    }
}