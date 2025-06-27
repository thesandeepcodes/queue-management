"use client";

import Button from "@/components/base/Button";
import EventStatus from "@/components/layout/dashboard/EventStatus";
import LiveTimeDuration from "@/components/layout/dashboard/LiveDuration";
import LiveTimeAgo from "@/components/layout/dashboard/LiveTimeAgo";
import { useFetch } from "@/hooks/useFetch";
import useSocket from "@/hooks/useSocket";
import { formatTimeDuration, isAfter, isSameOrAfter } from "@/lib/client/date";
import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import { FiClock, FiLoader, FiLogIn, FiUser } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

export default function Event({ params }) {
    const { eventId } = use(params);

    const [event, setEvent] = useState(null);
    const [queues, setQueues] = useState([]);

    const [initialLoading, setInitialLoading] = useState(true);

    const { loading: fetchingEvent, error: eventError } = useFetch(`/analytics/event/${eventId}`, {}, true, (result) => {
        setEvent(result?.data)
        setInitialLoading(false);
    });

    const { loading: fetchingQueues, error: queuesError, data: queuesData, setData: setQueuesData } = useFetch(`/queue/event/${eventId}`, {}, true, (result) => {
        setQueues((result?.data?.queues || []));
    });

    const { loading: fetchingNotification, error: notificationError } = useFetch(`/notifications/${eventId}`, {}, true, (result) => {
        setNotification(result?.data);
    });

    const [guest, setGuest] = useState({
        loaded: false,
        id: null
    });

    const [currentGuest, setCurrentGuest] = useState(null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const guestId = localStorage.getItem(`${eventId}_guestId`);

        const guestData = queues.find(queue => queue._id === guestId);

        setGuest({ loaded: true, id: guestData?._id, ...(guestData || {}) });
    }, [eventId, queues])

    useEffect(() => {
        const guest = queues.find((queue, index) => index == event?.currentPosition);

        if (guest) {
            setCurrentGuest(guest);
        } else {
            setCurrentGuest(null);
        }
    }, [queues, event]);


    const listeners = useMemo(() => [
        {
            event: "event:updated",
            listener: (event) => {
                setEvent(event);

                const updatedQueues = (prev) => {
                    const sortedQueues = [];

                    const ids = event.queues;

                    for (const id of ids) {
                        const queue = prev.find(q => q?._id?.toString() === id.toString());

                        if (!queue) {
                            continue;
                        }

                        sortedQueues.push(queue);
                    }

                    return sortedQueues;
                }

                setQueues(updatedQueues);

                setQueuesData(prev => ({
                    ...prev,
                    data: {
                        ...prev.data,
                        queues: updatedQueues(prev.data.queues)
                    }
                }));
            }
        },
        {
            event: "event:error",
            listener: (error) => {
                console.log(error);
            }
        },
        {
            event: "queues:updated",
            listener: (queue) => {
                setQueues(prev => prev.map(q => q._id === queue._id ? queue : q));
                setQueuesData(prev => ({
                    ...prev,
                    data: {
                        ...prev.data,
                        queues: prev.data.queues.map(q => q._id === queue._id ? queue : q)
                    }
                }));
            }
        },
        {
            event: "queues:deleted",
            listener: (queue) => {
                setQueues(prev => prev.filter(q => q._id !== queue._id));
                setQueuesData(prev => ({
                    ...prev,
                    data: {
                        ...prev.data,
                        queues: prev.data.queues.filter(q => q._id !== queue._id)
                    }
                }));
            }
        },
        {
            event: "queues:added",
            listener: (queue) => {
                setQueues(prev => [...prev, queue]);
                setQueuesData(prev => ({
                    ...prev,
                    data: {
                        ...prev.data,
                        queues: [...prev.data.queues, queue]
                    }
                }));
            }
        },
        {
            event: "notification:added",
            listener: (n) => {
                setNotification(n);
            }
        },
        {
            event: "notification:deleted",
            listener: (n) => {
                setNotification(null);
            }
        },
        {
            event: "notification:updated",
            listener: (n) => {
                setNotification(n);
            }
        }
    ], []);
    useSocket(listeners, { eventId });

    // Calculate Wait Time
    const averageQueueTimeMs = (event?.averageQueueTime || 0);
    const guestWaitDurationMs = guest?.served ? guest?.queueTime : (guest?.joinedAt ? new Date() - new Date(guest?.joinedAt) : null);

    const estimatedWaitTime = guestWaitDurationMs != null
        ? Math.max(averageQueueTimeMs - guestWaitDurationMs, 0)
        : 0;


    const showNotification = (notification?.startTime == notification?.endTime && isSameOrAfter(new Date(), new Date(notification?.startTime))) || isSameOrAfter(new Date(), new Date(notification?.startTime)) && !isAfter(new Date(), new Date(notification?.endTime));

    // Render
    if (eventError?.show) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <p className="text-red-500">{eventError.message}</p>
            </div>
        )
    }

    return fetchingEvent ? (
        <div className="w-full h-screen flex items-center justify-center">
            <FiLoader className="w-8 h-8 animate-spin text-neutral-500" />
        </div>
    ) : (
        <div className="w-full">
            {
                notification && showNotification &&
                (
                    notification.sendTo === "all" ||
                    (notification.sendTo === "served" && guest?.served) ||
                    (notification.sendTo === "awaiting" && !guest?.served)
                ) &&
                <div className={twMerge(
                    "w-full p-4 leading-loose border-b-2",
                    notification.type == "alert" && "bg-red-800/10 border-red-800/30 text-red-500",
                    notification.type == "warning" && "bg-yellow-800/10 border-yellow-800/30 text-yellow-500",
                    notification.type == "info" && "bg-blue-800/10 border-blue-800/30 text-blue-500"
                )}>
                    {notification.message}
                </div>
            }


            <div className="w-full md:p-10 p-4 bg-neutral-900">
                <div className="text-2xl font-bold mb-4">{event?.name} <EventStatus className={`relative bottom-1 left-1 inline-block`} event={event} /></div>
                <div className="text-md text-neutral-400">{event?.description}</div>

                <div className="grid grid-cols-2 gap-6 mt-10">
                    <div className="flex flex-col border border-neutral-800 bg-neutral-800/30 rounded-md p-4">
                        <div className="text-2xl font-bold">{event?.queues?.indexOf(guest?._id) + 1}</div>
                        <div className="mt-2 text-sm text-neutral-400">Your Position</div>
                    </div>

                    <div className="flex flex-col border border-neutral-800 bg-neutral-800/30 rounded-md p-4">
                        <div className="text-2xl font-bold">{event?.queues?.length > 0 ? event?.currentPosition + 1 : 0}</div>
                        <div className="mt-2 text-sm text-neutral-400">Queue Position</div>
                    </div>

                    <div className="flex flex-col border border-neutral-800 bg-neutral-800/30 rounded-md p-4">
                        <div className="text-2xl font-bold"><LiveTimeDuration durationMs={estimatedWaitTime} decrement={true} /></div>
                        <div className="mt-2 text-sm text-neutral-400">Est. Wait Time</div>
                    </div>

                    <div className="flex flex-col border border-neutral-800 bg-neutral-800/30 rounded-md p-4">
                        <div className="text-2xl font-bold">{event?.queues?.length || 0}</div>
                        <div className="mt-2 text-sm text-neutral-400">Total Attendees</div>
                    </div>
                </div>
            </div>

            {
                !guest.id && guest.loaded && (
                    <div>
                        <div className="w-full md:p-10 p-4 flex flex-col items-start gap-3">
                            <div className="text-xl text-red-600 font-bold">Oops!</div>
                            <div className="text-neutral-400 leading-loose">You have not joined this event yet. Please join the event first to view your queue status.</div>

                            <Link href={`/join/${eventId}`}>
                                <Button className="mt-4">
                                    <FiLogIn />
                                    Join Event
                                </Button>
                            </Link>
                        </div>
                    </div>
                )
            }


            {
                guest.id && (
                    <>
                        <div className="w-full md:p-10 md:py-8 p-4 py-8 grid grid-cols-2 gap-6 border-b border-neutral-800">
                            <div className="flex items-start justify-center md:justify-start gap-2">
                                <FiClock className="w-6 h-6 mt-1 hidden md:block mr-2 text-warning/60" />
                                <div className="flex flex-col gap-2 items-start">
                                    <div className="text-lg font-bold">{formatTimeDuration(averageQueueTimeMs)}</div>
                                    <div className="text-sm text-neutral-400">Avg Queue Time</div>
                                </div>
                            </div>

                            <div className="flex items-start justify-center md:justify-start gap-2">
                                <FiUser className="w-6 h-6 mt-1 hidden md:block mr-2 text-warning/60" />
                                <div className="flex flex-col gap-2 items-start">
                                    <div className="text-lg font-bold"><LiveTimeDuration decrement={false} durationMs={guestWaitDurationMs ? guestWaitDurationMs : 0} /></div>
                                    <div className="text-sm text-neutral-400">Your Wait Time</div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:p-10 p-4">
                            <div className="bg-neutral-900 rounded-xl shadow-lg mt-6">
                                {/* Table Body */}
                                <div className="relative">
                                    {
                                        initialLoading && (
                                            <div className="w-full p-6 bg-neutral-900 rounded-md flex items-center justify-center min-h-[200px]">
                                                <FiLoader className="w-8 h-8 animate-spin text-neutral-500" />
                                            </div>
                                        )
                                    }

                                    {
                                        queues.length == 0 && !queuesError?.show && !fetchingQueues && (
                                            <div className="w-full p-6 bg-neutral-900 rounded-md flex items-center justify-center min-h-[200px] text-neutral-500">
                                                No Guests Joined
                                            </div>
                                        )
                                    }

                                    {!initialLoading &&
                                        queues.map((g, index) => (
                                            <div
                                                key={g._id}
                                                className={twMerge(`grid grid-cols-12 gap-4  items-center px-3 md:px-6 py-4 bg-neutral-900 hover:bg-neutral-800/50 border-b border-neutral-800 last:border-b-0`, g?.served && "bg-blue-800/10 hover:bg-blue-800/10", g._id === currentGuest?._id ? "bg-green-800/10 font-bold hover:bg-green-800/10" : "")}
                                            >
                                                <div className="col-span-1 md:col-span-1 text-neutral-400 font-medium">{index + 1}</div>

                                                <div className="col-span-11 md:col-span-5 text-neutral-200 font-medium">{g.name} {g?._id == guest?._id && <span className="text-xs ml-1 p-1 px-3 rounded-md bg-green-800/30 text-green-500 font-bold">You</span>} {g?.served && <span className="text-xs p-1 px-3 rounded-md bg-blue-800/30 text-blue-500 font-bold">Served</span>}</div>
                                                <div className="col-span-6 md:col-span-3 p-2 mt-2 px-5 md:border-none border border-green-700/20 rounded-md text-neutral-400 md:text-[16px] text-sm"><LiveTimeAgo date={g.joinedAt} /></div>
                                                <div className="col-span-6 md:col-span-3 p-2 mt-2 px-5 md:border-none border border-green-700/20 rounded-md text-neutral-400 md:text-[16px] text-sm">{g?.queueTime ? formatTimeDuration(g.queueTime) : "-"}</div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </>
                )
            }

        </div>
    )
}