import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VOCABULARY_WORDS, CONFIDENCE_MESSAGES_CORRECT } from '../../data/words';
import { speakWord, playSoundCardFlip, playSoundCorrect } from '../../utils/audio';

interface Stage4MemoryProps {
  onComplete: (scoreGain: number) => void;
  onBackToBoard: () => void;
  onAddScore: (points: number) => void;
}

interface Card {
  id: string;
  wordId: string;
  type: 'english' | 'hebrew';
  text: string;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const Stage4Memory: React.FC<Stage4MemoryProps> = ({
  onComplete,
  onBackToBoard,
  onAddScore,
}) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [matchesCount, setMatchesCount] = useState(0);
  const [encouragement, setEncouragement] = useState<string>('הפכו שני קלפים ומצאו את הזוגות המתאימים!');
  const [isFinished, setIsFinished] = useState(false);
  const [moves, setMoves] = useState(0);

  // Initialize 8 pairs (16 cards)
  const initializeGame = () => {
    const shuffledWords = [...VOCABULARY_WORDS].sort(() => Math.random() - 0.5).slice(0, 8);
    const newCards: Card[] = [];

    shuffledWords.forEach((word) => {
      newCards.push({
        id: `${word.id}-en`,
        wordId: word.id,
        type: 'english',
        text: word.english,
        emoji: word.emoji,
        isFlipped: false,
        isMatched: false,
      });
      newCards.push({
        id: `${word.id}-he`,
        wordId: word.id,
        type: 'hebrew',
        text: word.hebrew,
        emoji: word.emoji,
        isFlipped: false,
        isMatched: false,
      });
    });

    setCards(newCards.sort(() => Math.random() - 0.5));
    setSelectedCards([]);
    setMatchesCount(0);
    setMoves(0);
    setIsFinished(false);
    setEncouragement('בואו נבדוק את הזיכרון! הפכו קלף ראשון.');
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (selectedCards.length >= 2 || cards[index].isFlipped || cards[index].isMatched) {
      return;
    }

    playSoundCardFlip();
    const currentCard = cards[index];
    if (currentCard.type === 'english') {
      speakWord(currentCard.text);
    }

    const updated = [...cards];
    updated[index].isFlipped = true;
    setCards(updated);

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newSelected;
      const first = updated[firstIdx];
      const second = updated[secondIdx];

      if (first.wordId === second.wordId && first.type !== second.type) {
        playSoundCorrect();
        onAddScore(25);
        const randomCompliment =
          CONFIDENCE_MESSAGES_CORRECT[Math.floor(Math.random() * CONFIDENCE_MESSAGES_CORRECT.length)];
        const matchedWord = VOCABULARY_WORDS.find((w) => w.id === first.wordId);
        setEncouragement(`${randomCompliment} התאמה מעולה! ✨`);

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isMatched: true } : c
            )
          );
          setSelectedCards([]);
          const newCount = matchesCount + 1;
          setMatchesCount(newCount);

          if (newCount === 8) {
            confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
            setIsFinished(true);
            setEncouragement('אלופים של צמרות באר יעקב! הזיכרון שלכם מושלם לקראת המבחן! 🏆');
          }
        }, 500);
      } else {
        setEncouragement('כמעט! נסו לזכור איפה כל קלף נמצא! 💫');
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c
            )
          );
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="bg-white border-4 border-black rounded-[2rem] p-5 sm:p-8 relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in fade-in">
      <div className="absolute inset-0 bento-dot-bg opacity-10 pointer-events-none" />

      {/* Top Bento Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-5 border-b-3 border-black">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl p-1 bg-[#A29BFE] rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              🃏
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-black">
              שלב 4: משחק הזיכרון וההתאמה
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-bold text-black/70">
            עכשיו כשלמדנו ואייתנו את המילים – בודקים את הזיכרון! התאימו בין קלפי האנגלית לקלפי העברית.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={initializeGame}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF9E6] hover:bg-[#fff2cc] text-black text-xs font-black transition-all border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
            title="ערבב קלפים והתחל מחדש"
          >
            <RefreshCw className="w-3.5 h-3.5 text-black" />
            ערבב מחדש
          </button>
          <button
            onClick={onBackToBoard}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4ECDC4] hover:bg-[#3dbdb4] text-black text-xs font-black transition-all border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5 text-black" />
            למסלול השלבים
          </button>
        </div>
      </div>

      {/* Stats Bento Strip */}
      <div className="relative z-10 my-5 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#FFF9E6] border-3 border-black text-xs sm:text-sm shadow-[3px_3px_0px_0px_#000]">
        <div className="flex items-center gap-2 font-black text-black">
          <Sparkles className="w-4 h-4 text-black" />
          <span>{encouragement}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-bold text-black/60">
            מהלכים: <strong className="font-black text-black">{moves}</strong>
          </span>
          <span className="font-black text-black bg-[#FFD700] border-2 border-black px-3 py-1 rounded-xl shadow-[1px_1px_0px_0px_#000]">
            התאמות: {matchesCount} / 8
          </span>
        </div>
      </div>

      {/* Cards 4x4 Bento Grid */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto py-2">
        {cards.map((card, index) => {
          const isSelected = selectedCards.includes(index);
          const showContent = card.isFlipped || card.isMatched;

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(index)}
              className={`relative aspect-[4/3] rounded-2xl border-3 border-black flex items-center justify-center p-3 text-center cursor-pointer select-none transition-all duration-300 ${
                card.isMatched
                  ? 'bg-[#4ECDC4] border-black text-black shadow-[2px_2px_0px_0px_#000] opacity-85 scale-95'
                  : showContent
                  ? 'bg-white border-black text-black shadow-[4px_4px_0px_0px_#000] rotate-0 scale-102'
                  : 'bg-[#FFD700] hover:bg-[#fed600] border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px]'
              }`}
              id={`memory-card-${index}`}
            >
              {showContent ? (
                <div className="flex flex-col items-center justify-center gap-1.5 animate-in zoom-in-75">
                  <span
                    className={`font-black leading-tight ${
                      card.type === 'english'
                        ? 'font-english text-xl sm:text-2xl text-black'
                        : 'text-lg sm:text-xl text-black underline decoration-[#FF8C42] decoration-2'
                    }`}
                  >
                    {card.text}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-black uppercase text-black/60 bg-black/5 px-2 py-0.5 rounded-md border border-black/15">
                    {card.type === 'english' ? 'English' : 'עברית'}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center text-xl shadow-[1px_1px_0px_0px_#000]">
                    ⭐
                  </div>
                  <span className="text-[10px] font-black text-black mt-1 uppercase tracking-wider">
                    צמרות
                  </span>
                </div>
              )}

              {card.isMatched && (
                <div className="absolute top-1.5 right-1.5 text-black">
                  <CheckCircle2 className="w-4 h-4 fill-[#4ECDC4] text-black" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Finished Stage Modal/Banner */}
      {isFinished && (
        <div className="relative z-10 mt-6 p-6 rounded-[2rem] bg-[#FFD700] border-4 border-black text-black text-center shadow-[6px_6px_0px_0px_#000] animate-in zoom-in-95">
          <Trophy className="w-12 h-12 mx-auto mb-2 text-black filter drop-shadow animate-bounce" />
          <h3 className="text-2xl sm:text-3xl font-black mb-1">
            כל הכבוד! סיימתם את שלב 4 בהצטיינות!
          </h3>
          <p className="text-xs sm:text-sm font-bold text-black/80 max-w-md mx-auto mb-4">
            הוכחתם זיכרון מעולה והתאמה מושלמת של כל הפעלים! כעת אתם מוכנים ב-100% למבחן האלופים המסכם של צמרות.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onComplete(250)}
              className="px-7 py-3 bg-[#4ECDC4] hover:bg-[#3dbdb4] text-black font-black border-3 border-black rounded-xl text-sm transition-all shadow-[3px_3px_0px_0px_#000] cursor-pointer"
            >
              המשך לשלב 5: מבחן האלופים המסכם! 🏆
            </button>
            <button
              onClick={initializeGame}
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
