


import React, { useState, useEffect } from "react";

const NetworkStatusModal: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowModal(false); // network aate hi modal close
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowModal(true); // network disconnect → modal open
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // initial check
    if (!navigator.onLine) setShowModal(true);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
      <div className="max-w-sm p-8 text-center bg-white rounded-lg shadow-lg">
        <h2 className={`mb-4 ${isOnline ? "" : "text-red-600"}`}>
          {isOnline ? "Connected" : "You are offline!"}
        </h2>
        {!isOnline && <p>Please check your internet connection.</p>}
      </div>
    </div>
  );
};

export default NetworkStatusModal;
