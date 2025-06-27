"use client";

import Button from "@/components/base/Button";
import { useUser } from "@/context/UserContext";
import { useFetch } from "@/hooks/useFetch";
import { FiLoader, FiLogOut } from "react-icons/fi";

export default function LogoutButton() {
    const { setUser, setLoggedIn } = useUser();

    const {
        loading, error, data, refetch
    } = useFetch("/auth/logout", { method: "POST" }, false, (result) => {
        setUser({});
        setLoggedIn(false);
    });

    return (
        <Button onClick={refetch} disabled={loading} className="w-full bg-red-800/15 border border-red-800/20 text-red-600 justify-center hover:bg-red-800/20">
            {loading ? <FiLoader className="animate-spin" /> : <FiLogOut />}
            <span>Logout</span>
        </Button>
    )
}