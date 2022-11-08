import React, { useEffect } from 'react';
import ProductCard from './ProductCard';
import { Card } from 'semantic-ui-react';
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";

import { initProducts } from '../reducers/ProductSlice.js';

//pengennya pake .env, tapi undefined terus.
const BASE_URL = "http://localhost:9000";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

const ProductList = (props) => {
    const products = useSelector((state) => state.products.value);
    const cartStore = useSelector((state) => state.cart.value);
    const dispatch = useDispatch();


    //ketika 'effect' yg ini jalan, harusnya effect yang di bawah gak ketriger
    //tapi ternyata ketika 'effect' ini jalan, 'effect' yang bawah juga ke trigger, jadi ngaco isi cart nya
    useEffect(() => {
        axiosInstance.get('/product-list').then(response => {
            let products = response.data;
            dispatch(initProducts({ products: response.data }))
        }).catch(error => {
            console.log(error);
        })
        // console.log('FETCHING FLAG IS:'+ props.fetching);
        //     axiosInstance.get(`/carts?userId=${session.userId}`, {
        //         headers: {
        //             'user-id': session.userId,
        //             'user-role': session.role,
        //         }
        //     }).then(response => {
        //         //TODO: konversikan format dari db ke format ygbenar (ada picture, harga ,nama nya)
        //         JSON.parse(response.data.items).forEach(item => {
        //             //ini tuh buat nge get detail setiap produk
        //             axiosInstance.get(`/products/${item.productId}`).then(response => {
        //                 dispatch(addProduct({
        //                     product: {
        //                         id: parseInt(item.productId),
        //                         image: BASE_URL + '/product/picture/' + item.productId,
        //                         name: response.data.name,
        //                         price: parseInt(response.data.price),
        //                         quantity: parseInt(item.qty),
        //                         unit: response.data.unit,
        //                         checked: JSON.parse(item.checked.toLowerCase()),
        //                     }
        //                 }))
        //             }).catch(err => {
        //                 console.log(err)
        //             })
        //         })
        //         props.initialRender.current = false;
        //     }).catch(err => {
        //         console.log(err);
        //     })
    }, [])


    // useEffect(() => {
    //     //kalo operasi ngambil data cart dari db belom selesai,jangan lakukan apa-apa
    //     console.log("PROTECTION IS: "+props.initialRender.current);
    //     if(props.initialRender.current) return;
    //     console.log('cartis modifiedon productListPage!')
    //     // console.log('items in cart are')
    //     let items = [];
    //     for (let i = 0; i < cartStore.length; i++) {
    //         items.push({
    //             productId: cartStore[i].id,
    //             qty: cartStore[i].quantity,
    //             checked: cartStore[i].checked
    //         })
    //     }
    //     // console.log('items in cart when at productlistpage are: '+items)
    //     //kalau gak ada yg lagi login -> session.userId nya null, gak usah update cart nya
    //     if (session.userId) {
    //         axiosInstance.put(`/carts/${session.userId}`, qs.stringify({
    //             "items": items
    //         }), {
    //             headers: {
    //                 'user-id': session.userId,
    //                 'user-role': session.role,
    //                 'content-type': 'application/x-www-form-urlencoded'
    //             }
    //         }).catch(err => {
    //             console.log(err);
    //         })
    //     }
    // }, [cartStore]);

    const searchProduct = (query = '', products) => {
        return products.filter(product => { 
            if(query===''){
                return product
            }else{
                return product.name.toLowerCase().includes(query.toLowerCase());
            }
        })
    }

    return (
        <Card.Group centered itemsPerRow={6}>
            {searchProduct(props.searchQuery,products).map((product, idx) => {
                return <ProductCard key={product.id} stock={product.stock} unit={product.unit} id={product.id} name={product.name} imgSrc={BASE_URL + '/product/picture/' + product.id} price={product.price} description={product.description}></ProductCard>;
            })}
        </Card.Group>
    )
}

export default ProductList;