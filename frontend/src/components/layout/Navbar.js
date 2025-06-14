import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <span className="text-xl font-bold text-primary">ManageTheQueue</span>
        </Link>
        <nav className="space-x-4">
          <Link href="/take-ticket" className="text-gray-700 hover:text-primary">Take Ticket</Link>
          <Link href="/queue-status" className="text-gray-700 hover:text-primary">Queue Status</Link>
          <Link href="/reschedule" className="text-gray-700 hover:text-primary">Reschedule</Link>
          <Link href="/admin" className="text-gray-700 hover:text-primary">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
