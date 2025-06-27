"use client";

import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import TextArea from "@/components/base/TextArea";
import FetchErrorModal from "@/components/layout/dashboard/FetchErrorModal";
import DashboardTitleBar from "@/components/layout/dashboard/TitleBar";
import { useFetch } from "@/hooks/useFetch";
import { formatDate } from "@/lib/client/date";
import { use, useState } from "react";
import { FiLoader, FiRefreshCcw, FiTrash, FiUpload } from "react-icons/fi";
import { IoInformationCircle } from "react-icons/io5";
import { twMerge } from "tailwind-merge";

export default function ManageNotifications({ params }) {
    const { eventId } = use(params);

    const [notification, setNotification] = useState(null);

    const [type, setType] = useState("warning");
    const [sendTo, setSendTo] = useState("all");
    const [message, setMessage] = useState("");
    const [startTime, setStartTime] = useState(new Date().toISOString());
    const [endTime, setEndTime] = useState(new Date().toISOString());

    const { loading: fetchingNotification, error: notificationError } = useFetch(`/notifications/${eventId}`, {}, true, (result) => {
        setNotification(result?.data);
        setType(result?.data?.type || "warning");
        setSendTo(result?.data?.sendTo || "all");
        setMessage(result?.data?.message || "");
        setStartTime(result?.data?.startTime || new Date().toISOString());
        setEndTime(result?.data?.endTime || new Date().toISOString());
    });

    const body = {
        type: type,
        sendTo: sendTo,
        message: message,
        startTime: startTime,
        endTime: endTime
    }

    const { loading: pushingNotification, error: pushNotificationError, setError: setPushNotificationError, refetch: pushNotification } = useFetch(`/notifications/${notification ? notification._id : eventId}`, {
        method: notification ? "PUT" : "POST",
        body: JSON.stringify(body),
    }, false, (result) => {
        setNotification(result.data || body);
    });

    const { loading: deletingNotification, error: deleteNotificationError, setError: setDeleteNotificationError, refetch: deleteNotification } = useFetch(`/notifications/${notification?._id}`, { method: "DELETE" }, false, () => {
        setNotification(null);
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const currentNotification = notification;

        const updatedNotification = {
            ...currentNotification,
            type: type,
            sendTo: sendTo,
            message: message,
            startTime: startTime,
            endTime: endTime
        }

        if (JSON.stringify(currentNotification) === JSON.stringify(updatedNotification)) {
            setPushNotificationError({ show: true, message: "No changes detected." });
        } else {
            pushNotification();
        }
    }

    const handleDelete = () => {
        deleteNotification();
    }

    return fetchingNotification ? (
        <div className="w-full h-screen flex items-center justify-center">
            <FiLoader className="w-8 h-8 animate-spin text-neutral-500" />
        </div>
    ) : (
        <div>
            <div className="w-full">
                <DashboardTitleBar
                    title={"Manage Notifications"}
                    description={"Manage your notifications and their settings."} />

                <FetchErrorModal error={deleteNotificationError} setError={setDeleteNotificationError} />

                <form onSubmit={handleSubmit}>
                    <div className="w-full">
                        <div className="grid grid-cols-4 gap-7 min-w-0">
                            <div className="w-full">
                                <label className="block text-sm font-medium text-neutral-400 mb-4">Type</label>
                                <select onChange={(e) => setType(e.target.value)} value={type} className="w-full bg-neutral-900 p-3 py-4 rounded-md border border-neutral-800">
                                    <option value="alert">Alert</option>
                                    <option value="warning">Warning</option>
                                    <option value="info">Info</option>
                                </select>
                            </div>

                            <div className="w-full">
                                <label className="block text-sm font-medium text-neutral-400 mb-4">Send To</label>
                                <select value={sendTo} onChange={(e) => setSendTo(e.target.value)} className="w-full bg-neutral-900 p-3 py-4 rounded-md border border-neutral-800">
                                    <option value="all">All</option>
                                    <option value="served">Served</option>
                                    <option value="awaiting">Awaiting</option>
                                </select>
                            </div>

                            <div className="w-full">
                                <label className="block text-sm font-medium text-neutral-400 mb-4">Start Time</label>
                                <Input
                                    type="datetime-local"
                                    value={formatDate(startTime, "yyyy-MM-ddTHH:mm:ss")}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>

                            <div className="w-full">
                                <label className="block text-sm font-medium text-neutral-400 mb-4">End Time</label>
                                <Input
                                    type="datetime-local"
                                    value={formatDate(endTime, "yyyy-MM-ddTHH:mm:ss")}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </div>

                            <div className="w-full col-span-4">
                                <label className="block text-sm font-medium text-neutral-400 mb-4">Message</label>
                                <TextArea placeholder="Enter message" value={message} onChange={(e) => setMessage(e.target.value)} />
                            </div>
                        </div>

                        {/* Error */}
                        {
                            pushNotificationError.show &&
                            <div className="p-3 mt-3 text-sm text-red-400 items-start gap-2 bg-red-950 rounded-md flex">
                                <IoInformationCircle className='w-5 h-5 mt-[1px]' />
                                <span>{pushNotificationError?.message} {pushNotificationError?.object?.[0]?.message ? `: ${pushNotificationError?.object?.[0]?.message}` : ''}</span>
                            </div>
                        }


                        <div className="mt-4 flex items-center gap-3">
                            <Button className="p-3 px-4" disabled={pushingNotification}>
                                <FiRefreshCcw className={pushingNotification ? "w-4 h-4 animate-spin" : "w-4 h-4"} />
                                <span>Push</span>
                            </Button>

                            {
                                notification &&
                                <Button disabled={deletingNotification} className="p-3 px-4 bg-red-800 hover:bg-red-700" type="button" onClick={handleDelete}>
                                    {
                                        deletingNotification ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiTrash className="w-4 h-4" />
                                    }

                                    <span>Delete</span>
                                </Button>
                            }
                        </div>
                    </div>
                </form>

                {
                    notification &&
                    <div className={twMerge(
                        "mt-8 p-4 rounded-md",
                        notification.type == "alert" && "bg-red-800/10 border border-red-800/30 text-red-500",
                        notification.type == "warning" && "bg-yellow-800/10 border border-yellow-800/30 text-yellow-500",
                        notification.type == "info" && "bg-blue-800/10 border border-blue-800/30 text-blue-500"
                    )}>
                        {
                            notification.message
                        }
                    </div>
                }
            </div>
        </div>
    );
}