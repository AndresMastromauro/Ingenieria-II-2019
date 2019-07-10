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

import { SwitchnAPI } from '../../utils/client';


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


class CalleChoiceField extends React.Component {
    state = {
        calles: []
    }

    cargarCalles(idLocalidad) {
        SwitchnAPI.geo.calles.list({localidad: idLocalidad})
            .then(data => {
                this.setState({calles: data});
            })
            .catch(err => console.log(err));
    }

    componentDidMount() {
        if (this.props.localidad != undefined) {
            // this.props.loadCalles(this.props.localidad);
            this.cargarCalles(this.props.localidad);
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.localidad !== undefined) {
            if (prevProps.localidad !== this.props.localidad) {
                this.cargarCalles(this.props.localidad);
            }
        } else {
            if (prevProps.localidad !== undefined) {
                this.setState({calles: []});
            }
        }
    }

    render() {
        return (
            <ChoiceField
                label={"Calle"}
                name={this.props.name}
                value={this.props.value}
                choices={this.state.calles}
                adapter={(calle) => { return {value: calle.id, caption: calle.nombre} }}
                onChange={this.props.onChange}
                nullCaption={"Elija una calle..."} />
        )
    }
}


class LocalidadChoiceField extends React.Component {
    state = {
        localidades: []
    }

    cargarLocalidades(idProvincia) {
        SwitchnAPI.geo.localidades.list({provincia: idProvincia})
            .then(data => {
                this.setState({localidades: data});
            })
            .catch(err => console.log(err));
    }

    componentDidMount() {
        if (this.props.provincia !== undefined) {
            this.cargarLocalidades(this.props.provincia);
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.provincia !== undefined) {
            if (prevProps.provincia !== this.props.provincia) {
                this.cargarLocalidades(this.props.provincia);
            }
        } else {
            if (prevProps.provincia !== undefined) {
                this.setState({localidades: []});
            }
        }
    }
    render() {
        return (
            <ChoiceField
                label="Localidad"
                name={this.props.name}
                value={this.props.value}
                choices={this.state.localidades}
                adapter={(localidad) => { return {value: localidad.id, caption: localidad.nombre} }}
                onChange={this.props.onChange}
                nullCaption={"Elija una localidad..."} />
        )
    }
}


class ProvinciaChoiceField extends React.Component {
    state = {
        provincias: []
    }

    cargarProvincias(idPais) {
        SwitchnAPI.geo.provincias.list({pais: idPais})
            .then(data => {
                this.setState({provincias: data})
            })
            .catch(err => {
                console.log(err);
            })
    }

    componentDidMount() {
        if (this.props.pais !== undefined) {
            this.cargarProvincias(this.props.pais);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.pais !== undefined) {
            if (prevProps.pais !== this.props.pais) {
                this.cargarProvincias(this.props.pais);
            }
        } else {
            if (prevProps.pais !== undefined) {
                this.setState({provincias: []})
            }
        }
    }

    render() {
        return (
            <ChoiceField
                label="Provincia"
                name={this.props.name}
                value={this.props.value}
                choices={this.state.provincias}
                adapter={(provincia) => { return {value: provincia.id, caption: provincia.nombre} }}
                onChange={this.props.onChange}
                nullCaption={"Elija una provincia..."} />
        )
    }
}


class PaisChoiceField extends React.Component {
    state = {
        paises: []
    }

    componentDidMount() {
        SwitchnAPI.geo.paises.list()
            .then(data => {
                this.setState({
                    paises: data
                })
            })
            .catch(err => {
                console.log(err);
            })
    }

    render() {
        return (
            <ChoiceField
                label="Pais"
                name={this.props.name}
                value={this.props.value}
                choices={this.state.paises}
                adapter={(pais) => { return {value: pais.id, caption: pais.nombre} }}
                onChange={this.props.onChange}
                nullCaption={"Elija un pais..."}
            />
        )
    }
}


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
        this.props.input.onChange(moment(selectedDays[0]).format("YYYY-MM-DD"));
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
        this.props.input.onChange(moment(days[0]).format("YYYY-MM-DD"));
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
                    disabledDays={[
                        {
                            before: new Date()
                        }
                    ].concat(this.props.disabledDays)}
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

export { ChoiceField, CalleChoiceField, LocalidadChoiceField, PaisChoiceField, ProvinciaChoiceField, WeekField };