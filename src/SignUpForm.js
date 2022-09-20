import React from 'react';
import Form from 'react-bootstrap/Form';
import FormInput from './FormInput';
import Button from 'react-bootstrap/Button';
class SignUpForm extends React.Component {
    render() {
        return (
            <Form.Group className="mb-3">
                <FormInput label="Full Name" name="name" type="text" placeholder="your full name"></FormInput>
                <FormInput label="Username" name="userName" type="text" placeholder="your username"></FormInput>
                <FormInput label="Password" name="password" type="password" placeholder="your password"></FormInput>
                <FormInput label="Password Confirmation" name="confPassword" type="password" placeholder="Please re-type your password"></FormInput>
                <div className='row m-0 d-flex'>
                <Button type="submit">
                    Sign up
                </Button>
                </div>
                <div className='row m-0 d-flex'>
                <a className="py-2 text-center">Already have an account? click to login</a>
                </div>
            </Form.Group>
        );
    }
}

export default SignUpForm;