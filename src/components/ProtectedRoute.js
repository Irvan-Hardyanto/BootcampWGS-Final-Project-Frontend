import React from 'react';
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
//kutipan dari: https://www.robinwieruch.de/react-router-private-routes/

function ProtectedRoute(props) {
    const session = useSelector(state=>state.session);
    if(!session.userId || session.role!=props.authorizedRole){
        return (
            <Navigate to={props.redirectRoute}></Navigate>
        );
    }else{
        return props.children;
    }
}

export default ProtectedRoute;