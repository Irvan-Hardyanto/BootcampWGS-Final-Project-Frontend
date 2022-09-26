import 'semantic-ui-css/semantic.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import MainLayout from './MainLayout';
import ProductDetailModal from './ProductDetailModal';
import ProductListPage from './ProductListPage';
import {
    createBrowserRouter,
    RouterProvider,
    Route,
} from "react-router-dom";

const rootContainer = document.getElementById("root");
const root = ReactDOM.createRoot(rootContainer);

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
    }
]);
root.render(
    <RouterProvider router={router} />
);