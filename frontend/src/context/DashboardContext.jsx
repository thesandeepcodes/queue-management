"use client";

import { usePathname } from "next/navigation";
import { FiBell, FiCalendar } from "react-icons/fi";
import { IoQrCode } from "react-icons/io5";

const { createContext, useContext, useState, useEffect } = require("react");

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
    const [tab, setTab] = useState("");

    const tabs = [
        {
            name: "events",
            icon: <FiCalendar className="w-5 h-5" />,
            title: "Events",
            tabTitle: "Manage Events",
            tabDes: "Manage your events and their settings."
        },
        {
            name: "notifications",
            icon: <FiBell className="w-5 h-5" />,
            title: "Notifications",
            tabTitle: "Manage Notifications",
            tabDes: "Manage your notifications and their settings."
        },
        {
            name: "qr",
            icon: <IoQrCode className="w-5 h-5" />,
            title: "QR Code",
            tabTitle: "Generate QR Code",
            tabDes: "Generate a QR code for your events."
        }
    ];

    const pathname = usePathname();

    useEffect(() => {
        const paths = pathname.split("/").filter(Boolean);

        if (paths.length >= 2) {
            setTab(paths[1]);
        } else {
            setTab("");
        }
    }, [pathname]);

    return <DashboardContext.Provider value={{
        tab, setTab, tabs
    }}>
        {children}
    </DashboardContext.Provider>
}

export const useDashboard = () => {
    const context = useContext(DashboardContext);

    if (!context) throw new Error('useDashboard must be used within a DashboardProvider');

    return context;
}