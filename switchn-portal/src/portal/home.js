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
    state = {
        today: null
    }

    componentDidMount() {
        SwitchnAPI.getToday()
            .then(data => this.setState({today: data.today}))
            .catch(() => this.setState({today: new Date()}))
    }

    getInicioOffsetSemanaDesde() {
        const ult_lunes = moment(this.state.today).subtract(moment(this.state.today).weekday());
        if (!this.props.filtros || !this.props.filtros.fecha_fin)
            return 25;
        let {fecha_fin} = this.props.filtros;
        var semanas = moment.duration(moment(fecha_fin).diff(ult_lunes));
        semanas = semanas.subtract(8, 'weeks').as('weeks');
        return semanas > 25 ? semanas : 25;
    }

    getInicioOffsetSemanaHasta() {
        const ult_lunes = moment(this.state.today).subtract(moment(this.state.today).weekday());
        var semanas;
        if (this.props.filtros)
            if (this.props.filtros.fecha_fin) {
                let {fecha_fin} = this.props.filtros;
                var semanas = moment.duration(moment(fecha_fin).diff(ult_lunes));
                // semanas = semanas.add(2, 'months').as('weeks');
                semanas = semanas.as('weeks');
            } else {
                semanas = 53;
            }
        return semanas;
    }

    getFinOffsetSemanaDesde() {
        const ult_lunes = moment(this.state.today).subtract(moment(this.state.today).weekday());
        var semanas;
        if (this.props.filtros) {
            let {fecha_inicio, fecha_fin} = this.props.filtros;
            if (fecha_inicio) {
                semanas = moment.duration(moment(fecha_inicio).diff(ult_lunes));
                semanas = semanas.as('weeks');
            } else if (fecha_fin) {
                semanas = moment.duration(moment(fecha_fin).diff(ult_lunes));
                semanas = semanas.subtract(8, 'weeks').as('weeks');
                semanas = semanas > 25 ? semanas : 25;
            }
        } else {
            semanas = 25;
        }
        return semanas;
    }

    getFinOffsetSemanaHasta() {
        const ult_lunes = moment(this.state.today).subtract(moment(this.state.today).weekday());
        var semanas;
        if (this.props.filtros)
            if (this.props.filtros.fecha_inicio) {
                let {fecha_inicio} = this.props.filtros;
                var semanas = moment.duration(moment(fecha_inicio).diff(ult_lunes));
                semanas = semanas.add(8, 'weeks').as('weeks');
            } else {
                semanas = 53;
            }
        return semanas;
    }

    render() {
        if (!this.state.today) return null;
        var pais, provincia, fecha_inicio, fecha_fin;
        if (this.props.filtros) {
            let {filtros} = this.props;
            pais = filtros.pais;
            provincia = filtros.provincia;
            fecha_inicio = filtros.fecha_inicio;
            fecha_fin = filtros.fecha_fin;
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
                        value={fecha_inicio}
                        offsetSemanaDesde={this.getInicioOffsetSemanaDesde()}
                        offsetSemanaHasta={this.getInicioOffsetSemanaHasta()}
                    />
                    <WeekPickerModal
                        name='fecha_fin'
                        id='range-end'
                        title='Hasta'
                        value={fecha_fin}
                        offsetSemanaDesde={this.getFinOffsetSemanaDesde()}
                        offsetSemanaHasta={this.getFinOffsetSemanaHasta()}
                    />
                </div>
            </form>
        );
    }
}

SwitchnPortalPropiedadesFiltros = connect(
    state => {
        return {
            filtros: getFormValues("propiedades-filtros")(state)
        }
    }
)(SwitchnPortalPropiedadesFiltros);

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
                        <SwitchnPortalPropiedadesFiltros /* filtros={this.props.filtros}  *//>
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