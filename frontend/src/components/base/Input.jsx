import { twMerge } from "tailwind-merge";

export default function Input({ iconLeft = null, className, ...rest }) {
    return (
        <div className="relative">
            {iconLeft && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                    {iconLeft}
                </div>
            )}

            <input
                type="text"
                {...rest}
                className={twMerge(
                    "w-full pr-4 py-3 disabled:opacity-50 rounded-lg border border-neutral-600 ring-neutral-500 transition-colors duration-300 focus:ring-1 focus:outline-none",
                    iconLeft ? "pl-10" : "pl-4",
                    className
                )}
            />
        </div>
    );
}
