import $ from "jquery";

/* Propiedad individual */

const PROPIEDADES_URL = "/ajax/propiedades/"

/* Carga */
export const PROPIEDAD_LISTADO_LOADING = "PROPIEDAD_LISTADO_LOADING";
export const PROPIEDAD_LISTADO_LOAD_OK = "PROPIEDAD_LISTADO_LOAD_OK";
export const PROPIEDAD_LISTADO_LOAD_FAIL = "PROPIEDAD_LISTADO_LOAD_FAIL";

export const PROPIEDAD_SELECTED = "PROPIEDAD_SELECTED";
export const PROPIEDAD_UNSELECTED = "PROPIEDAD_UNSELECTED";


export const PROPIEDAD_LOADING = "PROPIEDAD_LOADING";
export const PROPIEDAD_LOAD_OK = "PROPIEDAD_LOAD_OK";
export const PROPIEDAD_LOAD_FAIL = "PROPIEDAD_LOAD_FAIL";

/* Alta */
export const PROPIEDAD_CREATING = "PROPIEDAD_CREATING";
export const PROPIEDAD_CREATE_OK = "PROPIEDAD_CREATION_OK";
export const PROPIEDAD_CREATE_FAIL = "PROPIEDAD_CREATION_FAIL";

export const PROPIEDAD_UPDATING = "PROPIEDAD_UPDATING";
export const PROPIEDAD_UPDATE_OK = "PROPIEDAD_UPDATE_OK";
export const PROPIEDAD_UPDATE_FAIL = "PROPIEDAD_UPDATE_FAIL";

export const PROPIEDAD_DELETING = "PROPIEDAD_DELETING";
export const PROPIEDAD_DELETE_OK = "PROPIEDAD_REMOVE_OK";
export const PROPIEDAD_DELETE_FAIL = "PROPIEDAD_REMOVE_FAIL";

/*Para detalle propiedad */
export const SUBASTA_LOAD_OK = "SUBASTA_LOAD_OK"
export const SUBASTA_LOADING = "SUBASTA_LOADING"
export const RESERVA_LOAD_OK = "RESERVA_LOAD_OK"
export const RESERVA_LOADING = "RESERVA_LOADING"


/* Action generators Lectura */
function propiedadListadoLoading() {
    return {
        type: PROPIEDAD_LISTADO_LOADING
    }
}

function propiedadListadoLoadOk(listado) {
    return {
        type: PROPIEDAD_LISTADO_LOAD_OK,
        data: listado
    }
}

function propiedadListadoLoadFail(err) {
    return {
        type: PROPIEDAD_LISTADO_LOAD_FAIL,
        error: err
    }
}

function propiedadSelected(propiedad) {
    return {
        type: PROPIEDAD_SELECTED,
        data: propiedad
    }
}

function propiedadUnselected() {
    return {
        type: PROPIEDAD_UNSELECTED
    }
}

function propiedadLoading() {
    return {
        type: PROPIEDAD_LOADING
    }
}

function subastaLoading() {
    return {
        type: SUBASTA_LOADING
    }
}

function propiedadLoadOk(oData) {
    return {
        type: PROPIEDAD_LOAD_OK,
        data: oData
    }
}

function subastaLoadOk(subData) {
    return {
        type: SUBASTA_LOAD_OK,
        data: subData
    }
}

function reservaLoading() {
    return {
        type: RESERVA_LOADING
    }
}

function reservaLoadOk(oData) {
    return {
        type: RESERVA_LOAD_OK,
        data: oData
    }
}

function propiedadLoadFail(oErr) {
    return {
        type: PROPIEDAD_LOAD_FAIL,
        error: oErr
    }
}

/* Action generators Creacion */
function propiedadCreating() {
    return {
        type: PROPIEDAD_CREATING
    }
}

function propiedadCreateOk(data) {
    return {
        type: PROPIEDAD_CREATE_OK,
        data: data
    }
}

function propiedadCreateFail(data) {
    return {
        type: PROPIEDAD_CREATE_FAIL,
        error: data
    }
}

/* Action generators Modificacion */
function propiedadUpdating () {
    return {
        type: PROPIEDAD_UPDATING
    }
}


function propiedadUpdateOk(data) {
    return {
        type: PROPIEDAD_UPDATE_OK,
        data: data
    }
}

function propiedadUpdateFail(data) {
    return {
        type: PROPIEDAD_UPDATE_FAIL,
        error: data
    }
}

