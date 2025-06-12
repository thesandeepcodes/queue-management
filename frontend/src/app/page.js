"use client";

import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";

export default function Home() {
  return (
    <main className="relative z-20 flex flex-col items-center justify-center w-full flex-1 px-6 sm:px-20 py-16 text-center min-h-screen bg-gray-50">
      <h1 className="text-5xl font-extrabold text-slate-800 mb-6 tracking-tight leading-tight drop-shadow-sm">
        Welcome to <span className="text-indigo-600">ManageTheQueue</span>
      </h1>

      <p className="mt-3 text-base sm:text-lg text-gray-700 max-w-xl">
        Say goodbye to long lines! Get a virtual ticket and relax while we keep
        your spot.
      </p>

      {/* Buttons */}
      <div className="mt-10 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
        <Link href="/take-ticket" passHref>
          <button className="bg-blue-600 hover:bg-blue-700 transition duration-200 text-white font-semibold py-3 px-6 rounded-lg shadow-md">
            🎟️ Take a Virtual Ticket
          </button>
        </Link>

        <Link href="/queue-status" passHref>
          <button className="bg-green-600 hover:bg-green-700 transition duration-200 text-white font-semibold py-3 px-6 rounded-lg shadow-md">
            📊 View Queue Status
          </button>
        </Link>
      </div>

      {/* QR Code Section */}
      <div className="mt-16 flex flex-col items-center justify-center bg-white bg-opacity-80 p-6 rounded-xl backdrop-blur-lg shadow-xl">
        <h2 className="text-2xl font-semibold text-slate-700 mb-4">
          Or Scan QR to Join Instantly
        </h2>
        <QRCodeCanvas
          value="https://example.com/queue/join"
          size={200}
          level="H"
          aria-label="Join the queue by scanning QR"
          className="mb-4 bg-white p-2 rounded-md"
        />
        <p className="text-gray-600 text-sm">
          Use your phone camera to jump the hassle.
        </p>
      </div>

      {/* Features */}
      <ul className="mt-12 text-gray-700 space-y-2 max-w-xl text-sm list-disc text-left">
        <li>🔔 Stay informed with live position updates.</li>
        <li>📱 Receive notifications when your turn is near.</li>
        <li>🔁 Need to reschedule? Manage your slot online anytime.</li>
      </ul>
    </main>
  );
}
