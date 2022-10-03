import React from 'react';
import CustomHeader from './CustomHeader';
import { List, Container, Grid, Header, Image, Button } from 'semantic-ui-react';

class ProductListAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: props.products//array of product objects.
        }
    }

    render() {
        return (
            <Container style={{ maxHeight: "100%", backgroundColor: 'white' }}>
                <Grid verticalAlign='middle' padded>
                    {/* Perhatikan URI yang digunakan dan path gambarnya */}
                    <CustomHeader height="20vh" placeholder="Search an customer.." imgSrc="../images/logo-pake-padding.png"></CustomHeader>
                    <Grid.Row style={{ padding: "0px", height: "80vh" }}>
                        <Grid.Column>
                            <Header as='h1'>PRODUCT LIST (ADMIN)</Header>
                            <Container style={{ maxHeight: "70vh", overflow: "Auto" }}>
                                <List divided verticalAlign='middle' style={{ margin: "0px" }}>
                                    {this.state.products.map((product, idx) => {
                                        return (
                                            <List.Item key={product.id}>
                                                <Grid verticalAlign='middle' padded>
                                                    <Grid.Row columns={3}>
                                                        <Grid.Column width={2} style={{ padding: "0.2em 0px" }}>
                                                            <Image src={product.image} fluid />
                                                        </Grid.Column>
                                                        <Grid.Column width={10}>
                                                            <List.Content>
                                                                <table>
                                                                    <tr>
                                                                        <td><strong>Product name</strong></td>
                                                                        <td>:</td>
                                                                        <td>{product.name}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td><strong>Price</strong></td>
                                                                        <td>:</td>
                                                                        <td>Rp. {product.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td><strong>Remaining Stock</strong></td>
                                                                        <td>:</td>
                                                                        <td>{product.stock}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td><strong>Added at</strong></td>
                                                                        <td>:</td>
                                                                        <td>{product.createdAt}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td><strong>Last updated at</strong></td>
                                                                        <td>:</td>
                                                                        <td>{product.updatedAt}</td>
                                                                    </tr>
                                                                </table>
                                                                {/* <Header as='h3' style={{ marginBottom: "0.5em" }}>Product name: {product.name} </Header>
                                                                <Header as='h4' style={{ marginBottom: "0.5em" }}>Price: Rp. {product.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}</Header>
                                                                <Header as='h4' style={{ marginBottom: "0.5em" }}>Remaining Stock: {product.stock}</Header>
                                                                <Header as='h4' style={{ marginBottom: "0.5em" }}>Added at : {product.createdAt}</Header>
                                                                <Header as='h4' style={{ marginBottom: "0.5em" }}>Last updated at : {product.updatedAt}</Header> */}
                                                            </List.Content>
                                                        </Grid.Column>
                                                        <Grid.Column width={4}>
                                                            <Button.Group size='large'>
                                                                <Button color="blue">Edit</Button>
                                                                <Button.Or />
                                                                <Button color="red">Delete</Button>
                                                            </Button.Group>
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
                </Grid>
            </Container>
        )
    }
}

export default ProductListAdmin;