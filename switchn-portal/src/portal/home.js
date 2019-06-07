import React from 'react';
import { SwitchnPortalPage, SwitchnPortalPropiedad } from '../portal/base';
import { SwitchnListadoPropiedades } from '../common/listados';


class SwitchnWTF extends React.Component {
    render() {
        return (
            <article className="media content-section">
                <div className="media-body">
                    <div className="article-metadata">
                        <a className="mr-2" href="#">{"{{ post.author }}"}</a>
                        <small className="text-muted">{"{{ post.date_posted | date:\"d F Y\" }}"}</small>
                    </div>
                    <img className="account-img" src="{{ post.imagen.url }}" />
                    <img src="{{ post.imagen.url }}" alt="" />
                    <h2><a className="article-title" href="#">{"{{ post.titulo }}"}</a></h2>
                    <p className="article-content">{"{{ post.direccion }}"}</p>
                </div>
            </article>
        );
    }
}



export class SwitchnHome extends React.Component {
    render() {
        return (
            <SwitchnPortalPage title={"Home"} user={this.props.user}>
                <SwitchnListadoPropiedades
                    render={ p => (<SwitchnPortalPropiedad propiedad={p} />)} />
            </SwitchnPortalPage>
        );
    }
}