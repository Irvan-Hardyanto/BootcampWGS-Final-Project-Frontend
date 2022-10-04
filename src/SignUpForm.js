import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import axios from 'axios';
import qs from 'qs';

const BASE_URL = "http://localhost:9000";

class SignUpForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            userName: "",
            password: "",
            confPassword: "",
            userNameError: false,
            passwordError: false,
            confPasswordError: false,
            nameError: false
        }
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleConfPasswordChange = this.handleConfPasswordChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    setErrorMessage(param, msg) {
        if (param === "userName") {
            this.setState({ userNameError: msg });
        } else if (param === "password") {
            this.setState({ passwordError: msg });
        } else if (param === "name") {
            this.setState({ nameError: msg });
        } else if (param == "confPassword") {
            this.setState({ confPasswordError: msg });
        } else {
            alert(msg);
        }
    }

    handleNameChange(event) {
        this.setState({ name: event.target.value });
        this.setState({ nameError: false });
    }

    handleUsernameChange(event) {
        this.setState({ userName: event.target.value });
        this.setState({ userNameError: false });
    }

    handlePasswordChange(event) {
        this.setState({ password: event.target.value });
        this.setState({ passwordError: false });
    }

    handleConfPasswordChange(event) {
        if(this.state.password !== event.target.value){
            this.setState({ confPasswordError: 'Incorrect password confirmation!' });
        }else{
            this.setState({ confPassword: event.target.value });
            this.setState({ confPasswordError: false });
        }
    }

    handleFormSubmit(event) {
        event.preventDefault();
        const axiosInstance = axios.create({
            baseURL: BASE_URL,
        })

        axiosInstance.post('/register', qs.stringify({
            name: this.state.name,
            userName: this.state.userName,
            password: this.state.password,
            confPassword: this.state.confPassword,
        }), {
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        }).then(response => {
            console.log(response);
            //redirect ke halaman yang sesuai dengan role yang dimiliki
        }).catch(errors => {
            console.log(errors);
            for (let i = 0; i < errors.response.data.length; i++) {
                this.setErrorMessage(errors.response.data[i].param, errors.response.data[i].msg);
            }
        });
    }

    render() {
        return (
            <Form>
                <Form.Field>
                    <Form.Input label="Full Name" type="text" placeholder="Please insert your full name" name="name" value={this.state.name} onChange={this.handleNameChange} error={this.state.nameError}></Form.Input>
                    {/* <label>Full Name</label>
                    <input type="text" placeholder="Please insert your full name" name="name" /> */}
                </Form.Field>
                <Form.Field>
                    <Form.Input label="Username" type="text" placeholder="Please insert your username" name="userName" value={this.state.userName} onChange={this.handleUsernameChange} error={this.state.userNameError}></Form.Input>
                    {/* <label>Username</label>
                    <input type="text" placeholder="Please insert your username" name="userName" /> */}
                </Form.Field>
                <Form.Field>
                    <Form.Input label="Password" type="password" placeholder="Please insert your password" name="password" value={this.state.password} onChange={this.handlePasswordChange} error={this.state.passwordError}></Form.Input>
                    {/* <label>Password</label>
                    <input type="password" placeholder="Please insert your password" name="password" /> */}
                </Form.Field>
                <Form.Field>
                    <Form.Input label="Password Confirmation" type="password" placeholder="Please re-type your password" name="confPassword" value={this.state.confPassword} onChange={this.handleConfPasswordChange} error={this.state.confPasswordError}></Form.Input>
                    {/* <label>Password Confirmation</label>
                    <input type="password" placeholder="Please re-type your password" name="confPassword" /> */}
                </Form.Field>
                <Button primary type='submit' style={{ width: "100%" }} onClick={this.handleFormSubmit}>Sign Up</Button>
            </Form>
        );
    }
}

export default SignUpForm;