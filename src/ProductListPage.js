import React, { useEffect } from 'react';
import MainLayout from './MainLayout';
import CustomHeader from './CustomHeader';
import ProductCard from './ProductCard';
import { Card, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";

import { initProducts } from './reducers/ProductSlice.js';


//pengennya pake .env, tapi undefined terus.
const BASE_URL = "http://localhost:9000";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

const ProductListPage = (props) => {
    const products = useSelector((state) => state.products.value);
    const dispatch = useDispatch();

    //panggil API nya cukup sekali saja di awal..
    useEffect(() => {
        axiosInstance.get('/customer/productlist').then(response => {
            dispatch(initProducts({ products: response.data }))
        }).catch(error => {
            console.log(error);
        })
    }, []);
    
    //ketika komponen nya udah di render ke DOM  => ambil produk-produknya dari database, lalu tampilkan
    
    // constructor(props) {
    //     super(props);

    //     this.state={
    //         products:[]
    //     }

    //     const axiosInstance = axios.create({
    //         baseURL: BASE_URL,
    //     })

    //     axiosInstance.get('/customer/productlist').then(response=>{
    //         // console.log(response);
    //         this.setState({products: response.data});
    //     }).catch(error=>{
    //         alert(error);
    //     })
    // }

    return (
        <MainLayout columns={3}>
            <CustomHeader placeholder="Type to search a product..." height="25vh" imgSrc="./images/logo-pake-padding.png">
            </CustomHeader>
            {/* <Content maxHeight="75vh" columns={4} overflow="auto"> */}
            <Link to="/cart">
            <Button>View Cart</Button>
            </Link>
            <Card.Group centered itemsPerRow={6}>
                {products.map((product, idx) => {
                    return <ProductCard key={product.id} stock={product.stock} unit={product.unit} id={product.id} name={product.name} imgSrc={BASE_URL + '/product/picture/' + product.id} price={product.price} description={product.description}></ProductCard>;
                })}
            </Card.Group>
            {/* </Content> */}
        </MainLayout>
    )
}

export default ProductListPage;