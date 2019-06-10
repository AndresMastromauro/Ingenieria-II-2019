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
        /* this.getData = this.getData.bind(this);
        this.setParams = this.setParams.bind(this); */
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

    /* getData() {
        return this.state.data;
    } */

    /* setParams(oParams) {
        var newParams = Object.assign(this.state.params);
        newParams = $.extend(newParams, oParams);
        this.setState({
            params: newParams
        });
        this.fetchData();
    } */
    
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.dataSourceParams !== this.props.dataSourceParams) {
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