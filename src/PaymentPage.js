import React from 'react';
import { Container, Grid, Header, Message, Image, List } from 'semantic-ui-react';
import { useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";


///checkout sama payment sebenernya bisa ngambil dari 'store' nya cart
function PaymentPage(props) {
    const order = useSelector((state) => state.cart.value).filter(e => e.checked);
    let totalPrice=0;
    for(let item of order){
        totalPrice += (item.quantity*item.price);
    }
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
                        <List divided>
                            {order.map((product, idx) => {
                                return (
                                    <List.Item key={product.id}>
                                        <List.Content>
                                            <Grid columns={2}>
                                                <Grid.Row>
                                                    <Grid.Column textAlign='left' width={10}>
                                                        <Header size='medium'>{product.name}</Header>
                                                        <Header sub style={{fontSize: "0.9em"}}>{`${product.quantity} ${product.unit}`}</Header>
                                                    </Grid.Column>
                                                    <Grid.Column width={6} textAlign='right'>
                                                        <Header as='h2'>{`Rp. ${(parseInt(product.quantity) * parseInt(product.price)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}`}</Header>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </List.Content>
                                    </List.Item>
                                )
                            })}
                        </List>
                        <Message>    
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={10} textAlign='left'>
                                    <Header size='large'>TOTAL PRICE</Header>
                                </Grid.Column>
                                <Grid.Column width={6} textAlign='right'>
                                    <Header size='large'>{`Rp.  ${totalPrice.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}`}</Header>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        </Message>
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