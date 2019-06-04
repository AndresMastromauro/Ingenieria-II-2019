function loadPaises() {
    populateDropdown(
        "id_pais",
        "/ajax/paises",
        null,
        (function(p) {
            return {'id': p.id, 'caption': p.nombre}
        })
    );
}

function loadProvincias(idPais) {
    populateDropdown(
        "id_provincia",
        "/ajax/provincias",
        {pais: idPais},
        (function(p) {
            return {id: p.id, caption: p.nombre}
        })
    );
}

function loadLocalidades(idProvincia) {
    populateDropdown(
        "id_localidad",
        "/ajax/localidades",
        {provincia: idProvincia},
        (function(l) {
            return {id: l.id, caption: l.nombre}
        })
    );
}

function loadCalles(id_localidad) {
    populateDropdown(
        "id_calle",
        "/ajax/calles",
        {localidad: id_localidad},
        (function(c) {
            return {id: c.id, caption: c.nombre}
        })
    );
}


function onChangeDecorator(fnCallback) {
    return (
        function(e) {
            fnCallback(e.target.value)
        }
    );
}

function paisOnChange(e) {
    clearLocalidades();
    loadProvincias(e.target.value);
}

function provinciaOnChange(e) {
    clearCalles();
    loadLocalidades(e.target.value);
}

function localidadOnChange(e) {
    loadCalles(e.target.value(e));
}

function clearPaises() {
    clearDropdown("id_pais", "(No hay paises para elegir)");
    clearProvincias();
}

function clearProvincias() {
    clearDropdown("id_provincia", "(Debe seleccionar un pais)")
    clearLocalidades();
}

function clearLocalidades() {
    clearDropdown("id_localidad", "(Debe seleccionar una provincia)");
    clearCalles();
}

function clearCalles() {
    clearDropdown("id_calle", "(Debe seleccionar una localidad)");
}

function init() {
    var calle_id = $('select#id_calle').val();
    var localidad_id, provincia_id, pais_id;

    initDisabledDropdown("id_pais", "(No hay paises para elegir)", paisOnChange);
    initDisabledDropdown("id_provincia", "(Debe seleccionar un pais)", provinciaOnChange);
    initDisabledDropdown("id_localidad", "(Debe seleccionar una provincia)", localidadOnChange);
    initDisabledDropdown("id_calle", "(Debe seleccionar una localidad)");

    if (calle_id) {
        $.ajax({
            url: "/ajax/calles",
            data: {
                id: calle_id
            }
        }).done(
            function(data) {
                localidad_id = data[0].localidad;
                loadCalles(localidad_id);
                $.ajax({
                    url: "/ajax/localidades",
                    data: {
                        id: localidad_id
                    }
                }).done(
                    function(data) {
                        provincia_id = data[0].provincia;
                        loadLocalidades(provincia_id);
                        
                        $.ajax({
                            url: "/ajax/provincias",
                            data: {
                                id: provincia_id
                            }
                        }).done(
                            function(data) {
                                debugger;
                                pais_id = data[0].pais;
                                loadProvincias(pais_id);
                                loadPaises();
                                $('select#id_pais').val(pais_id);
                                $('select#id_provincia').val(provincia_id);
                                $('select#id_localidad').val(localidad_id);
                                $('select#id_calle').val(calle_id);
                            }
                        );
                    }
                );
            }
        );
    } else {
        loadPaises();
    }
}

$(document).ready(init);