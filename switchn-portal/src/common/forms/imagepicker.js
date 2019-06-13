import React from "react";
import { ImagePicker as __ImagePicker } from "react-file-picker";
import { Field } from "redux-form";
import { Button } from "./inputs";
import FlexView from "react-flexview";
import HSHLogo from "../img/HSH-Logo.svg";

class _ImagePicker extends React.Component {

    handlePick = (base64) => {
        let pick = this.props.input.onChange;
        pick(base64);
    }

    render() {
        var image = this.props.input.value;
        return (
            <div className="container">
                <FlexView wrap vAlignContent="center" hAlignContent="center" style={{
                        width: "100%",
                        paddingTop: (image == "" ? "100%" : 0),
                        border: "gray dashed 2px",
                        marginBottom: "10%",
                        position: "relative"
                    }}>
                    { !!image ?
                        <img className="img-thumbnail" src={image} />
                        : <p className="text-muted">(sin foto)</p>
                    }
                </FlexView>
                <__ImagePicker
                    extensions={['jpg', 'jpeg', 'png']}
                    dims={{minWidth: 100, maxWidth: 1366, minHeight: 100, maxHeight: 768}}
                    onChange={this.handlePick}
                    onError={errMsg => { console.log(errMsg) }}
                >
                <Button type="button" className="btn-secondary">
                    {image == "" ? "Subir una foto" : "Cambiar foto" }
                </Button>
                </__ImagePicker>
            </div>
        );
    }
}

class ImagePicker extends React.Component {
    render() {
        return <Field name={this.props.name} initialImg={this.props.initialImg} component={_ImagePicker} />
    }
}

export { ImagePicker };