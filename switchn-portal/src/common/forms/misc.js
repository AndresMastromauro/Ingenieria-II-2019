import React from "react";

class Label extends React.Component {
    render() {
        return (
            <label className="text-muted" htmlFor={this.props.htmlFor}>
                {this.props.children}
            </label>
        );
    }
}

export { Label }