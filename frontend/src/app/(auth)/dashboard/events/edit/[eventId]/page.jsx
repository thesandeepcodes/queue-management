"use client";

import Button from "@/components/base/Button";
import Checkbox from "@/components/base/Checkbox";
import Input from "@/components/base/Input";
import Modal from "@/components/base/Modal";
import TextArea from "@/components/base/TextArea";
import DashboardTitleBar from "@/components/layout/dashboard/TitleBar";
import { useFetch } from "@/hooks/useFetch";
import { formatDate } from "@/lib/client/date";
import { use, useEffect, useState } from "react";
import { FiCalendar, FiInfo, FiLoader, FiPlus, FiStar, FiTrash, FiUser } from "react-icons/fi";
import { IoWarning } from "react-icons/io5";

export default function EditEvent({ params }) {
    const { eventId } = use(params);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [maxAttendees, setMaxAttendees] = useState("");
    const [currentPosition, setCurrentPosition] = useState(0);
    const [additionalInfo, setAdditionalInfo] = useState([]);

    const [eventStartTime, setEventStartTime] = useState("");
    const [eventEndTime, setEventEndTime] = useState("");
    const [venue, setVenue] = useState("");

    const { data, loading, error, setError, refetch } = useFetch(`/events/${eventId}`, {
        method: "PUT",
        body: JSON.stringify({
            name: name,
            description: description,
            eventDate: eventDate,
            currentPosition: Number(currentPosition) || 0,
            maxAttendees: Number(maxAttendees) || 0,
            additionalInfo: additionalInfo.filter(info => info.name.trim() !== ''),
            eventStartTime: eventStartTime || new Date().toISOString(),
            eventEndTime: eventEndTime || new Date().toISOString(),
            venue: venue
        })
    }, false);

    const { data: eventData, setData: setEventData, loading: fetchingEvent, error: eventError } = useFetch(`/events/${eventId}`, {}, true);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (fetchingEvent || eventError?.show) return;

        if (!name || !description || !eventDate) {
            setError({ show: true, message: "Please fill in all the required fields." });

            return;
        }

        const previousData = eventData.data;
        const updatedData = { ...previousData, name, description, eventDate: new Date(eventDate), maxAttendees: Number(maxAttendees) || 0, currentPosition, additionalInfo, eventStartTime: new Date(eventStartTime), eventEndTime: new Date(eventEndTime), venue };

        if (JSON.stringify(previousData) === JSON.stringify(updatedData)) {
            setError({ show: true, message: "No changes detected." });
        } else {
            refetch();
        }
    }

    useEffect(() => {
        if (!error?.show) {
            setError({ show: false, message: '' });
            setEventData(data);
        }
    }, [data]);

    useEffect(() => {
        if (eventData) {
            setName(eventData.data.name);
            setDescription(eventData.data.description);
            setEventDate(formatDate(eventData.data.eventDate));
            setMaxAttendees(eventData.data.maxAttendees > 0 ? eventData.data.maxAttendees : '');
            setAdditionalInfo(eventData.data.additionalInfo || []);
            setCurrentPosition(eventData.data.currentPosition);

            setEventStartTime(eventData.data.eventStartTime);
            setEventEndTime(eventData.data.eventEndTime);
            setVenue(eventData.data.venue);
        }
    }, [eventData]);

    if (eventError?.show) {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                    <FiInfo className="w-5 h-5 text-red-500" />
                    <div className="text-center font-bold text-lg text-red-500">{eventError.message}</div>
                </div>
                <div className="text-center text-neutral-400">You can not edit this event. Go back and try again.</div>
            </div>
        )
    }

    return (
        <div>
            <DashboardTitleBar title={"Edit Event"} description={"Edit event and manage its settings."} />

            <Modal
                isOpen={fetchingEvent}>
                <div className="flex items-center justify-center p-6 min-h-[180px]">
                    <FiLoader className="w-8 h-8 animate-spin text-neutral-500" />
                </div>
            </Modal>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-4 gap-4">
                    <Input
                        type="text"
                        iconLeft={<FiStar className="w-4.5 h-4.5" />}
                        placeholder="Event Name"
                        value={name}
                        disabled={loading}
                        required
                        onChange={(e) => setName(e.target.value)}
                    />

                    <Input
                        type="number"
                        iconLeft={<FiUser className="w-4.5 h-4.5" />}
                        value={maxAttendees}
                        disabled={loading}
                        onChange={(e) => setMaxAttendees(Number(e.target.value) ? Number(e.target.value) : e.target.value)}
                        placeholder="Max Attendees" />

                    <Input
                        type="number"
                        iconLeft={<FiUser className="w-4.5 h-4.5" />}
                        value={currentPosition}
                        disabled={loading}
                        onChange={(e) => setCurrentPosition(Number(e.target.value) ? Number(e.target.value) : e.target.value)}
                        placeholder="Current Position" />

                    <Input
                        type="date"
                        required
                        disabled={loading}
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        iconLeft={<FiCalendar className="w-4.5 h-4.5" />}
                        placeholder="Event Date" />

                    <TextArea
                        className={`col-span-4`}
                        rows={4}
                        required
                        disabled={loading}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Event Description"
                    />
                </div>

                <div className="h-[1px] mt-10 w-full bg-gradient-to-r from-transparent via-neutral-700 to-transparent text-center">
                    <span className="relative bottom-3 bg-background px-3 text-neutral-400">Optional</span>
                </div>

                <div className="mt-12 mb-10 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-3 text-neutral-500 text-sm">Start Time</label>
                        <Input
                            type="datetime-local"
                            disabled={loading}
                            value={formatDate(eventStartTime, "yyyy-MM-ddTHH:mm:ss")}
                            onChange={(e) => setEventStartTime(e.target.value)}
                            iconLeft={<FiInfo className="w-4.5 h-4.5" />}
                            placeholder="Event Start Time" />
                    </div>

                    <div>
                        <label className="block mb-3 text-neutral-500 text-sm">End Time</label>
                        <Input
                            type="datetime-local"
                            disabled={loading}
                            value={formatDate(eventEndTime, "yyyy-MM-ddTHH:mm:ss")}
                            onChange={(e) => setEventEndTime(e.target.value)}
                            iconLeft={<FiInfo className="w-4.5 h-4.5" />}
                            placeholder="Event End Time" />
                    </div>

                    <Input
                        type="text"
                        disabled={loading}
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        iconLeft={<FiInfo className="w-4.5 h-4.5" />}
                        placeholder="Venue" />
                </div>

                <div className="bg-neutral-900 rounded-md p-4 mt-4">
                    <div className="font-bold">Additional Info</div>
                    <div className="text-sm text-neutral-500 mt-2">This info will be asked when a user joins the event</div>

                    <div className="mt-4">
                        <div className="grid grid-cols-1 gap-3">
                            {
                                additionalInfo.map((info, index) => (
                                    <div key={index} className="grid grid-cols-[1fr_auto_auto] items-center gap-5">
                                        <Input
                                            type="text"
                                            disabled={loading}
                                            placeholder={"Info Name"}
                                            value={info?.name}
                                            onChange={(e) => setAdditionalInfo(additionalInfo.map((info, i) => i === index ? { ...info, name: e.target.value } : info))}
                                        />

                                        <div className="flex items-center gap-3">
                                            <Checkbox checked={info?.required} setChecked={() => setAdditionalInfo(additionalInfo.map((info, i) => i === index ? { ...info, required: !info?.required } : info))} />
                                            <div className="text-neutral-300">Required</div>
                                        </div>

                                        <div onClick={() => setAdditionalInfo(additionalInfo.filter((info, i) => i !== index))} className="flex items-center w-8 h-8 justify-center rounded-md hover:bg-neutral-800 active:bg-neutral-700 cursor-pointer transition-colors">
                                            <FiTrash className="w-4 h-4  text-red-500 cursor-pointer" />
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                        <Button type="button" onClick={() => setAdditionalInfo([...additionalInfo, { name: '', required: false }])} className="mt-5">
                            <FiPlus className="w-4 h-4" />
                            Add Info
                        </Button>
                    </div>
                </div>

                <div className="mt-5 flex items-center gap-3 p-4 bg-warning/8 text-warning/70 rounded-md">
                    <IoWarning />
                    <span>Leave Max Attendees empty to allow any number of attendees to join.</span>
                </div>

                {
                    error?.show &&
                    <div className="mt-5 flex items-center gap-3 p-4 bg-red-800/20 text-red-600 rounded-md">
                        <FiInfo />
                        <span>{error?.message} {error?.object?.[0]?.message ? `: ${error?.object?.[0]?.message}` : ''}</span>
                    </div>
                }

                {
                    data?.status == "success" && !error?.show &&
                    <div className="mt-5 flex items-center gap-3 p-4 bg-green-800/20 text-green-600 rounded-md">
                        <FiInfo />
                        <span>{data?.message}</span>
                    </div>
                }


                <div className="mt-5 flex items-center gap-3">
                    <Button type="submit" disabled={loading || fetchingEvent}>
                        {
                            loading ? <FiLoader className="w-5 h-5 animate-spin" /> :
                                <FiPlus className="w-5 h-5" />
                        }

                        <span>Update Event</span>
                    </Button>
                </div>
            </form>
        </div>
    )
}