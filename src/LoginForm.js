import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class LoginForm extends React.Component {
    //method yang WAJIB dimiliki oleh setiap component pada React
    render() {
        return (
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="masukkan username"></Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="masukkan password"></Form.Control>
                </Form.Group>
                <Button type="submit">
                    Login
                </Button>
            </Form>
        );
    }
}

export default LoginForm; 