import React from 'react';
import FormInput from './FormInput'
import { Button, Form } from 'semantic-ui-react'    

class LoginForm extends React.Component {
    //method yang WAJIB dimiliki oleh setiap component pada React
    render() {
        return (
            /*<Form>
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
            </Form>*/
            <Form>
                <FormInput name="username" type="text" placeholder="Insert your username" label="Username" ></FormInput>
                <FormInput name="password" type="password" placeholder="Insert your password" label="Password" ></FormInput>
                <Button primary type='submit' style={{width: "100%"}}>Login</Button>
            </Form>
        );
    }
}

export default LoginForm; 