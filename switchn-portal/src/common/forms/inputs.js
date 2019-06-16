import React from "react";
import { Field } from "redux-form";
import { Label } from "./misc";


class Input extends React.Component {
    render() {
        return (
            <div className="form-group">
            <Label htmlFor={this.props.name}>{this.props.label}</Label>
            <Field
                {...this.props}
                /* type={this.props.type} */
                component={"input"}
                /* name={this.props.name}
                value={this.props.value} */
                className={this.props.className ? 'form-control ' + this.props.className : 'form-control'} />
               {/* <input
                    type={this.props.type}
                    name={this.props.name}
                    value={this.props.value}
                    className={this.props.className ? 'form-control ' + this.props.className : 'form-control'}
               onChange={this.props.onChange} /> */}
            </div>
        );
    }
}



class Button extends React.Component {
    render() {
        var sClass = "form-control button";
        return (
            <button
                {...this.props}
               /*  type={this.props.type} */
                className={this.props.className ? sClass +' '+ this.props.className : sClass}>
                {this.props.children}
            </button>
        );
    }
}

class SubmitButton extends React.Component {
    render() {
        return (
            <Button {...this.props} type="submit" className="btn-primary">
                {this.props.children}
            </Button>
        );
    }
}

class TextField extends React.Component {
    render() {
        return <Input {...this.props} type="text" />
    }
}
class EmailField extends React.Component {
    render() {
        return <Input {...this.props} type="email" />
    }
}

class TextAreaField extends React.Component {
    render() {
        return (
            <div className="form-group">
                <Label htmlFor={this.props.name}>{this.props.label}</Label>
                <Field {...this.props} component={"textarea"} className={"form-control"} />
            </div>
        );
    }
}


class PasswordField extends React.Component {
    render() {
        return <Input {...this.props} type="password" />
    }
}

class NumberField extends React.Component {
    render() {
        return <Input {...this.props} type="number" />
    }
}

/* class NumberField extends React.Component {
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
} */

/* class PositiveNumberField extends React.Component {
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
} */



export { TextField, TextAreaField, NumberField, PasswordField, Button, SubmitButton, EmailField  };