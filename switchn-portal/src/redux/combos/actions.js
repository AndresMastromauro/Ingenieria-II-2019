import $ from "jquery";

export const CALLES_LOADING = "CALLES_LOADING";
export const CALLES_LOAD_OK = "CALLES_LOAD_OK";
export const CALLES_LOAD_FAIL = "CALLES_LOAD_FAIL";

export const LOCALIDADES_LOADING = "LOCALIDADES_LOADING";
export const LOCALIDADES_LOAD_OK = "LOCALIDADES_LOAD_OK";
export const LOCALIDADES_LOAD_FAIL = "LOCALIDADES_LOAD_FAIL";

export const PROVINCIAS_LOADING = "PROVINCIAS_LOADING";
export const PROVINCIAS_LOAD_OK = "PROVINCIAS_LOAD_OK";
export const PROVINCIAS_LOAD_FAIL = "PROVINCIAS_LOAD_FAIL";

export const PAISES_LOADING = "PAISES_LOADING";
export const PAISES_LOAD_OK = "PAISES_LOAD_OK";
export const PAISES_LOAD_FAIL = "PAISES_LOAD_FAIL";

function callesLoading() {
    return {
        type: CALLES_LOADING
    }
}

function callesLoadOk(aData) {
    return {
        type: CALLES_LOAD_OK,
        data: aData
    }
}

function callesLoadFail(oErr) {
    return {
        type: CALLES_LOAD_FAIL,
        errors: oErr
    }
}

function localidadesLoading() {
    return {
        type: LOCALIDADES_LOADING
    }
}

function localidadesLoadOk(aData) {
    return {
        type: LOCALIDADES_LOAD_OK,
        data: aData
    }
}

function localidadesLoadFail(oErr) {
    return {
        type: LOCALIDADES_LOAD_FAIL,
        errors: oErr
    }
}

function provinciasLoading() {
    return {
        type: PROVINCIAS_LOADING
    }
}

function provinciasLoadOk(aData) {
    return {
        type: PROVINCIAS_LOAD_OK,
        data: aData
    }
}

function provinciasLoadFail(oErr) {
    return {
        type: PROVINCIAS_LOAD_FAIL,
        errors: oErr
    }
}

function paisesLoading() {
    return {
        type: PAISES_LOADING,
    }
}

function paisesLoadOk(aData) {
    return {
        type: PAISES_LOAD_OK,
        data: aData
    }
}

function paisesLoadFail(oErr) {
    return {
        type: PAISES_LOAD_FAIL,
        errors: oErr
    }
}

function loadData(sUrl, oParams, token, fnSuccess, fnFailure) {
    $.ajax({
        url: sUrl,
        data: oParams,
        dataType: 'json',
        beforeSend: (xhr) => xhr.setRequestHeader("Authorization", `Token ${token}`)
    })
    .done(fnSuccess)
    .fail(fnFailure);
}

export function loadCallesFrom(localidad) {
    return (dispatch, getState) => {
        dispatch(callesLoading());
        loadData(
            "/ajax/calles",
            {
                localidad: localidad
            },
            getState().auth.token,
            (data) => dispatch(callesLoadOk(data)),
            (xhr, text, err) => dispatch(callesLoadFail(err))
        );
    }
}

export function loadLocalidadesFrom(provincia) {
    return (dispatch, getState) => {
        dispatch(localidadesLoading());
        loadData(
            "/ajax/localidades",
            {
                provincia: provincia
            },
            getState().auth.token,
            (data) => dispatch(localidadesLoadOk(data)),
            (xhr, text, err) => dispatch(localidadesLoadFail(err))
        );
    }
}

export function loadProvinciasFrom(pais) {
    return (dispatch, getState) => {
        dispatch(provinciasLoading());
        loadData(
            "/ajax/provincias",
            {
                pais: pais
            },
            getState().auth.token,
            (data) => dispatch(provinciasLoadOk(data)),
            (xhr, text, err) => dispatch(provinciasLoadFail(err))
        );
    }
}

export function loadPaises() {
    return (dispatch, getState) => {
        dispatch(paisesLoading());
        loadData(
            "/ajax/paises",
            {},
            getState().auth.token,
            (data) => dispatch(paisesLoadOk(data)),
            (xhr, text, err) => dispatch(paisesLoadFail(err))
        );
    }
}