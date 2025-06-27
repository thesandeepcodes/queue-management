"use client";

import Button from "@/components/base/Button";
import Modal from "@/components/base/Modal";
import DeleteGuestButton from "@/components/layout/dashboard/DeleteGuestButton";
import EventStatus from "@/components/layout/dashboard/EventStatus";
import FetchErrorModal from "@/components/layout/dashboard/FetchErrorModal";
import LiveTimeAgo from "@/components/layout/dashboard/LiveTimeAgo";
import DashboardTitleBar from "@/components/layout/dashboard/TitleBar";
import { useFetch } from "@/hooks/useFetch";
import useSocket from "@/hooks/useSocket";
import { formatDate, formatTimeDuration, timeAgo } from "@/lib/client/date";
import Link from "next/link";
import { Children, createRef, use, useEffect, useMemo, useRef, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiCheck, FiChevronDown, FiChevronUp, FiClock, FiEdit, FiEdit2, FiFlag, FiInfo, FiLoader, FiMail, FiPhone, FiRepeat, FiTrash2, FiUser } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

const calculateBoundingBoxes = (children) => {
    const boundingBoxes = {};

    Children.forEach(children, (child) => {
        const domNode = child.props.ref.current;

        if (domNode) {
            const boundingBox = domNode.getBoundingClientRect();
            boundingBoxes[child.key] = boundingBox;
        }
    });
    return boundingBoxes;
};

function getChangedIndicesOnly(original, rearranged) {
    const changes = [];

    for (let i = 0; i < original.length; i++) {
        if (original[i] !== rearranged[i]) {
            changes.push([i, rearranged.indexOf(original[i])]);
        }
    }

    const visited = new Set();
    const result = {};

    for (const [from, to] of changes) {
        if (!visited.has(to)) {
            result[from] = to;
            visited.add(from);
            visited.add(to);
        }
    }

    return result;
}


function applyPositionsMap(array, positions) {
    const newQueues = [...array];

    for (const from in positions) {
        const to = positions[from];

        newQueues.splice(to, 0, newQueues.splice(from, 1)[0]);
    }

    return newQueues;
}



