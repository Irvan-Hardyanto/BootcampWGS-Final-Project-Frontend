import React, { useState, useEffect } from 'react';
// import CustomHeader from './CustomHeader';
import { List, Table, Container, Grid, Header, Image, Button, Input } from 'semantic-ui-react';
import axios from 'axios';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import * as format from 'date-format';
import PaginationBar from "../../components/PaginationBar";

const BASE_URL = "http://localhost:9000";
const DATE_FORMAT = 'dd-MM-yyyy hh:mm:ss';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

const ProductList = (props) => {
    const ROWS_PER_PAGE = 3;

    const [products, setProducts] = useState([]);
    const [activePage, setActivePage] = useState(0);
    const [totalRows, setTotalRows] =useState(0);
    const [totalPage,setTotalPage] = useState(0)
    const [searchQuery, setSearchQuery] = useState('');

    const [editModalOpen,setEditModalOpen]=useState(false);
    const [selectedProduct,setSelectedProduct]=useState(null);

    const handleSearchBarInput = (event) => {
        // console.log('search bar value is changed...')
        setSearchQuery(event.target.value.toLowerCase());
    }

    const handlePageChange=({selected})=>{
        setActivePage(selected);
    }
    useEffect(() => {
        axiosInstance.get(`/products?search-query=${searchQuery}&page=${activePage}&limit=${ROWS_PER_PAGE}`).then(response => {
            setProducts(response.data.result);
            setTotalPage(response.data.totalPage);
            setTotalRows(response.data.totalRows);
            setActivePage(response.data.page);
        }).catch(error => {
            console.log(error);
            alert(error);
        })
    }, [activePage,searchQuery])

    const toggleEditProductModal=(product)=>{
        console.log('selected product is: '+product.name)
        setEditModalOpen(true);
        setSelectedProduct(product);
    }

    return (
        <Grid padded style={{ height: "100%" }}>
            <Grid.Row style={{ height: "10%" }}>
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
            <Grid.Row style={{height: "80%" }}>
                    <Table basic compact>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Picture</Table.HeaderCell>
                                <Table.HeaderCell>Product Information</Table.HeaderCell>
                                <Table.HeaderCell>Action</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                            <Table.Body>
                                {products.map((product, idx) => {
                                    return(
                                        <Table.Row key={product.id}>
                                            <Table.Cell width={2}>
                                                <Image src={BASE_URL + '/product/picture/' + product.id} fluid />
                                            </Table.Cell>
                                            <Table.Cell width={10}>
                                                <span style={{display:'inline-block', width: '110px', paddingRight: 0, marginRight:0}}><strong>Product name</strong> </span>: {product.name}<br/>
                                                <span style={{display:'inline-block', width: '110px', paddingRight: 0, marginRight:0}}><strong>Price</strong></span>: Rp. {product.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}<br/>
                                                <span style={{display:'inline-block', width: '110px', paddingRight: 0, marginRight:0}}><strong>Remaining Stock</strong></span>: {product.stock}<br/>
                                                <span style={{display:'inline-block', width: '110px', paddingRight: 0, marginRight:0}}><strong>Added at</strong></span>: {format.asString(DATE_FORMAT, new Date(product.createdAt))}<br/>
                                                <span style={{display:'inline-block', width: '110px', paddingRight: 0, marginRight:0}}><strong>Last updated at</strong></span>: {format.asString(DATE_FORMAT, new Date(product.updatedAt))}<br/>
                                            </Table.Cell>
                                            <Table.Cell width={4}>
                                                <Button color="blue" size='large' onClick={()=>toggleEditProductModal(product)}>Edit</Button>
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                })}
                        </Table.Body>
                    </Table>
            </Grid.Row>                      
            <Grid.Row style={{height:"10%", paddingBottom: "0px"}} centered>
                <Grid.Column textAlign='center'>
                    <PaginationBar totalPage={totalPage} handlePageChange={handlePageChange}/>
                </Grid.Column>
            </Grid.Row>
            <EditProductModal modalOpen={editModalOpen} setModalOpen={setEditModalOpen} product={selectedProduct}/> 
        </Grid>
    )

}

export default ProductList;