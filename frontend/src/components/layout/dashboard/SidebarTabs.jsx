"use client";

import { useDashboard } from "@/context/DashboardContext";
import Link from "next/link";

export default function DashboardSidebarTabs() {
    const { tab, tabs } = useDashboard();

    return (
        <div className="flex flex-col gap-3 mt-8">
            {tabs.map((tabItem) => (
                <Link
                    href={`/dashboard/${tabItem.name}`}
                    key={tabItem.name}
                    className={`rounded-md flex items-center gap-4 px-4 py-3 cursor-pointer select-none ${tab == tabItem.name
                        ? "bg-neutral-800"
                        : "hover:bg-neutral-800/40"
                        }`}
                >
                    {tabItem.icon}
                    <span>{tabItem.title}</span>
                </Link>
            ))}
        </div>
    )
}