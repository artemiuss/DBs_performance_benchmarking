import FormInput from "../FormInput.tsx";
import {useEffect, useState} from "react";
import CopyIcon from "../icons/CopyIcon.tsx";

interface BasicAuth {
    username: string;
    password: string;
    shown: boolean;
}

export default function() {
    const [authValues, setAuthValues] = useState({
        username: '',
        password: '',
        shown: false
    } as BasicAuth)

    useEffect(() => {
        // get auth values from local session storage
        const detailsStr = window.sessionStorage.getItem('details') || '';
        const details = JSON.parse(detailsStr);

        // format username and password
        setAuthValues({
            username: details.apiCreds.Client.padStart(6, '0') + '_' + details.apiCreds.Source.padStart(6, '0'),
            password: details.apiCreds.Token,
            shown: false
        })

    }, []);

    const copyButtonClicked = async (val: string) => {
        await navigator.clipboard.writeText(val);
        alert('copied!');
    }

    return(
        <div className="relative w-[240px] mr-6 z-10">
            <div className=" text-sm">
                <div className="text-gray-600 float-right relative top-8 right-2">
                    <CopyIcon clicked={() => copyButtonClicked(authValues.username)}></CopyIcon>
                </div>
                <FormInput name="username" value={'Username: ' + authValues.username} disabled={true}></FormInput>
            </div>
            <div className="text-sm">
                <div className="text-gray-600 float-right relative top-8 right-2">
                    <CopyIcon clicked={() => copyButtonClicked(authValues.password)}></CopyIcon>
                </div>
                <FormInput name="password"
                           value={'Password: ' + authValues.password.replace(authValues.password, '***************')}
                           disabled={true}></FormInput>
            </div>
        </div>
    )
}