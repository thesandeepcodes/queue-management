import Modal from "@/components/base/Modal";
import { useFetch } from "@/hooks/useFetch";
import { formatDate } from "@/lib/client/date";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiEdit, FiLoader, FiTrash, FiUsers } from "react-icons/fi";
import { HiOutlineQueueList } from "react-icons/hi2";
import { twMerge } from "tailwind-merge";
import EventStatus from "./EventStatus";


export default function EventItem({ event, removeEvent }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { data, loading, error, setError, refetch: deleteEvent } = useFetch(`/events/${event._id}`, {
        method: "DELETE",
    }, false);

    useEffect(() => {
        if (data) {
            setShowDeleteModal(false);
            removeEvent();
        }
    }, [data]);

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    return (
        <div className="p-4 bg-neutral-800 rounded-md">
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Event"
                message="Are you sure you want to delete this event? This action cannot be undone."
                loading={loading}
                onConfirmButtonClick={deleteEvent}
                confirmText={<>
                    {
                        loading ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiTrash className="w-4 h-4" />
                    }

                    <span>Yes, Delete</span>
                </>}
            />

            <Modal
                isOpen={error?.show}
                title={"Oops!"}
                message={error?.message || "Something went wrong. Please try again."}
                onClose={() => setError({ show: false, message: "" })}
                confirmText="Okay"
            />

            <div className="flex items-start justify-between gap-2">
                <div className="text-[18px]">
                    <div className="font-bold">{event.name}</div>
                    <div className="text-sm text-neutral-300 mt-2">{formatDate(event.eventDate, "MMMM dd, yyyy (EEE)")}</div>
                </div>

                <EventStatus event={event} />
            </div>

            <div className="text-sm mt-4 text-neutral-400 overflow-hidden text-ellipsis whitespace-nowrap">
                {event.description}
            </div>

            <div className="flex items-center justify-between gap-2 mt-5">
                <div className="flex items-center gap-2 text-neutral-200 font-bold">
                    <FiUsers className="w-4 h-4" />
                    <span className="text-[15px]">{event.maxAttendees > 0 ? event.maxAttendees : "No Limit"}</span>
                </div>

                <div className="flex items-center gap-3">
                    <Link href={`/dashboard/events/${event._id}`} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-700/50 cursor-pointer active:bg-neutral-700 transition duration-150">
                        <HiOutlineQueueList className="w-4.5 h-4.5" />
                    </Link>

                    <Link href={`/dashboard/events/edit/${event._id}`} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-700/50 cursor-pointer active:bg-neutral-700 transition duration-150">
                        <FiEdit className="w-4 h-4" />
                    </Link>

                    <div onClick={() => setShowDeleteModal(true)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-700/50 cursor-pointer active:bg-neutral-700 transition duration-150">
                        <FiTrash className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </div >
    )
}