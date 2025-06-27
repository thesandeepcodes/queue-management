"use client";

import { formatTimeDuration } from "@/lib/client/date";
import { useEffect, useRef, useState } from "react";

export default function LiveTimeDuration({ durationMs, decrement = null }) {
    const [duration, setDuration] = useState(durationMs);

    useEffect(() => {
        const interval = setInterval(() => {
            if (decrement == true) {
                setDuration((prev) => {
                    if (prev <= 0) return 0;
                    return prev - 1000;
                });
            } else if (decrement == false) {
                setDuration((prev) => prev + 1000);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [durationMs, decrement]);

    return <span>{formatTimeDuration(duration)}</span>;
}
