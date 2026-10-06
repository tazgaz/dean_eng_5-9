import React, { useState } from 'react';
import { Volume2, Sparkles, Trophy, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SENTENCE_MATCH_ITEMS, SentenceMatchItem, CONFIDENCE_MESSAGES_CORRECT } from '../../data/words';
import { speakSentence, playSoundCorrect, playSoundEncourage } from '../../utils/audio';

interface Stage3SentenceMatchProps {
  onComplete: (scoreGain: number) => void;
  onBackToBoard: () => void;
  onAddScore: (points: number) => void;
}

export const Stage3SentenceMatch: React.FC<Stage3SentenceMatchProps> = ({
  onComplete,
  onBackToBoard,
  onAddScore,
}) => {
  const [items] = useState<SentenceMatchItem[]>(() =>
    [...SENTENCE_MATCH_ITEMS].sort(() => Math.random() - 0.5)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [scoreEarned, setScoreEarned] = useState(0);
  const [feedback, setFeedback] = useState('קראו את המשפט באנגלית ובחרו את התמונה המתאימה!');
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = items[currentIndex] || SENTENCE_MATCH_ITEMS[0];

  const handleSelectOption = (emoji: string) => {
    if (isAnswered) return;
    setSelectedEmoji(emoji);
    setIsAnswered(true);

    const isCorrect = emoji === currentItem.correctEmoji;

    if (isCorrect) {
      playSoundCorrect();
      onAddScore(30);
      setScoreEarned((prev) => prev + 30);
      setCorrectCount((prev) => prev + 1);

      const msg = CONFIDENCE_MESSAGES_CORRECT[Math.floor(Math.random() * CONFIDENCE_MESSAGES_CORRECT.length)];
      setFeedback(`${msg} התאמה מושלמת! תרגום: "${currentItem.hebrewTranslation}"`);

      if (correctCount + 1 >= items.length && !isFinished) {
        setTimeout(() => {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
          setIsFinished(true);
        }, 1200);
      }
    } else {
      playSoundEncourage();
      setFeedback(`לא הפעם! התמונה המתאימה היא ${currentItem.correctLabel}. תרגום: "${currentItem.hebrewTranslation}"`);
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedEmoji(null);
      setIsAnswered(false);
      setFeedback('קראו את המשפט באנגלית ובחרו את התמונה המתאימה!');
    } else {
      setIsFinished(true);
    }
  };

  return (
    <div className="bg-white border-4 border-black rounded-[2rem] p-4 sm:p-8 max-w-3xl mx-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-3 border-black pb-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#FF8C42] text-white border-2 border-black px-3 py-0.5 rounded-full text-xs font-black shadow-[2px_2px_0px_0px_#000] mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>תחנה 3 • קריאת משפט והתאמה לתמונה</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black">
            קריאת משפט והתאמתו לתמונה הנכונה
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

      {!isFinished && (
        <div className="space-y-6">
          {/* Progress */}
          <div className="flex items-center justify-between text-xs font-black text-black/70 px-1">
            <span>משפט {currentIndex + 1} מתוך {items.length} (הצלחות: {correctCount})</span>
            <span>נקודות: +{scoreEarned}</span>
          </div>
          <div className="w-full bg-gray-200 h-3 rounded-full border-2 border-black overflow-hidden">
            <div
              className="bg-[#FF8C42] h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
            />
          </div>

          {/* Sentence Card with LTR and Audio */}
          <div className="bg-[#FFF9E6] border-3 border-black rounded-2xl p-6 text-center relative shadow-[4px_4px_0px_0px_#000]">
            <span className="text-xs font-black text-black/60 block mb-2">
              קראו את המשפט באנגלית:
            </span>

            <div
              className="text-xl sm:text-2xl md:text-3xl font-black text-black font-english my-3 select-none leading-relaxed tracking-wide px-2"
              dir="ltr"
            >
              "{currentItem.sentence}"
            </div>

            <div className="mt-4">
              <button
                onClick={() => speakSentence(currentItem.sentence)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-gray-50 border-2 border-black text-xs sm:text-sm font-black text-black shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-black" />
                <span>השמעת המשפט באנגלית 🔊</span>
              </button>
            </div>
          </div>

          {/* 4 Picture Choice Cards */}
          <div>
            <div className="text-center text-xs font-black text-black/70 mb-2">
              איזו תמונה מתארת את המשפט?
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {currentItem.options.map((opt) => {
                const isSelected = selectedEmoji === opt.emoji;
                const isCorrect = opt.emoji === currentItem.correctEmoji;
                let cardClass = 'bg-white hover:bg-gray-50 border-black';

                if (isAnswered) {
                  if (isCorrect) {
                    cardClass = 'bg-[#4ECDC4] border-black text-black font-black ring-4 ring-[#4ECDC4]/50';
                  } else if (isSelected) {
                    cardClass = 'bg-red-200 border-red-600 text-red-900';
                  } else {
                    cardClass = 'bg-gray-100 border-gray-300 text-gray-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={opt.emoji}
                    onClick={() => handleSelectOption(opt.emoji)}
                    disabled={isAnswered}
                    className={`p-4 border-3 rounded-2xl text-center transition-all shadow-[4px_4px_0px_0px_#000] cursor-pointer hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] flex flex-col items-center justify-center gap-2 ${cardClass}`}
                  >
                    <span className="text-5xl sm:text-6xl select-none filter drop-shadow">
                      {opt.emoji}
                    </span>
                    <span className="text-xs font-black mt-1">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback & Next */}
          <div className="p-4 bg-gray-50 border-2 border-black rounded-xl text-center text-sm font-bold text-black flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>{feedback}</span>
            {isAnswered && (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-[#FFD700] hover:bg-[#ffcd00] border-2 border-black font-black rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_#000] cursor-pointer"
              >
                <span>למשפט הבא</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Finished Screen */}
      {isFinished && (
        <div className="text-center py-8 space-y-4 animate-in zoom-in-95">
          <div className="inline-flex p-4 bg-[#FF8C42] border-3 border-black rounded-full shadow-[4px_4px_0px_0px_#000]">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-black">
            כל הכבוד! סיימתם את תחנה 3 בהצלחה! 🌟
          </h3>
          <p className="text-sm font-bold text-black/75 max-w-md mx-auto">
            קראתם את המשפטים באנגלית והתאמתם אותם לתמונות במדויק! הרווחתם {scoreEarned} נקודות.
          </p>
          <button
            onClick={() => onComplete(scoreEarned)}
            className="px-8 py-3.5 bg-[#4ECDC4] hover:bg-[#3dbdb4] text-black border-3 border-black font-black rounded-2xl text-base shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
          >
            סיום תחנה 3 ומעבר לתחנה הבאה 🚀
          </button>
        </div>
      )}
    </div>
  );
};
