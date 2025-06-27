"use client";

import { useDashboard } from "@/context/DashboardContext";

export default function DashboardTitleBar({ title, description, children }) {
    const { tabs, tab } = useDashboard();

    const tabData = tabs.find((tabItem) => tabItem.name == tab);

    return (
        <div className="flex items-center justify-between gap-3 mb-10">
            <div>
                <div className="text-2xl/loose font-bold">{title || tabData?.tabTitle}</div>
                <div className="text-sm/loose text-neutral-400">
                    {description || tabData?.tabDes}
                </div>
            </div>

            {children}
        </div>
    )
}