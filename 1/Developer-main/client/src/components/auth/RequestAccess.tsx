import {FormEvent, useEffect, useState} from "react";
import logo from "../../assets/logo.png";
import Alert from "../Alert.tsx";
import { loadCaptchaEnginge, LoadCanvasTemplateNoReload, validateCaptcha } from 'react-simple-captcha';

interface AccessRequest {
    dbaName: string;
    corporateEmailAddress: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    accessResponse?: string;
    level: string;
}

export default function () {
    const [formValues, setFormValues] = useState({
        dbaName: '',
        corporateEmailAddress: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        level: ''
    } as AccessRequest)

    useEffect(() => {
        loadCaptchaEnginge(6);
    }, []);

    const handleChange = (event: FormEvent<HTMLInputElement>) => {
        // @ts-ignore
        const {name, value} = event.target;
        setFormValues({...formValues, [name]: value});
    }

    const requestAccess = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setFormValues({...formValues, level: 'error', accessResponse: "All fields must have a value."})
            return;
        }

        const captcha = (document.getElementById("captcha-input") as HTMLInputElement);
        if (!validateCaptcha(captcha.value)) {
            setFormValues({...formValues, level: 'error', accessResponse: "Invalid Captcha response."})
            return;
        }

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formValues)
        };
        fetch('/api/request-access', requestOptions)
            .then((resp) => {
                if (resp.status === 204) {
                    setFormValues({
                        corporateEmailAddress: "",
                        dbaName: "",
                        firstName: "",
                        lastName: "",
                        phoneNumber: "",
                        level: 'success',
                        accessResponse: "Your request has been received! We will get back to you soon."})
                    loadCaptchaEnginge(6);
                    captcha.value = '';
                } else {
                    setFormValues({...formValues, level: 'error', accessResponse: "Sorry, there was a problem."})
                    loadCaptchaEnginge(6);
                    captcha.value = '';
                }
                // window.location.href = "/";
            })
    }

    const validateForm = () => {
        if (!formValues.dbaName || !formValues.corporateEmailAddress || !formValues.firstName
        || !formValues.lastName || !formValues.phoneNumber) {
            return false;
        } else {
            return true;
        }
    }

    return (
        <div className="bg-gray-50 h-full w-full place-content-center flex items-center">
            <div className="flex-col">
                <div className="flex justify-center">
                    <img className="h-[120px]" alt="trx logo" src={logo}></img>
                </div>

                <form onSubmit={requestAccess}
                    className="w-[460px] h-fit px-8 py-10 bg-white rounded-lg shadow flex-col justify-start items-center gap-[30px] inline-flex">
                    <div className="self-stretch text-center text-gray-800 text-[28px] font-bold ">Request Access
                    </div>
                    <p className="text-gray-500">Already registered? <a href="/" className="underline">Sign In</a></p>
                    <div className="self-stretch flex-col justify-start items-center gap-[15px] flex">

                        {/* Show any alerts */}
                        {formValues.accessResponse && (
                            <div className="w-full">
                                {/*// @ts-ignore*/}
                                <Alert level={formValues.level} message={formValues.accessResponse}/>
                            </div>
                        )}

                        {/* DBA Name*/}
                        <input type="text" name="dbaName"
                               placeholder="DBA Name" value={formValues.dbaName} onInput={handleChange}
                               minLength={1}
                               maxLength={50}
                               className="invalid:border-error w-full self-stretch h-11 px-3 py-[9px] bg-white rounded-lg border
               disabled:bg-gray-200 disabled:text-gray-500
               border-zinc-200 justify-start items-center gap-2.5 inline-flex"/>

                        {/*Corporate Email Address */}
                        <input type="email" name="corporateEmailAddress"
                               placeholder="Corporate Email Address" value={formValues.corporateEmailAddress} onInput={handleChange}
                               className="invalid:border-error w-full self-stretch h-11 px-3 py-[9px] bg-white rounded-lg border
               disabled:bg-gray-200 disabled:text-gray-500
               border-zinc-200 justify-start items-center gap-2.5 inline-flex"/>

                        {/* First Name*/}
                        <input type="text" name="firstName" value={formValues.firstName}
                               placeholder="First Name" onInput={handleChange}
                               minLength={1}
                               maxLength={30}
                               pattern={"^[A-Za-z0-9 .,&amp;'`~-]*$"}
                               className="invalid:border-error w-full self-stretch h-11 px-3 py-[9px] bg-white rounded-lg border
               disabled:bg-gray-200 disabled:text-gray-500
               border-zinc-200 justify-start items-center gap-2.5 inline-flex"/>

                        {/* Last Name */}
                        <input type="text" name="lastName" value={formValues.lastName}
                               placeholder="Last Name" onInput={handleChange}
                               minLength={1}
                               maxLength={30}
                               pattern={"^[A-Za-z0-9 .,&amp;'`~-]*$"}
                               className="invalid:border-error w-full self-stretch h-11 px-3 py-[9px] bg-white rounded-lg border
               disabled:bg-gray-200 disabled:text-gray-500
               border-zinc-200 justify-start items-center gap-2.5 inline-flex"/>

                        {/* Phone Number */}
                        <input type="tel" name="phoneNumber" value={formValues.phoneNumber}
                               placeholder="US format 555-555-5555" onInput={handleChange}
                               pattern={"^[2-9]\\d{2}-\\d{3}-\\d{4}$"}
                               className="invalid:border-error w-full self-stretch h-11 px-3 py-[9px] bg-white rounded-lg border
               disabled:bg-gray-200 disabled:text-gray-500
               border-zinc-200 justify-start items-center gap-2.5 inline-flex"/>

                        {/* Captcha */}
                        <br/>
                        <LoadCanvasTemplateNoReload/>
                        <input type="text" id="captcha-input"
                               placeholder="Enter the Captcha"
                               className="invalid:border-error w-full self-stretch h-11 px-3 py-[9px] bg-white rounded-lg border
               disabled:bg-gray-200 disabled:text-gray-500
               border-zinc-200 justify-start items-center gap-2.5 inline-flex"/>


                        {/* Action buttons */}
                        <div
                            className="self-stretch pt-[30px] flex-col justify-start items-center gap-[15px] flex">
                            <button type="submit"
                                    className="self-stretch text-white text-base font-normal px-[18px] py-3 bg-sherpa-blue-900 rounded-lg shadow justify-center items-center gap-2.5 inline-flex">
                                Request access
                            </button>
                        </div>
                    </div>
                </form>

                <p className="mt-4 flex text-gray-500 justify-center">Copyright © 2024 All Rights Reserved.</p>
            </div>
        </div>
    )
}