import React, { useEffect } from 'react';
import MainLayout from './MainLayout';
import CustomHeader from './CustomHeader';
import ProductCard from './ProductCard';
import { Card, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import { useSelector, useDispatch } from "react-redux";

import { initProducts } from './reducers/ProductSlice.js';
import { addProduct } from "./reducers/CartSlice.js"


//pengennya pake .env, tapi undefined terus.
const BASE_URL = "http://localhost:9000";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

const ProductListPage = (props) => {
    const products = useSelector((state) => state.products.value);
    const session = useSelector((state) => state.session);
    const cartStore = useSelector((state) => state.cart.value);
    const dispatch = useDispatch();

    useEffect(() => {
        // console.log('cartis modifiedon productListPage!')
        // console.log('items in cart are')
        let items = [];
        for (let i = 0; i < cartStore.length; i++) {
            items.push({
                productId: cartStore[i].id,
                qty: cartStore[i].quantity,
                checked: cartStore[i].checked
            })
        }
        // console.log('items in cart when at productlistpage are: '+items)
        axiosInstance.put(`/carts/${session.userId}`, qs.stringify({
            "items": items
        }), {
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        }).catch(err => {
            console.log(err);
        })
    }, [cartStore]);

    useEffect(() => {
        axiosInstance.get(`/carts?userId=${session.userId}`).then(response => {
            //TODO: konversikan format dari db ke format ygbenar (ada picture, harga ,nama nya)
            JSON.parse(response.data.items).forEach(item => {
                //ini tuh buat nge get detail setiap produk
                axiosInstance.get(`/products/${item.productId}`).then(response => {
                    dispatch(addProduct({
                        product: {
                            id: parseInt(item.productId),
                            image: BASE_URL + '/product/picture/' + item.productId,
                            name: response.data.name,
                            price: parseInt(response.data.price),
                            quantity: parseInt(item.qty),
                            unit: response.data.unit,
                            checked: JSON.parse(item.checked.toLowerCase()),
                        }
                    }))
                }).catch(err => {
                    console.log(err)
                })
            })
            //dispatch(addProducts({products: JSON.parse(response.data.items)}));
        }).catch(err => {
            console.log(err);
        })
    }, [])
    //panggil API nya cukup sekali saja di awal..
    useEffect(() => {
        axiosInstance.get('/products').then(response => {
            dispatch(initProducts({ products: response.data }))
        }).catch(error => {
            console.log(error);
        })
    }, []);

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