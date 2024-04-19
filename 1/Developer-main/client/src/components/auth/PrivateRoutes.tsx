import {Outlet, Navigate} from 'react-router-dom';
import {useEffect, useState} from "react";
import {checkAuthStatus} from "../../utils/auth.ts";

const PrivateRoutes = () => {
    const [authorized, setAuthorized] = useState(true);


    useEffect(() => {
        checkAuthStatus().then((authed) => {
            setAuthorized(authed);
        })

    }, []);


    return(
        authorized ? <Outlet/> : <Navigate to="/login"/>
    )
}

export default PrivateRoutes