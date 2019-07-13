import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, getFormValues } from "redux-form";

import { SwitchnPortalPage, SwitchnPortalPropiedad } from '../portal/base';
import { PaisChoiceField, ProvinciaChoiceField, LocalidadChoiceField, WeekPickerModal } from '../common/forms/select';
import { SwitchnAPI } from '../utils/client';
import moment from 'moment';


class SwitchnPortalListadoPropiedadesVista extends React.Component {
    render() {
        var content;
        if (this.props.isLoading) {
            content = <h2>Cargando</h2>;
        } else if (!this.props.propiedades || this.props.propiedades.length == 0) {
            content = <h2>No hay propiedades para mostrar</h2>;
        } else {
            // console.log(propiedad);
            content = [];
            for (var propiedad of this.props.propiedades) {
                content.push(<SwitchnPortalPropiedad key={propiedad.id} propiedad={propiedad} />)
            }
        }
        return (
            <div className="col-sm-8">
                {content}
            </div>
        )
    }
}

class SwitchnPortalPropiedadesFiltros extends React.Component {
    getOffsetSemanaHasta() {
        debugger;
        if (!this.props.filtros || !this.props.filtros.fecha_inicio)
            return 53;
        let {fecha_inicio} = this.props.filtros;
        var semanas = (moment.duration(moment().diff(fecha_inicio)));
        semanas = semanas.add(2, 'months').get('weeks');
        return semanas;
    }

    render() {
        var pais;
        var provincia;
        if (this.props.filtros) {
            pais = this.props.filtros.pais;
            provincia = this.props.filtros.provincia;
        }
        return ( 
            <form>
                <div className='form-group'>
                    <h3>Filtros</h3>
                    <legend>Por localidad</legend>
                    <PaisChoiceField name={"pais"} />
                    <ProvinciaChoiceField name={"provincia"} pais={pais} />
                    <LocalidadChoiceField name={"localidad"} provincia={provincia} />
                </div>
                <div className='form-group'>
                    <legend>Por fecha disponible</legend>
                    <WeekPickerModal
                        name='fecha_inicio'
                        id='range-start'
                        title='Desde'
                        offsetSemanaDesde={25}
                        offsetSemanaHasta={53}
                    />
                    <WeekPickerModal
                        name='fecha_fin'
                        id='range-end'
                        title='Hasta'
                        offsetSemanaDesde={25}
                        offsetSemanaHasta={this.getOffsetSemanaHasta()}
                    />
                </div>
            </form>
        );
    }
}

/* SwitchnPortalPropiedadesFiltros = connect(
    state => {
        return {
            filtros: getFormValues("propiedades-filtros")(state)
        }
    }
)(SwitchnPortalPropiedadesFiltros); */

SwitchnPortalPropiedadesFiltros = reduxForm({
    form: "propiedades-filtros"
})(SwitchnPortalPropiedadesFiltros);


class SwitchnPortalListadoPropiedades extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            propiedades: []
        }
    }

    cargarPropiedades(oParams) {
        if (oParams) {
            if (isNaN(parseInt(oParams.pais, 10))) {
                delete oParams.pais;
                delete oParams.provincia;
                delete oParams.localidad;
            }
            if (isNaN(parseInt(oParams.provincia, 10))) {
                delete oParams.provincia;
                delete oParams.localidad;
            }
            if (isNaN(parseInt(oParams.localidad, 10))) {
                delete oParams.localidad;
            }
        }
        SwitchnAPI.propiedades.list(oParams || {})
            .then(data => {
                if (data) {
                    this.setState({propiedades: data.propiedades}) 
                }
            })
            .catch(err => console.log(err));
    }
    
    componentDidMount() {
        this.cargarPropiedades();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.filtros !== undefined && prevProps.filtros !== undefined) {
            var shouldUpdate = Object.keys(this.props.filtros)
                .some(key => this.props.filtros[key] !== prevProps.filtros[key]);
            if (shouldUpdate) {
                this.cargarPropiedades(this.props.filtros);
            }
        } else if (this.props.filtros !== undefined) {
            this.cargarPropiedades(this.props.filtros);
        }
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-4">
                        <SwitchnPortalPropiedadesFiltros filtros={this.props.filtros} />
                    </div>
                    <div className="col-8">
                        <SwitchnPortalListadoPropiedadesVista propiedades={this.state.propiedades} />
                    </div>
                </div>
            </div>
        )
    }
}

SwitchnPortalListadoPropiedades = connect(
    state => {
        return {
            filtros: getFormValues("propiedades-filtros")(state)
        }
    }
)(SwitchnPortalListadoPropiedades);


export class SwitchnHome extends React.Component {
    render() {
        return (
            <SwitchnPortalPage title={"Home"} user={this.props.user}>
                <SwitchnPortalListadoPropiedades />
            </SwitchnPortalPage>
        );
    }
}