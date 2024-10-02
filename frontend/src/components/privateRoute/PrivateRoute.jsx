import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

function PrivateRoute() {
    const navigate = useNavigate();
    const token = JSON.parse(localStorage.getItem('token'));
    const isValidToken = checkTokenValidity(token);
    if(!isValidToken){
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
        navigate('/login');
    }

    return <Outlet /> ;
}

const checkTokenValidity = (token) => {
    if(!token) return false;
    try {
        const data = token.split('.')[1];
        const decodedPayload = atob(data);
        const { exp } = JSON.parse(decodedPayload)
        if(exp * 1000 < Date.now()){
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error checking token validity:', error);
        return false;
    }
}

export default PrivateRoute;