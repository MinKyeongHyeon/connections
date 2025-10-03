import React from 'react';
import Button from '../ui/Button';

export default function ResultDialog({ open, onClose, timer, formatTime, mistakes, solvedCount, total, startNewPuzzle, resetGame }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
      <div className="bg-white p-6 rounded-md w-full max-w-md animate-slideUp">
        <h3 className="text-lg font-semibold">결과</h3>
        <p className="mt-2">시간: <span className="font-mono">{formatTime(timer)}</span></p>
        <p className="mt-1">실수: {mistakes}</p>
        <p className="mt-1">찾은 카테고리: {solvedCount}/{total}</p>
        <div className="mt-4 flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => { resetGame(); onClose(); }}>다시 도전하기</Button>
          <Button variant="primary" onClick={() => { startNewPuzzle(); onClose(); }}>새로운 문제</Button>
        </div>
      </div>
    </div>
  );
}
