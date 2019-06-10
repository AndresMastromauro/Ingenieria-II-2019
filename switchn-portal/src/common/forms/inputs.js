import React from "react";
import $ from "jquery";
import { AJAXDataProvider } from "../utils";


class Input extends React.Component {
    render() {
        return (
            <div className="form-group">
            <label htmlFor={this.props.name} />
                {this.props.label}
               <input
                    type={this.props.type}
                    name={this.props.name}
                    value={this.props.value}
                    className={this.props.className ? 'form-control ' + this.props.className : 'form-control'}
                    onChange={this.props.onChange} />
            </div>
        );
    }
}

class Button extends React.Component {
    render() {
        var sClass = "form-control button";
        return (
            <button 
                type={this.props.type}
                className={this.props.className ? sClass +' '+ this.props.className : sClass}
                onClick={this.props.onClick}>
                {this.props.children}
            </button>
        );
    }
}

class SubmitButton extends React.Component {
    render() {
        return (
            <Button type="submit" className="btn-primary" onClick={this.props.onClick}>
                {this.props.children}
            </Button>
        );
    }
}

class TextField extends React.Component {
    render() {
        return <Input type="text" label={this.props.label} onChange={this.props.onChange} />
    }
}

class PasswordField extends React.Component {
    render() {
        return <Input type="password" label={this.props.label} onChange={this.props.onChange} />
    }
}

class NumberField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        if (!/\D+/.test(e.target.value)) {
            this.setState({
                value: e.target.value
            });
        }
        this.props.onChange(e);
    }

    render() {
        return (
            <input
                type="text"
                name={this.props.name}
                value={this.props.value}
                className={this.props.className}
                onChange={this.onChange} />
        );
    }
}

class PositiveNumberField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        var newValue;
        try {
            newValue = parseInt(e.target.value, 10);
            if (newValue < 0) {
                this.setState({
                    value: newValue
                });
            }
        } finally { }
    }

    render() {
        return (
            <NumberField name={this.props.name} value={this.state.value} onChange={this.onChange} />
        );
    }
}

class ChoiceField extends React.Component {
    
    render() {
        var sClass = "form-control "
        return (
            <select className={this.props.className ? sClass + this.props.className : sClass } name={this.props.name} value={this.props.value} onChange={this.props.onChange}>
                <option key={0} value={this.props.nullKey}>{this.props.nullCaption}</option>
                { this.props.choices.map(
                    function(choice) {
                        if (this.props.adapter)
                            choice = this.props.adapter(choice);
                        return (<option key={choice.value} value={choice.value}>{choice.caption}</option>);
                    }.bind(this)
                )}
            </select>
        );
    }
}

class _DataSourcedChoiceField extends React.Component {

    /* componentDidUpdate(prevProps, prevState) {
        if (this.props.dataSourceParams) {
            var shouldFetch = Object.keys(this.props.dataSourceParams).some(
                function(p) {
                    return prevProps.dataSourceParams[p] !== this.props.dataSourceParams[p]
                }.bind(this));

            if (shouldFetch)
                this.props.DataProvider.refresh();
        }
    } */

    render() {
        return (
                <ChoiceField
                    className={this.props.className}
                    name={this.props.name}
                    value={this.props.value}
                    choices={this.props.data}
                    adapter={this.props.adapter}
                    onChange={this.props.onChange} /> 
        );
    }
}

class DataSourcedChoiceField extends React.Component {
    render() {
        return (
            <AJAXDataProvider dontLoadOnMount={this.props.dontLoadOnMount} dataSourceURL={this.props.dataSourceURL} dataSourceParams={this.props.dataSourceParams}>
                <_DataSourcedChoiceField adapter={this.props.adapter} onChange={this.props.onChange} />
            </AJAXDataProvider>
        )
    }
}

export { TextField, NumberField, PositiveNumberField, ChoiceField, DataSourcedChoiceField, PasswordField, SubmitButton };