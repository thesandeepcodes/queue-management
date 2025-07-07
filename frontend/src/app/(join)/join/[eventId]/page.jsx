"use client";

import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import EventStatus from "@/components/layout/dashboard/EventStatus";
import { useFetch } from "@/hooks/useFetch";
import useSocket from "@/hooks/useSocket";
import { formatDate, isSameOrAfter } from "@/lib/client/date";
import { useRouter } from "next/navigation";
import { use, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { FiArrowLeft, FiCalendar, FiClock, FiLoader, FiLogIn, FiLogOut, FiMap } from "react-icons/fi";
import { IoInformationCircle } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";

export default function JoinEvent({ params }) {
    const { eventId } = use(params);

    const pageWrapper = useRef(null);
    const [page, setPage] = useState(1);

    const { data, loading, error } = useFetch(`/events/${eventId}`, {}, true);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");

    const [additionalInfo, setAdditionalInfo] = useState([]);

    const reqData = {
        name,
        email,
        phone: mobile,
        additionalInfo: additionalInfo.filter(info => info.name.trim() !== ''),
    }

    console.log(reqData);

    if (!email.trim()) delete reqData.email;

    const { data: joinData, loading: joining, error: joinError, setError: setJoinError, refetch } = useFetch(`/guests/join/${eventId}`, {
        method: "POST",
        body: JSON.stringify(reqData),
    }, false);

    const guestId = useRef(null);

    const { data: exitData, loading: exiting, error: exitError, refetch: exitRefetch } = useFetch(`/guests/leave/${guestId.current}`, {
        method: "DELETE",
        body: JSON.stringify({
            eventId
        }),
    }, false);

    const [joined, setJoined] = useState(false);

    const [event, setEvent] = useState({});

    const router = useRouter();

    const listeners = useMemo(() => [
        {
            event: "event:updated",
            listener: (data) => {
                setEvent(data);
            }
        }
    ], []);

    useSocket(listeners, { eventId });

    useEffect(() => {
        if (data?.data) {
            setEvent(data.data);
        }
    }, [data]);

    useEffect(() => {
        if (pageWrapper.current) {
            const outer = pageWrapper.current;

            const left = (page - 1) * outer.offsetWidth;

            outer.scrollTo({
                left,
                behavior: "smooth"
            });
        }
    }, [page]);

    useLayoutEffect(() => {
        if (!loading) {
            if (localStorage.getItem(`${eventId}_guestId`)) {
                guestId.current = localStorage.getItem(`${eventId}_guestId`)?.split("_").pop();
                setJoined(true);
            }
        }
    }, [loading]);

    useEffect(() => {
        if (joinData?.data) {
            if (joinData?.data?.guestId) {
                localStorage.setItem(`${eventId}_guestId`, joinData.data.guestId);
            }

            setAdditionalInfo([]);
            setEmail('');
            setName('');
            setMobile('');

            router.push(`/event/${eventId}`);
        }
    }, [joinData]);

    useEffect(() => {
        if (exitData?.status === "success") {
            setJoined(false);
            localStorage.removeItem(`${eventId}_guestId`);
        }
    }, [exitData]);

    useEffect(() => {
        if (exitError?.show) {
            toast.error(exitError.message);
            localStorage.removeItem(`${eventId}_guestId`);
            setJoined(false);
        }
    }, [exitError]);

    useEffect(() => {
        if (!error?.show && event?.additionalInfo?.length > 0 && additionalInfo.length === 0) {
            setAdditionalInfo(event.additionalInfo.map(info => ({ name: info.name, value: "" })));
        }
    }, [event?.additionalInfo, error?.show]);


    const handleSubmit = (e) => {
        e.preventDefault();

        if (name.trim() == "") {
            setJoinError({ show: true, message: "Please enter your name." });
            return;
        }

        if (mobile.trim() == "") {
            setJoinError({ show: true, message: "Please enter your mobile number." });
            return;
        }

        refetch();
    }

    let eventStartTime = null;
    let eventEndTime = null;

    try {
        const eventStartDate = new Date(event?.eventStartTime);
        const eventEndDate = new Date(event?.eventEndTime);

        if (eventStartDate.getDate() === eventEndDate.getDate()) {
            eventStartTime = eventStartDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            eventEndTime = eventEndDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        } else {
            eventStartTime = eventStartDate.toLocaleDateString([], { day: "2-digit", month: "2-digit", year: "numeric" });
            eventEndTime = eventEndDate.toLocaleDateString([], { day: "2-digit", month: "2-digit", year: "numeric" });
        }

        if (eventStartTime === eventEndTime) {
            eventStartTime = eventStartDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            eventEndTime = "To Be Announced";
        }
    } catch (e) {

    }

    return loading ? (
        <div className="w-full h-screen mx-auto flex items-center justify-center">
            <FiLoader className="w-8 h-8 animate-spin text-neutral-500" />
        </div>
    ) : error?.show ? (
        <div>
            <div className="w-full h-screen mx-auto flex items-center justify-center">
                <div className="w-full md:p-10 p-4 text-center">
                    <div className="text-2xl font-bold mb-4 text-red-600">{error.message}</div>
                    <div className="text-md text-neutral-400">Oops! We couldn't let you join this event. Please try again later.</div>
                </div>
            </div>
        </div >
    ) : (
        <div className="w-full h-screen mx-auto">
            <div className="w-full md:p-10 p-4 bg-neutral-900">
                <div className="text-2xl font-bold mb-4">{event?.name} <EventStatus className={`relative bottom-1 left-1 inline-block`} event={event} /></div>
                <div className="text-md text-neutral-400">{event?.description}</div>

                <div className="grid grid-cols-2 gap-6 mt-10">
                    <div className="flex flex-col border border-neutral-800 bg-neutral-800/30 rounded-md p-4">
                        <div className="text-2xl font-bold">{event?.queues?.length || 0}</div>
                        <div className="mt-2 text-sm text-neutral-400">Joined</div>
                    </div>

                    <div className="flex flex-col border border-neutral-800 bg-neutral-800/30 rounded-md p-4">
                        <div className="text-2xl font-bold">{event?.maxAttendees || 0}</div>
                        <div className="mt-2 text-sm text-neutral-400">Max Capacity</div>
                    </div>
                </div>
            </div>

            <ToastContainer theme="colored" position="bottom-right" />

            <div className="md:p-10 p-4 py-10">
                <div>
                    <div className="space-y-5 grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-10 border-neutral-800">
                        <div className="flex items-center space-x-3">
                            <div className="bg-neutral-800 p-2 rounded-full text-primary">
                                <FiCalendar />
                            </div>
                            <span className="text-neutral-300 text-md">{formatDate(event?.eventDate, "dd MMMM, yyyy")}</span>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="bg-neutral-800 p-2 rounded-full text-primary">
                                <FiClock />
                            </div>
                            <span className="text-neutral-300 text-md">
                                <span>{eventStartTime}</span>
                                <span className="text-neutral-400 px-3">-</span>
                                <span>{eventEndTime}</span>
                            </span>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="bg-neutral-800 p-2 rounded-full text-primary">
                                <FiMap />
                            </div>
                            <span className="text-neutral-300 text-md">{event?.venue || "To Be Announced"}</span>
                        </div>
                    </div>

                    {
                        joined &&
                        <div className="mt-10">
                            <div className="p-4 bg-warning/10 text-warning rounded-md">You have already joined this event. You can exit the event by clicking the button below.</div>

                            <div className="mt-10">
                                <Button disabled={exiting} onClick={exitRefetch} className={"md:w-auto bg-red-800/80 hover:bg-red-800 w-full justify-center items-center py-3 px-4"}>
                                    {
                                        exiting ? <FiLoader className="animate-spin" /> : <FiLogOut />
                                    }

                                    <span>Exit Event</span>
                                </Button>
                            </div>
                        </div>
                    }

                    {
                        !joined &&
                        <div className="mt-10 flex flex-nowrap max-w-full overflow-hidden" ref={pageWrapper}>
                            <div className="min-w-full">
                                <div className="leading-loose text-[17px]">
                                    <h1 className="text-xl text-primary mb-6 font-bold">{event?.registrationTitle || `Welcome to ${event?.name}`}</h1>

                                    {
                                        (event?.registrationDescription || `${event?.description}`).split("\n").map((item, index) => (
                                            <p className="mt-2 text-neutral-300" key={index}>{item}</p>
                                        ))
                                    }
                                </div>

                                {
                                    isSameOrAfter(new Date(), new Date(event?.eventDate)) &&
                                    <div className="mt-10">
                                        <Button onClick={() => setPage(2)} className={"md:w-auto w-full justify-center items-center py-3 px-4"}>
                                            <span>Register for this Event</span>
                                        </Button>
                                    </div>
                                }
                            </div>

                            {
                                isSameOrAfter(new Date(), new Date(event?.eventDate)) &&
                                <form onSubmit={handleSubmit} className="min-w-full p-1">
                                    <div className="md:grid flex flex-col md:grid-cols-3 md:gap-4 gap-8">
                                        <div>
                                            <label className="text-neutral-300 text-md mb-4 inline-block">Full Name <span className="text-red-500">*</span></label>

                                            <Input
                                                placeholder={"Full Name"}
                                                type="text"
                                                value={name}
                                                disabled={joining}
                                                required
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-neutral-300 text-md mb-4 inline-block">Mobile Number <span className="text-red-500">*</span></label>

                                            <Input
                                                placeholder={"Mobile Number"}
                                                type="number"
                                                value={mobile}
                                                disabled={joining}
                                                required
                                                onChange={(e) => setMobile(e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-neutral-300 text-md mb-4 inline-block">Email</label>

                                            <Input
                                                placeholder={"Email"}
                                                type="email"
                                                value={email}
                                                disabled={joining}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>

                                        {
                                            (event?.additionalInfo || []).length > 0 && (
                                                <>
                                                    <div className="col-span-3 w-full h-0.5 bg-gradient-to-r from-transparent via-neutral-800 to-transparent mt-4"></div>

                                                    {
                                                        (event?.additionalInfo || []).map((item, index) => (
                                                            <div key={index}>
                                                                <label className="text-neutral-300 text-md mb-4 inline-block">{item.name} {item.required && <span className="text-red-500">*</span>}</label>

                                                                <Input
                                                                    disabled={joining}
                                                                    type="string"
                                                                    required={item.required}
                                                                    placeholder={item.name}
                                                                    value={additionalInfo[index]?.value || ""}
                                                                    onChange={(e) => setAdditionalInfo(additionalInfo.map((info, infoIndex) => infoIndex === index ? { ...info, value: e.target.value } : info))}
                                                                />
                                                            </div>
                                                        ))
                                                    }
                                                </>
                                            )
                                        }
                                    </div>

                                    {/* Error */}
                                    {
                                        joinError.show &&
                                        <div className="p-3 mt-8 text-sm text-red-400 items-start gap-2 bg-red-950 rounded-md flex">
                                            <IoInformationCircle className='w-5 h-5 mt-[1px]' />
                                            <span>{joinError?.message} {joinError?.object?.[0]?.message ? `: ${joinError?.object?.[0]?.message}` : ''}</span>
                                        </div>
                                    }

                                    {
                                        !joinError.show && joinData?.status === "success" &&
                                        <div className="p-3 mt-8 text-sm text-green-400 items-start gap-2 bg-green-950 rounded-md flex">
                                            <IoInformationCircle className='w-5 h-5 mt-[1px]' />
                                            <span>{joinData?.message}</span>
                                        </div>
                                    }

                                    <div className="mt-10 flex items-center gap-3">
                                        <Button disabled={joining} className="py-3 px-4" type="submit">
                                            {
                                                joining ? <FiLoader className="animate-spin" /> : <FiLogIn />
                                            }

                                            <span>Join this Event</span>
                                        </Button>

                                        <Button disabled={joining} type="button" onClick={() => setPage(1)} className="bg-neutral-700 hover:bg-neutral-600 py-3 px-4">
                                            <FiArrowLeft />
                                            <span>Go Back</span>
                                        </Button>
                                    </div>
                                </form>
                            }
                        </div>
                    }

                </div>
            </div>
        </div>
    );
}