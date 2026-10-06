import React, { useState } from 'react';
import { Volume2, Sparkles, Trophy, ArrowRight, ArrowLeft, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VOCABULARY_WORDS, FIRST_LETTER_ITEMS, FirstLetterItem, CONFIDENCE_MESSAGES_CORRECT } from '../../data/words';
import { speakWord, speakSentence, playSoundCorrect, playSoundEncourage } from '../../utils/audio';

interface Stage2VocabularyFirstLetterProps {
  onComplete: (scoreGain: number) => void;
  onBackToBoard: () => void;
  onAddScore: (points: number) => void;
}

type TabMode = 'firstLetter' | 'wordBank';

export const Stage2VocabularyFirstLetter: React.FC<Stage2VocabularyFirstLetterProps> = ({
  onComplete,
  onBackToBoard,
  onAddScore,
}) => {
  const [tab, setTab] = useState<TabMode>('firstLetter');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedLetter, setTypedLetter] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState('זהו את האות הפותחת של התמונה והמילה!');
  const [correctCount, setCorrectCount] = useState(0);
  const [scoreEarned, setScoreEarned] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const [items] = useState<FirstLetterItem[]>(() =>
    [...FIRST_LETTER_ITEMS].sort(() => Math.random() - 0.5)
  );

  const currentItem = items[currentIndex] || FIRST_LETTER_ITEMS[0];

  // Generate 4 candidate letters
  const [letterOptions, setLetterOptions] = useState<string[]>(() =>
    generateLetterOptions(currentItem.firstLetter)
  );

  function generateLetterOptions(targetLetter: string): string[] {
    const lettersPool = ['F', 'C', 'D', 'P', 'B', 'H', 'T', 'M', 'S', 'W', 'L', 'R', 'G', 'K'];
    const distractors = lettersPool
      .filter((l) => l !== targetLetter)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    return [targetLetter, ...distractors].sort(() => Math.random() - 0.5);
  }

  const handleSelectLetter = (letter: string) => {
    if (isAnswered) return;
    setSelectedLetter(letter);
    setIsAnswered(true);

    const isCorrect = letter.toUpperCase() === currentItem.firstLetter.toUpperCase();

    if (isCorrect) {
      playSoundCorrect();
      speakWord(currentItem.word);
      onAddScore(25);
      setScoreEarned((prev) => prev + 25);
      setCorrectCount((prev) => prev + 1);

      const msg = CONFIDENCE_MESSAGES_CORRECT[Math.floor(Math.random() * CONFIDENCE_MESSAGES_CORRECT.length)];
      setFeedback(`${msg} המילה ${currentItem.word} מתחילה באות ${currentItem.firstLetter}!`);

      if (correctCount + 1 >= 8 && !isFinished) {
        setTimeout(() => {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
          setIsFinished(true);
        }, 1200);
      }
    } else {
      playSoundEncourage();
      setFeedback(`לא הפעם! המילה ${currentItem.word} מתחילה באות ${currentItem.firstLetter}.`);
    }
  };

  const handleTypeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnswered || !typedLetter.trim()) return;
    setIsAnswered(true);

    const isCorrect = typedLetter.trim().toUpperCase() === currentItem.firstLetter.toUpperCase();

    if (isCorrect) {
      playSoundCorrect();
      speakWord(currentItem.word);
      onAddScore(30);
      setScoreEarned((prev) => prev + 30);
      setCorrectCount((prev) => prev + 1);
      setFeedback(`בול בפוני! כתבת ${currentItem.firstLetter} עבור ${currentItem.word}!`);

      if (correctCount + 1 >= 8 && !isFinished) {
        setTimeout(() => {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
          setIsFinished(true);
        }, 1200);
      }
    } else {
      playSoundEncourage();
      setFeedback(`לא נורא! האות הפותחת של ${currentItem.word} היא ${currentItem.firstLetter}.`);
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setLetterOptions(generateLetterOptions(items[nextIdx].firstLetter));
      setSelectedLetter(null);
      setTypedLetter('');
      setIsAnswered(false);
      setFeedback('איזו אות פותחת את התמונה המוצגת?');
    } else {
      setIsFinished(true);
    }
  };

  return (
    <div className="bg-white border-4 border-black rounded-[2rem] p-4 sm:p-8 max-w-3xl mx-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-3 border-black pb-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#4ECDC4] border-2 border-black px-3 py-0.5 rounded-full text-xs font-black shadow-[2px_2px_0px_0px_#000] mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>תחנה 2 • אוצר מילים ואות פותחת</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black">
            כתיבת אות פותחת לתמונה & אוצר מילים
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

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('firstLetter')}
          className={`flex-1 py-2.5 px-3 rounded-xl border-2 border-black font-black text-xs sm:text-sm transition-all cursor-pointer ${
            tab === 'firstLetter'
              ? 'bg-[#FFD700] text-black shadow-[3px_3px_0px_0px_#000] -translate-y-0.5'
              : 'bg-gray-100 text-black/70 hover:bg-gray-200'
          }`}
        >
          🖼️ תרגול אות פותחת לתמונה
        </button>
        <button
          onClick={() => setTab('wordBank')}
          className={`flex-1 py-2.5 px-3 rounded-xl border-2 border-black font-black text-xs sm:text-sm transition-all cursor-pointer ${
            tab === 'wordBank'
              ? 'bg-[#4ECDC4] text-black shadow-[3px_3px_0px_0px_#000] -translate-y-0.5'
              : 'bg-gray-100 text-black/70 hover:bg-gray-200'
          }`}
        >
          📖 כל 29 המילים למבחן
        </button>
      </div>

      {tab === 'firstLetter' && !isFinished && (
        <div className="space-y-6">
          {/* Progress */}
          <div className="flex items-center justify-between text-xs font-black text-black/70 px-1">
            <span>התקדמות: {correctCount} תשובות נכונות (יעד: 8)</span>
            <span>נקודות: +{scoreEarned}</span>
          </div>
          <div className="w-full bg-gray-200 h-3 rounded-full border-2 border-black overflow-hidden">
            <div
              className="bg-[#FFD700] h-full transition-all duration-300"
              style={{ width: `${Math.min(100, (correctCount / 8) * 100)}%` }}
            />
          </div>

          {/* Picture Card */}
          <div className="bg-[#FFF9E6] border-3 border-black rounded-2xl p-6 text-center relative shadow-[4px_4px_0px_0px_#000]">
            <span className="text-xs font-black text-black/60 block mb-1">
              איזו אות פותחת את התמונה הזו באנגלית?
            </span>
            
            {/* Big Emoji Picture */}
            <div className="text-7xl sm:text-8xl my-2 select-none filter drop-shadow">
              {currentItem.emoji}
            </div>

            <div className="text-xl font-black text-black mt-1">
              {currentItem.hebrew}
            </div>
            <div className="text-xs text-black/60 font-bold mb-3">
              רמז: {currentItem.hint}
            </div>

            <button
              onClick={() => speakWord(currentItem.word)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-gray-50 border-2 border-black text-xs font-black text-black shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-black" />
              <span>השמעת המילה באנגלית 🔊</span>
            </button>
          </div>

          {/* Option Buttons */}
          <div>
            <div className="text-center text-xs font-black text-black/70 mb-2">
              בחרו את האות הפותחת הנכונה:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {letterOptions.map((letter) => {
                const isSelected = selectedLetter === letter;
                const isCorrectLetter = letter === currentItem.firstLetter;
                let btnClass = 'bg-white hover:bg-gray-50 border-black text-black';

                if (isAnswered) {
                  if (isCorrectLetter) {
                    btnClass = 'bg-[#4ECDC4] border-black text-black font-black ring-4 ring-[#4ECDC4]/50';
                  } else if (isSelected) {
                    btnClass = 'bg-red-200 border-red-600 text-red-900';
                  } else {
                    btnClass = 'bg-gray-100 border-gray-300 text-gray-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={letter}
                    onClick={() => handleSelectLetter(letter)}
                    disabled={isAnswered}
                    className={`py-4 px-3 border-3 rounded-2xl text-4xl font-black font-english text-center transition-all shadow-[4px_4px_0px_0px_#000] cursor-pointer hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] ${btnClass}`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Type Alternative */}
          <div className="border-t-2 border-dashed border-black/30 pt-4 text-center">
            <span className="text-xs font-bold text-black/60 block mb-2">
              או הקלידו את האות במקלדת:
            </span>
            <form onSubmit={handleTypeCheck} className="inline-flex gap-2 items-center">
              <input
                type="text"
                maxLength={1}
                value={typedLetter}
                onChange={(e) => setTypedLetter(e.target.value)}
                disabled={isAnswered}
                placeholder="?"
                className="w-14 h-14 text-center text-3xl font-black font-english border-3 border-black rounded-xl bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-3 focus:ring-[#FFD700]"
              />
              <button
                type="submit"
                disabled={isAnswered || !typedLetter}
                className="px-4 py-3 bg-[#4ECDC4] hover:bg-[#3dbdb4] text-black font-black text-xs border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] disabled:opacity-50 cursor-pointer"
              >
                בדיקה
              </button>
            </form>
          </div>

          {/* Feedback & Next */}
          <div className="p-4 bg-gray-50 border-2 border-black rounded-xl text-center text-sm font-bold text-black flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>{feedback}</span>
            {isAnswered && (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-[#FFD700] hover:bg-[#ffcd00] border-2 border-black font-black rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_#000] cursor-pointer"
              >
                <span>לתמונה הבאה</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ALL 29 WORDS LIST */}
      {tab === 'wordBank' && (
        <div className="space-y-4">
          <p className="text-xs sm:text-sm font-bold text-black/70 text-center">
            כל 29 המילים הנדרשות למבחן! לחצו על הרמקול להאזנה להגייה ולמשפט דוגמה:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto p-1">
            {VOCABULARY_WORDS.map((w) => (
              <div
                key={w.id}
                className="bg-[#FFF9E6] border-2 border-black rounded-xl p-3 shadow-[3px_3px_0px_0px_#000] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl select-none">{w.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-base font-english text-black">{w.english}</span>
                      <span className="text-xs font-bold text-black/60 bg-white px-2 py-0.5 rounded-md border border-black/40">
                        {w.hebrew}
                      </span>
                    </div>
                    <div className="text-[11px] text-black/70 mt-0.5">
                      הגייה: <span className="font-bold">{w.phonetic}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 font-english mt-0.5" dir="ltr">
                      "{w.exampleSentence}"
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    speakWord(w.english);
                    setTimeout(() => speakSentence(w.exampleSentence), 800);
                  }}
                  className="p-2 bg-white hover:bg-gray-50 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] cursor-pointer shrink-0"
                  title="השמעת מילה ומשפט"
                >
                  <Volume2 className="w-4 h-4 text-black" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Finished Screen */}
      {isFinished && (
        <div className="text-center py-8 space-y-4 animate-in zoom-in-95">
          <div className="inline-flex p-4 bg-[#FFD700] border-3 border-black rounded-full shadow-[4px_4px_0px_0px_#000]">
            <Trophy className="w-12 h-12 text-black" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-black">
            מעולה! סיימתם את תחנה 2 בהצלחה! 🌟
          </h3>
          <p className="text-sm font-bold text-black/75 max-w-md mx-auto">
            זיהיתם את האותיות הפותחות של המילים באנגלית ואתם שולטים היטב באוצר המילים! הרווחתם {scoreEarned} נקודות.
          </p>
          <button
            onClick={() => onComplete(scoreEarned)}
            className="px-8 py-3.5 bg-[#4ECDC4] hover:bg-[#3dbdb4] text-black border-3 border-black font-black rounded-2xl text-base shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
          >
            סיום תחנה 2 ומעבר לתחנה הבאה 🚀
          </button>
        </div>
      )}
    </div>
  );
};
