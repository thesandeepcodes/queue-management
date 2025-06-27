"use client";

import Button from "@/components/base/Button";
import Checkbox from "@/components/base/Checkbox";
import Input from "@/components/base/Input";
import TextArea from "@/components/base/TextArea";
import DashboardTitleBar from "@/components/layout/dashboard/TitleBar";
import { useFetch } from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import { FiCalendar, FiInfo, FiLoader, FiPlus, FiStar, FiTrash, FiUser } from "react-icons/fi";
import { IoWarning } from "react-icons/io5";

export default function CreateEvent() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [maxAttendees, setMaxAttendees] = useState("");
    const [additionalInfo, setAdditionalInfo] = useState([]);

    const { data, setData, loading, error, setError, refetch } = useFetch('/events/create', {
        method: "POST",
        body: JSON.stringify({
            name: name,
            description: description,
            eventDate: eventDate,
            maxAttendees: Number(maxAttendees) || 0,
            additionalInfo: additionalInfo.filter(info => info.name.trim() !== '')
        })
    }, false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !description || !eventDate) {
            setError({ show: true, message: "Please fill in all the required fields." });

            return;
        }

        refetch();
    }

    useEffect(() => {
        if (!error?.show) {
            setName('');
            setDescription('');
            setEventDate('');
            setMaxAttendees('');
            setAdditionalInfo([]);
            setError({ show: false, message: '' });
        }
    }, [data]);

    return (
        <div>
            <DashboardTitleBar title={"Create Event"} description={"Create a new event and manage its settings."} />

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-3 gap-4">
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
                        type="date"
                        required
                        disabled={loading}
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        iconLeft={<FiCalendar className="w-4.5 h-4.5" />}
                        placeholder="Event Date" />

                    <TextArea
                        className={`col-span-3`}
                        rows={4}
                        required
                        disabled={loading}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Event Description"
                    />
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
                    data?.status == "success" &&
                    <div className="mt-5 flex items-center gap-3 p-4 bg-green-800/20 text-green-600 rounded-md">
                        <FiInfo />
                        <span>{data?.message}</span>
                    </div>
                }


                <div className="mt-5 flex items-center gap-3">
                    <Button type="submit" disabled={loading}>
                        {
                            loading ? <FiLoader className="w-5 h-5 animate-spin" /> :
                                <FiPlus className="w-5 h-5" />
                        }

                        <span>Create Event</span>
                    </Button>

                    <Button type="button" onClick={() => {
                        setData(null);
                    }} className="bg-neutral-800 hover:bg-neutral-800/80">
                        <FiTrash />
                        <span>Clear</span>
                    </Button>
                </div>
            </form>
        </div>
    )
}