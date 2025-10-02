import React from "react";

export default function MessageBar({ message, messageType, messageStyles }) {
  if (!message) return <div className="h-16 sm:h-20" />;
  const classes = messageStyles[messageType] || messageStyles.info;
  return (
    <div
      className={`h-16 sm:h-20 px-4 py-3 border rounded-md ${classes} flex items-center`}
      role="status"
      aria-live="polite"
    >
      <span className="text-sm">{message}</span>
    </div>
  );
}
