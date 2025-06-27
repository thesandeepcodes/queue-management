import Modal from "@/components/base/Modal";

export default function FetchErrorModal({ error, setError, title, additionalModalProps = {} }) {
    return (
        <Modal
            isOpen={error?.show}
            onConfirmButtonClick={() => setError({ show: false, message: "" })}
            showCloseButton={false}
            title={title || "Error"}
            message={error?.message || "Something went wrong. Please try again."}
            {...additionalModalProps}
        />
    )
}