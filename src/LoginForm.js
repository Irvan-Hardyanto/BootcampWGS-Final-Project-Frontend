import React, { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import axios from 'axios';
import qs from 'qs';
import { Navigate } from "react-router-dom";


//pengennya pake .env, tapi undefined terus.
const BASE_URL = "http://localhost:9000";

const LoginForm = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [userData, setUserData] = useState(null);

    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         isLoggedIn: false,
    //         userName: "",
    //         password: "",
    //         userNameError: false,
    //         passwordError: false,
    //         userData: null,
    //         loading: false
    //     }

    //     this.handleUsernameChange = this.handleUsernameChange.bind(this);
    //     this.handlePasswordChange = this.handlePasswordChange.bind(this);
    //     this.handleFormSubmit = this.handleFormSubmit.bind(this);
    //     this.setErrorMessage = this.setErrorMessage.bind(this);
    // }

    const handleUsernameChange = (event) => {
        // this.setState({ userName: event.target.value, userNameError: false });
        setUsername(event.target.value);
        setUsernameError(false);
    }

    const handlePasswordChange = (event) => {
        // this.setState({ password: event.target.value, passwordError: false });
        setPassword(event.target.value);
        setPasswordError(false);
    }

    const setErrorMessage = (param, msg) => {
        if (param === "userName") {
            // this.setState({ userNameError: msg })
            setUsernameError(msg)
        } else if (param === "password") {
            // this.setState({ passwordError: msg })
            setPasswordError(msg)
        } else {
            alert(msg);
        }
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        //pengaman aja biar gak kacau sessionnya
        if(!isLogin){
            const axiosInstance = axios.create({
                baseURL: BASE_URL,
            })
    
            axiosInstance.post('/login', qs.stringify({
                userName: username,
                password: password,
            }), {
                headers: { 'content-type': 'application/x-www-form-urlencoded' }
            }).then(response => {
                //ini harus dipastiin apakah udah pas atau belum
                // this.setState({ isLoggedIn: true, userData: response, loading: false })
                setLoading(false);
                setIsLogin(true);
                setUserData(response.data);
                // dispatch(login({userData: response.data}))
            }).catch(errors => {
                setLoading(false);
                //tampilkan pesan error
                for (let i = 0; i < errors.response.data.length; i++) {
                    setErrorMessage(errors.response.data[i].param, errors.response.data[i].msg);
                }
            })
        }

        // this.setState({ loading: true }, () => {
        //     const axiosInstance = axios.create({
        //         baseURL: BASE_URL,
        //     })

        //     //axios itu by default nge-encode data yg dikirim ke API dalam format JSON
        //     axiosInstance.post('/login', qs.stringify({
        //         userName: this.state.userName,
        //         password: this.state.password,
        //     }), {
        //         headers: { 'content-type': 'application/x-www-form-urlencoded' }
        //     }).then(response => {
        //         //ini harus dipastiin apakah udah pas atau belum
        //         this.setState({ isLoggedIn: true, userData: response, loading: false })
        //     }).catch(errors => {
        //         this.setState({ loading: false })
        //         //tampilkan pesan error
        //         for (let i = 0; i < errors.response.data.length; i++) {
        //             this.setErrorMessage(errors.response.data[i].param, errors.response.data[i].msg);
        //         }
        //     })
        // })
    }

    //referensi: https://github.com/remix-run/react-router/blob/f59ee5488bc343cf3c957b7e0cc395ef5eb572d2/docs/advanced-guides/migrating-5-to-6.md#use-navigate-instead-of-history
    //referensi lainnya: https://learn.co/lessons/react-updating-state
    if (isLogin) {
        if (userData.role === 1) {

        } else if (userData.role === 2) {

        } else {
            return (
                <Navigate replace to="/productlist"/>
            )
        }
    } else {
        return (
            <Form>
                <Form.Field>
                    <Form.Input fluid label='Username' placeholder='Insert your username' name="username" type="text" value={username} onChange={handleUsernameChange} error={usernameError}></Form.Input>
                </Form.Field>
                <Form.Field>
                    <Form.Input label='Password' fluid type="password" name="password" placeholder="Insert your password" value={password} onChange={handlePasswordChange} error={passwordError}></Form.Input>
                </Form.Field>
                <Button onClick={handleFormSubmit} primary type='submit' style={{ width: "100%" }} loading={loading}>Login</Button>
            </Form>
        );
    }
}

export default LoginForm;