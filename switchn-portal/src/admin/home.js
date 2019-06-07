import React from "react";
import { SwitchnAdminPage } from "./base";
import { PositiveNumberField, DataSourcedChoiceField } from "../common/forms/inputs";

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
                <form>
                    <DataSourcedChoiceField
                        onChange={this.onSelectPais.bind(this)}
                        dataSourceURL={'/ajax/paises'}
                        adapter={
                            function(pais) {
                                return {value: pais.id, caption: pais.nombre}
                            }}
                        />
                    <DataSourcedChoiceField
                        dataSourceURL={'/ajax/provincias'}
                        dataSourceParams={{
                            pais: this.state.pais
                        }}
                        adapter={
                            function(pais) {
                                return {value: pais.id, caption: pais.nombre}
                            }} />
                </form>
            </SwitchnAdminPage>
        )
    }
}