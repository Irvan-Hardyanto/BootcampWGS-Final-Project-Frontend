import React, { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import axios from 'axios';
import qs from 'qs';
import { Navigate } from "react-router-dom";

const BASE_URL = "http://localhost:9000";

const SignUpForm = (props) => {
    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [nameError, setNameError] = useState(false);
    const [userNameError, setUserNameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confPasswordError, setConfPasswordError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSucces] = useState(false);

    const setErrorMessage = (param, msg) => {
        if (param === "userName") {
            setUserNameError(msg);
        } else if (param === "password") {
            setPasswordError(msg);
        } else if (param === "name") {
            setNameError(msg);
        } else if (param === "confPassword") {
            setConfPasswordError(msg);
        } else {
            alert(msg);
        }
    }

    const handleNameChange = (event) => {
        setName(event.target.value);
        setNameError(false);
    }

    const handleUsernameChange = (event) => {
        setUserName(event.target.value);
        setUserNameError(false);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setPasswordError(false);
    }

    const handleConfPasswordChange = (event) => {
        setConfPassword(event.target.value);
        if (password !== event.target.value) {
            setConfPasswordError('Incorrect password confirmation!');
        } else {
            setConfPasswordError(false);
        }
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        const axiosInstance = axios.create({
            baseURL: BASE_URL,
        })
        axiosInstance.post('/register', qs.stringify({
            name: name,
            userName: userName,
            password: password,
            confPassword: confPassword,
        }), {
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        }).then(response => {
            setLoading(false);
            setSucces(true);
            console.log(response);
            //redirect ke halaman daftar produk (Atau kalo keburu halaman konfirmasi via email / hp)

            //buat cart untuk user ini...
            axiosInstance.post('/carts',qs.stringify({
                userId:parseInt(response.data.id)
            }), {
                headers: { 'content-type': 'application/x-www-form-urlencoded' }
            }).catch(err=>{
                console.log(err);
            })
        }).catch(errors => {
            setLoading(false);
            console.log(errors);
            for (let i = 0; i < errors.response.data.length; i++) {
                setErrorMessage(errors.response.data[i].param, errors.response.data[i].msg);
            }
        });
    }
    if(success){
        return (
            <Navigate replace to="/login" />
        )
    }
    return (
        <Form>
            <Form.Field>
                <Form.Input label="Full Name" type="text" placeholder="Please insert your full name" name="name" value={name} onChange={handleNameChange} error={nameError}></Form.Input>
                {/* <label>Full Name</label>
                    <input type="text" placeholder="Please insert your full name" name="name" /> */}
            </Form.Field>
            <Form.Field>
                <Form.Input label="Username" type="text" placeholder="Please insert your username" name="userName" value={userName} onChange={handleUsernameChange} error={userNameError}></Form.Input>
                {/* <label>Username</label>
                    <input type="text" placeholder="Please insert your username" name="userName" /> */}
            </Form.Field>
            <Form.Field>
                <Form.Input label="Password" type="password" placeholder="Please insert your password" name="password" value={password} onChange={handlePasswordChange} error={passwordError}></Form.Input>
                {/* <label>Password</label>
                    <input type="password" placeholder="Please insert your password" name="password" /> */}
            </Form.Field>
            <Form.Field>
                <Form.Input label="Password Confirmation" type="password" placeholder="Please re-type your password" name="confPassword" value={confPassword} onChange={handleConfPasswordChange} error={confPasswordError}></Form.Input>
                {/* <label>Password Confirmation</label>
                    <input type="password" placeholder="Please re-type your password" name="confPassword" /> */}
            </Form.Field>
            <Button primary type='submit' style={{ width: "100%" }} onClick={handleFormSubmit} loading={loading}>Sign Up</Button>
        </Form>
    );

}

export default SignUpForm;