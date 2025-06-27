"use client";

import { timeAgo } from "@/lib/client/date";
import { useEffect, useState } from "react";

export default function LiveTimeAgo({ date }) {
    const [label, setLabel] = useState(() => timeAgo(date));

    useEffect(() => {
        const interval = setInterval(() => {
            setLabel(timeAgo(date));
        }, 3000);

        return () => clearInterval(interval);
    }, [date]);

    return <span>{label}</span>;
}
