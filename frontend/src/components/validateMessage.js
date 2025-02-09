import React from "react";

const ValidateMessage = ({ message, type = "info" }) => {
  if (!message) return null;

  const baseClasses = "px-3 py-2 mb-2 rounded text-sm border animate-slideIn";
  let typeClasses = "";

  switch (type) {
    case "success":
      typeClasses = "bg-green-100 text-green-800 border-green-300";
      break;
    case "error":
      typeClasses = "bg-red-100 text-red-800 border-red-300";
      break;
    case "warning":
      typeClasses = "bg-yellow-100 text-yellow-800 border-yellow-300";
      break;
    default: // info
      typeClasses = "bg-blue-100 text-blue-800 border-blue-300";
      break;
  }

  return <div className={`${baseClasses} ${typeClasses}`}>{message}</div>;
};

export default ValidateMessage;