export default function ManageEvent({ params }) {
    const { eventId } = use(params);

    const [prevBoundingBoxes, setPrevBoundingBoxes] = useState({});
    const [isAnimating, setIsAnimating] = useState(false);

    const [queues, setQueues] = useState([]);
    const [currentGuest, setCurrentGuest] = useState(null);
    const [event, setEvent] = useState({});

    const [initialLoading, setInitialLoading] = useState(true);

    const { error: eventError } = useFetch(`/analytics/event/${eventId}`, {}, true, (result) => {
        setEvent(result?.data)
        setInitialLoading(false);
    });

    const { loading: fetchingQueues, error: queuesError, data: queuesData, setData: setQueuesData } = useFetch(`/queue/event/${eventId}`, {}, true, (result) => {
        setQueues((result?.data?.queues || []).map(queue => ({ ...queue, ref: createRef() })));
    });

    const { loading: markingAsServed, error: markAsServedError, setError: setMarkAsServedError, refetch: markAsServed } = useFetch(`/queue/serve/${eventId}`, {
        method: "PUT",
        body: JSON.stringify({
            guestId: currentGuest?._id
        })
    }, false, (r) => {
        setQueues(prev => prev.map(queue => queue._id === currentGuest?._id ? { ...queue, served: true } : queue));
    });

    const newQueuePositions = queuesData ? getChangedIndicesOnly(queues.map(queue => queue._id), queuesData?.data?.queues.map(queue => queue._id)) : {};

    const { loading: savingPositions, error: savePositionsError, refetch: savePositions } = useFetch(`/queue/move/${eventId}`, {
        method: "PUT",
        body: JSON.stringify({
            positions: newQueuePositions
        })
    }, false, (r) => {
        setQueuesData(prev => ({
            ...prev,
            data: {
                ...prev.data,
                queues: applyPositionsMap(prev.data.queues, newQueuePositions)
            }
        }));
    });

    const { loading: markingEventCompleted, error: markCompletedError, setError: setMarkCompletedError, refetch: markEventCompleted } = useFetch(`/events/${eventId}`, {
        method: "PUT",
        body: JSON.stringify({
            completed: !event?.completed
        })
    }, false)

    const [updatePositionInfo, setUpdatePositionInfo] = useState({
        current: event?.currentPosition,
        magnitude: 0,
    });

    const { loading: updatingCurrentPosition, error: updateCurrentPositionError, setError: setUpdateCurrentPositionError, refetch: updateCurrentPosition } = useFetch(`/events/${eventId}`, {
        method: "PUT",
        body: JSON.stringify({
            currentPosition: event?.currentPosition + updatePositionInfo.magnitude
        })
    }, false, (r) => {
        console.log(r);
    })

    const listeners = useMemo(() => [
        {
            event: "event:updated",
            listener: (event) => {
                setEvent(event);
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
                console.log("Updated", queue);

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
                console.log("Added", queue);

                setQueues(prev => [...prev, { ...queue, ref: createRef() }]);
                setQueuesData(prev => ({
                    ...prev,
                    data: {
                        ...prev.data,
                        queues: [...prev.data.queues, queue]
                    }
                }));
            }
        }
    ], []);
    useSocket(listeners, { eventId });


    const savePositionsTimeout = useRef(null);

    useEffect(() => {
        if (updatePositionInfo.magnitude !== 0) {
            updateCurrentPosition();
        }
    }, [updatePositionInfo])

    useEffect(() => {
        if (queues.length > 1 && Object.keys(newQueuePositions).length > 0) {
            clearTimeout(savePositionsTimeout.current);

            savePositionsTimeout.current = setTimeout(() => {
                savePositions();
            }, 1000);

            return () => clearTimeout(savePositionsTimeout.current);
        }
    }, [queues]);

    useEffect(() => {
        const guest = queues.find((queue, index) => index == event.currentPosition);

        if (guest) {
            setCurrentGuest(guest);
        } else {
            setCurrentGuest(null);
        }
    }, [queues, event]);

    useEffect(() => {
        if (isAnimating) {
            const newBoundingBoxes = calculateBoundingBoxes(
                queues.map(queue => <div key={queue._id} ref={queue.ref}></div>)
            );

            queues.forEach(queue => {
                const oldBoundingBox = prevBoundingBoxes[queue._id];
                const newBoundingBox = newBoundingBoxes[queue._id];

                if (oldBoundingBox && newBoundingBox) {
                    const deltaX = oldBoundingBox.left - newBoundingBox.left;
                    const deltaY = oldBoundingBox.top - newBoundingBox.top;

                    requestAnimationFrame(() => {
                        queue.ref.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                        queue.ref.current.style.transition = 'transform 0s';

                        requestAnimationFrame(() => {
                            queue.ref.current.style.transform = '';
                            queue.ref.current.style.transition = 'transform 300ms ease-in-out';
                        });
                    });
                }
            });

            const timer = setTimeout(() => setIsAnimating(false), 300);
            return () => clearTimeout(timer);
        }
    }, [queues, isAnimating, prevBoundingBoxes]);


    const handleMove = (index, direction) => {
        if (isAnimating) return;

        const boundings = calculateBoundingBoxes(
            queues.map(queue => <div key={queue._id} ref={queue.ref}></div>)
        );

        setPrevBoundingBoxes(boundings);
        setIsAnimating(true);

        const newUsers = [...queues];
        const [movedUser] = newUsers.splice(index, 1);

        if (direction === 'up') {
            newUsers.splice(index - 1, 0, movedUser);
        } else {
            newUsers.splice(index + 1, 0, movedUser);
        }

        setQueues(newUsers);
    };

    if (eventError?.show) {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                    <FiInfo className="w-5 h-5 text-red-500" />
                    <div className="text-center font-bold text-lg text-red-500">{eventError.message}</div>
                </div>
                <div className="text-center text-neutral-400">You can not access this event. Go back and try again.</div>
            </div>
        )
    }

    return (
        initialLoading ? (
            <div className="w-full p-6 rounded-md flex items-center justify-center h-full">
                <FiLoader className="w-8 h-8 animate-spin text-neutral-500" />
            </div>
        ) : (

            eventError?.show ? (
                <div className="w-full p-6 rounded-md flex items-center justify-center h-full">{eventError.message}</div>
            ) : (
                <div>
                    <FetchErrorModal error={markCompletedError} setError={setMarkCompletedError} />

                    <DashboardTitleBar title={event?.name} description={
                        <>
                            <span className="mr-4 text-[15px]">
                                {formatDate(event?.eventDate, "dd MMMM yyyy (EEE)")}
                            </span>

                            <EventStatus event={event} />
                        </>
                    }>
                        <div className="flex items-center gap-4">

                            <div onClick={markEventCompleted} className={twMerge("w-10 h-10 rounded-full cursor-pointer select-none bg-neutral-900 border-neutral-600 font-bold hover:bg-neutral-800 text-neutral-400 active:scale-95 transition-all duration-300 flex items-center justify-center", event?.completed && "bg-warning/10 border-warning/30 hover:bg-warning/20 text-warning")}>
                                {
                                    markingEventCompleted ? <FiLoader className="w-5 h-5 animate-spin" /> : (
                                        event?.completed ? <FiClock className="w-5 h-5" /> : <FiCheck className="w-5 h-5" />
                                    )
                                }
                            </div>

                            <Link href={`/dashboard/events/edit/${event._id}`} className="w-10 h-10 rounded-full cursor-pointer select-none bg-neutral-900 border-neutral-600 font-bold hover:bg-neutral-800 text-neutral-400 active:scale-95 transition-all duration-300 flex items-center justify-center">
                                <FiEdit2 className="w-4 h-4" />
                            </Link>
                        </div>
                    </DashboardTitleBar>

                    <Modal isOpen={savePositionsError?.show} cancellable={false}>
                        <div className="leading-loose p-4">
                            <div className="font-bold text-xl leading-relaxed">Error</div>
                            <div className="mt-4 text-neutral-400">{savePositionsError?.message || "Something went wrong while saving positions"}</div>
                            <div className="flex items-center gap-2 text-white mt-8 justify-end">
                                <Button className="bg-red-800 hover:bg-red-700" disabled={savingPositions} onClick={() => {
                                    savePositions();
                                }}>
                                    {
                                        savingPositions ?
                                            <FiLoader className="w-4 h-4 animate-spin" /> : <FiRepeat className="w-4 h-4" />
                                    }
                                    <span>Retry</span>
                                </Button>
                            </div>
                        </div>
                    </Modal>

                    <div className="grid grid-cols-2 gap-5 items-start">
                        <div>
                            <div className="h-full border border-neutral-800 rounded-md p-6">
                                {
                                    currentGuest && (
                                        <div>
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="w-14 h-14 rounded-full bg-neutral-700 flex items-center justify-center">
                                                    <FiUser className="w-8 h-8 text-neutral-400" />
                                                </div>

                                                <div className="bg-green-900/15 border text-sm border-green-900/30 rounded-md px-3 py-1 text-green-500">
                                                    <span>{formatDate(currentGuest?.joinedAt, "dd MMM (EEE HH:mm)")}</span>
                                                </div>
                                            </div>

                                            <div className="mt-4 text-lg leading-relaxed">{currentGuest?.name} {currentGuest?.served && <span className="text-xs p-1 px-3 rounded-md bg-blue-800/30 text-blue-500 font-bold">Served</span>}</div>
                                            <div className="mt-3 text-sm text-neutral-400 flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <FiPhone />
                                                    <span>{currentGuest?.phone}</span>
                                                </div>

                                                {
                                                    currentGuest?.email &&
                                                    <div className="flex items-center gap-2 min-w-0 max-w-full overflow-hidden truncate">
                                                        <FiMail className="min-w-4" />
                                                        <span className="min-w-0 max-w-full overflow-hidden truncate">{currentGuest?.email}</span>
                                                    </div>
                                                }
                                            </div>

                                            {
                                                (currentGuest?.additionalInfo || []).length > 0 && (
                                                    <div className="mt-6 text-sm rounded-md overflow-auto max-h-[150px]">
                                                        {
                                                            (currentGuest?.additionalInfo || []).map((infoObj, index) => (
                                                                Object.entries(infoObj).map(([key, value]) => (
                                                                    <div key={`${index}-${key}`} className="grid grid-cols-2 gap-2 bg-neutral-900 border-b border-neutral-800">
                                                                        <div className="p-3 border-r border-neutral-800">{key}</div>
                                                                        <div className="p-3">{value}</div>
                                                                    </div>
                                                                ))
                                                            ))
                                                        }
                                                    </div>
                                                )
                                            }
                                        </div>
                                    )
                                }

                                {
                                    !currentGuest && (
                                        <div className="flex items-center justify-center h-full text-sm text-neutral-500">
                                            No Guest Selected
                                        </div>
                                    )
                                }
                            </div>

                            {/* Options */}

                            {
                                currentGuest && (
                                    <div className="mt-8 flex items-center gap-3">
                                        <FetchErrorModal error={markAsServedError} setError={setMarkAsServedError} />

                                        <Button onClick={markAsServed} className="bg-primary/20 text-primary hover:bg-primary/30 font-bold" disabled={markingAsServed || currentGuest?.served}>
                                            {
                                                markingAsServed ? (
                                                    <FiLoader className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <FiFlag className="w-4 h-4" />
                                                )

                                            }
                                            <span>Mark as Served</span>
                                        </Button>

                                        <DeleteGuestButton eventId={eventId} guest={currentGuest} onDeleted={() => {
                                            const newQueues = [...queues];
                                            const currentGuestIndex = queues.findIndex(queue => queue._id == currentGuest._id);
                                            if (currentGuestIndex > -1) {
                                                newQueues.splice(currentGuestIndex, 1);
                                                setQueues(newQueues);
                                            }
                                        }}>

                                            <Button className="bg-red-800/20 text-red-700 hover:bg-red-800/30 font-bold">
                                                <FiFlag />
                                                <span>Delete</span>
                                            </Button>
                                        </DeleteGuestButton>

                                        <div className="flex-1 flex gap-2 items-center justify-end">
                                            <Button onClick={() => setUpdatePositionInfo({ current: event?.currentPosition, magnitude: -1 })} disabled={event?.currentPosition <= 0 || updatingCurrentPosition} className="bg-neutral-800 hover:bg-neutral-700"><FiArrowLeft /></Button>

                                            <Button onClick={() => setUpdatePositionInfo({ current: event?.currentPosition, magnitude: 1 })} disabled={event?.currentPosition >= event?.queues?.length - 1 || updatingCurrentPosition} className="bg-neutral-800 hover:bg-neutral-700"><FiArrowRight /></Button>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="border border-green-800/35 bg-green-900/20 text-green-500 rounded-md p-6">
                                <div className="text-3xl font-bold">{event?.queues?.length > 0 ? event?.currentPosition + 1 : 0}</div>
                                <div className="mt-4 text-sm text-neutral-300">Serving</div>
                            </div>

                            <div className="border border-warning/20 bg-warning/10 text-warning rounded-md p-6">
                                <div className="text-3xl font-bold">{(event?.totalQueues - event?.servedQueues || 0) > 0 ? (event?.totalQueues - event?.servedQueues - 1) || 0 : 0}</div>
                                <div className="mt-4 text-sm text-neutral-300">Waiting</div>
                            </div>

                            <div className="border border-neutral-800 bg-neutral-900 rounded-md p-6">
                                <div className="text-3xl font-bold">{event?.totalQueues || 0}</div>
                                <div className="mt-4 text-sm text-neutral-300">Joined</div>
                            </div>

                            <div className="border border-neutral-800 bg-neutral-900 rounded-md p-6">
                                <div className="text-3xl font-bold">{(event?.maxAttendees || 0) == 0 ? "-" : (event?.maxAttendees || 0)}</div>
                                <div className="mt-4 text-sm text-neutral-300">Event Size</div>
                            </div>

                            <div className="border border-neutral-800 bg-neutral-900 rounded-md p-6 col-span-2">
                                <div className="text-3xl font-bold">{formatTimeDuration(event?.averageQueueTime)}</div>
                                <div className="mt-4 text-sm text-neutral-300">Average Queue Time</div>
                            </div>
                        </div>
                    </div>

                    {/* Attendees */}

                    <div className="mt-15 text-2xl font-bold text-neutral-200">Queues</div>

                    <div className="bg-neutral-900 rounded-xl shadow-lg mt-6">
                        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-neutral-800 text-neutral-400 font-semibold text-sm">
                            <div className="col-span-2">Position</div>
                            <div className="col-span-3">Name</div>
                            <div className="col-span-3">Joined At</div>
                            <div className="col-span-2">Time Taken</div>
                            <div className="col-span-2 text-center">Actions</div>
                        </div>

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
                                queues.map((guest, index) => (
                                    <div
                                        key={guest._id}
                                        ref={guest.ref}
                                        className={twMerge(`grid grid-cols-12 gap-4 items-center px-6 py-4 bg-neutral-900 hover:bg-neutral-800/50 border-b border-neutral-800 last:border-b-0`, guest?.served && "bg-blue-800/10 hover:bg-blue-800/10", guest._id === currentGuest?._id ? "bg-green-800/10 font-bold hover:bg-green-800/10" : "")}
                                    >
                                        <div className="col-span-2 text-neutral-400 font-medium">{index + 1}</div>

                                        <div className="col-span-3 text-neutral-200 font-medium">{guest.name} {guest?.served && <span className="text-xs p-1 px-3 rounded-md bg-blue-800/30 text-blue-500 font-bold">Served</span>}</div>
                                        <div className="col-span-3 text-neutral-400"><LiveTimeAgo date={guest.joinedAt} /></div>
                                        <div className="col-span-2 text-neutral-400">{guest?.queueTime ? formatTimeDuration(guest.queueTime) : "-"}</div>

                                        <div className="col-span-2 flex items-center justify-center space-x-2">
                                            <button
                                                onClick={() => handleMove(index, 'up')}
                                                disabled={index === 0}
                                                className="w-7 h-7 flex items-center justify-center cursor-pointer rounded-md text-neutral-400 hover:text-neutral-100 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                aria-label="Move up"
                                            >
                                                <FiChevronUp size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleMove(index, 'down')}
                                                disabled={index === queues.length - 1}
                                                className="w-7 h-7 flex items-center justify-center cursor-pointer rounded-md text-neutral-400 hover:text-neutral-100 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                aria-label="Move down"
                                            >
                                                <FiChevronDown size={18} />
                                            </button>

                                            <DeleteGuestButton eventId={eventId} guest={guest} onDeleted={() => {
                                                const newQueues = [...queues];
                                                newQueues.splice(index, 1);
                                                setQueues(newQueues);
                                            }}>
                                                <button className="w-7 h-7 flex items-center justify-center cursor-pointer rounded-md text-neutral-400 hover:text-red-500 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </DeleteGuestButton>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )
        )
    );
}