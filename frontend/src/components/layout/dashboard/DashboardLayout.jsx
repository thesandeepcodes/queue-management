"use client";

import Link from "next/link";
import { DashboardProvider } from "@/context/DashboardContext";
import DashboardSidebarTabs from "@/components/layout/dashboard/SidebarTabs";
import UserProfilePhoto from "@/components/layout/dashboard/UserProfile";
import LogoutButton from "@/components/layout/dashboard/LogoutButton";
import { useUser } from "@/context/UserContext";
import { FiLock } from "react-icons/fi";
import Button from "@/components/base/Button";

export default function DashboardLayout({ children }) {
    const { loggedIn } = useUser();

    return !loggedIn ? (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="bg-neutral-800/40 shadow-xl rounded-xl p-8 px-12 max-w-md text-center">
                <div className="flex justify-center mb-6">
                    <FiLock className="text-6xl text-red-500" />
                </div>
                <h1 className="text-2xl font-bold mb-2">You're not logged in</h1>
                <p className="text-neutral-400 mt-2 mb-6">
                    To access this page, you need to be logged in. Please log in with your
                    account.
                </p>
                <Link href="/login">
                    <Button className="px-6 py-2 bg-red-500 mx-auto text-white font-semibold rounded hover:bg-red-600 transition">
                        Go to Login
                    </Button>
                </Link>
            </div>
        </div>
    ) : (
        <DashboardProvider>
            <div className="grid grid-cols-[auto_1fr] w-full h-screen">
                <div className="w-64 h-full flex flex-col bg-neutral-900 p-3">
                    <Link
                        href="/dashboard"
                        className="flex items-center text-3xl font-bold py-2"
                    >
                        <span className="text-primary">Q'</span>Up
                    </Link>

                    <DashboardSidebarTabs />

                    <div className="flex-1 flex flex-col justify-end items-stretch">
                        <LogoutButton />
                    </div>
                </div>

                <div className="h-screen grid grid-rows-[auto_1fr]">
                    <div className="w-full flex items-center gap-4 justify-between p-3 bg-neutral-900">
                        <div></div>
                        <div className="flex items-center gap-4">
                            <UserProfilePhoto />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 px-8 min-h-0 overflow-y-auto">{children}</div>
                </div>
            </div>
        </DashboardProvider>
    );
}
