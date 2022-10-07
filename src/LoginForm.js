import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import axios from 'axios';
import qs from 'qs';
import { Navigate } from "react-router-dom";

//pengennya pake .env, tapi undefined terus.
const BASE_URL = "http://localhost:9000";

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            userName: "",
            password: "",
            userNameError: false,
            passwordError: false,
            userData: null,
            loading: false
        }

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.setErrorMessage = this.setErrorMessage.bind(this);
    }

    handleUsernameChange(event) {
        this.setState({ userName: event.target.value, userNameError: false });
    }

    handlePasswordChange(event) {
        this.setState({ password: event.target.value, passwordError: false });
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
        this.setState({ loading : true }, () => {
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
                //ini harus dipastiin apakah udah pas atau belum
                this.setState({ isLoggedIn: true, userData: response, loading : false})
            }).catch(errors => {
                this.setState({loading : false})
                //tampilkan pesan error
                for (let i = 0; i < errors.response.data.length; i++) {
                    this.setErrorMessage(errors.response.data[i].param, errors.response.data[i].msg);
                }
            })
        })
    }

    //method yang WAJIB dimiliki oleh setiap component pada React
    render() {
        //referensi: https://github.com/remix-run/react-router/blob/f59ee5488bc343cf3c957b7e0cc395ef5eb572d2/docs/advanced-guides/migrating-5-to-6.md#use-navigate-instead-of-history
        //referensi lainnya: https://learn.co/lessons/react-updating-state
        if (this.state.isLoggedIn) {
            if (this.state.userData.role === 1) {

            } else if (this.state.userData.role === 2) {

            } else {
                //periksa role nya
                //kalau admin (role: 1)=> redirect ke dashboard admin
                //kalau customer => redirect ke product list customer
                //kalau superadmin => redirect ke dashboard super admin
                return (
                    <Navigate replace to="/productlist" state={{ userData: this.state.userData }} />
                )
            }
        }
        return (
            <Form>
                <Form.Field>
                    <Form.Input fluid label='Username' placeholder='Insert your username' name="username" type="text" value={this.state.userName} onChange={this.handleUsernameChange} error={this.state.userNameError}></Form.Input>
                </Form.Field>
                <Form.Field>
                    <Form.Input label='Password' fluid type="password" name="password" placeholder="Insert your password" value={this.state.password} onChange={this.handlePasswordChange} error={this.state.passwordError}></Form.Input>
                </Form.Field>
                <Button onClick={this.handleFormSubmit} primary type='submit' style={{ width: "100%" }} loading={this.state.loading}>Login</Button>
            </Form>
        );
    }
}

export default LoginForm; 