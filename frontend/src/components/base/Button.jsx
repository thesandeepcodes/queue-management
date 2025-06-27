import { twMerge } from "tailwind-merge";

export default function Button({ children, className, ...props }) {
    return (
        <button
            {...props}
            className={twMerge(
                "flex items-center gap-2 p-2 px-3 bg-primary disabled:opacity-70 disabled:cursor-not-allowed rounded-md cursor-pointer hover:bg-primary/90 transition transform active:scale-99",
                props.disabled && "active:scale-100",
                className
            )}
            onClick={(e) => {
                if (props.disabled) return;
                props.onClick && props.onClick(e);
            }}
        >
            {children}
        </button>
    );
}
