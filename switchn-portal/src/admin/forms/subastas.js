import React from "react";
import { WeekField } from "../../common/forms/select";
import { NumberField, SubmitButton, HiddenField } from "../../common/forms/inputs";
import { Row, Col, Button, ButtonGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import moment from "moment";
import $ from "jquery";

class SwitchnAdminSubastaForm extends React.Component {
    state = {
        reservas: []
    }

    componentDidMount() {
        var idPropiedad = this.props.idPropiedad;
        $.ajax({
            url: `/ajax/propiedades/${idPropiedad}/reservas`,
            dataType: "json"
        }).done(
            reservas => this.setState({reservas: reservas})
        );
    }

    getDisabledWeeks() {
        return this.state.reservas.map(
            r => {
                var semana = new moment(r.semana);
                return {
                    after: semana,
                    before: semana.add(7, 'days')
                }
            }
        );
    }

    render() {
        return (
            <form onSubmit={this.props.handleSubmit}>
                <Row>
                    <legend>Datos de la Subasta</legend>
                </Row>
                <Row>
                    <Col>
                        <WeekField
                            label={"Semana"}
                            name={"semana"}
                            disabledDays={this.getDisabledWeeks()}
                        />
                        <NumberField label={"Precio Base"} name={"precioBase"} />
                        <HiddenField name={"reserva.propiedad.id"} value={this.props.idPropiedad} />
                    </Col>
                </Row>
                <Row>
                    <ButtonGroup>
                        <Button onClick={this.props.handleBack}>Volver</Button>
                        <SubmitButton>Guardar</SubmitButton>
                    </ButtonGroup>
                </Row>
            </form>
        )
    }
}

SwitchnAdminSubastaForm = reduxForm({
    form: "crear-subasta"
})(SwitchnAdminSubastaForm);

export { SwitchnAdminSubastaForm };