import React from 'react';
import FormInput from './FormInput'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class LoginForm extends React.Component {
    //method yang WAJIB dimiliki oleh setiap component pada React
    render() {
        return (
            <Form>
                <FormInput name="username" type="text" placeholder="Insert your username" label="Username" ></FormInput>
                <FormInput name="password" type="password" placeholder="Insert your password" label="Password" ></FormInput>
                <div className='row text-center m-0 d-flex'>
                    <Button type="submit">
                        Login
                    </Button>
                </div>
                <div className='row text-center m-0 d-flex'>
                <a className="py-2">Sign Up now!</a>
                </div>
            </Form>
        );
    }
}

export default LoginForm; 