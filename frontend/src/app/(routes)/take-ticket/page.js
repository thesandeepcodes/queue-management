"use client";

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function TakeTicket() {
  const [service, setService] = useState("");
  const [name, setName] = useState("");
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTakeTicket = async () => {
    if (!service) {
      setError("Please select a service.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // TODO: Replace with actual backend endpoint
      const res = await fetch("/api/queue/take", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ service, name }),
      });

      if (!res.ok) {
        throw new Error("Failed to take ticket. Please try again.");
      }

      const data = await res.json();

      setTicket(data);
    } catch (err) {
      setError("Failed to take ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Take a Ticket - ManageTheQueue</title>
        <meta name="description" content="Get a virtual ticket online." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
        <main className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-primary mb-6">
            Take a Virtual Ticket
          </h1>

          {ticket ? (
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-green-600">
                🎫 Ticket #{ticket.number}
              </h2>
              <p className="text-gray-700">Service: {ticket.serviceName}</p>
              <p className="text-sm text-gray-500">
                Estimated wait time: {ticket.estimatedTime} mins
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-left">
                <label
                  htmlFor="service"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Select Service:
                </label>
                <select
                  id="service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">-- Select a Service --</option>
                  <option value="general">General Inquiry</option>
                  <option value="appointment">Appointment</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mb-4 text-left">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Name (Optional):
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

              <button
                type="button"
                onClick={handleTakeTicket}
                disabled={loading}
                className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-6 rounded w-full transition"
              >
                {loading ? "Processing..." : "Get Ticket"}
              </button>
            </>
          )}
        </main>

        <div className="mt-4">
          <Link href="/" className="text-blue-500 hover:underline">
            ⬅️ Back to Homepage
          </Link>
        </div>

        <footer className="mt-12 text-sm text-gray-500">
          Powered by Your Awesome Team
        </footer>
      </div>
    </>
  );
}
