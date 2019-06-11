import React from "react";
import $ from 'jquery';

// const SWITCHN_SERVICE_URL = "/ajax"

function objectHasChanged(object, sameObject) {
    return Object.keys(object).some(
        function(key) {
            return sameObject[key] !== object[key]
        });
}

class AJAXDataProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
        this.fetchData = this.fetchData.bind(this);
    }

    fetchData() {
        $.ajax({
            url: this.props.dataSourceURL,
            data: this.props.dataSourceParams,
            dataType: 'json'
        }).done(
            function(newData) {
                this.setState({
                    data: newData
                });
            }.bind(this)
        ).fail(
            function(jqXhr, error, exception) {
                throw(exception);
            }
        );
    }
    
    componentDidUpdate(prevProps, prevState) {
        var propsChanged = Object.keys(prevProps)
            .some((prop) => prevProps[prop] !== this.props[prop]);
        if (propsChanged) {
            this.fetchData();
        }
    } 

    componentDidMount() {
        if (!this.props.dontLoadOnMount)
            this.fetchData();
    }

    render() {
        var children = React.Children.map(
            this.props.children,
            child => React.cloneElement(
                child,
                { 
                    data: this.state.data,
                    DataProvider: {
                        refresh: this.fetchData,
                        /* getData: this.getData,
                        setParams: this.setParams, */
                    }
                }
            )
        );
        return <div>{children}</div>;
    }
}

export { AJAXDataProvider };