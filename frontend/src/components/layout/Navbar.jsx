"use client";

import Link from "next/link";
import Button from "../base/Button";

export default function Navbar() {
    return (
        <header className="bg-neutral-800/30 backdrop-blur backdrop-filter shadow-lg py-5 px-4 sm:px-8 fixed w-full z-20 top-0">
            <nav className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
                <Link href="/" className="flex items-center space-x-3 mb-4 sm:mb-0">
                    <span className="text-3xl font-extrabold text-white">
                        <span className="text-primary">Q'</span>Up
                    </span>
                </Link>

                <ul className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-10 text-[17px] font-medium">
                    <li><Link href="#home" className="hover:text-primary transition duration-300">Home</Link></li>
                    <li><Link href="#features" className="hover:text-primary transition duration-300">Features</Link></li>
                    <li><Link href="#how-it-works" className="hover:text-primary transition duration-300">How It Works</Link></li>
                    <li><Link href="#faq" className="hover:text-primary transition duration-300">FAQ</Link></li>
                    <li><Link href="/signup" className="hover:text-primary transition duration-300">Join Now</Link></li>
                </ul>

                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                    <Link href="/login">
                        <Button className="bg-transparent border-1 border-primary text-primary hover:bg-transparent">Login</Button>
                    </Link>

                    <Link href="/signup">
                        <Button className="border-1 border-primary">Sign Up</Button>
                    </Link>
                </div>
            </nav>
        </header>
    )
}