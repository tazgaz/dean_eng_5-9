import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, Trophy, ArrowRight, ArrowLeft, CheckCircle2, ChevronRight, ChevronLeft, BookOpen, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VOCABULARY_WORDS, CONFIDENCE_MESSAGES_CORRECT } from '../../data/words';
import { WordItem } from '../../types';
import { speakWord, speakSentence, playSoundCorrect, playSoundEncourage } from '../../utils/audio';

interface Stage1LearnProps {
  onComplete: (scoreGain: number) => void;
  onBackToBoard: () => void;
  onAddScore: (points: number) => void;
  onLearnWord?: (wordId: string) => void;
}

export const Stage1Learn: React.FC<Stage1LearnProps> = ({
  onComplete,
  onBackToBoard,
  onAddScore,
  onLearnWord,
}) => {
  const [shuffledWords, setShuffledWords] = useState<WordItem[]>(() => {
    return [...VOCABULARY_WORDS].sort(() => Math.random() - 0.5);
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [learnedWordIds, setLearnedWordIds] = useState<string[]>([]);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [isQuizAnswered, setIsQuizAnswered] = useState(false);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('הקשיבו להגייה, קראו את המשפט וענו על שאלת התרגול!');
  const [isFinished, setIsFinished] = useState(false);

  const currentWord: WordItem = shuffledWords[currentIndex] || shuffledWords[0];
  const TARGET_LEARN_GOAL = shuffledWords.length; // All 16 verbs

  // Generate 3 multiple choice options for current word
  const setupWordQuiz = (word: WordItem) => {
    const distractors = VOCABULARY_WORDS
      .filter((w) => w.id !== word.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    const opts = [word.hebrew, ...distractors.map((d) => d.hebrew)].sort(
      () => Math.random() - 0.5
    );
    setQuizOptions(opts);
    setSelectedQuizOption(null);
    setIsQuizAnswered(false);
  };

  useEffect(() => {
    if (currentWord) {
      setupWordQuiz(currentWord);
      speakWord(currentWord.english);
    }
  }, [currentIndex, currentWord]);

  const handleQuizAnswer = (option: string) => {
    if (isQuizAnswered) return;
    setSelectedQuizOption(option);

    const isCorrect = option === currentWord.hebrew;

    if (isCorrect) {
      setIsQuizAnswered(true);
      playSoundCorrect();
      speakWord(currentWord.english);
      onAddScore(25);

      if (!learnedWordIds.includes(currentWord.id)) {
        const nextLearned = [...learnedWordIds, currentWord.id];
        setLearnedWordIds(nextLearned);
        if (onLearnWord) onLearnWord(currentWord.id);

        if (nextLearned.length >= TARGET_LEARN_GOAL && !isFinished) {
          setTimeout(() => {
            confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
            setIsFinished(true);
          }, 1000);
        }
      }

      const compliment =
        CONFIDENCE_MESSAGES_CORRECT[Math.floor(Math.random() * CONFIDENCE_MESSAGES_CORRECT.length)];
      setFeedback(`${compliment} הפועל ${currentWord.english} נקלט בהצלחה!`);
    } else {
      playSoundEncourage();
      setFeedback('לא הפעם, נסו שוב! בחרו את המשמעות המתאימה. 💡');
      setTimeout(() => {
        setSelectedQuizOption(null);
      }, 700);
    }
  };

  const handleNextWord = () => {
    if (currentIndex < shuffledWords.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      if (learnedWordIds.length >= TARGET_LEARN_GOAL) {
        setIsFinished(true);
      } else {
        setCurrentIndex(0);
      }
    }
  };

  const handlePrevWord = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(shuffledWords.length - 1);
    }
  };

  const handleRestartRandom = () => {
    setShuffledWords([...VOCABULARY_WORDS].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setIsFinished(false);
  };

  const isCurrentLearned = learnedWordIds.includes(currentWord.id);

  return (
    <div className="bg-white border-3 sm:border-4 border-black rounded-2xl sm:rounded-[2rem] p-3 sm:p-6 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in fade-in">
      <div className="absolute inset-0 bento-dot-bg opacity-10 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between gap-2 pb-2.5 sm:pb-4 border-b-2 sm:border-b-3 border-black">
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-lg sm:text-2xl p-0.5 sm:p-1 bg-[#FFD700] rounded-lg sm:rounded-xl border-2 border-black shadow-[1px_1px_0px_0px_#000]">
              💡
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-black leading-tight">
              שלב 1: לימוד הפעלים
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs font-bold text-black/70 mt-0.5 hidden xs:block sm:block">
            מקשיבים להגייה, קוראים דוגמה ועונים על שאלת תרגול!
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

      {/* Progress & Counter Strip */}
      <div className="relative z-10 my-2.5 flex flex-wrap items-center justify-between gap-2 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-[#FFF9E6] border-2 sm:border-3 border-black text-xs shadow-[2px_2px_0px_0px_#000]">
        <div className="flex items-center gap-1.5 font-black text-black text-[11px] sm:text-xs min-w-0">
          <Sparkles className="w-3.5 h-3.5 text-black shrink-0" />
          <span className="truncate">{feedback}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs shrink-0">
          <span className="font-black text-black bg-[#FFD700] border border-black px-2 py-0.5 rounded-lg shadow-[1px_1px_0px_0px_#000] text-[11px] sm:text-xs">
            {learnedWordIds.length} / {TARGET_LEARN_GOAL}
          </span>
          <span className="font-bold text-black/70 text-[11px] sm:text-xs">
            ({currentIndex + 1}/{shuffledWords.length})
          </span>
        </div>
      </div>

      {/* Main Learning Card */}
      {!isFinished && (
        <div className="relative z-10 max-w-2xl mx-auto py-1">
          <div className="bg-white border-2 sm:border-4 border-black rounded-2xl sm:rounded-[2rem] p-3.5 sm:p-6 shadow-[4px_4px_0px_0px_#000] relative">
            
            {/* Word Status & Emoji */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl sm:text-5xl filter drop-shadow">
                {currentWord.emoji}
              </span>

              {isCurrentLearned && (
                <span className="flex items-center gap-1 bg-[#4ECDC4] text-black border-2 border-black px-3 py-1 rounded-full text-xs font-black shadow-[2px_2px_0px_0px_#000]">
                  <CheckCircle2 className="w-4 h-4" />
                  פועל זה נלמד!
                </span>
              )}
            </div>

            {/* Big Focal Word Display - Without Hebrew meaning spoiling the quiz */}
            <div className="text-center py-2">
              <h3 className="text-4xl sm:text-5xl font-black text-black font-english tracking-wide mb-1">
                {currentWord.english}
              </h3>

              {/* Phonetic Pronunciation Badge */}
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="text-xs font-bold text-black/70 bg-[#FFF9E6] border-2 border-black px-3 py-1 rounded-xl shadow-[1px_1px_0px_0px_#000]">
                  איך הוגים: <strong className="font-black text-black">[{currentWord.phonetic}]</strong>
                </span>
                <button
                  onClick={() => speakWord(currentWord.english)}
                  className="flex items-center gap-1.5 px-3.5 py-1 rounded-xl bg-[#FFD700] hover:bg-[#fed600] text-black border-2 border-black text-xs font-black transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-black" />
                  השמע שוב
                </button>
              </div>

              {/* Example Sentence Box with Audio Narration - Without Hebrew sentence translation */}
              <div className="mt-5 p-4 bg-[#FFF9E6] border-2 border-black rounded-2xl text-right">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-black text-black/70">
                    דוגמה לשימוש במשפט:
                  </span>
                  <button
                    onClick={() => speakSentence(currentWord.exampleSentence)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[#FFD700] hover:bg-[#fed600] text-black border-2 border-black rounded-xl text-xs font-black transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                    title="הקראת המשפט השלם באנגלית"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-black" />
                    <span>הקרא משפט</span>
                  </button>
                </div>

                <div
                  dir="ltr"
                  onClick={() => speakSentence(currentWord.exampleSentence)}
                  className="text-base sm:text-lg font-black text-black font-english text-left cursor-pointer hover:text-[#FF6B6B] transition-colors flex items-center justify-between p-2.5 bg-white rounded-xl border border-black/30 shadow-[1px_1px_0px_0px_#000] group"
                  title="לחצו להקראת המשפט"
                >
                  <span className="select-text">"{currentWord.exampleSentence}"</span>
                  <Volume2 className="w-4 h-4 text-black/40 group-hover:text-[#FF6B6B] shrink-0 ml-2" />
                </div>
              </div>
            </div>

            {/* Quick Practice Micro-Quiz */}
            <div className="mt-6 pt-5 border-t-3 border-black">
              <div className="text-xs font-black text-black mb-2.5 text-center">
                תרגול מהיר: מה פירוש הפועל <strong className="font-english text-sm font-black">{currentWord.english}</strong>?
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {quizOptions.map((opt, idx) => {
                  const isSelected = selectedQuizOption === opt;
                  const isCorrect = opt === currentWord.hebrew;

                  let style = 'bg-white hover:bg-gray-50 text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]';
                  if (isQuizAnswered) {
                    if (isCorrect) {
                      style = 'bg-[#4ECDC4] text-black border-2 border-black font-black shadow-[2px_2px_0px_0px_#000]';
                    } else if (isSelected) {
                      style = 'bg-[#FF6B6B] text-white border-2 border-black shadow-[2px_2px_0px_0px_#000]';
                    } else {
                      style = 'bg-gray-100 text-gray-400 border-black/30 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuizAnswer(opt)}
                      disabled={isQuizAnswered}
                      className={`py-3 px-2 rounded-xl text-sm sm:text-base font-black transition-all cursor-pointer active:translate-x-[1px] active:translate-y-[1px] ${style}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons: Prev & Next */}
            <div className="mt-6 pt-4 border-t-2 border-black/15 flex items-center justify-between">
              <button
                onClick={handlePrevWord}
                className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-100 text-black font-black border-2 border-black rounded-xl text-xs transition-all shadow-[2px_2px_0px_0px_#000] cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                <span>פועל קודם</span>
              </button>

              <button
                onClick={handleNextWord}
                className="flex items-center gap-1.5 px-5 py-2 bg-[#FFD700] hover:bg-[#fed600] text-black font-black border-2 border-black rounded-xl text-xs transition-all shadow-[2px_2px_0px_0px_#000] cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
              >
                <span>לפועל הבא</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Completion Banner */}
      {isFinished && (
        <div className="relative z-10 p-6 rounded-[2rem] bg-[#FFD700] border-4 border-black text-black text-center shadow-[6px_6px_0px_0px_#000] animate-in zoom-in-95">
          <Trophy className="w-12 h-12 mx-auto mb-2 text-black filter drop-shadow animate-bounce" />
          <h3 className="text-2xl sm:text-3xl font-black mb-1">
            מעולה! סיימתם את שלב 1: לימוד והכרת הפעלים!
          </h3>
          <p className="text-xs sm:text-sm font-bold text-black/80 max-w-md mx-auto mb-5">
            עברתם על כל 16 הפעלים בסדר רנדומלי! הקשבתם להגייה, שמעתם את המשפטים ועניתם על המשמעויות ללא רמזים מקדימים. צברתם 200 נקודות ואתם מוכנים לשלב הבא!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onComplete(200)}
              className="px-7 py-3 bg-[#4ECDC4] hover:bg-[#3dbdb4] text-black font-black border-3 border-black rounded-xl text-sm transition-all shadow-[3px_3px_0px_0px_#000] cursor-pointer"
            >
              המשך לשלב 2: מפוצץ בועות המילים! 🫧
            </button>
            <button
              onClick={handleRestartRandom}
              className="px-5 py-3 bg-white hover:bg-gray-100 text-black font-black border-3 border-black rounded-xl text-xs transition-colors shadow-[2px_2px_0px_0px_#000] cursor-pointer"
            >
              תרגול חוזר בסדר רנדומלי חדש 🎲
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
