import {useState} from "react";
import ErrorIcon from "../icons/ErrorIcon.tsx";
import Alert from "../Alert.tsx";

interface logonState {
    username: string;
    password: string;
    usernameValid: boolean;
    logonResponse: string;
}

interface ValidationError {
    element: 'username' | 'password' | null;
    message: string;
}

export default function () {
    const validateForm = () => {
        let isValid = true;
        let newError: ValidationError = {
            element: null,
            message: ""
        };

        // Validate username
        if (!logonState.username) {
            console.log(logonState.username)
            newError = {
                element: 'username',
                message:"Username is required"
            };
            isValid = false;
        } else if (logonState.username.length < 6 || logonState.username.length > 50) {
            newError = {
                element: 'username',
                message:"Invalid username format"
            };
            isValid = false;
        }

        // Validate password
        if (logonState.usernameValid) {
            if (!logonState.password) {
                newError = {
                    element: 'password',
                    message:"Password is required"
                };
                isValid = false;
            }
        }

        setError(newError);
        return isValid;
    }

   const [logonState , updateLogonState] = useState({
       username: '',
       password: '',
       usernameValid: false,
       logonResponse: ''
   } as logonState);

   const [error, setError] = useState({} as ValidationError);

   const updateState = (event: any) => {
       const {name, value} = event.target;
       updateLogonState({...logonState, [name]: value});
   }


    const login = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: logonState.username,
                password: logonState.password
            })
        };
        fetch('/api/logon', requestOptions).then(async resp => {
            if (resp.status !== 200) {
                updateLogonState({username: '', password: '', usernameValid: false, logonResponse: "Logon failed"});
            } else{
                // save session details
                const details = await resp.json();
                window.sessionStorage.setItem('details', JSON.stringify(details));
                // redirect to docs
                window.location.href = '/docs/';
            }
        })
    }

    const handleLogon = e => {
       e.preventDefault();
       if (!logonState.usernameValid && validateForm()) {
           updateLogonState({...logonState, ['usernameValid']: true, logonResponse: ''})
       } else if (validateForm()) {
           login()
       }
    }



    return (
        <form onSubmit={handleLogon}
              className="w-[460px] h-fit place-content-center px-8 py-10 bg-white rounded-lg shadow-md flex-col justify-start items-center gap-[30px] inline-flex">
            <div className="self-stretch text-center text-gray-800 text-[28px] font-bold">Login</div>

            {/* Hide this on the password view, as it is assumed the that the user is attempting to logon at that point. */}
            {!logonState.usernameValid && (
                <p className="text-gray-500">Not registered yet? <a href="/signup" className="underline">Request
                    Access</a></p>
            )}

            {/* Show any alerts */}
            {logonState.logonResponse && (
                <Alert level="error" message={logonState.logonResponse}/>
            )}

            <div className="self-stretch flex-col justify-start items-center gap-[15px] flex">
                {/*Username*/}
                <div className="w-full">
                    <input type="text" disabled={logonState.usernameValid} value={logonState.username} name="username" placeholder="username" onKeyUp={validateForm} onChange={updateState}
                           className="w-full self-stretch h-11 px-3 py-[9px] bg-white rounded-lg border
               disabled:bg-gray-200 disabled:text-gray-500
               border-zinc-200 justify-start items-center gap-2.5 inline-flex"/>
                    {/* Display validation errors */}
                    {error.element === 'username' && (
                        <div className="absolute text-error flex flex-row">
                            <div className="m-1">
                                <ErrorIcon/>
                            </div>
                            <p className="m-0.5">{error.message}</p>
                        </div>
                    )}
                </div>

                {logonState.usernameValid && (
                    // Password
                    <div className="w-full">
                        <input type="password" value={logonState.password}
                               name="password" placeholder="Password" onKeyUp={validateForm} onChange={updateState}
                               className="w-full self-stretch h-11 px-3 py-[9px] bg-white rounded-lg border
               disabled:bg-gray-200 disabled:text-gray-500
               border-zinc-200 justify-start items-center gap-2.5 inline-flex"/>
                        {/* Display validation errors */}
                        {error.element === 'password' && (
                            <div className="absolute text-error flex flex-row">
                                <div className="m-1">
                                    <ErrorIcon/>
                                </div>
                                <p className="m-0.5">{error.message}</p>
                            </div>
                        )}
                    </div>
                )}

                <div
                    className="self-stretch pt-[30px] flex-col justify-start items-center gap-[15px] flex">
                    <button type="submit"
                            className="self-stretch text-white text-base font-normal  px-[18px] py-3 bg-sherpa-blue-900 rounded-lg shadow justify-center items-center gap-2.5 inline-flex">
                    Login
                        </button>
                        <div className="text-center text-gray-500 text-base font-normal  leading-tight"><a
                            href={import.meta.env.VITE_PASSWORD_RESET_URL} target="_blank">Forgot password?</a></div>
                    </div>
            </div>
        </form>
    )
}