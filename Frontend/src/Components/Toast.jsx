import React, { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-50">
      <div
        className={`px-5 py-3 rounded-lg shadow-lg text-white font-medium
        ${type === "success" ? "bg-green-600" : "bg-red-600"}`}
      >
        {message}
      </div>
    </div>
  );
}
