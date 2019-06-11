import React from "react";
import { SwitchnAdminPage } from "./base";

export class SwitchnAdminHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pais: 0
        };
    }

    onSelectPais(e) {
        this.setState({
            pais: e.target.value
        })
    }

    render() {
        return (
            <SwitchnAdminPage title={"Home Administración"} user={this.props.usuario}>
                Hola
            </SwitchnAdminPage>
        )
    }
}