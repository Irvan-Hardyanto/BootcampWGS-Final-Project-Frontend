import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { Card, Button, Grid, Menu, Input, Header } from 'semantic-ui-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import { useSelector, useDispatch } from "react-redux";

import { initProducts } from '../reducers/ProductSlice.js';
import { addProduct } from "../reducers/CartSlice.js";
import logOut from '../utils/LogOut';

//pengennya pake .env, tapi undefined terus.
const BASE_URL = "http://localhost:9000";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

const ProductListPage = (props) => {
    const products = useSelector((state) => state.products.value);
    const session = useSelector((state) => state.session);
    const cartStore = useSelector((state) => state.cart.value);
    const [activeMenu, setActiveMenu] = useState("Products");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleMenuItemClicked = (e, { name }) => {
        if(name!="Products" && !session.userId){
            navigate('/login')
        }
        setActiveMenu(name);
    }
    const renderProfileButton=(userId)=>{
        if(!userId){
            return (
                <Link to='/login'>
                    <Button color='green'>Login As Customer</Button>
                </Link>
            )
        }else{
            return (
                <Button color='red'onClick={()=>logOut(dispatch)}>Logout</Button>
            )
        }
    }

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
        //kalau gak ada yg lagi login -> session.userId nya null, gak usah update cart nya
        if(session.userId){
            axiosInstance.put(`/carts/${session.userId}`, qs.stringify({
                "items": items
            }), {
                headers: {
                    'user-id': session.userId,
                    'user-role': session.role,
                    'content-type': 'application/x-www-form-urlencoded' 
                }
            }).catch(err => {
                console.log(err);
            })
        }
    }, [cartStore]);

    useEffect(() => {
        if(session.userId){
            axiosInstance.get(`/carts?userId=${session.userId}`,{
                headers:{
                    'user-id': session.userId,
                    'user-role': session.role,
                }
            }).then(response => {
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
        }
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
        <Grid padded style={{ height: '100%' }}>
            <Grid.Row style={{ height: '10%', backgroundColor: 'white' }}>
                <Menu secondary style={{ height: '100%' }}>
                    <Menu.Item>
                        <Header as='h1'>SHOPPING APP</Header>
                    </Menu.Item>
                    <Menu.Item
                        name="Products"
                        active={activeMenu === "Products"}
                        onClick={handleMenuItemClicked}
                    />
                    <Menu.Item
                        name="Cart"
                        active={activeMenu === "Cart"}
                        onClick={handleMenuItemClicked}
                    >
                        <Link to="/cart">
                            Cart
                        </Link>
                    </Menu.Item>
                    <Menu.Item
                        name="Purchase History"
                        active={activeMenu === "Purchase History"}
                        onClick={handleMenuItemClicked}
                    />
                    <Menu.Item
                        name="Profile"
                        active={activeMenu === "Profile"}
                        onClick={handleMenuItemClicked}
                    />
                    <Menu.Item>
                        <Input className='icon' icon='search' placeholder='Search...' />
                    </Menu.Item>
                    <Menu.Menu position='right'>
                        {renderProfileButton(session.userId)}
                    </Menu.Menu>
                </Menu>
            </Grid.Row>
            <Grid.Row style={{ height: '90%' }}>
                <Grid.Column>
                    <Card.Group centered itemsPerRow={6}>
                        {products.map((product, idx) => {
                            return <ProductCard key={product.id} stock={product.stock} unit={product.unit} id={product.id} name={product.name} imgSrc={BASE_URL + '/product/picture/' + product.id} price={product.price} description={product.description}></ProductCard>;
                        })}
                    </Card.Group>
                </Grid.Column>
            </Grid.Row>
        </Grid>

    )
}

export default ProductListPage;