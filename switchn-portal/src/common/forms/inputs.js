import React from "react";
import $ from "jquery";

class TextField extends React.Component {
    render() {
        return (
            <input type="text"
                name={this.props.name}
                value={this.props.value}
                className={this.props.className}
                onChange={this.props.onChange} />
        );
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
        return (
            <select className={this.props.className} name={this.props.name} value={this.props.value} onChange={this.props.onChange}>
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

class DataSourcedChoiceField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            choices: []
        };
    }

    fetchData() {
        $.ajax({
            url: this.props.dataSourceURL,
            data: this.props.dataSourceParams ? this.props.dataSourceParams : {},
            dataType: 'json'
        }).done(
            function(data) {
                this.setState({
                    choices: data.length ? data : [data]
                });
            }.bind(this)
        );
    }

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.dataSourceParams) {
            var shouldFetch = Object.keys(this.props.dataSourceParams).some(
                function(p) {
                    return prevProps.dataSourceParams[p] !== this.props.dataSourceParams[p]
                }.bind(this));

            if (shouldFetch)
                this.fetchData();
        }
    }

    render() {
        return (
            <ChoiceField
                className={this.props.className}
                name={this.props.name}
                value={this.props.value}
                choices={this.state.choices}
                adapter={this.props.adapter}
                onChange={this.props.onChange} />
        );
    }
}

export { TextField, NumberField, PositiveNumberField, ChoiceField, DataSourcedChoiceField };