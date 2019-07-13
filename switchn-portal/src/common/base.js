import React from 'react';
import { Link as RouterLink } from "react-router-dom";
import './main.css';

class Link extends React.Component {
    render() {
        return (
            <RouterLink className={this.props.className} to={this.props.url}>{this.props.children}</RouterLink>
        );
    }
}

class SwitchnNavbarLink extends React.Component {
    render() {
        return (
            <Link className="nav-item nav-link"  url={this.props.url}>{this.props.children}</Link>
        );
    }
}

class SwitchnNavbarBrand extends React.Component {
    render() {
        return (
            <Link className="navbar-brand mr-4" url={this.props.url}>Home Switch Home</Link>
        )
    }
}


class SwitchnNavbarCollapse extends React.Component {
    render() {
        return (
            <div className="collapse navbar-collapse" id="navbarToggle">
                {this.props.children}
            </div>
        );
    }
}


class SwitchnNavbarToggler extends React.Component {
    render() {
        return (
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggle" aria-controls="navbarToggle" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
        );
    }
}


class SwitchnNavbar extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-expand-md navbar-dark bg-steel fixed-top">
                <div className="container">
                    <SwitchnNavbarBrand url={this.props.brandURL} />
                    <SwitchnNavbarToggler />
                    <SwitchnNavbarCollapse>
                        {this.props.children}
                    </SwitchnNavbarCollapse>
                </div>
            </nav>
        );
    }
}


class SwitchnMainContainer extends React.Component {
    render() {
        // Para pasar las props (por ejemplo el user)
        // var children = React.Children.map(this.props.children, child => React.cloneElement(child, this.props));
        return (
            <main /* role="main" */ className="container">
                {this.props.children}
            </main>
        );
    }
}


class SwitchnNavbarTabs extends React.Component {
    render() {
        return (
            <div className="navbar-nav mr-auto">
                {this.props.children}
            </div>
        );
    }
}

class SwitchnJumbotron extends React.Component {
    render() {
        return (
            <div className="jumbotron">
                {this.props.children}
                 <h1>{this.props.title}</h1>
            </div>
        );
    }
}


class SwitchnHeader extends React.Component {
    render() {
        return (
            <header className="site-header">
                <SwitchnJumbotron title={this.props.title}>
                    {this.props.children}
                </SwitchnJumbotron>
            </header>
        )
    }
}

export { Link, SwitchnHeader, SwitchnMainContainer, SwitchnNavbar, SwitchnNavbarLink, SwitchnNavbarTabs }



