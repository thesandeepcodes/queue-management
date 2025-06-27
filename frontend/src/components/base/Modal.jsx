import Button from "./Button";

export default function Modal({ children, isOpen, onClose, title, maxWidth = "500px", message, cancellable = true, loading = false, onConfirmButtonClick = () => { }, showCloseButton = true, confirmText = "Okay", closeText = "Close" }) {
    if (!isOpen) return;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50 animate-fadeIn"
            role="dialog"
            onClick={cancellable ? onClose : () => { }}
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className="relative bg-white dark:bg-neutral-800 w-full max-w-2xl mx-4 sm:mx-0 rounded-2xl shadow-2xl flex flex-col overflow-hidden transform transition-all duration-300 ease-in-out animate-fadeInScale"
                style={{ maxWidth: maxWidth }}
                onClick={(e) => e.stopPropagation()}
            >
                {
                    children ? children : (
                        <div className="leading-loose p-4">
                            <div className="font-bold text-xl leading-relaxed">{title}</div>
                            <div className="mt-4 text-neutral-400">{message}</div>
                            <div className="flex items-center gap-2 text-white mt-8 justify-end">
                                <Button className="bg-red-800 hover:bg-red-700" disabled={loading} onClick={onConfirmButtonClick}>
                                    {confirmText}
                                </Button>
                                {
                                    showCloseButton && cancellable &&
                                    <Button className="bg-neutral-700 hover:bg-neutral-600" disabled={loading} onClick={onClose}>{closeText}</Button>
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}