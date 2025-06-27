import { twMerge } from "tailwind-merge";

export default function TextArea({ className, ...rest }) {
    return (
        <textarea
            {...rest}
            className={twMerge(
                "w-full pr-4 py-3 pl-4 disabled:opacity-50 rounded-lg border border-neutral-600 ring-neutral-500 transition-colors duration-300 focus:ring-1 focus:outline-none",
                className
            )}
        />
    );
}
