import React, { useState } from 'react';
import { Volume2, Sparkles, Trophy, ArrowRight, ArrowLeft, CheckCircle2, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { READING_STORIES, ReadingStory, CONFIDENCE_MESSAGES_CORRECT } from '../../data/words';
import { speakSentence, playSoundCorrect, playSoundEncourage } from '../../utils/audio';

interface Stage4ReadingComprehensionProps {
  onComplete: (scoreGain: number) => void;
  onBackToBoard: () => void;
  onAddScore: (points: number) => void;
}

export const Stage4ReadingComprehension: React.FC<Stage4ReadingComprehensionProps> = ({
  onComplete,
  onBackToBoard,
  onAddScore,
}) => {
  const [storyIndex, setStoryIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [scoreEarned, setScoreEarned] = useState(0);
  const [feedback, setFeedback] = useState('קראו את הטקסט וענו על השאלה:');
  const [isFinished, setIsFinished] = useState(false);

  const [stories] = useState<ReadingStory[]>(() =>
    [...READING_STORIES].map((story) => ({
      ...story,
      questions: story.questions.map((q) => ({
        ...q,
        options: [...q.options].sort(() => Math.random() - 0.5),
      })),
    }))
  );

  const currentStory: ReadingStory = stories[storyIndex] || stories[0];
  const currentQ = currentStory.questions[questionIndex];

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    const isCorrect = opt === currentQ.correctAnswer;

    if (isCorrect) {
      playSoundCorrect();
      onAddScore(35);
      setScoreEarned((prev) => prev + 35);
      setCorrectCount((prev) => prev + 1);

      const msg = CONFIDENCE_MESSAGES_CORRECT[Math.floor(Math.random() * CONFIDENCE_MESSAGES_CORRECT.length)];
      setFeedback(`${msg} תשובה נכונה! ${currentQ.explanation}`);

      // Check if finished all stories and questions
      const isLastQuestionInStory = questionIndex === currentStory.questions.length - 1;
      const isLastStory = storyIndex === READING_STORIES.length - 1;
      if (isLastQuestionInStory && isLastStory) {
        setTimeout(() => {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
          setIsFinished(true);
        }, 1200);
      }
    } else {
      playSoundEncourage();
      setFeedback(`לא הפעם! ${currentQ.explanation}`);
    }
  };

  const handleNext = () => {
    if (questionIndex < currentStory.questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setFeedback('קראו את הטקסט וענו על השאלה:');
    } else if (storyIndex < READING_STORIES.length - 1) {
      setStoryIndex((prev) => prev + 1);
      setQuestionIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setFeedback('טקסט חדש! קראו את הסיפור וענו על השאלות:');
    } else {
      setIsFinished(true);
    }
  };

  return (
    <div className="bg-white border-4 border-black rounded-[2rem] p-4 sm:p-8 max-w-3xl mx-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-3 border-black pb-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#A29BFE] text-black border-2 border-black px-3 py-0.5 rounded-full text-xs font-black shadow-[2px_2px_0px_0px_#000] mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>תחנה 4 • קריאת טקסט ושאלות הבנה</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black">
            הבנת הנקרא: קטעי קריאה ושאלות
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
            <span>
              סיפור {storyIndex + 1} מתוך {READING_STORIES.length} • שאלה {questionIndex + 1} מתוך {currentStory.questions.length}
            </span>
            <span>נקודות: +{scoreEarned}</span>
          </div>

          {/* Reading Story Box */}
          <div className="bg-[#FFF9E6] border-3 border-black rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_#000]">
            <div className="flex items-center justify-between gap-3 border-b-2 border-black/20 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-black" />
                <h3 className="text-lg font-black font-english text-black" dir="ltr">
                  {currentStory.title}
                </h3>
              </div>
              <button
                onClick={() => speakSentence(currentStory.text)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-gray-50 border-2 border-black text-xs font-black text-black shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer"
                title="השמעת כל הסיפור באנגלית"
              >
                <Volume2 className="w-3.5 h-3.5 text-black" />
                <span>השמעת הסיפור 🔊</span>
              </button>
            </div>

            {/* Story Paragraph with LTR */}
            <p
              className="text-base sm:text-lg font-english text-black leading-relaxed tracking-wide select-none"
              dir="ltr"
            >
              {currentStory.text}
            </p>
          </div>

          {/* Question Card */}
          <div className="bg-white border-3 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_#000]">
            <span className="text-xs font-black text-black/60 block mb-1">
              שאלה {questionIndex + 1}:
            </span>
            <div
              className="text-base sm:text-lg font-black font-english text-black mb-4"
              dir="ltr"
            >
              {currentQ.question}
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOption === opt;
                const isCorrect = opt === currentQ.correctAnswer;
                let btnClass = 'bg-gray-50 hover:bg-gray-100 border-black text-black';

                if (isAnswered) {
                  if (isCorrect) {
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
                    className={`p-3.5 border-2 rounded-xl text-sm sm:text-base font-bold font-english text-left transition-all shadow-[2px_2px_0px_0px_#000] cursor-pointer hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] ${btnClass}`}
                    dir="ltr"
                  >
                    {opt}
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
                <span>
                  {questionIndex < currentStory.questions.length - 1
                    ? 'לשאלה הבאה'
                    : storyIndex < READING_STORIES.length - 1
                    ? 'לסיפור הבא'
                    : 'סיום התחנה'}
                </span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Finished Screen */}
      {isFinished && (
        <div className="text-center py-8 space-y-4 animate-in zoom-in-95">
          <div className="inline-flex p-4 bg-[#A29BFE] border-3 border-black rounded-full shadow-[4px_4px_0px_0px_#000]">
            <Trophy className="w-12 h-12 text-black" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-black">
            מצוין! סיימתם בהצלחה את תחנה 4! 🌟
          </h3>
          <p className="text-sm font-bold text-black/75 max-w-md mx-auto">
            קראתם את הטקסטים באנגלית ועניתם נכון על שאלות הבנת הנקרא! צברתם {scoreEarned} נקודות וכעת אתם מוכנים לחלוטין למבחן המסכם!
          </p>
          <button
            onClick={() => onComplete(scoreEarned)}
            className="px-8 py-3.5 bg-[#FFD700] hover:bg-[#ffcd00] text-black border-3 border-black font-black rounded-2xl text-base shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
          >
            מעבר למבחן האלופים המסכם 🏆
          </button>
        </div>
      )}
    </div>
  );
};
