import Logon from "./Logon.tsx";
import logo from '../../assets/logo.png';

export default function () {
        return(
            <div className="bg-gray-50 h-full w-full place-content-center flex items-center">
                <div className="flex-col">
                    <div className="flex justify-center">
                        <img className="h-[120px]" src={logo}></img>
                    </div>

                        <Logon></Logon>

                    <p className="mt-4 flex text-gray-500 justify-center">Copyright © 2024 All Rights Reserved.</p>
                </div>
            </div>
        )
}