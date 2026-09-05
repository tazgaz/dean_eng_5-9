import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VOCABULARY_WORDS, CONFIDENCE_MESSAGES_CORRECT } from '../../data/words';
import { WordItem } from '../../types';
import { playSoundBubble, playSoundCorrect, playSoundLadder, playSoundEncourage } from '../../utils/audio';

interface Stage3BubblePopperProps {
  onComplete: (scoreGain: number) => void;
  onBackToBoard: () => void;
  onAddScore: (points: number) => void;
}

interface Bubble {
  id: string;
  wordId: string;
  english: string;
  hebrew: string;
  emoji: string;
  color: string;
  isPopping: boolean;
  isWrong?: boolean;
}

const BUBBLE_BENTO_COLORS = [
  'bg-[#4ECDC4] text-black',
  'bg-[#FFD700] text-black',
  'bg-[#FF8C42] text-white',
  'bg-[#A29BFE] text-black',
  'bg-[#FF6B6B] text-white',
];

export const Stage3BubblePopper: React.FC<Stage3BubblePopperProps> = ({
  onComplete,
  onBackToBoard,
  onAddScore,
}) => {
  // All 16 vocabulary words shuffled in random order
  const [shuffledTargets, setShuffledTargets] = useState<WordItem[]>(() =>
    [...VOCABULARY_WORDS].sort(() => Math.random() - 0.5)
  );
  const [targetIndex, setTargetIndex] = useState(0);
  const [currentTarget, setCurrentTarget] = useState<WordItem>(VOCABULARY_WORDS[0]);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [feedback, setFeedback] = useState('מצאו ופוצצו את בועת הפועל המתאימה!');
  const [isFinished, setIsFinished] = useState(false);

  const TARGET_GOAL = shuffledTargets.length; // All 16 words

  // Setup round for a specific index in the randomized targets list
  const setupRoundForIndex = (index: number, targetsList: WordItem[]) => {
    const target = targetsList[index] || targetsList[0];
    setCurrentTarget(target);

    // Pick 4 other random words as distractors
    const others = VOCABULARY_WORDS.filter((w) => w.id !== target.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    const roundWords = [target, ...others].sort(() => Math.random() - 0.5);

    const newBubbles: Bubble[] = roundWords.map((w, idx) => ({
      id: `${w.id}-${Date.now()}-${idx}`,
      wordId: w.id,
      english: w.english,
      hebrew: w.hebrew,
      emoji: w.emoji,
      color: BUBBLE_BENTO_COLORS[idx % BUBBLE_BENTO_COLORS.length],
      isPopping: false,
      isWrong: false,
    }));

    setBubbles(newBubbles);
    setFeedback('מצאו ופוצצו את בועת הפועל המתאימה!');
  };

  useEffect(() => {
    const initialShuffled = [...VOCABULARY_WORDS].sort(() => Math.random() - 0.5);
    setShuffledTargets(initialShuffled);
    setTargetIndex(0);
    setPoppedCount(0);
    setupRoundForIndex(0, initialShuffled);
  }, []);

  const handleBubbleClick = (bubble: Bubble) => {
    if (bubble.isPopping) return;

    if (bubble.wordId === currentTarget.id) {
      // Correct!
      playSoundBubble();

      setBubbles((prev) =>
        prev.map((b) => (b.id === bubble.id ? { ...b, isPopping: true } : b))
      );

      playSoundCorrect();
      onAddScore(35);
      const newPopped = poppedCount + 1;
      setPoppedCount(newPopped);

      const compliment =
        CONFIDENCE_MESSAGES_CORRECT[Math.floor(Math.random() * CONFIDENCE_MESSAGES_CORRECT.length)];
      setFeedback(`${compliment} פוצצתם את הבועה הנכונה! 🎉`);

      if (newPopped >= TARGET_GOAL) {
        setTimeout(() => {
          playSoundLadder();
          confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
          setIsFinished(true);
        }, 800);
      } else {
        setTimeout(() => {
          setTargetIndex((prev) => {
            const nextIdx = prev + 1;
            setupRoundForIndex(nextIdx, shuffledTargets);
            return nextIdx;
          });
        }, 850);
      }
    } else {
      // Incorrect - DO NOT reveal translation spoiler!
      playSoundEncourage();
      setBubbles((prev) =>
        prev.map((b) => (b.id === bubble.id ? { ...b, isWrong: true } : b))
      );
      setTimeout(() => {
        setBubbles((prev) =>
          prev.map((b) => (b.id === bubble.id ? { ...b, isWrong: false } : b))
        );
      }, 500);
      setFeedback('לא הפעם! נסו לחפש בועה אחרת. 💪');
    }
  };

  const handleRestart = () => {
    const newShuffled = [...VOCABULARY_WORDS].sort(() => Math.random() - 0.5);
    setShuffledTargets(newShuffled);
    setTargetIndex(0);
    setPoppedCount(0);
    setIsFinished(false);
    setupRoundForIndex(0, newShuffled);
  };

  return (
    <div className="bg-white border-3 sm:border-4 border-black rounded-2xl sm:rounded-[2rem] p-3 sm:p-6 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in fade-in">
      <div className="absolute inset-0 bento-dot-bg opacity-10 pointer-events-none" />
      
      {/* Top Bento Header - Compact for Mobile */}
      <div className="relative z-10 flex items-center justify-between gap-2 pb-2.5 sm:pb-4 border-b-2 sm:border-b-3 border-black">
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-lg sm:text-2xl p-0.5 sm:p-1 bg-[#FF8C42] rounded-lg sm:rounded-xl border-2 border-black shadow-[1px_1px_0px_0px_#000]">
              🫧
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-black leading-tight">
              שלב 2: מפוצץ בועות המילים
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs font-bold text-black/70 mt-0.5 hidden xs:block">
            עוברים על כל 16 הפעלים בסדר אקראי: קראו את המשמעות ופוצצו את הבועה!
          </p>
        </div>

        <button
          onClick={onBackToBoard}
          className="flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#4ECDC4] hover:bg-[#3dbdb4] text-black text-xs font-black transition-all border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer shrink-0"
        >
          <ArrowRight className="w-3.5 h-3.5 text-black" />
          <span>למסלול</span>
        </button>
      </div>

      {/* Target Mission Bento Banner - Compact, No spoilers */}
      <div className="relative z-10 my-2.5 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#FF8C42] border-2 sm:border-3 border-black text-white shadow-[2.5px_2.5px_0px_0px_#000] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="text-3xl sm:text-4xl filter drop-shadow shrink-0">
            🎯
          </span>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs text-black bg-[#FFD700] border border-black font-black px-1.5 py-0.5 rounded-md shadow-[1px_1px_0px_0px_#000] inline-block mb-0.5">
              איפה הבועה שפירושה:
            </span>
            <div className="text-lg sm:text-2xl font-black text-white truncate">
              "{currentTarget.hebrew}"
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="bg-[#4ECDC4] border-2 border-black text-black px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-black shadow-[1.5px_1.5px_0px_0px_#000]">
            {poppedCount} / {TARGET_GOAL}
          </div>
        </div>
      </div>

      {/* Feedback Bento Strip */}
      <div className="relative z-10 mb-2.5 text-center text-xs sm:text-sm font-black text-black bg-[#FFF9E6] py-1.5 px-3 rounded-lg sm:rounded-xl border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000]">
        <Sparkles className="w-3.5 h-3.5 text-black inline mr-1" />
        {feedback}
      </div>

      {/* Mobile-Perfect Bubble Play Area - Guaranteed no clipping or collision */}
      {!isFinished && (
        <div
          className="relative w-full rounded-xl sm:rounded-[2rem] bg-[#FFF9E6] border-2 sm:border-4 border-black p-3 sm:p-5 overflow-hidden shadow-[3px_3px_0px_0px_#000] sm:shadow-[6px_6px_0px_0px_#000] select-none"
          id="bubble-stage-canvas"
        >
          <div className="absolute inset-0 bento-dot-bg opacity-15 pointer-events-none" />

          {/* Staggered Floating Bubbly Flex Grid */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 sm:gap-5 py-2">
            {bubbles.map((bubble, idx) => (
              <button
                key={bubble.id}
                onClick={() => handleBubbleClick(bubble)}
                disabled={bubble.isPopping}
                className={`w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 rounded-full ${
                  bubble.color
                } border-3 border-black shadow-[3px_3px_0px_0px_#000] flex flex-col items-center justify-center p-2 transition-all duration-200 cursor-pointer ${
                  bubble.isPopping
                    ? 'scale-125 opacity-0 pointer-events-none'
                    : bubble.isWrong
                    ? 'scale-95 animate-pulse bg-red-400 text-white'
                    : 'hover:scale-105 active:scale-95'
                } ${idx % 2 === 0 ? 'sm:-translate-y-1' : 'sm:translate-y-1'}`}
                id={`word-bubble-${bubble.wordId}`}
                title="לחצו לפיצוץ!"
              >
                <span className="font-english font-black text-lg xs:text-xl sm:text-2xl tracking-wide leading-tight">
                  {bubble.english}
                </span>
                <span className="text-[9px] sm:text-[10px] bg-black/15 text-current px-2 py-0.5 rounded-full mt-1.5 font-black">
                  💥 פוצץ!
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Completion Bento Banner */}
      {isFinished && (
        <div className="relative z-10 p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] bg-[#FFD700] border-3 sm:border-4 border-black text-black text-center shadow-[4px_4px_0px_0px_#000] sm:shadow-[6px_6px_0px_0px_#000] animate-in zoom-in-95">
          <Trophy className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 text-black filter drop-shadow animate-bounce" />
          <h3 className="text-xl sm:text-2xl font-black mb-1">
            מעולה! פוצצתם את כל 16 הפעלים! 🏆
          </h3>
          <p className="text-xs sm:text-sm font-bold text-black/80 max-w-md mx-auto mb-4">
            זיהיתם את כל 16 הפעלים בסדר אקראי בדיוק מושלם וצברתם ניקוד גבוה! מוכנים לעבור לשלב הבא: בונה המילים והאיות?
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => onComplete(250)}
              className="px-6 py-2.5 bg-[#4ECDC4] hover:bg-[#3dbdb4] text-black font-black border-2 sm:border-3 border-black rounded-xl text-xs sm:text-sm transition-all shadow-[2px_2px_0px_0px_#000] cursor-pointer"
            >
              המשך לשלב 3: בונה המילים והאיות! 🔤
            </button>
            <button
              onClick={handleRestart}
              className="px-4 py-2.5 bg-white hover:bg-gray-100 text-black font-black border-2 sm:border-3 border-black rounded-xl text-xs transition-colors shadow-[2px_2px_0px_0px_#000] cursor-pointer"
            >
              שחק שוב (סדר אקראי חדש) 🫧
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
