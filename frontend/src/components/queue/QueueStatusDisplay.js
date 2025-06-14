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
    <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Current Queue Status Breakdown</h2>
      <ul>
        {Object.entries(serviceQueueCounts).map(([service, count]) => (
          <li key={service} className="py-2">
            <span className="font-semibold">{service}:</span> {count} people waiting
          </li>
        ))}
      </ul>
      {/* You can add more detailed information or UI elements here, such as estimated wait times per service */}
    </div>
  );
};

export default QueueStatusDisplay;
