import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';

import { SwitchnPortalPage, SwitchnPortalPropiedad } from '../portal/base';
import { PaisChoiceField, ProvinciaChoiceField, LocalidadChoiceField } from '../common/forms/select';
import { loadData } from '../redux/dataprovider/actions';


class SwitchnPortalListadoPropiedadesVista extends React.Component {
    render() {
        var content;
        if (this.props.isLoading) {
            content = <h2>Cargando</h2>;
        } else if (!this.props.propiedades || this.props.propiedades.length == 0) {
            content = <h2>No hay propiedades para mostrar</h2>;
        } else {
            content = this.props.propiedades.map(
                function(propiedad) {
                    return <SwitchnPortalPropiedad key={propiedad.id} propiedad={propiedad} />
                }
            );
        }
        return (
            <div className="col-sm-8">
                {content}
            </div>
        )
    }
}

class SwitchnPortalPropiedadesFiltros extends React.Component {
    render() {
        return (
            <div className="col-sm-4">
                <form>
                    <div className='form-group'>
                        <legend>Filtros</legend>
                        <PaisChoiceField onChange={this.props.callbacks.onSelectPais} />
                        <ProvinciaChoiceField
                            onChange={this.props.callbacks.onSelectProvincia}
                            pais={this.props.filtros.pais} />
                        <LocalidadChoiceField
                            onChange={this.props.callbacks.onSelectLocalidad}
                            provincia={this.props.filtros.provincia} />
                    </div>
                </form>
            </div>
        );
    }
}


class _SwitchnPortalListadoPropiedades extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filtros: {}
        }
        this.onSelectLocalidad = this.onSelectLocalidad.bind(this);
        this.onSelectProvincia = this.onSelectProvincia.bind(this);
        this.onSelectPais = this.onSelectPais.bind(this);
    }

    componentDidMount() {
        this.props.loadPropiedades();
    }

    componentDidUpdate(prevProps, prevState) {
        var shouldUpdate = Object.keys(this.state.filtros)
            .some(key => this.state.filtros[key] !== prevState.filtros[key]);
        if (shouldUpdate) {
            this.props.loadPropiedades(this.state.filtros);
        }
    }

    onSelectLocalidad(e) {
        var filtros = $.extend({}, this.state.filtros);
        filtros.localidad = e.target.value;
        this.setState({filtros: filtros});
    }

    onSelectProvincia(e) {
        var filtros = {
            pais: this.state.filtros.pais,
            provincia: e.target.value
        };
        this.setState({filtros: filtros});
    }

    onSelectPais(e) {
        var filtros = {
            pais: e.target.value
        };
        this.setState({filtros: filtros});
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <SwitchnPortalPropiedadesFiltros
                        filtros={this.state.filtros}
                        callbacks={{
                            onSelectLocalidad: this.onSelectLocalidad,
                            onSelectProvincia: this.onSelectProvincia,
                            onSelectPais: this.onSelectPais
                        }} />
                    <SwitchnPortalListadoPropiedadesVista propiedades={this.props.propiedades} />
                </div>
            </div>
        )
    }
}

let SwitchnPortalListadoPropiedades = connect(
    state => {
        var propiedades = state.dataprovider.datamap.propiedades
        return {
            propiedades: propiedades && propiedades.data,
            isLoading: propiedades && propiedades.isLoading
        }
    },
    dispatch => {
        return {
            loadPropiedades: (oParams) => dispatch(loadData("propiedades", "/ajax/propiedades", oParams)),
        }
    }
)(_SwitchnPortalListadoPropiedades)

export class SwitchnHome extends React.Component {
    render() {
        return (
            <SwitchnPortalPage title={"Home"} user={this.props.user}>
                <SwitchnPortalListadoPropiedades />
            </SwitchnPortalPage>
        );
    }
}