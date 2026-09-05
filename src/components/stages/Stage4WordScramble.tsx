import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, Trophy, ArrowRight, Lightbulb, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VOCABULARY_WORDS, CONFIDENCE_MESSAGES_CORRECT } from '../../data/words';
import { WordItem } from '../../types';
import { speakWord, playSoundCorrect, playSoundLadder, playSoundCardFlip, playSoundEncourage } from '../../utils/audio';

interface Stage4WordScrambleProps {
  onComplete: (scoreGain: number) => void;
  onBackToBoard: () => void;
  onAddScore: (points: number) => void;
}

interface LetterTile {
  id: string;
  char: string;
  isUsed: boolean;
}

export const Stage4WordScramble: React.FC<Stage4WordScrambleProps> = ({
  onComplete,
  onBackToBoard,
  onAddScore,
}) => {
  const [shuffledWords, setShuffledWords] = useState<WordItem[]>(() =>
    [...VOCABULARY_WORDS].sort(() => Math.random() - 0.5).slice(0, 5)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState<WordItem>(VOCABULARY_WORDS[0]);
  const [availableLetters, setAvailableLetters] = useState<LetterTile[]>([]);
  const [placedLetters, setPlacedLetters] = useState<LetterTile[]>([]);
  const [solvedCount, setSolvedCount] = useState(0);
  const [feedback, setFeedback] = useState('לחצו על האותיות כדי להרכיב את הפועל באנגלית!');
  const [showHint, setShowHint] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const TARGET_GOAL = 5;

  const initWordRound = (idx: number, wordList: WordItem[]) => {
    const word = wordList[idx % wordList.length] || wordList[0];
    setCurrentWord(word);
    setShowHint(false);

    const letters = word.english.toUpperCase().split('');
    const tiles: LetterTile[] = letters
      .map((char, index) => ({
        id: `${char}-${index}-${Math.random()}`,
        char,
        isUsed: false,
      }))
      .sort(() => Math.random() - 0.5);

    setAvailableLetters(tiles);
    setPlacedLetters([]);
    setFeedback(`איך כותבים באנגלית: "${word.hebrew}"?`);
  };

  useEffect(() => {
    const fresh = [...VOCABULARY_WORDS].sort(() => Math.random() - 0.5).slice(0, 5);
    setShuffledWords(fresh);
    setCurrentIndex(0);
    initWordRound(0, fresh);
  }, []);

  const handlePickLetter = (tile: LetterTile) => {
    playSoundCardFlip();
    setAvailableLetters((prev) =>
      prev.map((t) => (t.id === tile.id ? { ...t, isUsed: true } : t))
    );
    const newPlaced = [...placedLetters, tile];
    setPlacedLetters(newPlaced);

    const targetUpper = currentWord.english.toUpperCase();
    if (newPlaced.length === targetUpper.length) {
      const spelled = newPlaced.map((t) => t.char).join('');
      if (spelled === targetUpper) {
        playSoundCorrect();
        speakWord(currentWord.english);
        onAddScore(40);
        const newSolved = solvedCount + 1;
        setSolvedCount(newSolved);

        const compliment =
          CONFIDENCE_MESSAGES_CORRECT[Math.floor(Math.random() * CONFIDENCE_MESSAGES_CORRECT.length)];
        setFeedback(`${compliment} איישתם נכון: ${currentWord.english}! 🎉`);

        if (newSolved >= TARGET_GOAL) {
          setTimeout(() => {
            playSoundLadder();
            confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
            setIsFinished(true);
          }, 800);
        } else {
          setTimeout(() => {
            setCurrentIndex((prev) => {
              const next = prev + 1;
              initWordRound(next, shuffledWords);
              return next;
            });
          }, 1200);
        }
      } else {
        playSoundEncourage();
        setFeedback('כמעט! נסו לבדוק את סדר האותיות שוב. אפשר ללחוץ על אות כדי להחזיר אותה! 💪');
      }
    }
  };

  const handleReturnLetter = (tile: LetterTile) => {
    playSoundCardFlip();
    setPlacedLetters((prev) => prev.filter((t) => t.id !== tile.id));
    setAvailableLetters((prev) =>
      prev.map((t) => (t.id === tile.id ? { ...t, isUsed: false } : t))
    );
  };

  const handleResetLetters = () => {
    setPlacedLetters([]);
    setAvailableLetters((prev) => prev.map((t) => ({ ...t, isUsed: false })));
  };

  const handleRevealHint = () => {
    setShowHint(true);
    speakWord(currentWord.english);
  };

  return (
    <div className="bg-white border-4 border-black rounded-[2rem] p-5 sm:p-8 relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in fade-in">
      <div className="absolute inset-0 bento-dot-bg opacity-10 pointer-events-none" />
      
      {/* Top Bento Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-5 border-b-3 border-black">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl p-1 bg-[#FFD700] rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              🔤
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-black">
              שלב 3: בונה המילים והאיות
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-bold text-black/70">
            לומדים לאיית ולכתוב: הרכיבו את הפועל באנגלית מהאותיות המעורבבות.
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

      {/* Target Word Bento Card */}
      {!isFinished && (
        <div className="relative z-10 max-w-xl mx-auto py-3">
          
          <div className="bg-[#A29BFE] rounded-[2rem] p-6 border-4 border-black text-center shadow-[6px_6px_0px_0px_#000]">
            <span className="text-5xl mb-2 inline-block filter drop-shadow animate-bounce-subtle">
              {currentWord.emoji}
            </span>

            <h3 className="text-2xl sm:text-3xl font-black text-black">
              תרגום לעברית: <span className="underline decoration-[#FFD700] decoration-4">"{currentWord.hebrew}"</span>
            </h3>

            {currentWord.hebrewNote && (
              <p className="text-xs font-bold text-black/75 mt-0.5">({currentWord.hebrewNote})</p>
            )}

            {/* Hint & Pronounce Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <button
                onClick={() => speakWord(currentWord.english)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-black border-2 border-black text-xs font-black transition-all shadow-[2px_2px_0px_0px_#000] cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-black" />
                <span>השמע הגייה באנגלית</span>
              </button>

              <button
                onClick={handleRevealHint}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FFD700] hover:bg-[#fcd000] text-black border-2 border-black text-xs font-black transition-all shadow-[2px_2px_0px_0px_#000] cursor-pointer"
              >
                <Lightbulb className="w-4 h-4 text-black" />
                <span>רמז: האות הראשונה {currentWord.english[0].toUpperCase()}</span>
              </button>
            </div>

            {showHint && (
              <div className="mt-3 text-xs font-black text-black bg-white border-2 border-black py-1.5 px-3 rounded-xl inline-block shadow-[2px_2px_0px_0px_#000]">
                תעתיק: [{currentWord.phonetic}] • דוגמה: {currentWord.exampleSentence}
              </div>
            )}
          </div>

          {/* Feedback Strip */}
          <div className="my-5 text-center text-xs sm:text-sm font-black text-black bg-[#FFF9E6] py-2.5 px-4 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000]">
            <Sparkles className="w-4 h-4 text-black inline mr-1" />
            {feedback}
          </div>

          {/* Placed Letters Slots Bento */}
          <div className="mb-6">
            <span className="block text-xs font-black text-black/70 text-center mb-2">
              המילה שלכם (לחצו על אות למחיקה והחזרה):
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2.5" dir="ltr">
              {Array.from({ length: currentWord.english.length }).map((_, idx) => {
                const placed = placedLetters[idx];

                return (
                  <button
                    key={idx}
                    onClick={() => placed && handleReturnLetter(placed)}
                    disabled={!placed}
                    className={`w-14 h-16 sm:w-16 sm:h-20 rounded-2xl border-3 font-english font-black text-2xl sm:text-3xl flex items-center justify-center transition-all ${
                      placed
                        ? 'bg-[#4ECDC4] text-black border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer'
                        : 'bg-white border-dashed border-black/40 text-black/20'
                    }`}
                  >
                    {placed ? placed.char : ''}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Available Scrambled Letter Tiles Bento */}
          <div>
            <span className="block text-xs font-black text-black/70 text-center mb-2">
              אותיות לבחירה (לחצו להוספה):
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3" dir="ltr">
              {availableLetters.map((tile) => (
                <button
                  key={tile.id}
                  onClick={() => handlePickLetter(tile)}
                  disabled={tile.isUsed}
                  className={`w-14 h-16 sm:w-16 sm:h-20 rounded-2xl border-3 border-black font-english font-black text-2xl sm:text-3xl flex items-center justify-center transition-all ${
                    tile.isUsed
                      ? 'bg-gray-200 border-black/30 text-gray-400 opacity-40 cursor-not-allowed shadow-none'
                      : 'bg-[#FFD700] hover:bg-[#fed600] text-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer'
                  }`}
                >
                  {tile.char}
                </button>
              ))}
            </div>
          </div>

          {/* Reset & Progress Buttons */}
          <div className="mt-7 flex items-center justify-between">
            <button
              onClick={handleResetLetters}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-100 text-black border-2 border-black text-xs font-black flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_#000] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-black" />
              איפוס אותיות
            </button>

            <span className="text-xs font-black text-black bg-[#4ECDC4] border-2 border-black px-3.5 py-2 rounded-xl shadow-[2px_2px_0px_0px_#000]">
              הושלמו: {solvedCount} / {TARGET_GOAL}
            </span>
          </div>

        </div>
      )}

      {/* Stage Completion Banner */}
      {isFinished && (
        <div className="relative z-10 p-6 rounded-[2rem] bg-[#FF8C42] border-4 border-black text-white text-center shadow-[6px_6px_0px_0px_#000] animate-in zoom-in-95">
          <Trophy className="w-12 h-12 mx-auto mb-2 text-[#FFD700] filter drop-shadow animate-bounce" />
          <h3 className="text-2xl sm:text-3xl font-black mb-1">
            מעולה! סיימתם את שלב 3 בהצטיינות!
          </h3>
          <p className="text-xs sm:text-sm font-bold text-white/90 max-w-md mx-auto mb-5">
            אייתתם את הפעלים בדיוק מושלם! עכשיו בואו נבדוק את הזיכרון בשלב 4 לקראת המבחן המסכם של צמרות.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onComplete(300)}
              className="px-7 py-3 bg-[#FFD700] hover:bg-[#fed600] text-black font-black border-3 border-black rounded-xl text-sm transition-all shadow-[3px_3px_0px_0px_#000] cursor-pointer"
            >
              המשך לשלב 4: משחק הזיכרון וההתאמה! 🃏
            </button>
            <button
              onClick={() => {
                const fresh = [...VOCABULARY_WORDS].sort(() => Math.random() - 0.5).slice(0, 5);
                setShuffledWords(fresh);
                setCurrentIndex(0);
                setIsFinished(false);
                setSolvedCount(0);
                initWordRound(0, fresh);
              }}
              className="px-5 py-3 bg-white hover:bg-gray-100 text-black font-black border-3 border-black rounded-xl text-xs transition-colors shadow-[2px_2px_0px_0px_#000] cursor-pointer"
            >
              שחק שוב (הגרלת 5 פעלים חדשים) 🔤
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
