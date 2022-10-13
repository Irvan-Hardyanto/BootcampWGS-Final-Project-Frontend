import React, { useState } from 'react';
import { Grid, Container, Button, Modal, Header, Message, Image, List } from 'semantic-ui-react';
import { useLocation,Link } from 'react-router-dom';

const CheckoutPage = (props) => {
    const [confirmOrderOpen, setConfirmOrderOpen] = useState(false);
    const order = useLocation().state;
    //ini komponen yang kompleks...
    //dia harus nampilin semua belanjaan punya customer
    //customer bisa milih mau ngebatalin produk mana
    //atau ngubah jumlah pembeliannya

    // constructor(props) {
    //     super(props);

    //     //state itu berupa sebuah order (daftar produk-produk yang dibeli oleh customer)
    //     this.state = {
    //         order: props.order,//array of product objects
    //         confirmOrderOpen: false,
    //         confirmOrderOpenDimmer: undefined,
    //     }
    //     this.closeConfirmOrderModal = this.closeConfirmOrderModal.bind(this);
    //     this.openConfirmOrderModal = this.openConfirmOrderModal.bind(this);
    // }
    const openConfirmOrderModal = () => {
        setConfirmOrderOpen(true)
        // setState({
        //     confirmOrderOpen: true,
        //     confirmOrderOpenDimmer: 'blurring'
        // })
    }

    const closeConfirmOrderModal = () => {
        setConfirmOrderOpen(false)
        // this.setState({
        //     confirmOrderOpen: false,
        //     confirmOrderOpenDimmer: undefined
        // })
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
                        <Header as='h1'>Rp. {order.reduce((a, b) => a + (b['price']*b['quantity'] || 0), 0).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}</Header>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={1}>
                    <Grid.Column width={7} floated='right' textAlign='right'>
                        <Button size='big' onClick={openConfirmOrderModal} color='green'>Confirm Order</Button>
                        <Link to='/products'>
                            <Button size='big'>Back to Product List</Button>
                        </Link>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Modal size="tiny" dimmer='blurring' open={confirmOrderOpen} onClose={closeConfirmOrderModal}>
                <Modal.Content>
                    <Message warning>
                        <Message.Header>Are You Sure With Your Order?</Message.Header>
                        <p>After clicking 'Yes' button, you CANNOT edit your order</p>
                    </Message>
                </Modal.Content>
                <Modal.Actions>
                {/* redirect ke halaman pembayaran */}
                    <Button negative onClick={closeConfirmOrderModal}>
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