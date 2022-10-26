import React from 'react';
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
//kutipan dari: https://www.robinwieruch.de/react-router-private-routes/

function ProtectedRoute(props) {
    const session = useSelector(state=>state.session);
    if(!session.userId){
        return (
            <Navigate to={props.redirectRoute} state={{reason:'err_not_login',msg:'You must login first!'}}></Navigate>
        );
    }else if(session.role!=props.authorizedRole){
        return (
            <Navigate to={props.redirectRoute} state={{reason:'err_wrong_role',msg:'Invalid role!'}}></Navigate>
        );
    }else{
        return props.children;
    }
}

export default ProtectedRoute;