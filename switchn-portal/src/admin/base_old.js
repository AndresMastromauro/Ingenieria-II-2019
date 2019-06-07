import React from "react";
import $ from "jquery";
// import './base.css';


class SwitchnAdminBodyHeader extends React.Component {
    render() {
        return (
            <div id="header">
                <div id="branding">
                    <h1 id="site-name"><a href="{% url 'admin:index' %}">Home Switch Home</a></h1>
                </div>
                {/* % block usertools % */}
                {/* % if has_permission % */}
                { this.props.user ?
                    <div id="user-tools">
                            Welcome <strong>{this.props.user.name}</strong>
                        {/* % block userlinks % */}
                            {/* % if site_url % */}
                                <a href="{{ site_url }}">View Site</a>
                            {/* % endif % */}
                            {/* % if user.is_active and user.is_staff % */}
                                {/* % url 'django-admindocs-docroot' as docsroot % */}
                                {/* % if docsroot % */}
                                    <a href="{{ docsroot }}">Docs</a>
                                {/* % endif % */}
                            {/* % endif % */}
                            {/* % if user.has_usable_password % */}
                            <a href="{% url 'admin:password_change' %}">Change Password</a>
                            {/* % endif % */}
                            <a href="{% url 'admin:logout' %}">Logout</a>
                        {/* % endblock % */}
                    </div>
                : null }
                {/* % endif % */}
                {/* % endblock % */}
                {/* % block nav-global % */}{/* % endblock % */}
            </div>
        );
    }
}

class SwitchnAdminBodyBreadcrumbs extends React.Component {
    render() {
        return (
            <div className="breadcrumbs">
                <a href="{% url 'admin:index' %}">{/* % trans 'Home' % */}</a>
                { this.props.title ? ">" : null }
            </div>
        );
    }
}

class SwitchnAdminBodyMessages extends React.Component {
    render() {
        var messages = null;
        if (this.props.messages && this.props.messages.length > 0) {
            messages = (
                <ul className="messagelist">
                    {this.props.messages.map(
                        function(msg) {
                            return (<li className={ msg.tags ? msg.tags : "" }>{ msg.text }</li>);
                        }
                    )}
                </ul>
            );
        }
        return messages;
    }
}

class SwitchnAdminBodyContent extends React.Component {
    render() {
        return (
            <div id="content" className="{/* % block coltype % */}colM{/* % endblock % */}">
                {/* % block pretitle % */}{/* % endblock % */}
                {/* % block content_title % */}{/* % if title % */}<h1>{/* { title } */}</h1>{/* % endif % */}{/* % endblock % */}
                {/* % block content % */}
                {/* % block object-tools % */}{/* % endblock % */}
                {/* { content } */}
                {/* % endblock % */}
                {/* % block sidebar % */}{/* % endblock % */}
                <br className="clear" />
            </div>
        );
    }
}

export class SwitchnAdminBody extends React.Component {
    render() {
        return (
            <div id="container">
                <SwitchnAdminBodyHeader />
                <SwitchnAdminBodyBreadcrumbs />
                <SwitchnAdminBodyMessages />
                <SwitchnAdminBodyContent />
                {/* % block footer % */}<div id="footer"></div>{/* % endblock % */}
            </div>
        );
    }
}
