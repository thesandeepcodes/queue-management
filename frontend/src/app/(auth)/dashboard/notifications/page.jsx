"use client";

import DashboardTitleBar from "@/components/layout/dashboard/TitleBar";
import { useFetch } from "@/hooks/useFetch";
import Link from "next/link";
import { useState } from "react";
import { FiLoader } from "react-icons/fi";

export default function Notifications() {
    const [events, setEvents] = useState([]);

    const { data: eventData, setData: setEventData, loading: fetchingEvent, error: eventError } = useFetch(`/events`, {}, true, (result) => {
        setEvents(result?.data || []);
    });

    return fetchingEvent ? (
        <div className="w-full h-screen flex items-center justify-center">
            <FiLoader className="w-8 h-8 animate-spin text-neutral-500" />
        </div>
    ) : (
        <div>
            <DashboardTitleBar
                title={"Notifications"}
                description={"Manage your notifications and their settings."}
            />

            <div className="grid grid-cols-3 gap-4">
                {
                    events.map((event) => (
                        <Link href={`/dashboard/notifications/${event._id}`} key={event._id} className="border border-neutral-800 cursor-pointer select-none hover:bg-neutral-800/50 transition-colors rounded-md p-4 bg-neutral-900">
                            {event.name}
                        </Link>
                    ))
                }
            </div>

            {
                events.length == 0 && (
                    <div className="border min-h-[200px] flex items-center justify-center border-neutral-800 cursor-pointer select-none transition-colors rounded-md p-4 bg-neutral-900/50 text-neutral-500">
                        No events found.
                    </div>
                )
            }
        </div>
    );
}