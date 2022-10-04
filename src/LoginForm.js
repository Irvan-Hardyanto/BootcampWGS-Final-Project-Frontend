import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import axios from 'axios';
import qs from 'qs';

//pengennya pake .env, tapi undefined terus.
const BASE_URL = "http://localhost:9000";

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            password: "",
            userNameError: false,
            passwordError: false
        }

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.setErrorMessage = this.setErrorMessage.bind(this);
    }

    handleUsernameChange(event) {
        this.setState({ userName: event.target.value });
        this.setState({ userNameError: false })
    }

    handlePasswordChange(event) {
        this.setState({ password: event.target.value });
        this.setState({ passwordError: false })
    }

    setErrorMessage(param, msg) {
        if (param === "userName") {
            this.setState({ userNameError: msg })
        } else if (param === "password") {
            this.setState({ passwordError: msg })
        } else {
            alert("msg");
        }
    }

    handleFormSubmit(event) {
        event.preventDefault();
        const axiosInstance = axios.create({
            baseURL: BASE_URL,
        })

        //axios itu by default nge-encode data yg dikirim ke API dalam format JSON
        axiosInstance.post('/login', qs.stringify({
            userName: this.state.userName,
            password: this.state.password,
        }), {
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        }).then(response => {
            //periksa role nya
            //kalau admin => redirect ke dashboard admin
            //kalau customer => redirect ke product list customer
            //kalau superadmin => redirect ke dashboard super admin
        }).catch(errors => {
            //tampilkan pesan error
            for (let i = 0; i < errors.response.data.length; i++) {
                this.setErrorMessage(errors.response.data[i].param, errors.response.data[i].msg);
            }
        })
    }

    //method yang WAJIB dimiliki oleh setiap component pada React
    render() {
        return (
            <Form>
                <Form.Field>
                    <Form.Input fluid label='Username' placeholder='Insert your username' name="username" type="text" value={this.state.userName} onChange={this.handleUsernameChange} error={this.state.userNameError}></Form.Input>
                </Form.Field>
                <Form.Field>
                    <Form.Input label='Password' fluid type="password" name="password" placeholder="Insert your password" value={this.state.password} onChange={this.handlePasswordChange} error={this.state.passwordError}></Form.Input>
                </Form.Field>
                <Button onClick={this.handleFormSubmit} primary type='submit' style={{ width: "100%" }}>Login</Button>
            </Form>
        );
    }
}

export default LoginForm; 