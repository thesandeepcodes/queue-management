import React from 'react';

const EstimatedTime = ({ estimatedTime }) => {
  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4">
      <strong className="font-bold">Estimated Wait Time:</strong>
      <span className="block sm:inline ml-2">{estimatedTime}</span>
    </div>
  );
};

export default EstimatedTime;