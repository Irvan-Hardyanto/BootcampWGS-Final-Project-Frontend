import 'semantic-ui-css/semantic.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import MainLayout from './pages/MainLayout';
import LandingPage from './pages/customer/LandingPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import CartPage from './pages/customer/CartPage';
import PaymentPage from './pages/customer/PaymentPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import Dashboard from './pages/superadmin/Dashboard';
import ProfilePage from './pages/customer/ProfilePage';
import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from '@reduxjs/toolkit';
import productReducer from './reducers/ProductSlice.js';
import cartReducer from './reducers/CartSlice';
import sessionReducer from './reducers/SessionSlice';

import ProtectedRoute from './components/ProtectedRoute';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react'

const SUPERADMIN_ROLE = 1;
const ADMIN_ROLE = 2;
const CUSTOMER_ROLE = 3;

const persistConfig = {
    key: 'root',
    storage,
}

const persistedSessionReducer = persistReducer(persistConfig, sessionReducer);

const store = configureStore({
    reducer: {
        products: productReducer,
        cart: cartReducer,
        session: persistedSessionReducer
    }
})

const persistor = persistStore(store);

const rootContainer = document.getElementById("root");
const root = ReactDOM.createRoot(rootContainer);

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
        path: "/products",
        element: <LandingPage />
    }, {
        path: "/checkout",
        element: <ProtectedRoute redirectRoute={'/login'} authorizedRole={CUSTOMER_ROLE}><CheckoutPage /></ProtectedRoute>
    }, {
        path: "/cart",
        element: <ProtectedRoute redirectRoute={'/login'} authorizedRole={CUSTOMER_ROLE}><CartPage /></ProtectedRoute>
    }, {
        path: "/payment",
        element: <ProtectedRoute redirectRoute={'/login'} authorizedRole={CUSTOMER_ROLE}><PaymentPage /></ProtectedRoute>
    }, {
        path: "/super-admin/dashboard",
        element: <ProtectedRoute redirectRoute={'/login'} authorizedRole={SUPERADMIN_ROLE}><Dashboard /></ProtectedRoute>
    }, {
        path: "/admin/dashboard",
        element: <ProtectedRoute redirectRoute={'/login'} authorizedRole={ADMIN_ROLE}><AdminDashboard /></ProtectedRoute>
    },{
        path:"/profile",
        element: <ProfilePage></ProfilePage>
    }
]);
root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <RouterProvider router={router} />
        </PersistGate>
    </Provider>
);