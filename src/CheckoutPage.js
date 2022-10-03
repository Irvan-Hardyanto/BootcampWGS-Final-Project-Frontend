import React from 'react';
import MainLayout from './MainLayout';
import { Grid, Container, Button, Modal, Header, Message, Image, List } from 'semantic-ui-react';
import NumberInput from 'semantic-ui-react-numberinput';

class CheckoutPage extends React.Component {
    //ini komponen yang kompleks...
    //dia harus nampilin semua belanjaan punya customer
    //customer bisa milih mau ngebatalin produk mana
    //atau ngubah jumlah pembeliannya
    constructor(props) {
        super(props);

        //state itu berupa sebuah order (daftar produk-produk yang dibeli oleh customer)
        this.state = {
            order: props.order,//array of product objects
            confirmOrderOpen: false,
            confirmOrderOpenDimmer: undefined,
        }
        this.closeConfirmOrderModal = this.closeConfirmOrderModal.bind(this);
        this.openConfirmOrderModal = this.openConfirmOrderModal.bind(this);
    }

    changeProductQuantity(productId, newQuantity) {
        let product = this.state.order.find((product) => {
            return product.id === productId;
        })
        this.setState()
    }

    openConfirmOrderModal() {
        this.setState({
            confirmOrderOpen: true,
            confirmOrderOpenDimmer: 'blurring'
        })
    }

    closeConfirmOrderModal() {
        this.setState({
            confirmOrderOpen: false,
            confirmOrderOpenDimmer: undefined
        })
    }

    render() {
        return (
            <Container style={{ backgroundColor: "white", padding: "2em", height: "100%", overflow: 'Auto' }}>
                <Header as='h1'>CHECKOUT</Header>
                <Message info>
                    <Message.Header>Please confirm your order</Message.Header>
                </Message>
                <Container style={{ maxHeight: "27em", overflow: "Auto" }}>
                    <List divided verticalAlign='middle' style={{ margin: "0px" }}>
                        {this.state.order.map((product, idx) => {
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
                                                    <NumberInput className="numberInput" value={product.quantity.toString()} />
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

                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={1}>
                        <Grid.Column width={7} floated='right' textAlign='right'>
                            <Button size='big' onClick={this.openConfirmOrderModal} color='green'>Confirm Order</Button>
                            <Button size='big'>Back to Product List</Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Modal size="tiny" dimmer={this.state.confirmOrderOpenDimmer} open={this.state.confirmOrderOpen} onClose={this.closeConfirmOrderModal}>
                    <Modal.Content>
                        <Message warning>
                            <Message.Header>Are You Sure With Your Order?</Message.Header>
                            <p>After clicking 'Yes' button, you CANNOT edit your order</p>
                        </Message>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button negative onClick={this.closeConfirmOrderModal}>
                            No
                        </Button>
                        <Button positive onClick={this.closeConfirmOrderModal}>
                            Yes
                        </Button>
                    </Modal.Actions>
                </Modal>
            </Container>
        )
    }
}

export default CheckoutPage;