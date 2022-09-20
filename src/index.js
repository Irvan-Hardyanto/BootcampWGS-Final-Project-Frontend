import React from 'react';
import ReactDOM from 'react-dom/client';
import FormCenteredSmall from './FormCenteredSmall';
import LoginForm from  './LoginForm';
import SignUpForm from './SignUpForm';
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
        path: "/signup",
        element: <FormCenteredSmall bgColor="rgb(216, 216, 216)" title="SIGN UP"><SignUpForm></SignUpForm></FormCenteredSmall>
    },
    {
        path: "/login",
        element: <FormCenteredSmall bgColor="rgb(216, 216, 216)" title="LOGIN"><LoginForm></LoginForm></FormCenteredSmall>
    }
]);
root.render(
    <RouterProvider router={router} />
);