/* Action generators Eliminación */
function propiedadDeleting() {
    return {
        type: PROPIEDAD_DELETING
    }
}

function propiedadDeleteOk(data) {
    return {
        type: PROPIEDAD_DELETE_OK,
        data: data
    }
}

function propiedadDeleteFail(data) {
    return {
        type: PROPIEDAD_DELETE_FAIL,
        error: data
    }
}

function preparePropiedadData(oData) {
    /* *hack* como el servicio usa un serializer distinto para alta/mod de propiedad,
        necesitamos convertir la data de la propiedad a algo que el serializer entienda */
    var propiedad = {}
    if (oData.id) propiedad.id = oData.id;
    if (oData.titulo) propiedad.titulo = oData.titulo;
    if (oData.descripcion) propiedad.descripcion = oData.descripcion;
    if (oData.direccion) {
        let {direccion} = oData
        if (direccion.calle) propiedad.calle = direccion.calle.id;
        if (direccion.numero) propiedad.numero = direccion.numero;
        if (direccion.piso) propiedad.piso = direccion.piso;
        if (direccion.dpto) propiedad.dpto = direccion.dpto;
    }
    if (oData.image) propiedad.image = oData.image;
    return propiedad;
}

export function loadPropiedad(idPropiedad) {
    return (dispatch, getState) => {
        dispatch(propiedadLoading());
        $.ajax({
            url: `${PROPIEDADES_URL}${idPropiedad}`,
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

export function crearPropiedad(oData, fnSuccess, fnError) {
    // TODO: Verificar si hay necesidad de transformar los datos de alguna forma
    return (dispatch, getState) => {
        dispatch(propiedadCreating());
        $.ajax({
            url: PROPIEDADES_URL,
            data: preparePropiedadData(oData),
            method: "POST",
            dataType: "json",
            beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", `Token ${getState().auth.token}`)
            }
        }).done(
            data => {
                dispatch(propiedadCreateOk(oData));
                fnSuccess();
            }
        ).fail(
            (xhr, text, err) => { 
                dispatch(propiedadCreateFail(err));
                fnError();
            }
        )
    }
}

export function modificarPropiedad(oData, fnSuccess, fnError) {
    return (dispatch, getState) => {
        dispatch(propiedadUpdating());
        $.ajax({
            url: `${PROPIEDADES_URL}${oData.id}/`,
            data: preparePropiedadData(oData),
            method: "PATCH",
            dataType: "json",
            beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", `Token ${getState().auth.token}`)
            }
        }).done(
            data => {
                dispatch(propiedadUpdateOk(oData));
                fnSuccess();
            }
        ).fail(
            (xhr, text, err) => {
                dispatch(propiedadUpdateFail(err));
                fnError();
            }
        )
    }
}

export function eliminarPropiedad(idPropiedad, fnSuccess, fnError) {
    return (dispatch, getState) => {
        dispatch(propiedadDeleting());
        $.ajax({
            url: `${PROPIEDADES_URL}${idPropiedad}`,
            method: "DELETE",
            dataType: "json",
            beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", `Token ${getState().auth.token}`)
            }
        }).done(
            data => {
                dispatch(propiedadDeleteOk(data));
                fnSuccess();
            }
        ).fail(
            (xhr, text, err) => {
                dispatch(propiedadDeleteFail(err));
                fnError();
            }
        )
    }
}

export function loadSubastaProp(skey, idPropiedad) {
    return (dispatch, getState) => {
        dispatch(subastaLoading(skey));
        $.ajax({
            url: `${PROPIEDADES_URL}${idPropiedad}/subastas`,
            dataType: "json",
            beforeSend: (xhr) => { xhr.setRequestHeader("Authorization", `Token ${getState().auth.token}`) }
        }).done(
            (data) => {
                dispatch(subastaLoadOk(data));
            }
        ).fail(
            (xhr, text, err) => {
                dispatch(propiedadLoadFail(err));
        });
    }
}

export function loadReservasProp(sKey, idPropiedad) {
    return (dispatch, getState) => {
        dispatch(reservaLoading(sKey));
        $.ajax({
            url: `${PROPIEDADES_URL}${idPropiedad}/reservasSinAdjudicar`,
            dataType: "json",
            beforeSend: (xhr) => { xhr.setRequestHeader("Authorization", `Token ${getState().auth.token}`) }
        }).done(
            (data) => {
                dispatch(reservaLoadOk(data));
            }
        ).fail(
            (xhr, text, err) => {
                dispatch(propiedadLoadFail(err));
        });
    }
}