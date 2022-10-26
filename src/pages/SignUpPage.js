import React from 'react';
import MainLayout from './MainLayout';
import SignUpForm from './SignUpForm';
import { Container, Grid, Image } from 'semantic-ui-react';

class SignUpPage extends React.Component {
    render() {
        return (
            <MainLayout columns={1}>
                <Grid.Row centered>
                    <Grid.Column style={{ width: "40%" }}>
                        <Container style={{ backgroundColor: "white", padding: "10px 10px" }}>
                            <Grid.Row>
                                <Grid.Column>
                                    <Image centered src="./images/logo-plain-nobg.png"></Image>
                                    <h1>SIGN UP</h1>
                                </Grid.Column>
                            </Grid.Row>
                            <SignUpForm></SignUpForm>
                        </Container>
                    </Grid.Column>
                </Grid.Row>
            </MainLayout>
        );
    }
}

export default SignUpPage;