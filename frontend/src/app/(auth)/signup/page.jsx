"use client";

import React, { useEffect, useState } from 'react';
import { IoInformationCircle, IoLockClosed, IoLogoGoogle, IoMail, IoPerson } from "react-icons/io5";
import { FiLoader } from "react-icons/fi";
import Link from 'next/link';
import { useFetch } from '@/hooks/useFetch';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Input from '@/components/base/Input';


export default function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const router = useRouter();

    const { data, loading, setLoading, error, setError, refetch } = useFetch('/auth/register', {
        method: "POST",
        body: JSON.stringify({ username: name, email, password }),
    }, false);

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError({ show: true, message: 'Passwords do not match.' });
            return;
        }

        if (name.length < 3) {
            setError({ show: true, message: 'Name must be at least 3 characters.' });
            return;
        }

        refetch();
    };

    useEffect(() => {
        if (data) {
            if (data.status == "success") {
                toast.success("Registration successful! Redirecting...");
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');

                setTimeout(() => {
                    router.push('/login');
                }, 1000);
            }
        }

    }, [data]);

    return (
        <div className="flex items-center justify-center min-h-screen w-full font-sans p-4 bg-background">
            <ToastContainer theme='colored' position='bottom-right' />

            <div className="w-full max-w-md mx-auto rounded-2xl p-8 md:p-10 shadow-2xl bg-neutral-900">
                <div className="text-center mb-8">
                    <Link href={'/'} className="text-4xl font-bold tracking-tight">
                        <span className='text-primary'>Q'</span>Up
                    </Link>
                    <p className="mt-2 text-md text-neutral-400">
                        Create your account to get started.
                    </p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-6">
                    {/* Name */}
                    <Input
                        type="text"
                        name="name"
                        id="name"
                        value={name}
                        disabled={loading}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        required
                        iconLeft={<IoPerson className='w-5 h-5' />}
                    />

                    {/* Email */}
                    <Input
                        type="email"
                        name="email"
                        id="email"
                        disabled={loading}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        required
                        iconLeft={<IoMail className='w-5 h-5' />}
                    />

                    {/* Password */}
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        disabled={loading}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        required
                        iconLeft={<IoLockClosed className='w-5 h-5' />}
                    />

                    {/* Confirm Password */}
                    <Input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        disabled={loading}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        required
                        iconLeft={<IoLockClosed className='w-5 h-5' />}
                    />

                    <div className='p-3 text-sm text-red-400 items-center gap-2 bg-red-950 rounded-md hidden'>
                        <IoInformationCircle />
                        <span>Something went wrong while signing up</span>
                    </div>

                    {/* Error */}
                    {
                        error.show &&
                        <div className="p-3 text-sm text-red-400 items-start gap-2 bg-red-950 rounded-md flex">
                            <IoInformationCircle className='w-5 h-5 mt-[1px]' />
                            <span>{error?.message} {error?.object?.[0]?.message ? `: ${error?.object?.[0]?.message}` : ''}</span>
                        </div>
                    }

                    {/* Sign Up Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`disabled:opacity-50 disabled:scale-100 disabled:cursor-default w-full flex bg-primary cursor-pointer items-center gap-2 justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all duration-300 transform hover:scale-105`}>
                            <span className={!loading ? 'opacity-0 invisible' : 'animate-spin'}><FiLoader /></span>
                            <span>Sign up</span>
                        </button>
                    </div>
                </form>

                <div className="mt-8 relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-neutral-700 to-transparent"></div>
                    </div>

                    <div className="relative flex justify-center">
                        <span className="px-2 text-sm bg-neutral-900 text-neutral-400">Or continue with</span>
                    </div>
                </div>

                {/* Google Sign Up (disabled for now) */}
                <div className="mt-6 opacity-70 pointer-events-none">
                    <a href="#" className="w-full inline-flex justify-center py-3 px-4 border rounded-lg shadow-sm bg-opacity-50 text-sm font-medium transition-colors duration-300 hover:bg-opacity-100 border-neutral-600">
                        <IoLogoGoogle className="h-5 w-5" />
                        <span className="ml-2">Sign up with Google</span>
                    </a>
                </div>

                {/* Already have an account */}
                <p className="mt-10 text-center text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium hover:underline text-primary">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
