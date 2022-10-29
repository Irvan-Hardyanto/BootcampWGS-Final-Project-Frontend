import React from 'react';
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function RegisterProtector(props) {
    const session = useSelector(state=>state.session);
    if(session.userId){
        return(
            <Navigate to='/products'></Navigate>
        )
    }else{
        return props.children;
    }
}

export default RegisterProtector;