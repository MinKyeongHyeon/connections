import React from "react";
import useGame from "../hooks/useGame";
import Timer from "./Timer";
import MessageBar from "./MessageBar";
import WordGrid from "./WordGrid";
import Controls from "./Controls";
import ResultDialog from "./ResultDialog";
import Leaderboard from "./Leaderboard";

export default function KoreanConnections() {
  const game = useGame();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-3 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6 text-white">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">같은 주제 찾기</h1>
                <p className="text-sm sm:text-base text-indigo-100">
                  16개의 단어를 4개씩 묶어보세요!
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => game.setShowLeaderboard(true)}
                  className="p-2 hover:bg-white/20 rounded-lg transition"
                  aria-label="리더보드"
                >
                  🏆
                </button>
                <button
                  onClick={() => game.setShowHelp?.(!game.showHelp)}
                  className="p-2 hover:bg-white/20 rounded-lg transition"
                  aria-label="도움말"
                >
                  ❔
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-xs sm:text-sm text-indigo-200">
                오늘의 문제 #{game.puzzles ? game.puzzles.length > 0 && new Date().getDay() : ""}
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-lg">
                <Timer timer={game.timer} formatTime={game.formatTime} />
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-8">
            <MessageBar
              message={game.message}
              messageType={game.messageType}
              messageStyles={game.messageStyles}
            />

            <div className="mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <div
                  className="text-sm font-semibold text-gray-700"
                  role="status"
                  aria-live="polite"
                >
                  남은 기회:{" "}
                  <span className="text-lg text-indigo-600">
                    {game.maxMistakes - game.mistakes}
                  </span>
                  개
                </div>
                <button
                  onClick={game.shuffleWords}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition text-sm font-medium text-indigo-700"
                  disabled={game.gameOver}
                  aria-label="단어 섞기"
                >
                  🔀 섞기
                </button>
              </div>

              <div
                className="flex gap-1 sm:gap-2"
                role="progressbar"
                aria-valuenow={game.mistakes}
                aria-valuemin="0"
                aria-valuemax={game.maxMistakes}
                aria-label="실수 횟수"
              >
                {[...Array(game.maxMistakes)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full transition-colors ${i < game.mistakes ? "bg-red-500" : "bg-gray-200"}`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2 mb-6" role="list" aria-label="해결된 카테고리">
              {game.solved.map((category, idx) => (
                <div
                  key={idx}
                  className={`${category.color} p-3 sm:p-4 rounded-xl shadow-md transform transition-all hover:scale-[1.02]`}
                  role="listitem"
                >
                  <div className="font-bold text-white mb-2 flex items-center gap-2 text-sm sm:text-base">
                    {category.name}
                  </div>
                  <div className="text-white text-xs sm:text-sm opacity-90">
                    {category.words.join(" · ")}
                  </div>
                </div>
              ))}
            </div>

            <WordGrid
              words={game.words}
              selected={game.selected}
              toggleWord={game.toggleWord}
              handleKeyDown={game.handleKeyDown}
              focusedIndex={game.focusedIndex}
              setFocusedIndex={game.setFocusedIndex}
            />

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={game.checkAnswer}
                disabled={game.selected.length !== 4 || game.gameOver}
                className={`flex-1 py-3 sm:py-4 rounded-xl font-bold transition-all text-sm sm:text-base ${game.selected.length === 4 && !game.gameOver ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-200 text-gray-400"}`}
                aria-label={`제출하기 (${game.selected.length}/4 선택됨)`}
              >
                제출하기 ({game.selected.length}/4)
              </button>
              <button
                onClick={() => game.setSelected?.([])}
                disabled={game.selected.length === 0 || game.gameOver}
                className="px-6 py-3 sm:py-4 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all disabled:opacity-50 text-sm sm:text-base"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>

      <ResultDialog
        open={game.showResultDialog}
        onClose={() => game.setShowResultDialog(false)}
        timer={game.timer}
        formatTime={game.formatTime}
        mistakes={game.mistakes}
        solvedCount={game.solved.length}
        total={game.todayPuzzle.categories.length}
        startNewPuzzle={game.startNewPuzzle}
        resetGame={game.resetGame}
      />

      <Leaderboard
        open={game.showLeaderboard}
        onClose={() => game.setShowLeaderboard(false)}
        leaderboard={game.leaderboard}
        formatTime={game.formatTime}
      />
    </div>
  );
}
