import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, Trophy, ArrowRight, CheckCircle2, XCircle, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VOCABULARY_WORDS, CONFIDENCE_MESSAGES_CORRECT, CONFIDENCE_MESSAGES_ENCOURAGING } from '../../data/words';
import { speakWord, playSoundCorrect, playSoundLadder, playSoundEncourage } from '../../utils/audio';

interface Stage2SpeedQuizProps {
  onComplete: (scoreGain: number) => void;
  onBackToBoard: () => void;
  onAddScore: (points: number) => void;
}

interface Question {
  type: 'en-to-he' | 'he-to-en' | 'audio';
  prompt: string;
  wordEnglish: string;
  wordHebrew: string;
  correctAnswer: string;
  options: string[];
  emoji: string;
  hint: string;
}

export const Stage2SpeedQuiz: React.FC<Stage2SpeedQuizProps> = ({
  onComplete,
  onBackToBoard,
  onAddScore,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [localStreak, setLocalStreak] = useState(0);
  const [feedback, setFeedback] = useState<string>('בחרו את התשובה הנכונה וטפסו בסולם!');
  const [isFinished, setIsFinished] = useState(false);
  const TARGET_GOAL = 6;

  const generateQuestion = (): Question => {
    const targetWord = VOCABULARY_WORDS[Math.floor(Math.random() * VOCABULARY_WORDS.length)];
    const types: ('en-to-he' | 'he-to-en' | 'audio')[] = ['en-to-he', 'he-to-en', 'audio'];
    const qType = types[Math.floor(Math.random() * types.length)];

    const distractors = VOCABULARY_WORDS.filter((w) => w.id !== targetWord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    let prompt = '';
    let correctAnswer = '';
    let options: string[] = [];

    if (qType === 'en-to-he') {
      prompt = `מה הפירוש של הפועל "${targetWord.english}"?`;
      correctAnswer = targetWord.hebrew;
      options = [targetWord.hebrew, ...distractors.map((d) => d.hebrew)].sort(() => Math.random() - 0.5);
    } else if (qType === 'he-to-en') {
      prompt = `איך אומרים באנגלית: "${targetWord.hebrew}"?`;
      correctAnswer = targetWord.english;
      options = [targetWord.english, ...distractors.map((d) => d.english)].sort(() => Math.random() - 0.5);
    } else {
      prompt = `הקשיבו לפועל: איזו מילה נאמרה?`;
      correctAnswer = targetWord.english;
      options = [targetWord.english, ...distractors.map((d) => d.english)].sort(() => Math.random() - 0.5);
    }

    return {
      type: qType,
      prompt,
      wordEnglish: targetWord.english,
      wordHebrew: targetWord.hebrew,
      correctAnswer,
      options,
      emoji: targetWord.emoji,
      hint: `${targetWord.sentenceHebrew} ("${targetWord.exampleSentence}")`,
    };
  };

  const nextQuestion = () => {
    const q = generateQuestion();
    setCurrentQuestion(q);
    setSelectedOption(null);
    setIsAnswered(false);
    if (q.type === 'audio') {
      setTimeout(() => speakWord(q.wordEnglish), 300);
    }
  };

  useEffect(() => {
    nextQuestion();
  }, []);

  const handleSelectOption = (option: string) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentQuestion.correctAnswer;

    if (isCorrect) {
      playSoundCorrect();
      speakWord(currentQuestion.wordEnglish);
      const newStreak = localStreak + 1;
      setLocalStreak(newStreak);
      const points = 30 + newStreak * 5;
      onAddScore(points);

      const newCorrect = correctCount + 1;
      setCorrectCount(newCorrect);

      if (newStreak % 3 === 0) {
        playSoundLadder();
        setFeedback(`🪜 וואו! סולם בונוס! 3 תשובות נכונות ברצף! צברתם ${points} נקודות!`);
      } else {
        const compliment =
          CONFIDENCE_MESSAGES_CORRECT[Math.floor(Math.random() * CONFIDENCE_MESSAGES_CORRECT.length)];
        setFeedback(compliment);
      }

      if (newCorrect >= TARGET_GOAL) {
        setTimeout(() => {
          playSoundLadder();
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
          setIsFinished(true);
        }, 1200);
      }
    } else {
      playSoundEncourage();
      setLocalStreak(0);
      const enc =
        CONFIDENCE_MESSAGES_ENCOURAGING[Math.floor(Math.random() * CONFIDENCE_MESSAGES_ENCOURAGING.length)];
      setFeedback(`${enc} התשובה הנכונה היא: ${currentQuestion.correctAnswer}`);
    }
  };

  return (
    <div className="bg-white border-4 border-black rounded-[2rem] p-5 sm:p-8 relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in fade-in">
      <div className="absolute inset-0 bento-dot-bg opacity-10 pointer-events-none" />
      
      {/* Top Bento Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-5 border-b-3 border-black">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl p-1 bg-[#4ECDC4] rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              ⚡
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-black">
              שלב 2: סולם הבחירה המהירה
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-bold text-black/70">
            ענו על {TARGET_GOAL} שאלות נכונות, צברו רצפים וטפסו בסולם השלב השני!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToBoard}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFD700] hover:bg-[#fed600] text-black text-xs font-black transition-all border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5 text-black" />
            למפת הסולמות
          </button>
        </div>
      </div>

      {/* Progress & Ladder Streak Bento Strip */}
      <div className="relative z-10 my-5 flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#FFF9E6] border-3 border-black text-xs sm:text-sm shadow-[3px_3px_0px_0px_#000]">
        <div className="flex items-center gap-2 font-black text-black">
          <Sparkles className="w-4 h-4 text-black" />
          <span>{feedback}</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {localStreak > 1 && (
            <span className="flex items-center gap-1 bg-[#FF8C42] text-black border-2 border-black px-2.5 py-1 rounded-lg font-black shadow-[1px_1px_0px_0px_#000] animate-bounce-subtle">
              <Flame className="w-3.5 h-3.5 fill-yellow-300 text-black" />
              {localStreak} ברצף!
            </span>
          )}
          <span className="font-black text-black bg-[#4ECDC4] border-2 border-black px-3 py-1 rounded-xl shadow-[1px_1px_0px_0px_#000]">
            התקדמות: {correctCount} / {TARGET_GOAL}
          </span>
        </div>
      </div>

      {/* Bento Layout Question Arena */}
      {!isFinished && currentQuestion && (
        <div className="relative z-10 max-w-2xl mx-auto py-2">
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-4">
            
            {/* Focal Word Bento Card */}
            <div className="w-56 h-64 bg-[#FF8C42] border-4 border-black rounded-3xl p-4 flex flex-col items-center justify-center gap-3 rotate-[-2deg] shadow-[6px_6px_0px_0px_#000] text-center shrink-0">
              <span className="text-4xl filter drop-shadow">{currentQuestion.emoji}</span>
              <p className="text-3xl sm:text-4xl font-black text-white font-english tracking-wide">
                {currentQuestion.wordEnglish}
              </p>
              <div className="h-1.5 w-20 bg-black/20 rounded-full"></div>
              <p className="text-lg font-black text-black bg-[#FFD700] px-3 py-0.5 rounded-lg border-2 border-black shadow-[1px_1px_0px_0px_#000]">
                {currentQuestion.prompt}
              </p>
              
              <button
                onClick={() => speakWord(currentQuestion.wordEnglish)}
                className="mt-1 flex items-center gap-1 bg-white hover:bg-gray-100 text-black px-2.5 py-1 rounded-lg border-2 border-black text-xs font-black shadow-[1px_1px_0px_0px_#000] cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-black" />
                השמע
              </button>
            </div>

            {/* 4 Bento Option Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isCorrectAnswer = option === currentQuestion.correctAnswer;

                let btnStyle = 'bg-white hover:bg-gray-50 text-black border-3 border-black shadow-[3px_3px_0px_0px_#000]';

                if (isAnswered) {
                  if (isCorrectAnswer) {
                    btnStyle = 'bg-[#4ECDC4] text-black border-3 border-black shadow-[3px_3px_0px_0px_#000] font-black scale-102';
                  } else if (isSelected) {
                    btnStyle = 'bg-[#FF6B6B] text-white border-3 border-black shadow-[3px_3px_0px_0px_#000]';
                  } else {
                    btnStyle = 'bg-gray-100 border-2 border-black/40 opacity-50 text-gray-500 shadow-none';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(option)}
                    disabled={isAnswered}
                    className={`min-h-[4rem] p-3 rounded-2xl font-black text-base sm:text-lg transition-all flex items-center justify-between cursor-pointer active:translate-x-[2px] active:translate-y-[2px] ${btnStyle}`}
                    id={`quiz-option-${idx}`}
                  >
                    <span className={currentQuestion.type !== 'en-to-he' ? 'font-english text-xl' : ''}>
                      {option}
                    </span>

                    {isAnswered && isCorrectAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-black shrink-0" />
                    )}
                    {isAnswered && isSelected && !isCorrectAnswer && (
                      <XCircle className="w-5 h-5 text-white shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Hint Bento Box */}
          <div className="mt-3 bg-blue-50 border-3 border-dashed border-blue-400 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-black flex items-center justify-center text-white font-black text-sm shrink-0 shadow-[1px_1px_0px_0px_#000]">
              !
            </div>
            <p className="font-bold text-xs sm:text-sm text-blue-950">
              <strong className="font-black">רמז מעצים: </strong> {currentQuestion.hint}
            </p>
          </div>

          {/* Next Question Bento Button */}
          {isAnswered && (
            <div className="mt-5 text-center">
              <button
                onClick={nextQuestion}
                className="px-8 py-3.5 bg-[#FFD700] hover:bg-[#fcd000] text-black font-black border-3 border-black rounded-2xl text-base transition-all shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer animate-in zoom-in-95"
              >
                לשאלה הבאה בסולם 🪜
              </button>
            </div>
          )}

        </div>
      )}

      {/* Stage Completion Banner */}
      {isFinished && (
        <div className="relative z-10 p-6 rounded-[2rem] bg-[#A29BFE] border-4 border-black text-black text-center shadow-[6px_6px_0px_0px_#000] animate-in zoom-in-95">
          <Trophy className="w-12 h-12 mx-auto mb-2 text-[#FFD700] filter drop-shadow animate-bounce" />
          <h3 className="text-2xl sm:text-3xl font-black mb-1">
            מדהים! סיימתם את שלב 2: סולם הבחירה!
          </h3>
          <p className="text-xs sm:text-sm font-bold text-black/80 max-w-md mx-auto mb-5">
            הפגנתם שליטה מעולה בפעלים ובמשמעותם! צברתם 250 נקודות נוספות והביטחון שלכם רק מתעצם.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onComplete(250)}
              className="px-7 py-3 bg-[#4ECDC4] hover:bg-[#3dbdb4] text-black font-black border-3 border-black rounded-xl text-sm transition-all shadow-[3px_3px_0px_0px_#000] cursor-pointer"
            >
              המשך לשלב 3: מפוצץ בועות המילים! 🫧
            </button>
            <button
              onClick={() => {
                setIsFinished(false);
                setCorrectCount(0);
                setLocalStreak(0);
                nextQuestion();
              }}
              className="px-5 py-3 bg-white hover:bg-gray-100 text-black font-black border-3 border-black rounded-xl text-xs transition-colors shadow-[2px_2px_0px_0px_#000] cursor-pointer"
            >
              שחק שוב
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
