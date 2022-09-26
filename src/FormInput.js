import React from 'react';
import { Form } from 'semantic-ui-react'  
class FormInput extends React.Component{
    render(){
        return(
            // <Form.Group className="mb-3">
            //     <Form.Label>{this.props.label}</Form.Label>
            //     <Form.Control type={this.props.type} placeholder={this.props.placeholder} name={this.props.name}></Form.Control>
            // </Form.Group>
            <Form.Field>
                    <label>{this.props.label}</label>
                    <input type={this.props.type} placeholder={this.props.placeholder} name={this.props.name}/>
            </Form.Field>
        );
    }
}

export default FormInput; 