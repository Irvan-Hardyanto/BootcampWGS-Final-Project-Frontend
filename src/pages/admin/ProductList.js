import React, { useState, useEffect } from 'react';
// import CustomHeader from './CustomHeader';
import { List, Container, Grid, Header, Image, Button } from 'semantic-ui-react';
import axios from 'axios';
import AddProductModal from './AddProductModal';
import * as format from 'date-format';

const BASE_URL = "http://localhost:9000";
const DATE_FORMAT = 'dd-MM-yyyy hh:mm:ss';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

const ProductList = (props) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axiosInstance.get('/products').then(response => {
            setProducts(response.data)
        }).catch(error => {
            alert(error);
        })
    }, [])

    return (
        // <Container style={{ maxHeight: "100%", backgroundColor: 'white' }}>
            <Grid verticalAlign='middle' padded>
                {/* Perhatikan URI yang digunakan dan path gambarnya */}
                {/* <CustomHeader height="20vh" placeholder="Search an customer.." imgSrc="../images/logo-pake-padding.png"></CustomHeader> */}
                <Grid.Row style={{ padding: "0px", height: "80vh" }}>
                    <Grid.Column>
                        <Grid verticalAlign='middle'>
                            <Grid.Row>
                                <Grid.Column floated='left' width={6}>
                                    <Header as='h1'>PRODUCT LIST (ADMIN)</Header>
                                </Grid.Column>
                                <Grid.Column floated='right' width={5}>
                                    <AddProductModal></AddProductModal>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <Container style={{ maxHeight: "70vh", overflow: "Auto" }}>
                            <List divided verticalAlign='middle' style={{ margin: "0px" }}>
                                {products.map((product, idx) => {
                                    return (
                                        <List.Item key={product.id}>
                                            <Grid verticalAlign='middle' padded>
                                                <Grid.Row columns={3}>
                                                    <Grid.Column width={2} style={{ padding: "0.2em 0px" }}>
                                                        <Image src={BASE_URL + '/product/picture/' + product.id} fluid />
                                                    </Grid.Column>
                                                    <Grid.Column width={10}>
                                                        <List.Content>
                                                            <table>
                                                                <tbody>
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
                                                                        <td>{format.asString(DATE_FORMAT, new Date(product.createdAt))}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td><strong>Last updated at</strong></td>
                                                                        <td>:</td>
                                                                        <td>{format.asString(DATE_FORMAT, new Date(product.updatedAt))}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
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
        // </Container>
    )

}

export default ProductList;