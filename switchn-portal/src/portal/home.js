import React from 'react';
import { SwitchnPortalPage, SwitchnPortalPropiedad } from '../portal/base';
import { AJAXDataProvider } from '../common/utils';
// import { SwitchnListadoPropiedades } from '../common/listados';


class _SwitchnPortalListadoPropiedades extends React.Component {
    render() {
        var propiedades = this.props.data.map(
            function(propiedad) {
                return <SwitchnPortalPropiedad key={propiedad.id} propiedad={propiedad} />
            }
        );
        return (
            <div>
                {propiedades}
            </div>
        )
    }
}

class SwitchnPortalListadoPropiedades extends React.Component {
    render() {
        return (
            <AJAXDataProvider dataSourceURL={"/ajax/propiedades"}>
                <_SwitchnPortalListadoPropiedades />
            </AJAXDataProvider>
        )
    }
}



export class SwitchnHome extends React.Component {
    render() {
        return (
            <SwitchnPortalPage title={"Home"} user={this.props.user}>
                <SwitchnPortalListadoPropiedades />
            </SwitchnPortalPage>
        );
    }
}