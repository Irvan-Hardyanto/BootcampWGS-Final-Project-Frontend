import React from 'react';
import { Button, Form } from 'semantic-ui-react';

class LoginForm extends React.Component {
    //method yang WAJIB dimiliki oleh setiap component pada React
    render() {
        return (
            <Form>
                <Form.Field>
                    <label>Username</label>
                    <input type="text" placeholder="Insert your username" name="username" />
                </Form.Field>
                <Form.Field>
                    <label>Password</label>
                    <input type="password" placeholder="Insert your password" name="password" />
                </Form.Field>
                <Button primary type='submit' style={{ width: "100%" }}>Login</Button>
            </Form>
        );
    }
}

export default LoginForm; 