import React, { useState, useEffect } from "react";
import { List, Container, Grid, Header, Image, Search, Checkbox, Segment, Button } from 'semantic-ui-react';
import NumberInput from 'semantic-ui-react-numberinput';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { uncheckAllProduct, checkAllProduct, uncheckProduct, checkProduct, editPurchaseQuantity } from "./reducers/CartSlice.js";
import axios from 'axios';
import qs from 'qs';
import { addProducts, addProduct } from "./reducers/CartSlice.js"

const BASE_URL = "http://localhost:9000";
const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

//Penjelasan pembagian height setiap container pake persen:
//https://stackoverflow.com/questions/14262938/child-with-max-height-100-overflows-parent

//Skenario yg mungkin:
//Pengguna menekan add to cart di halaman product list dan db nya kosong 
//Pengguna menekan add to cart di halaman product list dan db nya masih ada.
//ide dari: https://www.willmaster.com/library/manage-forms/checkbox-shopping-cart.php
const CartPage = (props) => {
    const [isCheckedAll, setIsCheckedAll] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const cartStore = useSelector((state) => state.cart.value);
    const session = useSelector((state) => state.session)
    const dispatch = useDispatch();

    useEffect(() => {
        axiosInstance.get(`/carts?userId=${session.userId}`).then(response => {
            //TODO: konversikan format dari db ke format ygbenar (ada picture, harga ,nama nya)
            JSON.parse(response.data.items).forEach(item => {
                axiosInstance.get(`/products/${item.productId}`).then(response => {
                    dispatch(addProduct({
                        product: {
                            id: item.productId,
                            image: BASE_URL + '/product/picture/' + item.productId,
                            name: response.data.name,
                            price: response.data.price,
                            quantity: item.qty,
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
    //ketika ada produk yang di check atau uncheck, perbarui total harga nya
    useEffect(() => {
        let sumPrice = 0;
        for (let product of cartStore) {
            if (product.checked) {
                sumPrice += product.price * product.quantity;
            }
        }
        setTotalPrice(sumPrice);
        //PUT ke API => perbarui database nya
        let items = [];
        for (let i = 0; i < cartStore.length; i++) {
            items.push({
                productId: cartStore[i].id,
                qty: cartStore[i].quantity,
                checked: cartStore[i].checked
            })
        }
        axiosInstance.put(`/carts/${session.userId}`, qs.stringify({
            "items": items
        }), {
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        })
    }, [cartStore])

    const changePurchasedProductQuantity = (selectedId, newQuantity) => {
        dispatch(editPurchaseQuantity({ id: selectedId, quantity: newQuantity }))
    }

    const handleMainCheckBoxClicked = (event, data) => {
        if (isCheckedAll) {
            setIsCheckedAll(false);//checked->unchecked
            dispatch(uncheckAllProduct())
        } else {
            setIsCheckedAll(true);//unchecked->checked
            dispatch(checkAllProduct())
        }
    }

    const handleProductClicked = (event, data) => {
        if (cartStore.find(product => product.id === data.id).checked) {
            dispatch(uncheckProduct({ id: data.id }))
        } else {
            dispatch(checkProduct({ id: data.id }))
        }
    }

    return (
        <Container style={{ backgroundColor: "white", height: "100%", padding: "1em" }}>
            <Grid verticalAlign='middle' padded style={{ height: "100%" }}>
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
                                    <Segment compact><Checkbox checked={isCheckedAll} onClick={handleMainCheckBoxClicked} /></Segment>
                                </Grid.Column>
                                <Grid.Column width={15}>
                                    <Header size='medium'>Select All Products</Header>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <Container style={{ height: "20em", overflow: "Auto" }}>
                            {/* <Segment style={{position:"fixed"}}><Checkbox label='Select all Product' /></Segment> */}
                            <List divided verticalAlign='middle' style={{ margin: "0px" }}>
                                {cartStore.map((product, idx) => {
                                    return (
                                        <List.Item key={product.id}>
                                            <Grid verticalAlign='middle' padded>
                                                <Grid.Row columns={4}>
                                                    <Grid.Column width={1}>
                                                        <Segment compact>
                                                            <Checkbox id={product.id} checked={product.checked} onClick={handleProductClicked} />
                                                        </Segment>
                                                    </Grid.Column>
                                                    <Grid.Column width={2}>
                                                        <Image src={product.image} fluid />
                                                    </Grid.Column>
                                                    <Grid.Column width={6}>
                                                        <List.Content>
                                                            <Header as='h3' style={{ marginBottom: "0.5em" }}>{product.name} </Header>
                                                            <Header as='h4' style={{ marginBottom: "0.5em" }}>Rp. {product.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}</Header>
                                                            <NumberInput className="numberInput" value={product.quantity.toString()} onChange={(e) => changePurchasedProductQuantity(product.id, e)} />
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
                <Grid.Row style={{ height: "5%", padding: "0px" }}>
                    <Grid.Column width={12}>
                        <Header as='h1'>TOTAL PRICE</Header>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Header as='h1'>Rp. {totalPrice.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}</Header>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row style={{ height: "10%", padding: "0px" }} columns={1}>
                    <Grid.Column width={7} floated='right' textAlign='right'>
                        <Link to='/checkout' state={cartStore.filter((cartItem) => cartItem.checked)}>
                            <Button size='big' color='green'>Checkout</Button>
                        </Link>
                        <Link to='/products'>
                            <Button size='big'>Back to Product List</Button>
                        </Link>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    )
}

export default CartPage;