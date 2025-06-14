"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Welcome to <span className="text-blue-600">ManageTheQueue</span>
      </h1>
      <p className="text-gray-600 mb-8">
        Say goodbye to long lines! Get a virtual ticket and relax while we keep your spot.
      </p>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <button
          onClick={() => router.push("/ticket")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow"
        >
          🎫 Take a Virtual Ticket
        </button>
        <button
          onClick={() => router.push("/queue")}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow"
        >
          📊 View Queue Status
        </button>
      </div>

      <div className="text-center mt-8">
        <h3 className="text-xl font-semibold mb-2">Or Scan QR to Join Instantly</h3>
        <img
          src="/qr.png"
          alt="Scan QR Code"
          className="w-40 h-40 mx-auto"
        />
        <p className="text-sm text-gray-500 mt-2">Use your phone camera to jump the hassle.</p>
      </div>
    </main>
  );
}
