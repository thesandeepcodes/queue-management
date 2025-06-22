"use client";

const { createContext, useContext, useState } = require("react");

const UserContext = createContext(null);

export function UserProvider({ children, userData }) {
    const [loggedIn, setLoggedIn] = useState(userData ? true : false);

    return <UserContext.Provider value={{
        loggedIn,
        setLoggedIn
    }}>{children}</UserContext.Provider>;
}

export const useUser = () => {
    const context = useContext(UserContext);

    if (!context) throw new Error('useUser must be used within a UserProvider');

    return context;
}