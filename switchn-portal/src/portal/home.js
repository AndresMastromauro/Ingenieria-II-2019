import React from 'react';
import $ from 'jquery';
import { SwitchnPortalPage, SwitchnPortalPropiedad } from '../portal/base';
import { AJAXDataProvider } from '../common/utils';
import { DataSourcedChoiceField } from '../common/forms/inputs';
import { connect } from 'react-redux';
import { loadData } from '../redux/dataprovider/actions';
// import { SwitchnListadoPropiedades } from '../common/listados';


class _SwitchnPortalListadoPropiedades extends React.Component {
    render() {
        if (!this.props.data.length) {
            return <div><p>No hay propiedades para mostrar</p></div>
        }
        var propiedades = this.props.data.map(
            function(propiedad) {
                return <SwitchnPortalPropiedad key={propiedad.id} propiedad={propiedad} />
            }
        );
        return (
            <div>
                {propiedades}
            </div>
        )
    }
}

/* let SwitchnPortalListadoPropiedades = connect(
    state => {
        return {
            data: state.dataprovider.data
        }
    },
    dispatch => {
        return {
            loadData: (sUrl, oParams) => dispatch(loadData(sUrl, oParams))
        }
    }
)(_SwitchnPortalListadoPropiedades); */


class SwitchnPortalListadoPropiedades extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filtros: {}
        }
        this.onSelectLocalidad = this.onSelectLocalidad.bind(this);
        this.onSelectProvincia = this.onSelectProvincia.bind(this);
        this.onSelectPais = this.onSelectPais.bind(this);
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
        const choiceAdapter = (choice) => { return {value: choice.id, caption: choice.nombre} };
        return (
            <div>
                <form>
                    <legend>Filtros</legend>
                    <span className='form-group'>
                        <DataSourcedChoiceField
                            dataSourceURL={"/ajax/paises"}
                            adapter={choiceAdapter}
                            onChange={this.onSelectPais} />
                        <DataSourcedChoiceField
                            dontLoadOnMount
                            dataSourceURL={"/ajax/provincias"}
                            dataSourceParams={
                                this.state.filtros.pais &&
                                    { pais: this.state.filtros.pais }
                            }
                            adapter={choiceAdapter}
                            onChange={this.onSelectProvincia} />
                        <DataSourcedChoiceField
                            dontLoadOnMount
                            dataSourceURL={"/ajax/localidades"}
                            dataSourceParams={
                                this.state.filtros.provincia &&
                                    { provincia: this.state.filtros.provincia }
                            }
                            adapter={choiceAdapter}
                            onChange={this.onSelectLocalidad} />
                        </span>
                </form>
                <AJAXDataProvider
                    dataSourceURL={"/ajax/propiedades"}
                    dataSourceParams={this.state.filtros}>
                    <_SwitchnPortalListadoPropiedades />
                </AJAXDataProvider>
            </div>
        )
    }
}



export class SwitchnHome extends React.Component {
    render() {
        return (
            <SwitchnPortalPage title={"Home"} user={this.props.user}>
                <SwitchnPortalListadoPropiedades />
            </SwitchnPortalPage>
        );
    }
}