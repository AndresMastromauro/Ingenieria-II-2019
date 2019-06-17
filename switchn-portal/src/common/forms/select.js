import React from "react";
import { connect } from "react-redux";
import {Field} from "redux-form";

/* WeekPicker */
import DayPicker from "react-day-picker";
import 'react-day-picker/lib/style.css';
import moment from "moment";
import MomentLocaleUtils from "react-day-picker/moment";
import './weekpicker.css';
import "moment/locale/es";

import { Label } from "./misc";
import { loadData, cleanData } from "../../redux/dataprovider/actions";

// import { AJAXDataProvider } from "../utils";

class ChoiceField extends React.Component { 
    render() {
        var sClass = "form-control "
        return (
            <div>
                <Label htmlFor={this.props.name}>{this.props.label}</Label>
                <Field component={"select"} disabled={!this.props.choices || this.props.choices.length == 0} className={this.props.className ? sClass + this.props.className : sClass } name={this.props.name} value={this.props.value} /* onChange={this.props.onChange} */>
                    <option key={0} value={this.props.nullKey}>{this.props.nullCaption}</option>
                    { this.props.choices && this.props.choices.map(
                        function(choice) {
                            if (this.props.adapter)
                                choice = this.props.adapter(choice);
                            return (<option key={choice.value} value={choice.value}>{choice.caption}</option>);
                        }.bind(this)
                    )}
                </Field>
            </div>
        );
    }
}

/* class _DataSourcedChoiceField extends React.Component {
    render() {
        return (
            <ChoiceField {...this.props} choices={this.props.data} />
        );
    }
}

class DataSourcedChoiceField extends React.Component {
    render() {
        return (
            <AJAXDataProvider dontLoadOnMount={this.props.dontLoadOnMount} dataSourceURL={this.props.dataSourceURL} dataSourceParams={this.props.dataSourceParams}>
                <_DataSourcedChoiceField adapter={this.props.adapter} onChange={this.props.onChange} label={this.props.label} nullKey={0} nullCaption={this.props.nullCaption} />
            </AJAXDataProvider>
        )
    }
} */


class _CalleChoiceField extends React.Component {
    componentDidMout() {
        if (this.props.localidad != undefined) {
            this.props.loadCalles(this.props.localidad);
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.localidad != undefined) {
            if (prevProps.localidad !== this.props.localidad) {
                this.props.loadCalles(this.props.localidad);
            }
        } else {
            this.props.cleanUp();
        }
    }
    componentWillUnmount() {
        this.props.cleanUp();
    }
    render() {
        return (
            <ChoiceField
                label={"Calle"}
                name={this.props.name}
                value={this.props.value}
                choices={this.props.calles}
                adapter={(calle) => { return {value: calle.id, caption: calle.nombre} }}
                onChange={this.props.onChange}
                nullCaption={"Elija una calle..."} />
        )
    }
}

let CalleChoiceField = connect(
    state => {
        return {
            calles: state.dataprovider.datamap.calles && state.dataprovider.datamap.calles.data
        }
    },
    dispatch => {
        return {
            loadCalles: (idLocalidad) => dispatch(loadData("calles", "/ajax/calles", {localidad: idLocalidad})),
            cleanUp: () => dispatch(cleanData("calles"))
        }
    }
)(_CalleChoiceField);



class _LocalidadChoiceField extends React.Component {
    componentDidMout() {
        if (this.props.provincia != undefined) {
            this.props.loadLocalidades(this.props.provincia);
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.provincia != undefined) {
            if (prevProps.provincia !== this.props.provincia) {
                this.props.loadLocalidades(this.props.provincia);
            }
        } else {
            this.props.cleanUp();
        }
    }
    componentWillUnmount() {
        this.props.cleanUp();
    }
    render() {
        return (
            <ChoiceField
                label="Localidad"
                name={this.props.name}
                value={this.props.value}
                choices={this.props.localidades}
                adapter={(localidad) => { return {value: localidad.id, caption: localidad.nombre} }}
                onChange={this.props.onChange}
                nullCaption={"Elija una localidad..."} />
        )
    }
}

let LocalidadChoiceField = connect(
    state => {
        return {
            localidades: state.dataprovider.datamap.localidades && state.dataprovider.datamap.localidades.data
        }
    },
    dispatch => {
        return {
            loadLocalidades: (idProvincia) => dispatch(loadData("localidades", "/ajax/localidades", {provincia: idProvincia})),
            cleanUp: () => dispatch(cleanData("localidades"))
        }
    }
)(_LocalidadChoiceField);



class _ProvinciaChoiceField extends React.Component {
    componentDidMout() {
        if (this.props.pais != undefined) {
            this.props.loadProvincias(this.props.pais);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.pais != undefined) {
            if (prevProps.pais !== this.props.pais) {
                this.props.loadProvincias(this.props.pais);
            }
        } else {
            this.props.cleanUp();
        }
    }

    componentWillUnmount() {
        this.props.cleanUp();
    }

    render() {
        return (
            <ChoiceField
                label="Provincia"
                name={this.props.name}
                value={this.props.value}
                choices={this.props.provincias}
                adapter={(provincia) => { return {value: provincia.id, caption: provincia.nombre} }}
                onChange={this.props.onChange}
                nullCaption={"Elija una provincia..."} />
        )
    }
}

