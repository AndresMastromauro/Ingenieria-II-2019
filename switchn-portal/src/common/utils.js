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
        this.child = null;
        // this._justFetched = false;
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
        ).always(
            function() {
                // this._justFetched = true;
            }.bind(this)
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
       /*  if (!this._justFetched && this.props.dataSourceParams) {
            var shouldUpdateState = objectHasChanged(prevProps.dataSourceParams, this.props.dataSourceParams);
            var shouldFetch = shouldUpdateState || objectHasChanged(prevState.params, this.state.params)
            if (shouldFetch) {
                this.fetchData();
                if (shouldUpdateState) {
                    this.setState({
                        params: this.props.dataSourceParams
                    })
                }
            }
        } */
        // this._justFetched = false;
        if (prevProps.dataSourceParams !== this.props.dataSourceParams) {
            this.fetchData();
        }
    } 

    componentDidMount() {
        try {
            this.child = React.Children.only(this.props.children);
            if (!this.props.dontLoadOnMount)
                this.fetchData();
        } catch {
            throw("Error: AJAXDataProvider fue compuesto con más de un hijo o ninguno");
        }
    }

    render() {
        if (this.child) {
            return React.cloneElement(
                    this.child,
                    {
                        data: this.state.data,
                        DataProvider: {
                            refresh: this.fetchData,
                            /* getData: this.getData,
                            setParams: this.setParams, */
                        }
                    }
            );
        }
        return null;
    }
}

export { AJAXDataProvider };