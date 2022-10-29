import React, { useState } from 'react';
import { Grid, Container, Button, Modal, Header, Message, Image, List } from 'semantic-ui-react';
import { useLocation, Link, Navigate } from 'react-router-dom';

const CheckoutPage = (props) => {
    const [confirmOrderOpen, setConfirmOrderOpen] = useState(false);
    const [checkoutDone, setCheckoutDone] = useState(false);

    //data redirect dari halaman product detail modal (kalau beli langsung)
    //atau dari cart (kalo beli dari cart)
    const order = useLocation().state.products;
    const prevPage = useLocation().state.prevPage;
    // console.log("order is: "+JSON.stringify(order));

    const openConfirmOrderModal = () => {
        setConfirmOrderOpen(true)
    }

    const closeConfirmOrderModal = () => {
        setConfirmOrderOpen(false)
        checkout();
    }
    const checkout = () => {
        //kirim data transaksi ke tabel Payment
        //ketika user klik checkout, ada rekord di tabel transaksi yang statusnya 'unpaid';
        setCheckoutDone(true);
    }
    const renderReturnButton = (prevPage) => {
        if (prevPage === "product_detail_modal") {
            return (
                <Link to='/products'>
                    <Button size='big'>Back to Product List</Button>
                </Link>
            )
        } else if (prevPage === "cart") {
            return(
                <Link to='/cart'>
                    <Button size='big'>Back to Shopping Cart</Button>
                </Link>
            )
        }
    }

    if (checkoutDone) {
        return <Navigate to='/payment' state={order}></Navigate>
    }
    return (
        <Container style={{ backgroundColor: "white", padding: "2em", height: "100%", overflow: 'Auto' }}>
            <Header as='h1'>CHECKOUT</Header>
            <Message info>
                <Message.Header>Please confirm your order</Message.Header>
            </Message>
            <Container style={{ maxHeight: "27em", overflow: "Auto" }}>
                <List divided verticalAlign='middle' style={{ margin: "0px" }}>
                    {order.map((product, idx) => {
                        return (
                            <List.Item key={product.id}>
                                <Grid verticalAlign='middle' padded>
                                    <Grid.Row columns={3}>
                                        <Grid.Column width={2} style={{ padding: "0.2em 0px" }}>
                                            <Image src={product.image} fluid />
                                        </Grid.Column>
                                        <Grid.Column width={10}>

                                            <List.Content>
                                                <Header as='h3' style={{ marginBottom: "0.5em" }}>{product.name} </Header>
                                                <Header as='h4' style={{ marginBottom: "0.5em" }}>Rp. {product.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}</Header>
                                                <Header as='h5'>{`${product.quantity.toString()} ${product.unit}`}</Header>
                                            </List.Content>
                                        </Grid.Column>
                                        <Grid.Column width={4}>
                                            <List.Content verticalAlign='middle' style={{ height: "100%" }}>
                                                <Header as='h1'>Rp. {(product.price * product.quantity).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}</Header>
                                            </List.Content>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </List.Item>
                        )
                    })}
                </List>
            </Container>
            <Grid verticalAlign='middle' padded>
                <Grid.Row columns={2} style={{ padding: "0px" }}>
                    <Grid.Column width={12} textAlign='right'>
                        <Header as='h1'>TOTAL PRICE</Header>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Header as='h1'>Rp. {order.reduce((a, b) => a + (b['price'] * b['quantity'] || 0), 0).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}</Header>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={1}>
                    <Grid.Column width={7} floated='right' textAlign='right'>
                        <Button size='big' onClick={openConfirmOrderModal} color='green'>Confirm Order</Button>
                        {renderReturnButton(prevPage)}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Modal size="tiny" dimmer='blurring' open={confirmOrderOpen} onClose={()=>setConfirmOrderOpen(false)}>
                <Modal.Content>
                    <Message warning>
                        <Message.Header>Are You Sure With Your Order?</Message.Header>
                        <p>After clicking 'Yes' button, you CANNOT edit your order</p>
                    </Message>
                </Modal.Content>
                <Modal.Actions>
                    {/* redirect ke halaman pembayaran */}
                    <Button negative onClick={()=>setConfirmOrderOpen(false)}>
                        No
                    </Button>
                    <Button positive onClick={closeConfirmOrderModal}>
                        Yes
                    </Button>
                </Modal.Actions>
            </Modal>
        </Container>
    )
}

export default CheckoutPage;