let ProvinciaChoiceField = connect(
    state => {
        return {
            provincias: state.dataprovider.datamap.provincias && state.dataprovider.datamap.provincias.data
        }
    },
    dispatch => {
        return {
            loadProvincias: idPais => dispatch(loadData("provincias","/ajax/provincias", {pais: idPais})),
            cleanUp: () => dispatch(cleanData("provincias"))
        }
    }
)(_ProvinciaChoiceField);


class _PaisChoiceField extends React.Component {
    componentDidMount() {
        this.props.loadPaises();
    }
    componentWillUnmount() {
        this.props.cleanUp();
    }
    render() {
        return (
            <ChoiceField
                label="Pais"
                name={this.props.name}
                value={this.props.value}
                choices={this.props.paises}
                adapter={(pais) => { return {value: pais.id, caption: pais.nombre} }}
                onChange={this.props.onChange}
                nullCaption={"Elija un pais..."}
            />
        )
    }
}

let PaisChoiceField = connect(
    (state) => {
        return {
            paises: state.dataprovider.datamap.paises && state.dataprovider.datamap.paises.data
        }
    },
    (dispatch) => {
        return {
            loadPaises: () => dispatch(loadData("paises", "/ajax/paises")),
            cleanUp: () => dispatch(cleanData("paises"))
        }
    }
)(_PaisChoiceField);

class _TipoPropiedadChoiceField extends React.Component {
    componentDidMount() {
        this.props.loadTipos();
    }

    componentWillUnmount() {
        this.props.cleanUp();
    }

    render() {
        return (
            <ChoiceField
                /* label="Tipo"
                name={this.props.name}
                value={this.props.value} */
                {...this.props}
                choices={this.props.tipos}
                adapter={(tipo) => { return {value: tipo.id, caption: tipo.descripcion} }}
                /* onChange={this.props.input.onChange} */
                nullCaption={"Elija un tipo..."} />
        );
    }
}

let TipoPropiedadChoiceField = connect(
    (state) => {
        var tipos = state.dataprovider.datamap.tipospropiedad
        return {
            tipos: tipos && tipos.data
        }
    },
    (dispatch) => {
        return {
            loadTipos: () => dispatch(loadData("tipospropiedad", "/ajax/tipospropiedad")),
            cleanUp: () => dispatch(cleanData("tipospropiedad"))
        }
    }
)(_TipoPropiedadChoiceField);


class _WeekField extends React.Component {
    state = {
        hoverRange: undefined,
        selectedDays: [],
    };

    getWeekDays(weekStart) {
        const days = [weekStart];
        for (let i = 1; i < 7; i += 1) {
            days.push(
                moment(weekStart)
                .add(i, 'days')
                .toDate()
            );
        }
        return days;
      }
      
    getWeekRange(date) {
        return {
            from: moment(date)
                .startOf('week')
                .toDate(),
            to: moment(date)
                .endOf('week')
                .toDate(),
        };
    }
    
    handleDayChange = date => {
        var selectedDays = this.getWeekDays(this.getWeekRange(date).from);
        this.props.input.onChange(selectedDays[0]);
        console.log((selectedDays[0]));
        this.setState({
            selectedDays: selectedDays,
        });
    };

    handleDayEnter = date => {
        this.setState({
            hoverRange: this.getWeekRange(date),
        });
    };

    handleDayLeave = () => {
        this.setState({
            hoverRange: undefined,
        });
    };

    handleWeekClick = (weekNumber, days, e) => {
        this.props.input.onChange(days[0]);
        this.setState({
            selectedDays: days,
        });
    };

    componentDidMount() {
        let {value} = this.props.input;
        this.handleDayChange(value);
    }

    componentDidUpdate() {
        /* console.log(this.state.selectedDays);
        let {onChange} = this.props.input;
        onChange(this.state.selectedDays[0]); */
    }
    
    render() {
        const { hoverRange, selectedDays } = this.state;
    
        const daysAreSelected = selectedDays.length > 0;
    
        const modifiers = {
            hoverRange,
            selectedRange: daysAreSelected && {
                from: selectedDays[0],
                to: selectedDays[6],
            },
            hoverRangeStart: hoverRange && hoverRange.from,
            hoverRangeEnd: hoverRange && hoverRange.to,
            selectedRangeStart: daysAreSelected && selectedDays[0],
            selectedRangeEnd: daysAreSelected && selectedDays[6],
        };
        return (
            <div className="WeekPicker">
                <DayPicker
                    selectedDays={selectedDays}
                    showWeekNumbers
                    showOutsideDays
                    modifiers={modifiers}
                    onDayClick={this.handleDayChange}
                    onDayMouseEnter={this.handleDayEnter}
                    onDayMouseLeave={this.handleDayLeave}
                    onWeekClick={this.handleWeekClick}
                    localeUtils={MomentLocaleUtils}
                    locale={'es'}
                />
            </div>
        );
    }
}

class WeekField extends React.Component {
    render() {
        return (
            <Field name={this.props.name} component={_WeekField} />
        )
    }
}

export { ChoiceField, CalleChoiceField, LocalidadChoiceField, PaisChoiceField, ProvinciaChoiceField, TipoPropiedadChoiceField, WeekField };