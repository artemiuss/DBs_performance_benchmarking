import logo from "../assets/logo-white-text.jpg";
// import {useNavigate} from "react-router-dom";

export default function() {
    // const navigate = useNavigate();
    const backToDocs = () => {
        window.location.href = '/docs/';
    }
    return (
        <div className="h-[48px] flex flex-row w-full sticky top-0 z-20 bg-sherpa-blue-900">
            <button onClick={backToDocs} className="text-white text-sm ml-4 relative top-3 sl-font-semibold inline-flex">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" className="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"/>
                </svg>

                <span className="top-0.5 relative">Back to Docs</span>
            </button>
            <img alt="trx logo" src={logo} className="h-[28px] relative top-2.5 ml-12"/>
            <h1 className="relative top-2 left-2 text-white text-xl ml-2 font-bold">TRX Developer Sandbox</h1>
        </div>
    )
}