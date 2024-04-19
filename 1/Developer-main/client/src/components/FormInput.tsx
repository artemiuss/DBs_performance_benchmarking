
interface Props {
    name: string;
    placeholder?: string;
    updateInputValue?: Function;
    disabled?: boolean;
    value?: string;
    inputType?: 'text' | 'password';
}

export default function ({name, placeholder, value, updateInputValue = () => {}, disabled, inputType = 'text'}: Props) {
    return (
        <input type={inputType} disabled={disabled} value={value} name={name} placeholder={placeholder} onInput={(event) => updateInputValue(event)}
               className="w-full self-stretch h-11 px-3 py-[9px] bg-white rounded-lg border
               disabled:bg-gray-200 disabled:text-gray-500
               border-zinc-200 justify-start items-center gap-2.5 inline-flex"/>

    )
}