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

class SwitchnPortalPropiedadesFiltros extends React.Component {
    render() {
        const choiceAdapter = (choice) => { return {value: choice.id, caption: choice.nombre} };
        return (
            <div className="col-sm-4">
                <form>
                    <div className='form-group'>
                        <legend className="row">Filtros</legend>
                    
                        <div className="row">
                            <DataSourcedChoiceField
                                name={"pais"}
                                dataSourceURL={"/ajax/paises"}
                                adapter={choiceAdapter}
                                onChange={this.props.callbacks.onSelectPais}
                                label={"Pais"} />
                        </div>
                        <div className="row">
                            <DataSourcedChoiceField
                                dontLoadOnMount
                                name={"provincia"}
                                dataSourceURL={"/ajax/provincias"}
                                dataSourceParams={
                                    this.props.filtros.pais &&
                                        { pais: this.props.filtros.pais }
                                }
                                adapter={choiceAdapter}
                                onChange={this.props.callbacks.onSelectProvincia}
                                label={"Provincia/Estado"} />
                        </div>
                        <div className="row">
                            <DataSourcedChoiceField
                                dontLoadOnMount
                                name={"localidad"}
                                dataSourceURL={"/ajax/localidades"}
                                dataSourceParams={
                                    this.props.filtros.provincia &&
                                        { provincia: this.props.filtros.provincia }
                                }
                                adapter={choiceAdapter}
                                onChange={this.props.callbacks.onSelectLocalidad}
                                label={"Localidad"} />
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}


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
        return (
            <div className="container-fluid">
                <SwitchnPortalPropiedadesFiltros
                    filtros={this.state.filtros}
                    callbacks={{
                        onSelectLocalidad: this.onSelectLocalidad,
                        onSelectProvincia: this.onSelectProvincia,
                        onSelectPais: this.onSelectPais
                    }} />
                <div className="col-sm-8">
                    <AJAXDataProvider
                        dataSourceURL={"/ajax/propiedades"}
                        dataSourceParams={this.state.filtros}>
                        <_SwitchnPortalListadoPropiedades />
                    </AJAXDataProvider>
                </div>
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