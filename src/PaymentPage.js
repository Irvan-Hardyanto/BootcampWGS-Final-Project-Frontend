import React from 'react';
import { Container, Grid, Header, Message, Image } from 'semantic-ui-react';

function PaymentPage(props) {
    return (
        <Container style={{ backgroundColor: "white", height: "100%" }}>
            <Grid padded style={{ height: "100%" }}>
                <Grid.Row style={{ height: "25%" }}>
                    <Grid.Column>
                        <Header as="h1">PAYMENT</Header>
                        <Message info>
                            <Message.Header>One Last Step!</Message.Header>
                            Please scan QR code below for payment,
                        </Message>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row centered style={{ height: "50%" }}>
                    <Grid.Column verticalAlign='middle' width={10} textAlign='center'>
                        <Header as='h1'>ORDER DETAILS</Header>
                    </Grid.Column>
                    <Grid.Column textAlign='center' width={5} style={{ margin: "auto" }}>
                        <Image fluid src={"../images/qr.jpg"}></Image>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row style={{ height: "25%" }}>
                    <Grid.Column textAlign='center'>
                        <Header size='medium'>Available Payment Methods</Header>
                        <Grid>
                            <Grid.Row centered columns={1} padded>
                                <Grid.Column verticalAlign='middle' width={3} textAlign='center'>
                                    <Image fluid src="../images/gopay.png" />
                                </Grid.Column>
                                {/* <Grid.Column verticalAlign='middle' width={3} textAlign='center'>
                                    <Image fluid src="../images/ovo.png"/>
                                </Grid.Column>
                                <Grid.Column verticalAlign='middle' width={3} textAlign='center'>
                                    <Image centered src="../images/dana.png" size="tiny"/>
                                </Grid.Column> */}
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
}

export default PaymentPage;