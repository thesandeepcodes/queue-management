'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';

export const ThemeContext = createContext(undefined);

export function ThemeProvider({
    children,
    defaultTheme = 'system',
    storageKey = 'site-theme',
}) {
    const [theme, setThemeState] = useState(() => {
        if (typeof window === 'undefined') {
            return defaultTheme === 'dark' ? 'dark' : 'light';
        }
        try {
            const storedTheme = window.localStorage.getItem(storageKey);
            if (storedTheme) {
                return storedTheme;
            }
            if (defaultTheme === 'system') {
                return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            return defaultTheme;
        } catch (e) {
            return defaultTheme === 'dark' ? 'dark' : 'light';
        }
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.add("no-transition");

        root.classList.remove('light', 'dark');
        root.classList.add(theme);

        setTimeout(() => {
            root.classList.remove("no-transition");
        }, 1000);

        try {
            if (defaultTheme === 'system') {
                window.localStorage.removeItem(storageKey);
            } else {
                window.localStorage.setItem(storageKey, theme);
            }
        } catch (e) {
            console.warn('Failed to save theme to localStorage', e);
        }
    }, [theme, storageKey]);

    const setTheme = useCallback((newTheme) => {
        setThemeState(newTheme);
    }, []);

    const toggleTheme = useCallback(() => {
        setThemeState((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    }, []);

    useEffect(() => {
        if (defaultTheme !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            const storedTheme = window.localStorage.getItem(storageKey);
            if (!storedTheme) {
                setThemeState(mediaQuery.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [defaultTheme, storageKey]);

    const value = {
        theme,
        setTheme,
        toggleTheme,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
    const context = React.useContext(ThemeContext);

    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
}