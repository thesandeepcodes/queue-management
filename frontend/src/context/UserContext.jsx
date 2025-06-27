"use client";

import { request } from "@/lib/client/request";

const { createContext, useContext, useState, useEffect } = require("react");

const UserContext = createContext(null);

export function UserProvider({ children, userData }) {
    const [loggedIn, setLoggedIn] = useState(userData ? true : false);
    const [user, setUser] = useState({});
    const [loadedUser, setLoadedUser] = useState(false);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (loggedIn && mounted) {
            (async () => {
                const userData = await request('/auth/me');

                setUser(userData?.data || {});
                setLoadedUser(true);
            })();
        }
    }, [mounted]);

    return <UserContext.Provider value={{
        loggedIn,
        setLoggedIn,
        user,
        loadedUser,
    }}>{children}</UserContext.Provider>;
}

export const useUser = () => {
    const context = useContext(UserContext);

    if (!context) throw new Error('useUser must be used within a UserProvider');

    return context;
}