import React, { useState } from 'react';
import { Volume2, Sparkles, Trophy, ArrowRight, CheckCircle2, XCircle, Award, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlayerProfile } from '../../types';
import { speakSentenceWithBlankPause, playSoundCorrect, playSoundFanfare, playSoundEncourage } from '../../utils/audio';

interface Stage5GrandExamProps {
  onComplete: (scoreGain: number, examScore: number) => void;
  onBackToBoard: () => void;
  onAddScore: (points: number) => void;
  onOpenCertificate: () => void;
  profile: PlayerProfile;
}

interface ExamQuestion {
  id: number;
  questionText: string;
  subText?: string;
  wordEnglish: string;
  correctAnswer: string;
  options: string[];
  type: 'meaning' | 'sentence' | 'audio';
}

// 10 base questions covering the vocabulary verbs systematically in full sentences with blanks (no icons/emojis)
const BASE_QUESTIONS: ExamQuestion[] = [
  {
    id: 1,
    questionText: 'השלימו את הפועל החסר במשפט:',
    subText: 'I _____ in the swimming pool during the summer.',
    wordEnglish: 'swim',
    correctAnswer: 'swim',
    options: ['swim', 'run', 'work', 'sing'],
    type: 'sentence',
  },
  {
    id: 2,
    questionText: 'השלימו את הפועל החסר במשפט:',
    subText: 'My parents _____ hard at their office every morning.',
    wordEnglish: 'work',
    correctAnswer: 'work',
    options: ['work', 'wait', 'watch', 'write'],
    type: 'sentence',
  },
  {
    id: 3,
    questionText: 'השלימו את הפועל החסר במשפט:',
    subText: 'Let us _____ a tasty chocolate cake together.',
    wordEnglish: 'make',
    correctAnswer: 'make',
    options: ['make', 'sing', 'kick', 'read'],
    type: 'sentence',
  },
  {
    id: 4,
    questionText: 'השלימו את הפועל החסר במשפט:',
    subText: 'I _____ my new bicycle to school every morning.',
    wordEnglish: 'ride',
    correctAnswer: 'ride',
    options: ['ride', 'kick', 'wait', 'watch'],
    type: 'sentence',
  },
  {
    id: 5,
    questionText: 'השלימו את הפועל החסר במשפט:',
    subText: 'Please _____ the soccer ball into the goal!',
    wordEnglish: 'kick',
    correctAnswer: 'kick',
    options: ['kick', 'match', 'learn', 'say'],
    type: 'sentence',
  },
  {
    id: 6,
    questionText: 'השלימו את הפועל החסר במשפט:',
    subText: 'Can you _____ the English word to the picture?',
    wordEnglish: 'match',
    correctAnswer: 'match',
    options: ['match', 'find', 'learn', 'say'],
    type: 'sentence',
  },
  {
    id: 7,
    questionText: 'השלימו את הפועל החסר במשפט:',
    subText: 'We _____ an exciting basketball game on television.',
    wordEnglish: 'watch',
    correctAnswer: 'watch',
    options: ['watch', 'wait', 'write', 'work'],
    type: 'sentence',
  },
  {
    id: 8,
    questionText: 'השלימו את הפועל החסר במשפט:',
    subText: 'Please _____ for me near the school gate.',
    wordEnglish: 'wait',
    correctAnswer: 'wait',
    options: ['wait', 'write', 'say', 'find'],
    type: 'sentence',
  },
  {
    id: 9,
    questionText: 'השלימו את הפועל החסר במשפט:',
    subText: 'I _____ a nice letter to my friend in English.',
    wordEnglish: 'write',
    correctAnswer: 'write',
    options: ['write', 'sing', 'study', 'swim'],
    type: 'sentence',
  },
  {
    id: 10,
    questionText: 'השלימו את הפועל החסר במשפט:',
    subText: 'The happy children _____ a lovely song together.',
    wordEnglish: 'sing',
    correctAnswer: 'sing',
    options: ['sing', 'play', 'read', 'learn'],
    type: 'sentence',
  },
];

