import $ from "jquery";

export const DATA_LOADING = "DATA_LOADING";
export const DATA_LOADED = "DATA_LOADED";
export const DATA_FAILED = "DATA_FAILED";
export const DATA_CLEANED = "DATA_CLEANED";

function dataLoading(sKey) {
    return {
        type: DATA_LOADING,
        key: sKey
    }
}

function dataLoaded(sKey, oData) {
    return {
        type: DATA_LOADED,
        data: oData,
        key: sKey,
    }
}

function dataFailed(sKey, oErr) {
    return {
        type: DATA_FAILED,
        key: sKey,
        data: oErr
    }
}

function dataCleaned(sKey) {
    return {
        type: DATA_CLEANED,
        key: sKey,
    }
}

export const loadData = (sKey, sUrl, oParams) => {
    return (dispatch, getState) => {
        dispatch(dataLoading(sKey));
        $.ajax({
            url: sUrl,
            data: $.extend({}, oParams),
            dataType: 'json',
            beforeSend: (xhr) => {
                var token = getState().auth.token;
                if (!!token) {
                    xhr.setRequestHeader("Authorization", `Token ${token}`);
                }
                return true;
            }
        }).done((data) => {
            dispatch(dataLoaded(sKey, data))
        }).fail((xhr, status, err) => {
            dispatch(dataFailed(sKey, err))
        });
    }
}

export const cleanData = (sKey) => {
    return (dispatch, getState) => {
        dispatch(dataCleaned(sKey));
    }
}