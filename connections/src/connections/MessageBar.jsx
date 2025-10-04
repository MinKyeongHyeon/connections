import React, { useEffect, useState } from "react";

export default function MessageBar({
  message,
  messageType,
  messageStyles,
  autoHide = true,
  duration = null,
}) {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    setVisible(!!message);
    if (message && autoHide) {
      const cssVal = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--toast-duration')) || 300;
      const ms = duration != null ? duration : cssVal;
      const t = setTimeout(() => setVisible(false), ms);
      return () => clearTimeout(t);
    }
  }, [message, autoHide, duration]);

  const classes = messageStyles[messageType] || messageStyles.info;

  // Always reserve the same height to avoid layout shift; animate translateY when showing/hiding
  return (
    <div className="h-16 sm:h-20">
      <div
        className={`transform transition-all duration-300 ease-out ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        role="status"
        aria-live="polite"
      >
        <div className={`px-4 py-3 border rounded-md ${classes} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <span className="text-xl">
              {messageType === 'success' ? '✅' : messageType === 'error' ? '❌' : messageType === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <span className="text-sm">{message}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
