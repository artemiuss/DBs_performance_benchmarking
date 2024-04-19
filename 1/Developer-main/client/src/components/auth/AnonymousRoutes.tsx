import {Outlet} from 'react-router-dom';
import {useEffect, useState} from "react";
import {checkAuthStatus} from "../../utils/auth.ts";

const AnonymousRoutes = () => {
    const [anonymous, setAnonymous] = useState(true);


    useEffect(() => {
        checkAuthStatus().then((authed) => {
            setAnonymous(!authed);
            if(authed) {
                window.location.href = '/docs/';
            }
        })

    }, []);


    return(
        anonymous ? <Outlet/> : ""
    )
}

export default AnonymousRoutes