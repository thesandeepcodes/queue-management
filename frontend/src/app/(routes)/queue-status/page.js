"use client";

import React from "react";
import Link from "next/link";
import EstimatedTime from "@/components/queue/EstimatedTime";
import QueueStatusDisplay from "@/components/queue/QueueStatusDisplay";
import useFetch from "@/hooks/useFetch";

export default function QueueStatus() {
  const { data: queueData, loading, error } = useFetch("/api/queue-status"); // Replace with your actual API endpoint

  if (loading) return <p>Loading queue status...</p>;
  if (error) return <p>Error loading queue status: {error.message}</p>;
  if (!queueData) return <p>No queue data available.</p>;

  // Now you can use queueData to populate your components
  const { currentPosition, estimatedWaitTime, overallStatus } = queueData;

  return (
    <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Real-Time Queue Status
      </h1>

      <EstimatedTime estimatedTime={estimatedWaitTime} />

      <OverallQueueStatus
        queueLength={overallStatus?.queueLength || 0}
        nextTicket={overallStatus?.nextTicket}
        showViewMyTicketButton={true}
      />

      <QueueStatusDisplay />

      <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Your Ticket Status
        </h2>
        <p className="text-gray-600 mb-2">
          Your current position:{" "}
          <span className="font-bold text-blue-500">{currentPosition}</span>
        </p>
      </div>

      <div className="mt-4">
        <Link href="/" passHref>
          <span className="text-blue-500 hover:underline cursor-pointer">
            Back to Homepage
          </span>
        </Link>
      </div>
    </main>
  );
}
