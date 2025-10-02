import React from "react";

export default function Timer({ timer, formatTime }) {
  return (
    <div className="flex items-center space-x-2 text-sm text-gray-700">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-clock"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      <span className="font-mono">{formatTime(timer)}</span>
    </div>
  );
}
