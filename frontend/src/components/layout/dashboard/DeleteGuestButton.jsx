"use client";

import Modal from "@/components/base/Modal";
import { useFetch } from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import { FiLoader, FiTrash } from "react-icons/fi";

export default function DeleteGuestButton({ children, guest, eventId, onDeleted = () => { } }) {
    const [showDeleteGuestModal, setShowDeleteGuestModal] = useState(false);
    const { data, loading, error, setError, refetch: deleteGuest } = useFetch(`/queue/remove/${guest._id}`, { method: "DELETE", body: JSON.stringify({ eventId }) }, false);

    useEffect(() => {
        if (data) {
            onDeleted();
            setShowDeleteGuestModal(false);
        }
    }, [data]);

    return (
        <>
            <Modal
                isOpen={showDeleteGuestModal}
                onClose={() => setShowDeleteGuestModal(false)}
                title="Delete Guest"
                message="Are you sure you want to delete this guest? This action cannot be undone."
                loading={loading}
                onConfirmButtonClick={deleteGuest}
                confirmText={<>
                    {
                        loading ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiTrash className="w-4 h-4" />
                    }
                    <span>Delete</span>
                </>}
            />

            <Modal
                isOpen={error?.show}
                onConfirmButtonClick={() => {
                    setError({ show: false, message: "" })
                    setShowDeleteGuestModal(false);
                }}
                title="Error"
                showCloseButton={false}
                message={error?.message || "Something went wrong. Please try again."}
            />

            <div onClick={() => setShowDeleteGuestModal(true)}>
                {children}
            </div>
        </>
    )
}