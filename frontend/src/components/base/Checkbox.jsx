"use client";

export default function Checkbox({ checked, setChecked }) {
    return (
        <div
            onClick={() =>
                setChecked(!checked)
            }

            className={`w-12 h-6 cursor-pointer bg-neutral-800 border border-neutral-700 transition-all duration-300 rounded-full relative ${checked ? 'bg-primary' : ''}`}
        >
            <div
                className={`w-5 h-5 bg-neutral-500 rounded-full absolute top-[1.5px] left-0.5 transition-all duration-300 ${checked ? 'translate-x-[calc(100%+2.5px)] bg-white' : ''
                    }`}
            ></div>
        </div>
    )
}