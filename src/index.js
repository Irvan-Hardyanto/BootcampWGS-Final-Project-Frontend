import 'semantic-ui-css/semantic.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import MainLayout from './MainLayout';
import ProductDetailModal from './ProductDetailModal';
import ProductListPage from './ProductListPage';
import CheckoutPage from './CheckoutPage';
import { faker } from '@faker-js/faker';
import {
    createBrowserRouter,
    RouterProvider,
    Route,
} from "react-router-dom";

const rootContainer = document.getElementById("root");
const root = ReactDOM.createRoot(rootContainer);

const getRndInteger=(min, max)=>{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateDummyProductData = (productNum) => {
    let products = [];
    for (let i = 1; i <= productNum; i++) {
        products.push({
            id: i,
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: getRndInteger(10000, 100000),
            stock: getRndInteger(1, 100),
            quantity: getRndInteger(1, 100),
            image: faker.image.food(100, 100, false)
        });
    }
    return products;
}

//client-side routing menggunakan react router
const router = createBrowserRouter([
    {
        path:"/",
        element: <MainLayout><h1>Hello World</h1></MainLayout>
    },
    {
        path: "/signup",
        element: <SignUpPage></SignUpPage>
    },
    {
        path: "/login",
        element: <LoginPage></LoginPage>
    }, {
        path: "/productList",
        element: <ProductListPage></ProductListPage>
    },{
        path: "/modal",
        element: <ProductDetailModal></ProductDetailModal>
    },{
        path: "/checkout",
        element: <CheckoutPage order={generateDummyProductData(4)}></CheckoutPage>
    }
]);
root.render(
    <RouterProvider router={router} />
);