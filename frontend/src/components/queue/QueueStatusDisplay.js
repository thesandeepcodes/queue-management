import React from 'react';

const QueueStatusDisplay = () => {
  // Placeholder data for the number of people waiting for different services
  const serviceQueueCounts = {
    'General Inquiry': 12,
    'Appointment': 5,
    'Document Submission': 8,
    'Other': 3,
  };

  return (
    <div className="bg-white shadow-md rounded-xl px-6 py-6 mb-6 w-full max-w-md border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        📊 Queue Status Breakdown
      </h2>
      <ul className="space-y-3">
        {Object.entries(serviceQueueCounts).map(([service, count]) => (
          <li
            key={service}
            className="flex justify-between items-center text-gray-700"
          >
            <span className="font-medium">{service}</span>
            <span className="font-semibold">{count} waiting</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QueueStatusDisplay;
