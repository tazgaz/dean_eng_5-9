import React, { useState } from 'react';
import { Volume2, Sparkles, Trophy, ArrowRight, ArrowLeft, CheckCircle2, XCircle, Award, RotateCcw } from 'lucide-react';
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
  section: string; // e.g., 'חלק 1: אותיות גדולות וקטנות', 'חלק 2: אות פותחת', 'חלק 3: השלמת משפטים', etc.
  questionText: string;
  subText?: string;
  hasAudio?: boolean;
  correctAnswer: string;
  options: string[];
  type: 'letters' | 'firstLetter' | 'sentenceBlank' | 'meaning' | 'reading';
  readingContext?: string;
}

// 12 comprehensive questions strictly following all user rules:
// - Clean silent pause for sentence blanks (no words, no MM, no blank)
// - No hints in question title
// - No emojis/icons on question cards
// - Strict LTR direction for English text
const BASE_QUESTIONS: ExamQuestion[] = [
  // SECTION 1: Upper and Lowercase Letters
  {
    id: 1,
    section: 'חלק א׳: אותיות גדולות וקטנות',
    questionText: 'איזו אות קטנה מתאימה לאות הגדולה הבאה?',
    subText: 'G',
    correctAnswer: 'g',
    options: ['g', 'q', 'p', 'd'],
    type: 'letters',
  },
  {
    id: 2,
    section: 'חלק א׳: אותיות גדולות וקטנות',
    questionText: 'איזו אות גדולה מתאימה לאות הקטנה הבאה?',
    subText: 'b',
    correctAnswer: 'B',
    options: ['B', 'D', 'P', 'R'],
    type: 'letters',
  },

  // SECTION 2: First Letter
  {
    id: 3,
    section: 'חלק ב׳: אות פותחת',
    questionText: 'איזו אות פותחת את המילה Flamingo באנגלית?',
    subText: 'Flamingo',
    correctAnswer: 'F',
    options: ['F', 'P', 'L', 'T'],
    type: 'firstLetter',
  },
  {
    id: 4,
    section: 'חלק ב׳: אות פותחת',
    questionText: 'איזו אות פותחת את המילה Castle באנגלית?',
    subText: 'Castle',
    correctAnswer: 'C',
    options: ['C', 'K', 'S', 'G'],
    type: 'firstLetter',
  },

  // SECTION 3: Sentence Blanks (with silent audio pause, LTR, no hints)
  {
    id: 5,
    section: 'חלק ג׳: השלמת מילים במשפט',
    questionText: 'השלימו את המילה החסרה במשפט:',
    subText: 'The princess lives in a big _____ .',
    hasAudio: true,
    correctAnswer: 'castle',
    options: ['castle', 'clock', 'chair', 'dish'],
    type: 'sentenceBlank',
  },
  {
    id: 6,
    section: 'חלק ג׳: השלמת מילים במשפט',
    questionText: 'השלימו את המילה החסרה במשפט:',
    subText: 'The hungry dog likes to eat _____ .',
    hasAudio: true,
    correctAnswer: 'meat',
    options: ['meat', 'table', 'sky', 'clown'],
    type: 'sentenceBlank',
  },
  {
    id: 7,
    section: 'חלק ג׳: השלמת מילים במשפט',
    questionText: 'השלימו את המילה החסרה במשפט:',
    subText: 'The cute baby sits on the _____ .',
    hasAudio: true,
    correctAnswer: 'chair',
    options: ['chair', 'cloud', 'cow', 'fly'],
    type: 'sentenceBlank',
  },
  {
    id: 8,
    section: 'חלק ג׳: השלמת מילים במשפט',
    questionText: 'השלימו את המילה החסרה במשפט:',
    subText: 'The round clock is on the _____ .',
    hasAudio: true,
    correctAnswer: 'table',
    options: ['table', 'man', 'burn', 'fall'],
    type: 'sentenceBlank',
  },

  // SECTION 4: Sentence Understanding & Meaning
  {
    id: 9,
    section: 'חלק ד׳: הבנת משפט',
    questionText: 'מה הפירוש הנכון של המשפט הבא?',
    subText: 'The birds fly high in the blue sky.',
    correctAnswer: 'הציפורים עפות גבוה בשמיים הכחולים',
    options: [
      'הציפורים עפות גבוה בשמיים הכחולים',
      'הכלב רץ מהר בחצר הבית',
      'הדגים שוחים במים העמוקים',
      'הילדים משחקים בפארק הגדול',
    ],
    type: 'meaning',
  },
  {
    id: 10,
    section: 'חלק ד׳: הבנת משפט',
    questionText: 'מה הפירוש הנכון של המשפט הבא?',
    subText: 'Do not touch the fire, it can burn.',
    correctAnswer: 'אל תיגע באש, היא עלולה לשרוף',
    options: [
      'אל תיגע באש, היא עלולה לשרוף',
      'אל תפתח את הדלת של הבית',
      'אל תפיל את השעון מהשולחן',
      'אל תאכל את האוכל החם',
    ],
    type: 'meaning',
  },

  // SECTION 5: Reading Comprehension
  {
    id: 11,
    section: 'חלק ה׳: הבנת הנקרא',
    questionText: 'לפי הקטע הקצר, איזה בעל חיים ראה הילד?',
    readingContext: 'Maya lives in a house near the lake. In the morning, she sees a tall pink flamingo fly in the blue sky. Maya thinks it is very nice.',
    subText: 'Where does Maya see the flamingo fly?',
    correctAnswer: 'In the blue sky',
    options: ['In the blue sky', 'Under the table', 'In the kitchen', 'Behind the car'],
    type: 'reading',
  },
  {
    id: 12,
    section: 'חלק ה׳: הבנת הנקרא',
    questionText: 'לפי הקטע הקצר, מי הגיע לבקר ביום שישי?',
    readingContext: 'Dan and Sarah live on a farm. They have a spotted cow and a playful dog. On Friday afternoon, Benny the clown comes to visit. He tells funny jokes.',
    subText: 'Who comes to visit on Friday afternoon?',
    correctAnswer: 'Benny the clown',
    options: ['Benny the clown', 'The doctor', 'The teacher', 'The pilot'],
    type: 'reading',
  },
];

