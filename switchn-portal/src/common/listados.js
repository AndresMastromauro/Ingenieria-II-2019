/* import React from "react";
import $ from 'jquery';

const SWITCHN_SERVICE_URL = "/ajax"

class SwitchnListadoPropiedades extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            propiedades: []
        };
    }
    componentDidMount() {
        $.ajax({
            url: SWITCHN_SERVICE_URL + "/propiedades",
            dataType: 'json'
        }).done(
            function(data) {
                this.setState({
                    propiedades: data
                });
            }.bind(this)
        ).fail(
            function() {
                throw("Error al recuperar propiedades");
            }
        );
    }

    render() {
        var propiedades = this.state.propiedades.map(
            function(propiedad) {
                return this.props.render(propiedad);
            }.bind(this)
        );
        return (
            <div>
                {
                (propiedades.length > 0) ?
                    propiedades
                    : <span>{"No hay propiedades para mostrar"}</span>
                }
            </div>
        )
    }
}

export { SwitchnListadoPropiedades } */