export const Stage5GrandExam: React.FC<Stage5GrandExamProps> = ({
  onComplete,
  onBackToBoard,
  onAddScore,
  onOpenCertificate,
  profile,
}) => {
  const [questions, setQuestions] = useState<ExamQuestion[]>(() =>
    [...BASE_QUESTIONS].sort(() => Math.random() - 0.5)
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [qId: number]: string }>({});
  const [isExamCompleted, setIsExamCompleted] = useState(false);
  const [examFinalScore, setExamFinalScore] = useState<number>(0);

  const currentQ = questions[currentIdx];
  const selectedAnswer = userAnswers[currentQ?.id];

  // Play the sentence with a clean silent pause where the blank is (no words, no MM)
  const playExamSentence = (q: ExamQuestion) => {
    if (!q.subText) return;
    speakSentenceWithBlankPause(q.subText, 850);
  };

  const handleSelect = (option: string) => {
    if (userAnswers[currentQ.id]) return;

    const newAnswers = { ...userAnswers, [currentQ.id]: option };
    setUserAnswers(newAnswers);

    // Do NOT speak the solution word here. Play rewarding chime sounds:
    if (option.toLowerCase() === currentQ.correctAnswer.toLowerCase()) {
      playSoundCorrect();
      onAddScore(20);
    } else {
      playSoundEncourage();
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      let correctCount = 0;
      questions.forEach((q) => {
        if (
          userAnswers[q.id] &&
          userAnswers[q.id].toLowerCase() === q.correctAnswer.toLowerCase()
        ) {
          correctCount++;
        }
      });

      const calculatedScore = Math.round((correctCount / questions.length) * 100);
      setExamFinalScore(calculatedScore);
      setIsExamCompleted(true);

      playSoundFanfare();
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
      });

      onComplete(500, calculatedScore);
    }
  };

  const handleRetake = () => {
    setUserAnswers({});
    setCurrentIdx(0);
    setIsExamCompleted(false);
    setQuestions([...BASE_QUESTIONS].sort(() => Math.random() - 0.5));
  };

  return (
    <div className="bg-white border-4 border-black rounded-[2rem] p-5 sm:p-8 relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in fade-in">
      <div className="absolute inset-0 bento-dot-bg opacity-10 pointer-events-none" />
      
      {/* Top Bento Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-5 border-b-3 border-black">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl p-1 bg-[#FF6B6B] text-white rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              🏆
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-black">
              שלב 5: מבחן האלופים של צמרות באר יעקב
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-bold text-black/70">
            השלב האחרון והמרגש! 10 שאלות סיכום שיובילו אתכם לתעודת ההצטיינות הרשמית.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToBoard}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4ECDC4] hover:bg-[#3dbdb4] text-black text-xs font-black transition-all border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5 text-black" />
            למסלול השלבים
          </button>
        </div>
      </div>

      {/* Progress Bento Bar */}
      {!isExamCompleted && (
        <div className="relative z-10 my-5 bg-[#FFF9E6] border-3 border-black p-3.5 rounded-2xl shadow-[3px_3px_0px_0px_#000]">
          <div className="flex justify-between items-center text-xs font-black text-black mb-1.5">
            <span>שאלה {currentIdx + 1} מתוך {questions.length}</span>
            <span className="bg-[#4ECDC4] border border-black px-2 py-0.5 rounded-md font-black">
              {Math.round(((currentIdx) / questions.length) * 100)}% הושלם
            </span>
          </div>
          <div className="w-full bg-white h-3.5 rounded-full border-2 border-black overflow-hidden p-0.5">
            <div
              className="bg-[#FF6B6B] border-r-2 border-black h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Question Bento Body */}
      {!isExamCompleted && currentQ && (
        <div className="relative z-10 max-w-xl mx-auto py-2">
          
          <div className="bg-[#FFF9E6] rounded-[2rem] p-6 border-4 border-black text-center shadow-[6px_6px_0px_0px_#000] mb-6">
            <h3 className="text-xl sm:text-2xl font-black text-black mb-2">
              {currentQ.questionText}
            </h3>

            {currentQ.subText && (
              <div className="my-2 flex justify-center">
                <p
                  dir="ltr"
                  className="text-sm sm:text-base font-english font-black text-black bg-white border-2 border-black py-2 px-4 sm:px-6 rounded-xl inline-block shadow-[2px_2px_0px_0px_#000] text-left select-text"
                >
                  "{currentQ.subText}"
                </p>
              </div>
            )}

            {/* Play sentence with blank button */}
            <div className="mt-3">
              <button
                onClick={() => playExamSentence(currentQ)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4ECDC4] hover:bg-[#3dbdb4] text-black border-2 border-black text-xs sm:text-sm font-black transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                title="השמעת המשפט עם עצירה במקום המילה החסרה באנגלית"
              >
                <Volume2 className="w-4 h-4 text-black" />
                <span>השמעת המשפט (עם עצירה במילה החסרה) 🔊</span>
              </button>
            </div>
          </div>

          {/* Options Grid Bento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isAnswered = !!selectedAnswer;
              const isCorrect = option.toLowerCase() === currentQ.correctAnswer.toLowerCase();

              let btnStyle = 'bg-white hover:bg-gray-50 text-black border-3 border-black shadow-[3px_3px_0px_0px_#000]';

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-[#4ECDC4] text-black border-3 border-black shadow-[3px_3px_0px_0px_#000] font-black scale-102';
                } else if (isSelected) {
                  btnStyle = 'bg-[#FF6B6B] text-white border-3 border-black shadow-[3px_3px_0px_0px_#000]';
                } else {
                  btnStyle = 'bg-gray-100 border-2 border-black/40 opacity-50 text-gray-400 shadow-none';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(option)}
                  disabled={isAnswered}
                  dir="ltr"
                  className={`p-4 rounded-2xl font-black text-base sm:text-lg transition-all flex items-center justify-between cursor-pointer active:translate-x-[2px] active:translate-y-[2px] ${btnStyle}`}
                  id={`exam-opt-${idx}`}
                >
                  <span className={option.match(/^[a-zA-Z]+$/) ? 'font-english text-xl' : ''}>
                    {option}
                  </span>

                  {isAnswered && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-black shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-white shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Bento Button */}
          {selectedAnswer && (
            <div className="mt-6 text-center space-y-3 animate-in fade-in">
              <div className="text-xs sm:text-sm font-black text-black bg-[#FFF9E6] py-2.5 px-4 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] inline-block">
                {selectedAnswer.toLowerCase() === currentQ.correctAnswer.toLowerCase() ? (
                  <span>תשובה נכונה ומדויקת! גאווה של צמרות! 🌟</span>
                ) : (
                  <span>התשובה הנכונה היא: {currentQ.correctAnswer}. לומדים מכל תרגול! 💪</span>
                )}
              </div>

              <div>
                <button
                  onClick={handleNext}
                  className="px-8 py-3.5 bg-[#FFD700] hover:bg-[#fed600] text-black font-black border-3 border-black rounded-2xl text-base transition-all shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
                >
                  {currentIdx === questions.length - 1 ? 'סיום המבחן וקבלת התעודה! 🎓' : 'לשאלה הבאה ←'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Exam Result / Certificate Unlock Banner */}
      {isExamCompleted && (
        <div className="relative z-10 p-6 sm:p-8 rounded-[2rem] bg-[#FF6B6B] border-4 border-black text-white text-center shadow-[8px_8px_0px_0px_#000] animate-in zoom-in-95">
          <div className="text-6xl mb-2 animate-bounce">🎓</div>
          
          <span className="text-xs uppercase font-black tracking-wider bg-black text-[#FFD700] border border-black px-3.5 py-1 rounded-full inline-block mb-3 shadow-[2px_2px_0px_0px_#000]">
            הצלחה כבירה במבחן הסיכום
          </span>

          <h3 className="text-2xl sm:text-3xl font-black mb-1">
            כל הכבוד, {profile.name}! עברת את המבחן!
          </h3>

          <div className="my-4 inline-block bg-white border-3 border-black text-black px-7 py-3 rounded-2xl shadow-[4px_4px_0px_0px_#000]">
            <span className="text-xs text-black/70 block font-black">ציון סופי:</span>
            <span className="text-5xl font-black text-[#FF6B6B]">{examFinalScore} / 100</span>
          </div>

          <p className="text-xs sm:text-sm font-bold text-white/95 max-w-md mx-auto mb-6">
            צברת את כל הידע הנחוץ, הפגנת ביטחון עצמי עצום והוכחת שאתה אלוף אמיתי ב-16 הפעלים באנגלית של בית ספר צמרות באר יעקב!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenCertificate}
              className="px-7 py-3.5 bg-[#FFD700] hover:bg-[#fed600] text-black border-3 border-black font-black rounded-2xl text-base transition-all shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] flex items-center gap-2 cursor-pointer"
              id="view-certificate-btn"
            >
              <Award className="w-5 h-5 text-black" />
              <span>צפייה בתעודת ההצטיינות הרשמית שלך! 📜</span>
            </button>

            <button
              onClick={handleRetake}
              className="px-5 py-3.5 bg-white hover:bg-gray-100 text-black border-3 border-black font-black rounded-2xl text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-[3px_3px_0px_0px_#000] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-black" />
              <span>עשה את המבחן שוב לשיפור הציון</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