export const Stage5GrandExam: React.FC<Stage5GrandExamProps> = ({
  onComplete,
  onBackToBoard,
  onAddScore,
  onOpenCertificate,
  profile,
}) => {
  const [questions] = useState<ExamQuestion[]>(() => [...BASE_QUESTIONS]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [qId: number]: string }>({});
  const [isExamCompleted, setIsExamCompleted] = useState(false);
  const [examFinalScore, setExamFinalScore] = useState<number>(0);

  const currentQ = questions[currentIdx];
  const selectedAnswer = userAnswers[currentQ?.id];

  // Play sentence with a clean SILENT pause where the blank is (no words, no MM)
  const playExamSentence = (q: ExamQuestion) => {
    if (!q.subText) return;
    speakSentenceWithBlankPause(q.subText, 850);
  };

  const handleSelect = (option: string) => {
    if (userAnswers[currentQ.id]) return; // Answer locked

    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: option,
    }));

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
      finishExam();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const finishExam = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id]?.toLowerCase() === q.correctAnswer.toLowerCase()) {
        correct++;
      }
    });

    const calculatedScore = Math.round((correct / questions.length) * 100);
    setExamFinalScore(calculatedScore);
    setIsExamCompleted(true);

    if (calculatedScore >= 70) {
      playSoundFanfare();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
      });
    }

    onComplete(correct * 30, calculatedScore);
  };

  const handleRetakeExam = () => {
    setUserAnswers({});
    setCurrentIdx(0);
    setIsExamCompleted(false);
  };

  // RESULTS SCREEN
  if (isExamCompleted) {
    const isPassed = examFinalScore >= 70;
    const correctAnswersCount = Object.keys(userAnswers).filter(
      (id) => userAnswers[Number(id)]?.toLowerCase() === questions.find((q) => q.id === Number(id))?.correctAnswer.toLowerCase()
    ).length;

    return (
      <div className="bg-white border-4 border-black rounded-[2rem] p-6 sm:p-10 max-w-2xl mx-auto text-center shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95">
        <div className="inline-flex p-5 rounded-full bg-[#FFD700] border-4 border-black mb-4 shadow-[4px_4px_0px_0px_#000]">
          <Trophy className="w-16 h-16 text-black" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-black mb-2">
          {isPassed ? 'כל הכבוד! הצטיינות במבחן! 🌟' : 'סיימתם את המבחן! תרגול מעולה! 💪'}
        </h2>

        <p className="text-base font-bold text-black/75 mb-6">
          {profile.name} • בית ספר צמרות באר יעקב
        </p>

        {/* Score Card */}
        <div className="bg-[#FFF9E6] border-4 border-black rounded-3xl p-6 mb-6 shadow-[6px_6px_0px_0px_#000]">
          <div className="text-6xl sm:text-7xl font-black text-black mb-1">
            {examFinalScore}
          </div>
          <div className="text-sm font-black text-black/60">
            ציון המבחן המסכם ({correctAnswersCount} מתוך {questions.length} תשובות נכונות)
          </div>

          <div className="mt-4 pt-4 border-t-2 border-black/20 text-xs sm:text-sm font-bold text-black">
            {isPassed
              ? 'שליטה מצוינת בכל חלקי המבחן: אותיות, אוצר מילים, אות פותחת, התאמת משפטים והבנת הנקרא!'
              : 'למדתם ותרגלתם נהדר! מומלץ לחזור על התחנות כדי לחזק את המילים לקראת ציון 100!'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button
            onClick={onOpenCertificate}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#4ECDC4] hover:bg-[#3dbdb4] text-black border-3 border-black font-black rounded-2xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#000] cursor-pointer"
          >
            <Award className="w-5 h-5" />
            <span>הצגת תעודת ההצטיינות להדפסה</span>
          </button>

          <button
            onClick={handleRetakeExam}
            className="w-full sm:w-auto px-5 py-3.5 bg-white hover:bg-gray-50 text-black border-3 border-black font-black rounded-2xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#000] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>מבחן חוזר</span>
          </button>

          <button
            onClick={onBackToBoard}
            className="w-full sm:w-auto px-5 py-3.5 bg-gray-100 hover:bg-gray-200 text-black border-3 border-black font-bold rounded-2xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#000] cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>חזרה ללוח</span>
          </button>
        </div>
      </div>
    );
  }

  // ACTIVE EXAM QUESTION SCREEN
  const isAnswered = !!selectedAnswer;

  return (
    <div className="bg-white border-4 border-black rounded-[2rem] p-4 sm:p-8 max-w-3xl mx-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in fade-in">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b-3 border-black pb-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#FFD700] text-black border-2 border-black px-3 py-0.5 rounded-full text-xs font-black shadow-[2px_2px_0px_0px_#000] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>תחנה 5 • {currentQ.section}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-black">
            מבחן האלופים המסכם באנגלית
          </h2>
        </div>

        <button
          onClick={onBackToBoard}
          className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 border-2 border-black rounded-xl font-bold text-xs flex items-center gap-1 shadow-[2px_2px_0px_0px_#000] cursor-pointer"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>יציאה</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-black text-black/70 mb-2">
          <span>שאלה {currentIdx + 1} מתוך {questions.length}</span>
          <span>
            נענו {Object.keys(userAnswers).length} מתוך {questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 h-3 rounded-full border-2 border-black overflow-hidden">
          <div
            className="bg-[#FFD700] h-full transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card (No clue emojis or icons as requested) */}
      <div className="bg-[#FFF9E6] border-4 border-black rounded-3xl p-6 sm:p-8 text-center relative shadow-[6px_6px_0px_0px_#000] mb-6">
        
        {/* Reading Passage if question has context */}
        {currentQ.readingContext && (
          <div className="mb-4 p-4 bg-white border-2 border-black rounded-2xl text-left" dir="ltr">
            <span className="text-xs font-black text-black/50 block mb-1" dir="rtl">
              קראו את הקטע הקצר:
            </span>
            <p className="text-sm sm:text-base font-english text-black leading-relaxed">
              {currentQ.readingContext}
            </p>
          </div>
        )}

        {/* Clean Instruction Text (no translation hints) */}
        <div className="text-base sm:text-lg font-black text-black mb-3">
          {currentQ.questionText}
        </div>

        {/* English Sentence / Prompt in Strict LTR with Underline Box */}
        {currentQ.subText && (
          <div className="my-3 flex justify-center">
            <div
              className="text-lg sm:text-2xl font-black text-black font-english bg-white border-2 border-black px-6 py-3 rounded-2xl shadow-[3px_3px_0px_0px_#000] text-center max-w-xl w-full tracking-wide"
              dir="ltr"
            >
              {currentQ.subText}
            </div>
          </div>
        )}

        {/* Audio Button with Clean Silent Pause (no MM, no BLANK) */}
        {currentQ.hasAudio && (
          <div className="mt-3">
            <button
              onClick={() => playExamSentence(currentQ)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-gray-50 border-2 border-black text-xs sm:text-sm font-black text-black shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer"
              title="השמעת המשפט עם עצירה שקטה במקום המילה החסרה"
            >
              <Volume2 className="w-4 h-4 text-black" />
              <span>השמעת המשפט עם עצירה במקום המילה החסרה 🔊</span>
            </button>
          </div>
        )}
      </div>

      {/* 4 Options Grid (Strict LTR for English options) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {currentQ.options.map((option) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option.toLowerCase() === currentQ.correctAnswer.toLowerCase();
          const isEnglishOption = currentQ.type !== 'meaning';

          let btnClass = 'bg-white hover:bg-gray-50 border-black text-black';

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
              key={option}
              onClick={() => handleSelect(option)}
              disabled={isAnswered}
              className={`p-4 sm:p-5 border-3 rounded-2xl text-base sm:text-lg font-black transition-all shadow-[4px_4px_0px_0px_#000] cursor-pointer hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-between text-left ${isEnglishOption ? 'font-english' : 'font-sans'} ${btnClass}`}
              dir={isEnglishOption ? 'ltr' : 'rtl'}
            >
              <span>{option}</span>
              {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-black shrink-0" />}
              {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t-2 border-black/20">
        <button
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 border-2 border-black rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_#000] cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>לשאלה הקודמת</span>
        </button>

        <button
          onClick={handleNext}
          disabled={!isAnswered}
          className="px-6 py-2.5 bg-[#FFD700] hover:bg-[#ffcd00] border-3 border-black font-black rounded-xl text-xs sm:text-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-[3px_3px_0px_0px_#000] cursor-pointer"
        >
          <span>{currentIdx < questions.length - 1 ? 'לשאלה הבאה' : 'לסיום המבחן'}</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
