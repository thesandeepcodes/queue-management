"use client";

import { useUser } from "@/context/UserContext";

export default function UserProfilePhoto() {
    const { user, loadedUser } = useUser();

    return (
        <div className="w-10 h-10 rounded-full bg-neutral-700 cursor-pointer flex items-center justify-center">
            {
                loadedUser &&
                <div className="text-center font-bold">
                    {user?.username?.charAt(0).toUpperCase()}
                </div>
            }
        </div>
    )
}