import React, { useState, useEffect } from "react";
import {
  Shuffle,
  Share2,
  Info,
  Star,
  Circle,
  Square,
  Triangle,
} from "lucide-react";

const KoreanConnections = () => {
  const puzzles = [
    {
      categories: [
        {
          name: "발효식품",
          words: ["김치", "된장", "청국장", "고추장"],
          difficulty: "easy",
          color: "bg-yellow-400",
          icon: "circle",
        },
        {
          name: "광역시",
          words: ["서울", "부산", "대구", "인천"],
          difficulty: "medium",
          color: "bg-green-400",
          icon: "square",
        },
        {
          name: "카페 메뉴",
          words: ["아메리카노", "카페라떼", "카푸치노", "에스프레소"],
          difficulty: "hard",
          color: "bg-blue-400",
          icon: "triangle",
        },
        {
          name: "___당",
          words: ["국회", "찜질", "당구", "노래"],
          difficulty: "expert",
          color: "bg-purple-400",
          icon: "star",
        },
      ],
    },
    {
      categories: [
        {
          name: "과일",
          words: ["사과", "배", "포도", "수박"],
          difficulty: "easy",
          color: "bg-yellow-400",
          icon: "circle",
        },
        {
          name: "지하철 호선",
          words: ["일호선", "이호선", "삼호선", "사호선"],
          difficulty: "medium",
          color: "bg-green-400",
          icon: "square",
        },
        {
          name: "편의점",
          words: ["세븐일레븐", "CU", "GS25", "이마트24"],
          difficulty: "hard",
          color: "bg-blue-400",
          icon: "triangle",
        },
        {
          name: "___맨",
          words: ["슈퍼", "아이언", "배트", "스파이더"],
          difficulty: "expert",
          color: "bg-purple-400",
          icon: "star",
        },
      ],
    },
    {
      categories: [
        {
          name: "계절",
          words: ["봄", "여름", "가을", "겨울"],
          difficulty: "easy",
          color: "bg-yellow-400",
          icon: "circle",
        },
        {
          name: "한국 대학",
          words: ["서울대", "연세대", "고려대", "카이스트"],
          difficulty: "medium",
          color: "bg-green-400",
          icon: "square",
        },
        {
          name: "배달앱",
          words: ["배달의민족", "쿠팡이츠", "요기요", "땡겨요"],
          difficulty: "hard",
          color: "bg-blue-400",
          icon: "triangle",
        },
        {
          name: "___방",
          words: ["PC", "노래", "찜질", "코인"],
          difficulty: "expert",
          color: "bg-purple-400",
          icon: "star",
        },
      ],
    },
  ];

  const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  const todayPuzzle = puzzles[getDayOfYear() % puzzles.length];
  const allWords = todayPuzzle.categories.flatMap((cat) => cat.words);

  const [words, setWords] = useState(
    [...allWords].sort(() => Math.random() - 0.5)
  );
  const [selected, setSelected] = useState([]);
  const [solved, setSolved] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [gameOver, setGameOver] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const maxMistakes = 4;

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

  const shuffleWords = () => {
    const remaining = words.filter(
      (w) => !solved.flatMap((s) => s.words).includes(w)
    );
    const shuffled = [...remaining].sort(() => Math.random() - 0.5);
    setWords([...solved.flatMap((s) => s.words), ...shuffled]);
    setSelected([]);
    setFocusedIndex(0);
  };

  const toggleWord = (word, index) => {
    if (solved.flatMap((s) => s.words).includes(word)) return;

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
        selected.every((word) => cat.words.includes(word)) &&
        selected.length === cat.words.length
    );

    if (category) {
      setMessage(`정답! ${category.name} 카테고리를 찾았습니다!`);
      setMessageType("success");
      setSolved([...solved, category]);
      setSelected([]);

      if (solved.length + 1 === todayPuzzle.categories.length) {
        setGameOver(true);
        setMessage("축하합니다! 모든 카테고리를 찾았습니다!");
        setMessageType("success");
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
        setMessage("게임 오버! 내일 다시 도전해보세요");
        setMessageType("error");
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
    const remaining = words.filter(
      (w) => !solved.flatMap((s) => s.words).includes(w)
    );
    const currentIndex = remaining.indexOf(word);

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        if (currentIndex < remaining.length - 1) {
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
        if (currentIndex + 4 < remaining.length) {
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
                <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">
                  한국어 커넥션
                </h1>
                <p className="text-sm sm:text-base text-indigo-100">
                  16개의 단어를 4개씩 묶어보세요!
                </p>
              </div>
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="p-2 hover:bg-white/20 rounded-lg transition"
                aria-label="도움말 토글"
              >
                <Info size={24} />
              </button>
            </div>
            <div className="text-xs sm:text-sm text-indigo-200">
              오늘의 문제 #{getDayOfYear()}
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
                <h3 className="font-bold text-indigo-900 mb-3 text-sm sm:text-base">
                  게임 방법
                </h3>
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
                  <span className="text-lg text-indigo-600">
                    {maxMistakes - mistakes}
                  </span>
                  개
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

            {/* 메시지 */}
            {message && (
              <div
                className={`mb-4 p-3 sm:p-4 border-2 rounded-xl text-center font-semibold text-sm sm:text-base ${messageStyles[messageType]} animate-pulse`}
                role="alert"
                aria-live="assertive"
              >
                {message}
              </div>
            )}

            {/* 해결된 카테고리 */}
            <div
              className="space-y-2 mb-6"
              role="list"
              aria-label="해결된 카테고리"
            >
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
              {words
                .filter((w) => !solved.flatMap((s) => s.words).includes(w))
                .map((word, idx) => (
                  <button
                    key={idx}
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
                    ${
                      gameOver
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer active:scale-90"
                    }
                    min-h-[60px] sm:min-h-[80px] flex items-center justify-center
                  `}
                    role="gridcell"
                    aria-pressed={selected.includes(word)}
                    aria-label={`${word} ${
                      selected.includes(word) ? "선택됨" : ""
                    }`}
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

            {/* 공유 버튼 */}
            {gameOver && (
              <button
                onClick={shareResult}
                className="w-full mt-4 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-green-300"
                aria-label="결과 공유하기"
              >
                <Share2 size={20} />
                결과 공유하기
              </button>
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
          <p className="text-gray-500">
            문제 아이디어 제보: contact@example.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default KoreanConnections;
