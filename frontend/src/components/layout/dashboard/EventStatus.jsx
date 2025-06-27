import { twMerge } from "tailwind-merge";

export default function EventStatus({ event }) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const isUpcoming = new Date(event.eventDate) > today;
    const isCompleted = event?.completed;

    let statusText = "Ongoing";
    let statusClasses = "bg-warning/10 border-warning/20 text-warning/80";

    if (isUpcoming) {
        statusText = "Upcoming";
        statusClasses = "bg-primary/20 border-primary/40 text-primary";
    } else if (isCompleted) {
        statusText = "Completed";
        statusClasses = "bg-green-800/20 border-green-800/40 text-green-600";
    }

    return (
        <span className={twMerge(
            "p-1 px-3 border mt-1 rounded-full text-xs font-bold",
            statusClasses
        )}>
            {statusText}
        </span>
    );
}
