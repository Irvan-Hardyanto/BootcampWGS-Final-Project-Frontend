import React, { useState } from 'react';
import { Button, Form, Message } from 'semantic-ui-react';
import axios from 'axios';
import qs from 'qs';
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login } from '../reducers/SessionSlice';


//pengennya pake .env, tapi undefined terus.
const BASE_URL = "http://localhost:9000";

const LoginForm = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error,setError]=useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    //sebenarnya ini pakenya JWT 
    const session = useSelector(state=>state.session);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
        setError(false);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setError(false);
    }

    const setErrorMessage = (param, msg) => {
        setError(msg);
    }

    const showErrorMessages=()=>{
        if(error){
            return(
                <Message
                    negative
                    attached
                    content={error}
                />
            )
        }
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        if (!session.id) {
            const axiosInstance = axios.create({
                baseURL: BASE_URL,
            })

            axiosInstance.post('/login', qs.stringify({
                userName: username,
                password: password,
            }), {
                headers: { 'content-type': 'application/x-www-form-urlencoded' }
            }).then(response => {
                console.log('response.data is: '+response);
                setLoading(false);
                dispatch(login({
                    userId: response.data.id,
                    role: response.data.role,
                    fullname: response.data.fullname,
                    email: response.data.email,
                    mobile: response.data.mobile,
                    picture: response.data.picture,
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken
                }))
            }).catch(errors => {
                setLoading(false);
                //tampilkan pesan error
                for (let i = 0; i < errors.response.data.length; i++) {
                    setErrorMessage(errors.response.data[i].param, errors.response.data[i].msg);
                }
            })
        }
    }

    //referensi: https://github.com/remix-run/react-router/blob/f59ee5488bc343cf3c957b7e0cc395ef5eb572d2/docs/advanced-guides/migrating-5-to-6.md#use-navigate-instead-of-history
    //referensi lainnya: https://learn.co/lessons/react-updating-state
    if (session.userId) {
        if (session.role === 1) {
            return (
                <Navigate replace to="/super-admin/dashboard"/>
            )
        } else if (session.role === 2) {
            return (
                <Navigate replace to="/admin/dashboard"/>
            )

        } else {
            return (
                <Navigate replace to="/products" />
            )
        }
    } else {
        return (
            <div>
            {showErrorMessages()}
            <Form>
                <Form.Field>
                    <Form.Input fluid label='Username' placeholder='Insert your username' name="username" type="text" value={username} onChange={handleUsernameChange}></Form.Input>
                </Form.Field>
                <Form.Field>
                    <Form.Input label='Password' fluid type="password" name="password" placeholder="Insert your password" value={password} onChange={handlePasswordChange}></Form.Input>
                </Form.Field>
                <Button onClick={handleFormSubmit} primary type='submit' style={{ width: "100%" }} loading={loading}>Login</Button>
            </Form>
            </div>
        );
    }
}

export default LoginForm;