import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import { reduxForm, getFormValues } from "redux-form";

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

class __SwitchnPortalPropiedadesFiltros extends React.Component {
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
                    <legend>Filtros</legend>
                    <PaisChoiceField name={"pais"} />
                    <ProvinciaChoiceField name={"provincia"} pais={pais} />
                    <LocalidadChoiceField name={"localidad"} provincia={provincia} />
                </div>
            </form>
        );
    }
}

let _SwitchnPortalPropiedadesFiltros = connect(
    state => {
        return {
            filtros: getFormValues("propiedades-filtros")(state)
        }
    }
)(__SwitchnPortalPropiedadesFiltros);

let SwitchnPortalPropiedadesFiltros = reduxForm({
    form: "propiedades-filtros"
})(_SwitchnPortalPropiedadesFiltros);


class _SwitchnPortalListadoPropiedades extends React.Component {

    componentDidMount() {
        this.props.loadPropiedades();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.filtros !== undefined && prevProps.filtros !== undefined) {
            var shouldUpdate = Object.keys(this.props.filtros)
                .some(key => this.props.filtros[key] !== prevProps.filtros[key]);
            if (shouldUpdate) {
                this.props.loadPropiedades(this.props.filtros);
            }
        } else if (this.props.filtros !== undefined) {
            this.props.loadPropiedades(this.props.filtros);
        }
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-4">
                        <SwitchnPortalPropiedadesFiltros />
                    </div>
                    <div className="col-8">
                        <SwitchnPortalListadoPropiedadesVista propiedades={this.props.propiedades} />
                    </div>
                </div>
            </div>
        )
    }
}

let SwitchnPortalListadoPropiedades = connect(
    state => {
        var propiedades = state.dataprovider.datamap.propiedades;
        return {
            filtros: getFormValues("propiedades-filtros")(state),
            propiedades: propiedades && propiedades.data,
            isLoading: propiedades && propiedades.isLoading
        }
    },
    dispatch => {
        return {
            loadPropiedades: (oParams) => dispatch(loadData("propiedades", "/ajax/propiedades", oParams)),
        }
    }
)(_SwitchnPortalListadoPropiedades);

export class SwitchnHome extends React.Component {
    render() {
        return (
            <SwitchnPortalPage title={"Home"} user={this.props.user}>
                <SwitchnPortalListadoPropiedades />
            </SwitchnPortalPage>
        );
    }
}