import { useEffect, useState } from "react";
import { puzzles } from "../data/puzzles";

export default function useGame() {
  const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

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
  const [focusedIndex, setFocusedIndex] = useState(0);

  // timer
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const [showResultDialog, setShowResultDialog] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  const maxMistakes = 4;

  useEffect(() => {
    let interval;
    if (isTimerRunning && !gameOver) {
      interval = setInterval(() => setTimer((p) => p + 10), 10);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, gameOver]);

  useEffect(() => {
    const saved = localStorage.getItem("connections-leaderboard");
    if (saved) setLeaderboard(JSON.parse(saved));
  }, []);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${centiseconds
      .toString()
      .padStart(2, "0")}`;
  };

  const startGame = () => {
    if (!gameStarted) {
      setGameStarted(true);
      setIsTimerRunning(true);
    }
  };

  const resetGame = (puzzleIndex = null) => {
    const idx = puzzleIndex ?? currentPuzzleIndex;
    const puzzle = puzzles[idx];
    const newWords = puzzle.categories.flatMap((c) => c.words);
    setWords([...newWords].sort(() => Math.random() - 0.5));
    setSelected([]);
    setSolved([]);
    setMistakes(0);
    setMessage("");
    setMessageType("info");
    setGameOver(false);
    setTimer(0);
    setIsTimerRunning(false);
    setGameStarted(false);
    setShowResultDialog(false);
    setFocusedIndex(0);
  };

  const startNewPuzzle = () => {
    const newIndex = (currentPuzzleIndex + 1) % puzzles.length;
    setCurrentPuzzleIndex(newIndex);
    resetGame(newIndex);
  };

  const shuffleWords = () => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setWords(shuffled);
    setSelected([]);
    setFocusedIndex(0);
  };

  const toggleWord = (word, index) => {
    startGame();
    setSelected((prev) =>
      prev.includes(word)
        ? prev.filter((w) => w !== word)
        : prev.length < 4
          ? [...prev, word]
          : prev
    );
    setFocusedIndex(index);
  };

  const saveToLeaderboard = (time, mistakesCount, won) => {
    const newEntry = {
      date: new Date().toISOString(),
      time,
      mistakes: mistakesCount,
      won,
      puzzleNumber: getDayOfYear(),
    };
    const updated = [...leaderboard, newEntry]
      .sort((a, b) => {
        if (a.won !== b.won) return b.won - a.won;
        if (a.won) return a.time - b.time;
        return a.mistakes - b.mistakes;
      })
      .slice(0, 10);
    setLeaderboard(updated);
    localStorage.setItem("connections-leaderboard", JSON.stringify(updated));
  };

  const checkAnswer = () => {
    if (selected.length !== 4) return;
    const category = todayPuzzle.categories.find((cat) =>
      selected.every((w) => cat.words.includes(w))
    );
    if (category) {
      setMessage(`정답! ${category.name} 카테고리를 찾았습니다!`);
      setMessageType("success");
      setSolved((s) => [...s, category]);
      setWords((ws) => ws.filter((w) => !category.words.includes(w)));
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
      const almost = todayPuzzle.categories.find(
        (cat) => selected.filter((w) => cat.words.includes(w)).length === 3
      );
      if (almost) {
        setMessage("아깝네요! 하나만 틀렸어요");
        setMessageType("warning");
      } else {
        setMessage("틀렸습니다! 다시 시도해보세요");
        setMessageType("error");
      }
      setMistakes((m) => m + 1);
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

  const handleKeyDown = (e, word) => {
    const currentIndex = words.indexOf(word);
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setSelected([]);
        break;
      case "ArrowRight":
        e.preventDefault();
        if (currentIndex < words.length - 1) setFocusedIndex(currentIndex + 1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (currentIndex > 0) setFocusedIndex(currentIndex - 1);
        break;
      case "ArrowDown":
        e.preventDefault();
        if (currentIndex + 4 < words.length) setFocusedIndex(currentIndex + 4);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (currentIndex - 4 >= 0) setFocusedIndex(currentIndex - 4);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        toggleWord(word, currentIndex);
        break;
      default:
        break;
    }
  };

  const shareResult = () => {
    const result = todayPuzzle.categories
      .map((cat) => (solved.some((s) => s.name === cat.name) ? "🟩" : "⬜"))
      .join("");
    const text = `한국어 커넥션 ${getDayOfYear()}번\n${result}\n실수: ${mistakes}/${maxMistakes}`;
    if (navigator.share) navigator.share({ text });
    else {
      navigator.clipboard.writeText(text);
      setMessage("결과가 클립보드에 복사되었습니다!");
      setMessageType("success");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const messageStyles = {
    success: "bg-green-50 border-green-300 text-green-800",
    error: "bg-red-50 border-red-300 text-red-800",
    warning: "bg-yellow-50 border-yellow-300 text-yellow-800",
    info: "bg-blue-50 border-blue-300 text-blue-800",
  };

  return {
    puzzles,
    todayPuzzle,
    currentPuzzleIndex,
    setCurrentPuzzleIndex,
    words,
    selected,
    solved,
    mistakes,
    message,
    messageType,
    gameOver,
    showResultDialog,
    setShowResultDialog,
    showLeaderboard,
    setShowLeaderboard,
    leaderboard,
    timer,
    isTimerRunning,
    focusedIndex,
    setFocusedIndex,
    maxMistakes,
    formatTime,
    startGame,
    resetGame,
    startNewPuzzle,
    shuffleWords,
    toggleWord,
    checkAnswer,
    handleKeyDown,
    shareResult,
    saveToLeaderboard,
    messageStyles,
  };
}
