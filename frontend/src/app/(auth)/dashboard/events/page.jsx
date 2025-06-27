"use client";

import Button from "@/components/base/Button";
import EventItem from "@/components/layout/dashboard/EventItem";
import DashboardTitleBar from "@/components/layout/dashboard/TitleBar";
import { useFetch } from "@/hooks/useFetch";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiCalendar, FiLoader, FiPlus } from "react-icons/fi";

export default function Events() {

    const { data, loading, error } = useFetch('/events', {}, true);

    const [events, setEvents] = useState([]);

    useEffect(() => {
        setEvents(data?.data || []);
    }, [data]);

    return (
        <div>
            <DashboardTitleBar title={"Manage Events"} description={"Manage your events and their settings."}>
                <Link href={"/dashboard/events/create"}>
                    <Button>
                        <FiPlus className="w-5 h-5" />
                        <span>Create Event</span>
                    </Button>
                </Link>
            </DashboardTitleBar>

            <div>
                {
                    loading &&
                    (
                        <div className="w-full p-6 bg-neutral-900 rounded-md flex items-center justify-center min-h-[200px]">
                            <FiLoader className="w-8 h-8 animate-spin text-neutral-500" />
                        </div>
                    )
                }

                {
                    error?.show &&
                    (
                        <div className="w-full p-6 bg-neutral-900 border border-red-900 rounded-md flex items-center flex-col gap-3 justify-center min-h-[200px]">
                            <span className="text-red-500">Oops! We got an error</span>
                            <span className="text-neutral-500">{error.message}</span>
                        </div>
                    )
                }

                {
                    !loading && !error?.show &&
                    (
                        events.length === 0 ?
                            (
                                <div className="w-full p-5 bg-neutral-900 rounded-md flex items-center flex-col gap-3 justify-center min-h-[200px]">
                                    <div className="flex items-center gap-3">
                                        <span><FiCalendar /></span>
                                        <span className="text-neutral-300">No Events Found</span>
                                    </div>
                                    <span className="text-neutral-500">Create an event to get started.</span>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    {
                                        events.map((event, index) => (
                                            <EventItem key={event?._id || index} event={event} removeEvent={() => {
                                                setEvents(events.filter(e => e._id !== event._id));
                                            }} />
                                        ))
                                    }
                                </div>
                            )
                    )
                }
            </div>
        </div>
    )
}