import $ from "jquery";

/* Listado de propiedades */
export const PROPIEDADES_LOADING = "PROPIEDADES_LOADING";
export const PROPIEDADES_LOAD_OK = "PROPIEDADES_LOAD_OK";
export const PROPIEDADES_LOAD_FAIL = "PROPIEDADES_LOAD_FAIL";

/* Propiedad individual */
export const PROPIEDAD_LOADING = "PROPIEDAD_LOADING";
export const PROPIEDAD_LOAD_OK = "PROPIEDAD_LOAD_OK";
export const PROPIEDAD_LOAD_FAIL = "PROPIEDAD_LOAD_FAIL";

function propiedadesLoadOk(aData) {
    return {
        type: PROPIEDADES_LOAD_OK,
        data: aData
    }
}

function propiedadesLoadFail(oErr) {
    return {
        type: PROPIEDADES_LOAD_FAIL,
        errors: oErr
    }
}

function propiedadesLoading() {
    return {type: PROPIEDADES_LOADING}
}

function propiedadLoading() {
    return {
        type: PROPIEDAD_LOADING
    }
}

function propiedadLoadOk(oData) {
    return {
        type: PROPIEDAD_LOAD_OK,
        data: oData
    }
}

function propiedadLoadFail(oErr) {
    return {
        type: PROPIEDAD_LOAD_FAIL,
        errors: oErr
    }
}

export function loadPropiedades(params) {
    return (dispatch, getState) => {
        dispatch(propiedadesLoading());
        $.ajax({
            url: "/ajax/propiedades",
            data: params || {},
            dataType: "json",
            beforeSend: (xhr) => { xhr.setRequestHeader("Authorization", `Token ${getState().auth.token}`)}
        }).done(
            (data) => {
                dispatch(propiedadesLoadOk(data));
            }
        ).fail(
            (xhr, text, err) => {
                dispatch(propiedadesLoadFail(err));
            }
        );
    }
}

export function loadPropiedadesFromLocalidad(localidad) {
    loadPropiedades({localidad: localidad});
}

export function loadPropiedad(id) {
    return (dispatch, getState) => {
        dispatch(propiedadLoading());
        $.ajax({
            url: `/ajax/propiedad/${id}`,
            dataType: "json",
            beforeSend: (xhr) => { xhr.setRequestHeader("Authorization", `Token ${getState().auth.token}`) }
        }).done(
            (data) => {
                dispatch(propiedadLoadOk(data));
            }
        ).fail(
            (xhr, text, err) => {
                dispatch(propiedadLoadFail(err));
        });
    }
}
