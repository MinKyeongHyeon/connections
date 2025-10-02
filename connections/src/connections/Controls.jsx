import React from "react";

export default function Controls({
  shuffleWords,
  checkAnswer,
  resetGame,
  startNewPuzzle,
  setShowLeaderboard,
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={shuffleWords} className="btn">
        단어 섞기
      </button>
      <button onClick={checkAnswer} className="btn">
        정답 확인
      </button>
      <button onClick={resetGame} className="btn">
        다시 도전하기
      </button>
      <button onClick={startNewPuzzle} className="btn">
        새로운 문제
      </button>
      <button onClick={() => setShowLeaderboard(true)} className="btn">
        리더보드
      </button>
    </div>
  );
}
