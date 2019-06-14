import React from "react";
import { SwitchnAdminPage } from "./base";

export class SwitchnAdminHome extends React.Component {
    render() {
        return (
            <SwitchnAdminPage title={"Home Administración"} user={this.props.usuario}>
                <p>Hola</p>
            </SwitchnAdminPage>
        )
    }
}