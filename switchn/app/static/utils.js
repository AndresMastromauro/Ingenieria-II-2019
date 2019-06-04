function populateDropdown(sID, sURL, oURLParameters, fnAdapter) {
    var oSelect = $(`select#${sID}`);
    $.ajax({
        url: sURL,
        data: (oURLParameters ? oURLParameters : {}),
        dataType: 'json'
    }).done(function (data) {
        if (data.length > 0){
            var selectHeader = document.createElement("option");
            selectHeader.value = 0;
            selectHeader.innerText = "---Seleccione una opción---";
            oSelect.html(
                [selectHeader].concat(
                    data.map(function(e) {
                        var option = document.createElement("option");
                        option.value = (fnAdapter ? fnAdapter(e).id : e.id);
                        option.innerText = (fnAdapter ? fnAdapter(e).caption : e.caption);
                        return (option);
                    })
                )
            );
            oSelect.prop('disabled', false);
        } else {
            clearDropdown(sID, "(Sin datos para esta selección)");
        }
    }).fail(function() {
        console.log(`Ha ocurrido un error al procesar ${sID}`);
    });
}

function clearDropdown(sID, defaultCaption) {
    var oCombo = $(`select#${sID}`);
    oCombo.html(`<option value=''>${defaultCaption}</option>`);
    oCombo.prop('disabled', true);
}

function initDisabledDropdown(sID, caption, fnOnChange) {
    var oCombo = $(`select#${sID}`);
    if (fnOnChange)
        oCombo.change(fnOnChange);
    clearDropdown(sID, caption);
}