"use client";

import React, { createContext, useState } from "react";

export const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
  const [queueData, setQueueData] = useState(null); // Example state

  // Function to update queue data
  const updateQueueData = (newData) => {
    setQueueData(newData);
  };

  return (
    <QueueContext.Provider value={{ queueData, updateQueueData }}>
      {children}
    </QueueContext.Provider>
  );
};
