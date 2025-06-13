import React from 'react';

export default function EstimatedTime({ estimatedTime }) {
  if (!estimatedTime) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-yellow-50 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg mb-4 shadow-sm"
    >
      <strong className="font-semibold">Estimated Wait Time:</strong>
      <span className="ml-2">{estimatedTime}</span>
    </div>
  );
}
