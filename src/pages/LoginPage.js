import React from 'react';
import MainLayout from './MainLayout';
import LoginForm from './LoginForm';
import { Container, Grid, Image, Message } from 'semantic-ui-react';
import { useLocation } from 'react-router-dom';

const LoginPage = (props) => {
    const state=useLocation().state;
    const showLoginError=()=>{
        if(state){
            return <Message negative>{state.msg}</Message>
        }
    }
    return (
        <MainLayout columns={1}>
            <Grid.Row centered>
                <Grid.Column style={{ width: "40%" }}>
                    <Container style={{ backgroundColor: "white", padding: "10px 10px" }}>
                        <Grid.Row>
                            <Grid.Column>
                                <Image centered src="./images/logo-plain-nobg.png"></Image>
                                <h1>LOGIN</h1>
                                {showLoginError()}
                            </Grid.Column>
                        </Grid.Row>
                        <LoginForm></LoginForm>
                    </Container>
                </Grid.Column>
            </Grid.Row>
        </MainLayout>
    )
}

export default LoginPage;