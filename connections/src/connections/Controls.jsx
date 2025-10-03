import React from "react";
import Button from "../ui/Button";

export default function Controls({
  shuffleWords,
  checkAnswer,
  resetGame,
  startNewPuzzle,
  setShowLeaderboard,
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="secondary" onClick={shuffleWords}>
        단어 섞기
      </Button>
      <Button variant="secondary" onClick={checkAnswer}>
        정답 확인
      </Button>
      <Button variant="secondary" onClick={resetGame}>
        다시 도전하기
      </Button>
      <Button variant="primary" onClick={startNewPuzzle}>
        새로운 문제
      </Button>
      <Button variant="secondary" onClick={() => setShowLeaderboard(true)}>
        리더보드
      </Button>
    </div>
  );
}
