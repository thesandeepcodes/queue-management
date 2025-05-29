"use client";

import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function Reschedule() {
  const [ticketId, setTicketId] = useState("");
  const [newDateTime, setNewDateTime] = useState(""); // You might use a date/time picker component here

  const handleReschedule = () => {
    // Logic to send reschedule request to the backend
    console.log("Rescheduling ticket with ID:", ticketId, "to:", newDateTime);
    // You would typically use Axios or Fetch here
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <Head>
        <title>Reschedule - ManageTheQueue</title>
        <meta
          name="description"
          content="Reschedule your existing virtual ticket."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Reschedule Your Ticket
        </h1>

        <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-md">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="ticketId"
            >
              Ticket ID:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="ticketId"
              type="text"
              placeholder="Enter your ticket ID"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="newDateTime"
            >
              Select New Date and Time:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="newDateTime"
              type="datetime-local" // Consider using a more user-friendly date/time picker component
              value={newDateTime}
              onChange={(e) => setNewDateTime(e.target.value)}
            />
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleReschedule}
          >
            Reschedule Ticket
          </button>
        </div>

        <div className="mt-4">
          <Link href="/" passHref>
            <span className="text-blue-500 hover:underline cursor-pointer">
              Back to Homepage
            </span>
          </Link>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t bg-white mt-8">
        <p className="text-gray-500">Powered by Your Awesome Team</p>
      </footer>
    </div>
  );
}
