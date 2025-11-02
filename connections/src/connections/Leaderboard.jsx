import React, { useEffect, useRef } from "react";
import Button from "../ui/Button";

export default function Leaderboard({ open, onClose, leaderboard, formatTime }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (open && modalRef.current) {
      const firstButton = modalRef.current.querySelector("button");
      if (firstButton) firstButton.focus();
    }
  }, [open]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-40"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="bg-white p-4 rounded-md w-full max-w-lg animate-slideUp"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="leaderboard-title"
      >
        <h3 id="leaderboard-title" className="text-lg font-semibold">
          리더보드
        </h3>
        <div className="mt-3 space-y-2">
          {leaderboard.length === 0 && <p>아직 기록이 없습니다.</p>}
          {leaderboard.map((item, i) => (
            <div key={i} className="flex justify-between">
              <div className="text-sm">{new Date(item.date).toLocaleString()}</div>
              <div className="text-sm">{item.won ? "클리어" : "실패"}</div>
              <div className="font-mono">{formatTime(item.time)}</div>
              <div className="text-sm">실수: {item.mistakes}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-right">
          <Button variant="secondary" onClick={onClose}>
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}
