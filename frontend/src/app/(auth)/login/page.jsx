"use client";

import { useUser } from '@/context/UserContext';
import { useFetch } from '@/hooks/useFetch';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FiHome, FiLoader, FiLogOut } from 'react-icons/fi';
import { IoInformationCircle, IoLockClosed, IoLogoGoogle, IoMail } from "react-icons/io5";
import { toast, ToastContainer } from 'react-toastify';


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);

    const { loggedIn, setLoggedIn } = useUser();

    const router = useRouter();

    const { data, loading, error, refetch } = useFetch('/auth/login', {
        method: "POST",
        body: JSON.stringify({ email, password }),
    }, false);

    const { data: logoutData, loading: logoutLoading, error: logoutError, refetch: logoutRefetch } = useFetch('/auth/logout', { method: 'POST' }, false);

    useEffect(() => {
        if (data) {
            toast.success('Login successful!');

            setPassword('');
            setEmail('');

            setTimeout(() => {
                router.push('/dashboard');
            }, 1000);
        }
    }, [data]);

    useEffect(() => {
        if (logoutError?.show) {
            toast.error('Logout failed: ' + logoutError.message);
        } else if (logoutData) {
            toast.success('Logout successful!');
            setLoggedIn(false);
        }
    }, [logoutData, logoutError]);

    const handleLogin = (e) => {
        e.preventDefault();
        refetch();
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-full font-sans p-4 bg-background">
            <ToastContainer position='bottom-right' theme='colored' />

            {
                loggedIn ? (
                    <div className="w-full max-w-md mx-auto rounded-2xl p-8 md:p-10 shadow-2xl bg-neutral-900">
                        <div className="text-center mb-8">
                            <Link href={'/'} className="text-4xl font-bold tracking-tight">
                                Q<span className='text-primary'>'</span>Up
                            </Link>
                            <p className="mt-4 text-md text-neutral-400">
                                You are already logged in!
                            </p>
                        </div>

                        <div className='mt-4 grid grid-cols-2 gap-4'>
                            <Link className='p-3 flex items-center justify-center gap-2 rounded-lg bg-primary text-white' href={'/'}>
                                <FiHome />
                                <span>Back to Home</span>
                            </Link>

                            <button onClick={logoutRefetch} className={`p-3 ${logoutLoading ? 'pointer-events-none opacity-60' : ''} cursor-pointer select-none hover:bg-red-700 transition active:scale-102 flex items-center justify-center gap-2 rounded-lg bg-red-800 text-white`} >
                                {logoutLoading ? <FiLoader className='animate-spin' /> : <FiLogOut />}
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        className="w-full max-w-md mx-auto rounded-2xl p-8 md:p-10 shadow-2xl bg-neutral-900">
                        <div className="text-center mb-8">
                            <Link href={'/'} className="text-4xl font-bold tracking-tight">
                                <span className='text-primary'>Q'</span>Up
                            </Link>
                            <p className="mt-2 text-md text-neutral-400">
                                Welcome back! Please sign in to your account.
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            {/* Email Input */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                                    <IoMail className="h-5 w-5" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    disabled={loading}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    required
                                    className="w-full disabled:opacity-50 border-neutral-600 ring-neutral-500 pl-10 pr-4 py-3 rounded-lg border transition-colors duration-300 focus:ring-1 focus:outline-none"
                                />
                            </div>

                            {/* Password Input */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400 pointer-events-none">
                                    <IoLockClosed className="h-5 w-5" />
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    disabled={loading}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full disabled:opacity-50 pl-10 pr-4 py-3 rounded-lg border border-neutral-600 ring-neutral-500 transition-colors duration-300 focus:ring-1 focus:outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <label htmlFor="remember-me" className={`flex items-center ${loading ? 'opacity-80 pointer-events-none' : ''}`}>
                                    <input id="remember-me" name="remember-me" disabled={loading} type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded" />
                                    <span className="ml-2 block text-sm text-neutral-400 select-none">Remember me</span>
                                </label>
                                <div className="text-sm">
                                    <a href="#" className="font-medium hover:underline text-primary">
                                        Forgot your password?
                                    </a>
                                </div>
                            </div>

                            {/* Error */}
                            {
                                error.show &&
                                <div className="p-3 text-sm text-red-400 items-start gap-2 bg-red-950 rounded-md flex">
                                    <IoInformationCircle className='w-5 h-5 mt-[1px]' />
                                    <span>{error?.message} {error?.object?.[0]?.message ? `: ${error?.object?.[0]?.message}` : ''}</span>
                                </div>
                            }

                            {/* Login Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`disabled:opacity-50 disabled:scale-100 disabled:cursor-default w-full flex bg-primary cursor-pointer items-center gap-2 justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all duration-300 transform hover:scale-105`}>
                                    <span className={!loading ? 'opacity-0 invisible' : 'animate-spin'}><FiLoader /></span>
                                    <span>Sign in</span>
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-neutral-700 to-transparent"></div>
                            </div>

                            {/* Text */}
                            <div className="relative flex justify-center">
                                <span className="px-2 text-sm bg-neutral-900 text-neutral-400">Or continue with</span>
                            </div>
                        </div>

                        {/* Social Login */}
                        <div className="mt-6 opacity-70 pointer-events-none">
                            <a href="#" className="w-full inline-flex justify-center py-3 px-4 border rounded-lg shadow-sm bg-opacity-50 text-sm font-medium transition-colors duration-300 hover:bg-opacity-100 border-neutral-600">
                                <IoLogoGoogle className="h-5 w-5" />
                                <span className="ml-2">Sign in with Google</span>
                            </a>
                        </div>


                        {/* Sign Up Link */}
                        <p className="mt-10 text-center text-sm">
                            Not a member?{' '}
                            <Link href={'/signup'} className="font-medium hover:underline text-primary">
                                Sign up now
                            </Link>
                        </p>
                    </div>
                )
            }
        </div>
    );
}
