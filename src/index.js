import 'semantic-ui-css/semantic.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import MainLayout from './MainLayout';
import ProductDetailModal from './ProductDetailModal';
import ProductListPage from './ProductListPage';
import CheckoutPage from './CheckoutPage';
import SellingListPage from './SellingListPage';
import ProductListAdmin from './ProductListAdmin';
import CartPage from './CartPage';
import PaymentPage from './PaymentPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import Dashboard from './pages/superadmin/Dashboard';
import { faker } from '@faker-js/faker';
import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";
import { Provider} from "react-redux";
import { configureStore } from '@reduxjs/toolkit';
import productReducer from './reducers/ProductSlice.js';
import cartReducer from './reducers/CartSlice';
import sessionReducer from './reducers/SessionSlice';

const store = configureStore({
    reducer: {
        products: productReducer,
        cart: cartReducer,
        session: sessionReducer
    }
})

const rootContainer = document.getElementById("root");
const root = ReactDOM.createRoot(rootContainer);

const getRndInteger = (min, max) => {
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
            updatedAt: faker.date.between('2022-09-05T00:00:00.000Z', '2022-10-31T00:00:00.000Z').toDateString()
        });
    }
    return products;
}

const generateDummyCustomerData = (num) => {
    let customers = [];
    for (let i = 1; i <= num; i++) {
        customers.push({
            id: i,
            name: faker.name.fullName(),
            photo: faker.image.avatar(),
            email: faker.internet.email(),
            mobile: faker.phone.number('08##-####-####'),
            userName: faker.internet.userName(),
            password: faker.internet.password(10, true)

        })
    }
    return customers;
}

const generateDummySellingData = (num) => {
    let sellingData = [];
    for (let i = 1; i <= num; i++) {
        sellingData.push({
            id: i,
            purchaseDate: faker.date.between('2022-09-05T00:00:00.000Z', '2022-10-31T00:00:00.000Z').toDateString(),
            customerId: getRndInteger(1, 20),
            customerName: faker.name.fullName(),
            productId: getRndInteger(1, 100),
            productName: faker.commerce.productName(),
            qty: getRndInteger(1, 10),
            productPrice: getRndInteger(10000, 100000),
            nominal: getRndInteger(10000, 5000000)
        })
    }
    return sellingData;
}

const generateDummyCartData = (num)=>{
    let cartData = [];
    for (let i = 1; i <= num; i++) {
        cartData.push({
            name: faker.commerce.productName(),
            quantity: getRndInteger(1, 100),
            unit:  'pieces',
            price: getRndInteger(10000,20000)
        })
    }
    return cartData;
}

//client-side routing menggunakan react router
const router = createBrowserRouter([
    {
        path: "/",
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
        path: "/products",//ini HANYA bisa diakses oleh user dengan role customer yang SUDAH LOGIN
        element: <ProductListPage></ProductListPage>
    }, {
        path: "/modal",
        element: <ProductDetailModal></ProductDetailModal>
    }, {
        path: "/checkout",
        element: <CheckoutPage></CheckoutPage>
    }, {
        path: "/super-admin/dashboard",
        element: <Dashboard/>
    }, {
        path: "/admin/selling-list",
        element: <SellingListPage sellingList={generateDummySellingData(12)}></SellingListPage>
    }, {
        path: "/admin/products",
        element: <ProductListAdmin products={generateDummyProductData(10)}></ProductListAdmin>
    }, {
        path: "/cart",
        element: <CartPage products={generateDummyProductData(10)}></CartPage>
    }, {
        path: "/payment",
        // element: <PaymentPage order={generateDummyCartData(10)}></PaymentPage>
        element: <PaymentPage></PaymentPage>
    },{
        path: "/admin/dashboard",
        element: <AdminDashboard></AdminDashboard>
    }
]);
root.render(
    <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
);