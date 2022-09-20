import React from 'react';
import Form from 'react-bootstrap/Form';

class FormInput extends React.Component{
    constructor(props){
        super(props);
    }
    
    render(){
        return(
            <Form.Group className="mb-3">
                <Form.Label>{this.props.label}</Form.Label>
                <Form.Control type={this.props.type} placeholder={this.props.placeholder} name={this.props.name}></Form.Control>
            </Form.Group>
        );
    }
}

export default FormInput; 