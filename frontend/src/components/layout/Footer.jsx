import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-neutral-900 py-10 px-6 text-center text-gray-400 text-md mt-auto">
            <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center space-y-6 sm:space-y-0">
                <p>&copy; {new Date().getFullYear()} Q'up. All rights reserved.</p>
                <div className="flex flex-wrap justify-center space-x-6 sm:space-x-8">
                    <Link href="/signup" className="hover:text-primary transition duration-300">Login</Link>
                    <Link href="/signup" className="hover:text-primary transition duration-300">Create Account</Link>
                </div>
            </div>
        </footer>
    )
}