import React, { useState, useEffect } from 'react';
// import CustomHeader from './CustomHeader';
import { List, Container, Grid, Header, Image, Button, Input } from 'semantic-ui-react';
import axios from 'axios';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import * as format from 'date-format';

const BASE_URL = "http://localhost:9000";
const DATE_FORMAT = 'dd-MM-yyyy hh:mm:ss';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

const ProductList = (props) => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [editModalOpen,setEditModalOpen]=useState(false);
    const [selectedProduct,setSelectedProduct]=useState(null);

    const searchProduct = (query = '', products) => {
        query=query.toLowerCase();
        return products.filter(product => { 
            if(query===''){
                return product
            }else{
                return product.name.toLowerCase().includes(query);
            }
        })
    }
    const handleSearchBarInput = (event) => {
        // console.log('search bar value is changed...')
        setSearchQuery(event.target.value);
    }
    useEffect(() => {
        axiosInstance.get('/products').then(response => {
            setProducts(response.data)
        }).catch(error => {
            alert(error);
        })
    }, [])

    const toggleEditProductModal=(product)=>{
        console.log('selected product is: '+product.name)
        setEditModalOpen(true);
        setSelectedProduct(product);
    }

    return (
        // <Container style={{ maxHeight: "100%", backgroundColor: 'white' }}>
            <Grid verticalAlign='middle' padded>
                {/* Perhatikan URI yang digunakan dan path gambarnya */}
                {/* <CustomHeader height="20vh" placeholder="Search an customer.." imgSrc="../images/logo-pake-padding.png"></CustomHeader> */}
                <Grid.Row style={{ padding: "0px", height: "80vh" }}>
                    <Grid.Column>
                        <Grid verticalAlign='middle'>
                            <Grid.Row>
                                <Grid.Column floated='left' width={3}>
                                    <Header as='h1'>PRODUCTS</Header>
                                </Grid.Column>
                                <Grid.Column  width={8}>
                                    <Input style={{width:'100%'}} className='icon' icon='search' placeholder='Search Product(s) by name...' onChange={handleSearchBarInput}/>
                                </Grid.Column>
                                <Grid.Column floated='right' width={5}>
                                    <AddProductModal products={products} setProducts={setProducts}></AddProductModal>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <Container style={{ maxHeight: "70vh", overflow: "Auto" ,minHeight: "70vh"}}>
                            <List divided verticalAlign='middle' style={{ margin: "0px" }}>
                                {searchProduct(searchQuery,products).map((product, idx) => {
                                    return (
                                        <List.Item key={product.id}>
                                            <Grid verticalAlign='middle' padded>
                                                <Grid.Row columns={3} style={{padding:'0px'}}>
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
                                                        <Button color="blue" size='large' onClick={()=>toggleEditProductModal(product)}>Edit</Button>
                                                        {/*<Button.Group size='large'>
                                                            <Button color="blue" onClick={()=>toggleEditProductModal(product)}>Edit</Button>
                                                            <Button.Or />
                                                            <Button color="red">Delete</Button>
                                                        </Button.Group>*/}
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
                <EditProductModal modalOpen={editModalOpen} setModalOpen={setEditModalOpen} product={selectedProduct}/> 
            </Grid>
        // </Container>
    )

}

export default ProductList;