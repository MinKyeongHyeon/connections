import React, { useState, useEffect } from "react";
import {
  Shuffle,
  Share2,
  Info,
  Star,
  Circle,
  Square,
  Triangle,
  Clock,
  Trophy,
  X,
} from "lucide-react";
import { puzzles } from "../data/puzzles";

const KoreanConnections = () => {
  const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  // 현재 퍼즐 인덱스 상태
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(getDayOfYear() % puzzles.length);
  const todayPuzzle = puzzles[currentPuzzleIndex];
  const allWords = todayPuzzle.categories.flatMap((cat) => cat.words);

  const [words, setWords] = useState([...allWords].sort(() => Math.random() - 0.5));
  const [selected, setSelected] = useState([]);
  const [solved, setSolved] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [gameOver, setGameOver] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);

  // 타이머 관련 상태
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // 결과 다이얼로그 상태
  const [showResultDialog, setShowResultDialog] = useState(false);

  // 리더보드 상태
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  const maxMistakes = 4;

  // 타이머 효과
  useEffect(() => {
    let interval;
    if (isTimerRunning && !gameOver) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 10); // 10ms 단위로 증가
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, gameOver]);

  // 로컬 스토리지에서 리더보드 불러오기
  useEffect(() => {
    const savedLeaderboard = localStorage.getItem("connections-leaderboard");
    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard));
    }
  }, []);

  // 게임 시작 (첫 단어 선택 시)
  const startGame = () => {
    if (!gameStarted) {
      setGameStarted(true);
      setIsTimerRunning(true);
    }
  };

  // 타이머 포맷 (00:00.00)
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
  };

  // 리더보드에 기록 추가
  const saveToLeaderboard = (time, mistakes, won) => {
    const newEntry = {
      date: new Date().toISOString(),
      time: time,
      mistakes: mistakes,
      won: won,
      puzzleNumber: getDayOfYear(),
    };

    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => {
        if (a.won !== b.won) return b.won - a.won; // 성공한 게임 우선
        if (a.won) return a.time - b.time; // 성공한 경우 시간 빠른 순
        return a.mistakes - b.mistakes; // 실패한 경우 실수 적은 순
      })
      .slice(0, 10); // 상위 10개만 유지

    setLeaderboard(updatedLeaderboard);
    localStorage.setItem("connections-leaderboard", JSON.stringify(updatedLeaderboard));
  };

  const getIcon = (iconType) => {
    const iconProps = { size: 16, className: "inline-block" };
    switch (iconType) {
      case "circle":
        return <Circle {...iconProps} />;
      case "square":
        return <Square {...iconProps} />;
      case "triangle":
        return <Triangle {...iconProps} />;
      case "star":
        return <Star {...iconProps} />;
      default:
        return null;
    }
  };

  // 게임 리셋 함수 (같은 문제)
  const resetGame = () => {
    const puzzle = puzzles[currentPuzzleIndex];
    const newWords = puzzle.categories.flatMap((cat) => cat.words);
    setWords([...newWords].sort(() => Math.random() - 0.5));
    setSelected([]);
    setSolved([]);
    setMistakes(0);
    setMessage("");
    setGameOver(false);
    setTimer(0);
    setIsTimerRunning(false);
    setGameStarted(false);
    setShowResultDialog(false);
    setFocusedIndex(0);
  };

  // 새 문제 시작
  const startNewPuzzle = () => {
    const newIndex = (currentPuzzleIndex + 1) % puzzles.length;
    setCurrentPuzzleIndex(newIndex);

    const puzzle = puzzles[newIndex];
    const newWords = puzzle.categories.flatMap((cat) => cat.words);
    setWords([...newWords].sort(() => Math.random() - 0.5));
    setSelected([]);
    setSolved([]);
    setMistakes(0);
    setMessage("");
    setGameOver(false);
    setTimer(0);
    setIsTimerRunning(false);
    setGameStarted(false);
    setShowResultDialog(false);
    setFocusedIndex(0);
  };

  const shuffleWords = () => {
    const remaining = words.filter((w) => !solved.flatMap((s) => s.words).includes(w));
    const shuffled = [...remaining].sort(() => Math.random() - 0.5);
    setWords(shuffled);
    setSelected([]);
    setFocusedIndex(0);
  };

  const toggleWord = (word, index) => {
    startGame(); // 첫 선택 시 게임 시작

    if (selected.includes(word)) {
      setSelected(selected.filter((w) => w !== word));
    } else if (selected.length < 4) {
      setSelected([...selected, word]);
    }
    setFocusedIndex(index);
  };

  const checkAnswer = () => {
    if (selected.length !== 4) return;

    const category = todayPuzzle.categories.find(
      (cat) =>
        selected.every((word) => cat.words.includes(word)) && selected.length === cat.words.length
    );

    if (category) {
      setMessage(`정답! ${category.name} 카테고리를 찾았습니다!`);
      setMessageType("success");
      setSolved([...solved, category]);
      setWords(words.filter((w) => !category.words.includes(w)));
      setSelected([]);

      if (solved.length + 1 === todayPuzzle.categories.length) {
        setGameOver(true);
        setIsTimerRunning(false);
        setMessage("축하합니다! 모든 카테고리를 찾았습니다!");
        setMessageType("success");
        saveToLeaderboard(timer, mistakes, true);
        setTimeout(() => setShowResultDialog(true), 500);
      }
    } else {
      const almostCorrect = todayPuzzle.categories.find((cat) => {
        const matches = selected.filter((word) => cat.words.includes(word));
        return matches.length === 3;
      });

      if (almostCorrect) {
        setMessage("아깝네요! 하나만 틀렸어요");
        setMessageType("warning");
      } else {
        setMessage("틀렸습니다! 다시 시도해보세요");
        setMessageType("error");
      }

      setMistakes(mistakes + 1);
      setSelected([]);

      if (mistakes + 1 >= maxMistakes) {
        setGameOver(true);
        setIsTimerRunning(false);
        setMessage("게임 오버! 내일 다시 도전해보세요");
        setMessageType("error");
        saveToLeaderboard(timer, mistakes + 1, false);
        setTimeout(() => setShowResultDialog(true), 500);
      }
    }

    setTimeout(() => setMessage(""), 3000);
  };

  const shareResult = () => {
    const result = todayPuzzle.categories
      .map((cat) => {
        const isSolved = solved.some((s) => s.name === cat.name);
        return isSolved ? "🟩" : "⬜";
      })
      .join("");

    const text = `한국어 커넥션 ${getDayOfYear()}번\n${result}\n실수: ${mistakes}/${maxMistakes}`;

    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      setMessage("결과가 클립보드에 복사되었습니다!");
      setMessageType("success");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const handleKeyDown = (e, word, index) => {
    const currentIndex = words.indexOf(word);

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        if (currentIndex < words.length - 1) {
          setFocusedIndex(currentIndex + 1);
        }
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (currentIndex > 0) {
          setFocusedIndex(currentIndex - 1);
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (currentIndex + 4 < words.length) {
          setFocusedIndex(currentIndex + 4);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (currentIndex - 4 >= 0) {
          setFocusedIndex(currentIndex - 4);
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        toggleWord(word, currentIndex);
        break;
    }
  };

  const messageStyles = {
    success: "bg-green-50 border-green-300 text-green-800",
    error: "bg-red-50 border-red-300 text-red-800",
    warning: "bg-yellow-50 border-yellow-300 text-yellow-800",
    info: "bg-blue-50 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-3 sm:p-6">
      <div className="max-w-3xl mx-auto">
        {/* AdSense 영역 - 상단 */}
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 h-20 sm:h-24 mb-4 sm:mb-6 flex items-center justify-center text-gray-400 text-xs sm:text-sm rounded-lg">
          [Google AdSense - 상단 배너 728x90 또는 320x50]
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* 헤더 */}
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
                  onClick={() => setShowLeaderboard(true)}
                  className="p-2 hover:bg-white/20 rounded-lg transition"
                  aria-label="리더보드"
                >
                  <Trophy size={24} />
                </button>
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className="p-2 hover:bg-white/20 rounded-lg transition"
                  aria-label="도움말 토글"
                >
                  <Info size={24} />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-xs sm:text-sm text-indigo-200">
                오늘의 문제 #{getDayOfYear()}
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-lg">
                <Clock size={16} />
                <span className="font-mono font-bold">{formatTime(timer)}</span>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-8">
            {/* 도움말 */}
            {showHelp && (
              <div
                className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl"
                role="region"
                aria-label="게임 방법"
              >
                <h3 className="font-bold text-indigo-900 mb-3 text-sm sm:text-base">게임 방법</h3>
                <ul className="text-xs sm:text-sm text-indigo-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">1.</span>
                    <span>16개의 단어를 공통점이 있는 4개씩 묶어보세요</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">2.</span>
                    <span>4개를 선택한 후 제출하기 버튼을 누르세요</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">3.</span>
                    <span>4번 틀리면 게임이 종료됩니다</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">난이도:</span>
                    <span className="flex flex-wrap gap-2">
                      <span className="flex items-center gap-1">
                        <Circle size={14} /> 쉬움
                      </span>
                      <span className="flex items-center gap-1">
                        <Square size={14} /> 보통
                      </span>
                      <span className="flex items-center gap-1">
                        <Triangle size={14} /> 어려움
                      </span>
                      <span className="flex items-center gap-1">
                        <Star size={14} /> 매우어려움
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">키보드:</span>
                    <span>화살표 키로 이동, Enter/Space로 선택</span>
                  </li>
                </ul>
              </div>
            )}

            {/* 상태 표시 */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <div
                  className="text-sm font-semibold text-gray-700"
                  role="status"
                  aria-live="polite"
                >
                  남은 기회:{" "}
                  <span className="text-lg text-indigo-600">{maxMistakes - mistakes}</span>개
                </div>
                <button
                  onClick={shuffleWords}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition text-sm font-medium text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={gameOver}
                  aria-label="단어 섞기"
                >
                  <Shuffle size={16} />
                  <span className="hidden sm:inline">섞기</span>
                </button>
              </div>

              {/* 실수 표시 바 */}
              <div
                className="flex gap-1 sm:gap-2"
                role="progressbar"
                aria-valuenow={mistakes}
                aria-valuemin="0"
                aria-valuemax={maxMistakes}
                aria-label="실수 횟수"
              >
                {[...Array(maxMistakes)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full transition-colors ${
                      i < mistakes ? "bg-red-500" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* 메시지 - 고정 높이 */}
            <div className="mb-4 h-16 sm:h-20 flex items-center justify-center">
              {message && (
                <div
                  className={`w-full p-3 sm:p-4 border-2 rounded-xl text-center font-semibold text-sm sm:text-base ${messageStyles[messageType]} animate-pulse`}
                  role="alert"
                  aria-live="assertive"
                >
                  {message}
                </div>
              )}
            </div>

            {/* 해결된 카테고리 */}
            <div className="space-y-2 mb-6" role="list" aria-label="해결된 카테고리">
              {solved.map((category, idx) => (
                <div
                  key={idx}
                  className={`${category.color} p-3 sm:p-4 rounded-xl shadow-md transform transition-all hover:scale-[1.02]`}
                  role="listitem"
                >
                  <div className="font-bold text-white mb-2 flex items-center gap-2 text-sm sm:text-base">
                    {getIcon(category.icon)}
                    {category.name}
                  </div>
                  <div className="text-white text-xs sm:text-sm opacity-90">
                    {category.words.join(" · ")}
                  </div>
                </div>
              ))}
            </div>

            {/* 단어 그리드 */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6"
              role="grid"
              aria-label="단어 선택 영역"
            >
              {words.map((word, idx) => (
                <button
                  key={word}
                  onClick={() => toggleWord(word, idx)}
                  onKeyDown={(e) => handleKeyDown(e, word, idx)}
                  disabled={gameOver}
                  tabIndex={focusedIndex === idx ? 0 : -1}
                  className={`
                    p-3 sm:p-4 rounded-xl font-semibold transition-all text-sm sm:text-base
                    focus:outline-none focus:ring-4 focus:ring-indigo-300
                    ${
                      selected.includes(word)
                        ? "bg-indigo-600 text-white scale-95 shadow-lg"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-800 shadow-sm hover:shadow-md"
                    }
                    ${gameOver ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-90"}
                    min-h-[60px] sm:min-h-[80px] flex items-center justify-center
                  `}
                  role="gridcell"
                  aria-pressed={selected.includes(word)}
                  aria-label={`${word} ${selected.includes(word) ? "선택됨" : ""}`}
                >
                  {word}
                </button>
              ))}
            </div>

            {/* 버튼 그룹 */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={checkAnswer}
                disabled={selected.length !== 4 || gameOver}
                className={`
                  flex-1 py-3 sm:py-4 rounded-xl font-bold transition-all text-sm sm:text-base
                  focus:outline-none focus:ring-4 focus:ring-blue-300
                  ${
                    selected.length === 4 && !gameOver
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }
                `}
                aria-label={`제출하기 (${selected.length}/4 선택됨)`}
              >
                제출하기 ({selected.length}/4)
              </button>
              <button
                onClick={() => setSelected([])}
                disabled={selected.length === 0 || gameOver}
                className="px-6 py-3 sm:py-4 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all disabled:opacity-50 text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-gray-300"
                aria-label="선택 취소"
              >
                취소
              </button>
            </div>

            {/* 게임 오버 버튼들 */}
            {gameOver && (
              <div className="space-y-3 mt-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={resetGame}
                    className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-indigo-300"
                    aria-label="다시 도전하기"
                  >
                    🔄 다시 도전하기
                  </button>
                  <button
                    onClick={startNewPuzzle}
                    className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-blue-300"
                    aria-label="새로운 문제 도전하기"
                  >
                    ✨ 새로운 문제
                  </button>
                </div>
                <button
                  onClick={shareResult}
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-green-300"
                  aria-label="결과 공유하기"
                >
                  <Share2 size={20} />
                  결과 공유하기
                </button>
              </div>
            )}
          </div>
        </div>

        {/* AdSense 영역 - 하단 */}
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 h-20 sm:h-24 mt-4 sm:mt-6 flex items-center justify-center text-gray-400 text-xs sm:text-sm rounded-lg">
          [Google AdSense - 하단 배너 728x90 또는 320x50]
        </div>

        {/* 푸터 */}
        <div className="text-center mt-6 text-xs sm:text-sm text-gray-600 space-y-1">
          <p>매일 자정에 새로운 문제가 업데이트됩니다!</p>
          <p className="text-gray-500">문제 아이디어 제보: manemin2@gmail.com</p>
        </div>
      </div>

      {/* 결과 다이얼로그 */}
      {showResultDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-slideUp">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {solved.length === todayPuzzle.categories.length
                  ? "🎉 축하합니다!"
                  : "😢 아쉽네요!"}
              </h2>
              <button
                onClick={() => setShowResultDialog(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-indigo-600">{formatTime(timer)}</div>
                    <div className="text-sm text-gray-600 mt-1">걸린 시간</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600">
                      {mistakes}/{maxMistakes}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">실수 횟수</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">카테고리</h3>
                {todayPuzzle.categories.map((category, idx) => {
                  const isSolved = solved.some((s) => s.name === category.name);
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg ${isSolved ? category.color : "bg-gray-100"}`}
                    >
                      <div
                        className={`font-semibold ${isSolved ? "text-white" : "text-gray-400"} flex items-center gap-2`}
                      >
                        {getIcon(category.icon)}
                        {category.name}
                      </div>
                      <div
                        className={`text-sm mt-1 ${isSolved ? "text-white/90" : "text-gray-400"}`}
                      >
                        {category.words.join(" · ")}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <button
                    onClick={resetGame}
                    className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all shadow-lg"
                  >
                    🔄 다시 도전
                  </button>
                  <button
                    onClick={startNewPuzzle}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl font-bold transition-all shadow-lg"
                  >
                    ✨ 새 문제
                  </button>
                </div>
                <button
                  onClick={shareResult}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <Share2 size={20} />
                  결과 공유하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 리더보드 모달 */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[80vh] overflow-y-auto animate-slideUp">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2">
                <Trophy className="text-yellow-500" size={28} />
                <h2 className="text-2xl font-bold text-gray-900">리더보드</h2>
              </div>
              <button
                onClick={() => setShowLeaderboard(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            {leaderboard.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Trophy size={48} className="mx-auto mb-4 opacity-20" />
                <p>아직 기록이 없습니다.</p>
                <p className="text-sm mt-2">첫 번째 기록을 남겨보세요!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((entry, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      idx === 0
                        ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300"
                        : idx === 1
                          ? "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300"
                          : idx === 2
                            ? "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-300"
                            : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            idx === 0
                              ? "bg-yellow-400 text-white"
                              : idx === 1
                                ? "bg-gray-400 text-white"
                                : idx === 2
                                  ? "bg-orange-400 text-white"
                                  : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-mono font-bold text-lg">
                            {formatTime(entry.time)}
                          </div>
                          <div className="text-sm text-gray-600">
                            문제 #{entry.puzzleNumber} · 실수 {entry.mistakes}회
                            {entry.won ? " · ✅ 성공" : " · ❌ 실패"}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(entry.date).toLocaleDateString("ko-KR", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default KoreanConnections;
