import {useEffect, useState} from "react";
import ApiCreds from "./ApiCreds.tsx";
import AppHeader from "../AppHeader.tsx";
import { useLocation} from "react-router-dom";


/*
*  TRX API does not accept Basic Auth via C.O.R.S., so fetch directly from browser fails.
*  To get around this, we intercept API calls from the sandbox, and send them to a dev portal server endpoint
*  that proxies the request to the TRX gateway.
* */
const { fetch: originalFetch } = window;
window.fetch = async (...args) => {
    let [resource, config] = args;
    if ((resource as string).includes('gateway.trxservices.net')) {
        resource = '/api/sandbox-gateway';
    }
    const response = await originalFetch(resource, config);
    return response;
};

export default function() {
    const location = useLocation();
    const [specState, setSpecState] = useState({name: 'CreditSale', specFound: false});


    useEffect(() => {
        // only render the stoplights web component if the API yaml file for that operation is actually available on the server.
        if (location) {
            if (location.pathname.includes('/sandbox/operations/')) {
                const specName = location.pathname.replace('/sandbox/operations/', '');
                fetch('/api/sandbox/'+specName).then((resp) => {
                    if (resp.status !== 200) {
                        console.log('spec not found');
                    } else {
                        setSpecState({name: specName, specFound: true})
                    }
                }, err => {
                    console.log(err);
                })
            }
        }

        // callback function to call when event triggers
        const onPageLoad = () => {
            setTimeout(() => { hideElems();}, 500)
        };

        // Check if the page has already loaded
        if (document.readyState === 'complete' && specState.name) {
            onPageLoad();
        } else {
            window.addEventListener('load', onPageLoad, false);
            // Remove the event listener when component unmounts
            return () => window.removeEventListener('load', onPageLoad);
        }
    }, []);

    const hideElems = () => {
        const rootElem = document.getElementsByClassName('sl-elements-api');
        if (rootElem.length > 0) {
            const elemToHide = rootElem[0].firstElementChild as HTMLElement;
            elemToHide.style.display = 'none';
        } else {
            console.log('no elem found');
        }

        const sandbox = document.getElementById('sandbox-container');
        if (sandbox) {
            sandbox.style.visibility = 'visible';
            console.log('setting sandbox to visible');
        }
    }

    // Show a 404 view if the spec is not available
    if (!specState.specFound) {
        return (
            <div id="sandbox-container" style={{visibility: 'hidden'}}>
                <AppHeader></AppHeader>
                <div className="bg-gray-200 w-full px-16 md:px-0 h-screen flex items-center justify-center">
                    <div
                        className="bg-white border border-gray-200 flex flex-col items-center justify-center px-4 md:px-8 lg:px-24 py-8 rounded-lg shadow-2xl">
                        <p className="text-6xl md:text-7xl lg:text-9xl font-bold tracking-wider text-gray-300">404</p>
                        <p className="text-2xl md:text-3xl lg:text-5xl font-bold tracking-wider text-gray-500 mt-4">Spec Not Found</p>
                        <p className="text-gray-500 mt-4 pb-4 border-b-2 text-center">Sorry, the sandbox operation you are looking for could not be found.</p>
                    </div>
                </div>
            </div>
        )
    }

    return(
        <div id="sandbox-container"  style={{visibility: 'hidden'}}>
            <AppHeader></AppHeader>
            <div className="absolute right-2">
                <ApiCreds></ApiCreds>
            </div>
                <elements-api
                    router="history"
                    hideSchemas="true"
                    basePath="/sandbox"
                    hideExport="true"
                    apiDescriptionUrl={'/api/sandbox/' + specState.name}/>
        </div>
    )
}