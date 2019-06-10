import $ from "jquery";

export const DATA_LOADING = "DATA_LOADING";
export const DATA_LOADED = "DATA_LOADED";
export const DATA_FAILED = "DATA_FAILED";

function dataLoaded(oData) {
    return {
        type: DATA_LOADED,
        data: oData
    }
}

function dataFailed(oErr) {
    return {
        type: DATA_FAILED,
        data: oErr
    }
}

export const loadData = (sUrl, oParams) => {
    return (dispatch, getState) => {
        dispatch({type: DATA_LOADING});
        $.ajax({
            url: sUrl,
            data: $.extend({}, oParams),
            dataType: 'json',
            beforeSend: (xhr) => {
                debugger;
                var token = getState().auth.token;
                if (!!token) {
                    xhr.setRequestHeader("Authorization", `Token ${token}`);
                }
                return true;
            }
        }).done((data) => {
            dispatch(dataLoaded(data))
        }).fail((xhr, status, err) => {
            dispatch(dataFailed(err))
        });
    }
}