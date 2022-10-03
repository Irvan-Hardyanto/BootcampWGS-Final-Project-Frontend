import 'semantic-ui-css/semantic.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import MainLayout from './MainLayout';
import ProductDetailModal from './ProductDetailModal';
import ProductListPage from './ProductListPage';
import CheckoutPage from './CheckoutPage';
import CustomerListPage from './CustomerListPage';
import SellingListPage from './SellingListPage';
import ProductListAdmin from './ProductListAdmin';
import CartPage from './CartPage';
import { faker } from '@faker-js/faker';
import {
    createBrowserRouter,
    RouterProvider
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
            image: faker.image.food(100, 100, true),
            createdAt: faker.date.between('2022-09-05T00:00:00.000Z', '2022-10-31T00:00:00.000Z').toDateString(),
            updatedAt:faker.date.between('2022-09-05T00:00:00.000Z', '2022-10-31T00:00:00.000Z').toDateString()
        });
    }
    return products;
}

const generateDummyCustomerData=(num)=>{
    let customers=[];
    for(let i=1;i<=num;i++){
        customers.push({
            id: i,
            name:faker.name.fullName(),
            photo:faker.image.avatar(),
            email:faker.internet.email(),
            mobile:faker.phone.number('08##-####-####'),
            userName:faker.internet.userName(),
            password:faker.internet.password(10, true)

        })
    }
    return customers;
}

const generateDummySellingData=(num)=>{
    let sellingData=[];
    for(let i = 1; i <= num;i++){
        sellingData.push({
            id: i,
            purchaseDate: faker.date.between('2022-09-05T00:00:00.000Z', '2022-10-31T00:00:00.000Z').toDateString(),
            customerId: getRndInteger(1,20),
            customerName: faker.name.fullName(),
            productId: getRndInteger(1,100),
            productName: faker.commerce.productName(),
            qty:getRndInteger(1,10),
            productPrice: getRndInteger(10000, 100000),
            nominal: getRndInteger(10000, 5000000)
        })
    }
    return sellingData;
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
    },{
        path: "/customer/list",
        element:  <CustomerListPage customers={generateDummyCustomerData(10)}></CustomerListPage>
    },{
        path:"/product/list",
        element: <SellingListPage sellingList={generateDummySellingData(12)}></SellingListPage>
    },{
        path:"/admin/product/list",
        element: <ProductListAdmin products={generateDummyProductData(10)}></ProductListAdmin>
    },{
        path:"/cart",
        element:<CartPage products={generateDummyProductData(10)}></CartPage>
    }
]);
root.render(
    <RouterProvider router={router} />
);