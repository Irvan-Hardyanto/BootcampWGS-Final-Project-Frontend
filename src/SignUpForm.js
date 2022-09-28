import React from 'react';
import { Button, Form } from 'semantic-ui-react';

class SignUpForm extends React.Component {
    render() {
        return (
            <Form>
                <Form.Field>
                    <label>Full Name</label>
                    <input type="text" placeholder="Please insert your full name" name="name" />
                </Form.Field>
                <Form.Field>
                    <label>Username</label>
                    <input type="text" placeholder="Please insert your username" name="userName" />
                </Form.Field>
                <Form.Field>
                    <label>Password</label>
                    <input type="password" placeholder="Please insert your password" name="password"/>
                </Form.Field>
                <Form.Field>
                    <label>Password Confirmation</label>
                    <input type="password" placeholder="Please re-type your password" name="confPassword"/>
                </Form.Field>
                {/* <FormInput label="Full Name" name="name" type="text" placeholder="your full name"></FormInput> */}
                {/* <FormInput label="Username" name="userName" type="text" placeholder="your username"></FormInput> */}
                {/* <FormInput label="Password" name="password" type="password" placeholder="your password"></FormInput> */}
                {/* <FormInput label="Password Confirmation" name="confPassword" type="password" placeholder="Please re-type your password"></FormInput> */}
                <Button primary type='submit' style={{ width: "100%" }}>Sign Up</Button>
            </Form>
        );
    }
}

export default SignUpForm;