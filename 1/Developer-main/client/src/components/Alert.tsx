import ErrorIcon from "./icons/ErrorIcon.tsx";
import SuccessIcon from "./icons/SuccessIcon.tsx";

interface Props {
    level: 'success' | 'info' | 'warn' | 'error';
    message: string;
}
export default function({level, message}: Props) {
    return(
        <div className="w-full">
        {level === 'error' && (
            <div className="w-full rounded-md font-semibold px-4 py-4 flex flex-row bg-error bg-opacity-10 text-error">
                    <div className="relative">
                        <ErrorIcon/>
                    </div>
                <p className="text-sm font-sans ml-4">{message}</p>
            </div>
        )}
            {level === 'success' && (
                <div className="w-full rounded-md font-semibold px-4 py-4 flex flex-row bg-screamin-green-500 bg-opacity-10 text-screamin-green-800">
                    <div className="relative">
                        <SuccessIcon/>
                    </div>
                    <p className="text-sm font-sans ml-4">{message}</p>
                </div>
            )}
        </div>
    )
}