import React from "react";
import { List, Container, Grid, Header, Image, Button, Search, Checkbox, Segment, Message } from 'semantic-ui-react';
import NumberInput from 'semantic-ui-react-numberinput';

//Penjelasan pembagian height setiap container pake persen:
//https://stackoverflow.com/questions/14262938/child-with-max-height-100-overflows-parent
class CartPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: props.products,
        }
    }

    render() {
        return (
            <Container style={{ backgroundColor: "white", height: "100%", padding: "1em" }}>
                <Grid verticalAlign='middle' padded style={{height:"100%"}}>
                    <Grid.Row style={{ height: "10%", paddingBottom: "0px" }}>
                        <Grid.Column>
                            <Header as="h1">CART</Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{ height: "75%", padding: "0px" }}>
                        <Grid.Column>
                            <Search placeholder="Search a product in your cart..." input={{ fluid: true }} style={{ marginBottom: "2px" }}></Search>
                            <Grid verticalAlign="middle" padded>
                                <Grid.Row columns={2}>
                                    <Grid.Column width={1}>
                                        <Segment compact><Checkbox /></Segment>
                                    </Grid.Column>
                                    <Grid.Column width={15}>
                                        <Header size='medium'>Select All Products</Header>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Container style={{ height: "20em", overflow: "Auto" }}>
                                {/* <Segment style={{position:"fixed"}}><Checkbox label='Select all Product' /></Segment> */}
                                <List divided verticalAlign='middle' style={{ margin: "0px" }}>
                                    {this.state.products.map((product, idx) => {
                                        return (
                                            <List.Item key={product.id}>
                                                <Grid verticalAlign='middle' padded>
                                                    <Grid.Row columns={4}>
                                                        <Grid.Column width={1}>
                                                            <Segment compact>
                                                                <Checkbox />
                                                            </Segment>
                                                        </Grid.Column>
                                                        <Grid.Column width={2}>
                                                            <Image src={product.image} fluid />
                                                        </Grid.Column>
                                                        <Grid.Column width={6}>
                                                            <List.Content>
                                                                <Header as='h3' style={{ marginBottom: "0.5em" }}>{product.name} </Header>
                                                                <Header as='h4' style={{ marginBottom: "0.5em" }}>Rp. {product.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}</Header>
                                                                <NumberInput className="numberInput" value={product.quantity.toString()} />
                                                            </List.Content>
                                                        </Grid.Column>
                                                        <Grid.Column width={7}>
                                                            <List.Content verticalAlign='middle' style={{ height: "100%" }}>
                                                                <Header as='h1' textAlign="right">Rp. {(product.price * product.quantity).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}</Header>
                                                            </List.Content>
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                </Grid>
                                            </List.Item>
                                        )
                                    })}
                                </List>
                            </Container>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{ height: "15%", padding: "0px" }}>
                        <Grid.Column floated='right'>
                            <Header as='h1'>TOTAL PRICE</Header>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        )
    }
}

export default CartPage;