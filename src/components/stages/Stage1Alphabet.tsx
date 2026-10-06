import React, { useState } from 'react';
import { Volume2, Sparkles, Trophy, ArrowRight, ArrowLeft, CheckCircle2, RotateCcw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ALPHABET_DATA, AlphabetItem, CONFIDENCE_MESSAGES_CORRECT } from '../../data/words';
import { speakWord, playSoundCorrect, playSoundEncourage } from '../../utils/audio';

interface Stage1AlphabetProps {
  onComplete: (scoreGain: number) => void;
  onBackToBoard: () => void;
  onAddScore: (points: number) => void;
}

type TabMode = 'match' | 'write' | 'cards';

export const Stage1Alphabet: React.FC<Stage1AlphabetProps> = ({
  onComplete,
  onBackToBoard,
  onAddScore,
}) => {
  const [mode, setMode] = useState<TabMode>('match');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedInput, setTypedInput] = useState('');
  const [feedback, setFeedback] = useState('התאימו בין האות הגדולה לאות הקטנה המתאימה!');
  const [isAnswered, setIsAnswered] = useState(false);
  const [scoreEarned, setScoreEarned] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Pool of alphabet items for quiz
  const [quizItems] = useState<AlphabetItem[]>(() =>
    [...ALPHABET_DATA].sort(() => Math.random() - 0.5)
  );

  const currentItem = quizItems[currentIndex] || ALPHABET_DATA[0];

  // Generate 4 options (1 correct lowercase + 3 distractor lowercases)
  const [options, setOptions] = useState<string[]>(() => generateOptions(currentItem));

  function generateOptions(target: AlphabetItem): string[] {
    const distractors = ALPHABET_DATA.filter((a) => a.upper !== target.upper)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((a) => a.lower);
    return [target.lower, ...distractors].sort(() => Math.random() - 0.5);
  }

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    const isCorrect = opt === currentItem.lower;
    if (isCorrect) {
      playSoundCorrect();
      speakWord(currentItem.upper);
      onAddScore(20);
      setScoreEarned((prev) => prev + 20);
      setCorrectCount((prev) => prev + 1);

      const msg = CONFIDENCE_MESSAGES_CORRECT[Math.floor(Math.random() * CONFIDENCE_MESSAGES_CORRECT.length)];
      setFeedback(`${msg} ${currentItem.upper} מתאימה ל-${currentItem.lower}!`);

      if (correctCount + 1 >= 10 && !isFinished) {
        setTimeout(() => {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
          setIsFinished(true);
        }, 1200);
      }
    } else {
      playSoundEncourage();
      setFeedback(`לא הפעם! האות הגדולה ${currentItem.upper} נכתבת בקטנה כ-${currentItem.lower}.`);
    }
  };

  const handleCheckTyped = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnswered || !typedInput.trim()) return;
    setIsAnswered(true);

    const isCorrect = typedInput.trim().toLowerCase() === currentItem.lower;
    if (isCorrect) {
      playSoundCorrect();
      speakWord(currentItem.upper);
      onAddScore(25);
      setScoreEarned((prev) => prev + 25);
      setCorrectCount((prev) => prev + 1);
      setFeedback(`מצוין! כתבת במדויק: ${currentItem.upper} ⬅️ ${currentItem.lower}`);

      if (correctCount + 1 >= 10 && !isFinished) {
        setTimeout(() => {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
          setIsFinished(true);
        }, 1200);
      }
    } else {
      playSoundEncourage();
      setFeedback(`לא בדיוק, האות הקטנה של ${currentItem.upper} היא "${currentItem.lower}".`);
    }
  };

  const handleNext = () => {
    if (currentIndex < quizItems.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setOptions(generateOptions(quizItems[nextIdx]));
      setSelectedOption(null);
      setTypedInput('');
      setIsAnswered(false);
      setFeedback('איזו אות קטנה מתאימה לאות הגדולה המוצגת?');
    } else {
      setIsFinished(true);
    }
  };

  return (
    <div className="bg-white border-4 border-black rounded-[2rem] p-4 sm:p-8 max-w-3xl mx-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-3 border-black pb-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#FFD700] border-2 border-black px-3 py-0.5 rounded-full text-xs font-black shadow-[2px_2px_0px_0px_#000] mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>תחנה 1 • אותיות גדולות וקטנות</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black">
            כתיבה וזיהוי אותיות Capital & Lowercase
          </h2>
        </div>
        <button
          onClick={onBackToBoard}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border-2 border-black rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_#000] cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>חזרה למסלול</span>
        </button>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setMode('match'); setIsAnswered(false); setSelectedOption(null); }}
          className={`flex-1 py-2.5 px-3 rounded-xl border-2 border-black font-black text-xs sm:text-sm transition-all cursor-pointer ${
            mode === 'match'
              ? 'bg-[#4ECDC4] text-black shadow-[3px_3px_0px_0px_#000] -translate-y-0.5'
              : 'bg-gray-100 text-black/70 hover:bg-gray-200'
          }`}
        >
          🎯 התאמת אותיות
        </button>
        <button
          onClick={() => { setMode('write'); setIsAnswered(false); setTypedInput(''); }}
          className={`flex-1 py-2.5 px-3 rounded-xl border-2 border-black font-black text-xs sm:text-sm transition-all cursor-pointer ${
            mode === 'write'
              ? 'bg-[#FF8C42] text-white shadow-[3px_3px_0px_0px_#000] -translate-y-0.5'
              : 'bg-gray-100 text-black/70 hover:bg-gray-200'
          }`}
        >
          ✍️ כתיבת האות הקטנה
        </button>
        <button
          onClick={() => setMode('cards')}
          className={`flex-1 py-2.5 px-3 rounded-xl border-2 border-black font-black text-xs sm:text-sm transition-all cursor-pointer ${
            mode === 'cards'
              ? 'bg-[#FFD700] text-black shadow-[3px_3px_0px_0px_#000] -translate-y-0.5'
              : 'bg-gray-100 text-black/70 hover:bg-gray-200'
          }`}
        >
          🗂️ לוח כל האותיות (A-Z)
        </button>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between text-xs font-black text-black/70 mb-3 px-1">
        <span>התקדמות: {correctCount} תשובות נכונות (יעד: 10)</span>
        <span>נקודות: +{scoreEarned}</span>
      </div>
      <div className="w-full bg-gray-200 h-3 rounded-full border-2 border-black overflow-hidden mb-6">
        <div
          className="bg-[#4ECDC4] h-full transition-all duration-300"
          style={{ width: `${Math.min(100, (correctCount / 10) * 100)}%` }}
        />
      </div>

      {/* MODE 1: MATCHING */}
      {mode === 'match' && !isFinished && (
        <div className="space-y-6">
          <div className="bg-[#FFF9E6] border-3 border-black rounded-2xl p-6 text-center relative shadow-[4px_4px_0px_0px_#000]">
            <span className="text-xs font-black text-black/60 block mb-2">
              איזו אות קטנה (Lowercase) שייכת לאות הגדולה:
            </span>
            <div className="text-7xl sm:text-8xl font-black text-black font-english my-2 select-none">
              {currentItem.upper}
            </div>
            <button
              onClick={() => speakWord(currentItem.upper)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-gray-50 border-2 border-black text-xs font-black text-black shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>השמעת שם האות ({currentItem.name})</span>
            </button>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {options.map((opt) => {
              const isSelected = selectedOption === opt;
              const isTarget = opt === currentItem.lower;
              let btnClass = 'bg-white hover:bg-gray-50 border-black text-black';

              if (isAnswered) {
                if (isTarget) {
                  btnClass = 'bg-[#4ECDC4] border-black text-black font-black ring-4 ring-[#4ECDC4]/50';
                } else if (isSelected) {
                  btnClass = 'bg-red-200 border-red-600 text-red-900';
                } else {
                  btnClass = 'bg-gray-100 border-gray-300 text-gray-400 opacity-60';
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isAnswered}
                  className={`py-5 px-3 border-3 rounded-2xl text-4xl sm:text-5xl font-black font-english text-center transition-all shadow-[4px_4px_0px_0px_#000] cursor-pointer hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] ${btnClass}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next */}
          <div className="p-4 bg-gray-50 border-2 border-black rounded-xl text-center text-sm font-bold text-black flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>{feedback}</span>
            {isAnswered && (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-[#FFD700] hover:bg-[#ffcd00] border-2 border-black font-black rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_#000] cursor-pointer"
              >
                <span>לאות הבאה</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* MODE 2: TYPING / WRITING */}
      {mode === 'write' && !isFinished && (
        <div className="space-y-6">
          <div className="bg-[#FFF9E6] border-3 border-black rounded-2xl p-6 text-center relative shadow-[4px_4px_0px_0px_#000]">
            <span className="text-xs font-black text-black/60 block mb-2">
              כתבו במקלדת את האות הקטנה המתאימה (למשל: a, b, c):
            </span>
            <div className="text-7xl sm:text-8xl font-black text-black font-english my-2 select-none">
              {currentItem.upper}
            </div>
            <button
              onClick={() => speakWord(currentItem.upper)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-gray-50 border-2 border-black text-xs font-black text-black shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>השמעה</span>
            </button>
          </div>

          <form onSubmit={handleCheckTyped} className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <input
              type="text"
              maxLength={1}
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              disabled={isAnswered}
              placeholder="?"
              className="w-24 h-24 text-center text-5xl font-black font-english border-4 border-black rounded-2xl bg-white shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:ring-4 focus:ring-[#FFD700]"
              autoFocus
            />
            <button
              type="submit"
              disabled={isAnswered || !typedInput}
              className="px-6 py-4 bg-[#FF8C42] hover:bg-[#ff7b2b] text-white font-black text-base border-3 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] disabled:opacity-50 cursor-pointer"
            >
              בדיקת האות 🚀
            </button>
          </form>

          {/* Feedback & Next */}
          <div className="p-4 bg-gray-50 border-2 border-black rounded-xl text-center text-sm font-bold text-black flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>{feedback}</span>
            {isAnswered && (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-[#FFD700] hover:bg-[#ffcd00] border-2 border-black font-black rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_#000] cursor-pointer"
              >
                <span>לאות הבאה</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* MODE 3: ALL CARDS REFERENCE */}
      {mode === 'cards' && (
        <div className="space-y-4">
          <p className="text-xs sm:text-sm font-bold text-black/70 text-center">
            לחצו על כל כרטיס כדי לשמוע את הגיית האות ומילת דוגמה!
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-[460px] overflow-y-auto p-2">
            {ALPHABET_DATA.map((item) => (
              <div
                key={item.upper}
                onClick={() => speakWord(`${item.upper}, ${item.sampleWord}`)}
                className="bg-white border-2 border-black rounded-xl p-3 text-center shadow-[3px_3px_0px_0px_#000] hover:bg-[#FFF9E6] cursor-pointer transition-all hover:scale-105"
              >
                <div className="text-2xl font-black font-english text-black flex items-center justify-center gap-1">
                  <span className="text-[#4ECDC4]">{item.upper}</span>
                  <span className="text-gray-400 font-normal">/</span>
                  <span className="text-[#FF8C42]">{item.lower}</span>
                </div>
                <div className="text-[11px] font-black text-black/70 mt-1">
                  {item.name}
                </div>
                <div className="text-[10px] text-gray-500 font-english mt-0.5">
                  {item.sampleWord}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Finished Screen */}
      {isFinished && (
        <div className="text-center py-8 space-y-4 animate-in zoom-in-95">
          <div className="inline-flex p-4 bg-[#4ECDC4] border-3 border-black rounded-full shadow-[4px_4px_0px_0px_#000]">
            <Trophy className="w-12 h-12 text-black" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-black">
            כל הכבוד! סיימתם בהצלחה את תחנה 1! 🌟
          </h3>
          <p className="text-sm font-bold text-black/75 max-w-md mx-auto">
            אתם שולטים מעולה באותיות הגדולות והקטנות באנגלית. הרווחתם {scoreEarned} נקודות וכעת אתם מוכנים לעבור לתחנה הבאה!
          </p>
          <button
            onClick={() => onComplete(scoreEarned)}
            className="px-8 py-3.5 bg-[#FFD700] hover:bg-[#ffcd00] text-black border-3 border-black font-black rounded-2xl text-base shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
          >
            סיום תחנה 1 ומעבר לתחנה הבאה 🚀
          </button>
        </div>
      )}
    </div>
  );
};
