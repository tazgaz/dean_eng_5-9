import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, Trophy, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VOCABULARY_WORDS, CONFIDENCE_MESSAGES_CORRECT } from '../../data/words';
import { speakWord, playSoundCardFlip, playSoundCorrect, playSoundLadder } from '../../utils/audio';

interface Stage1MemoryProps {
  onComplete: (scoreGain: number) => void;
  onBackToBoard: () => void;
  onAddScore: (points: number) => void;
}

interface Card {
  id: string; // unique card id
  wordId: string;
  type: 'english' | 'hebrew';
  text: string;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const Stage1Memory: React.FC<Stage1MemoryProps> = ({
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

  // Initialize 8 pairs (16 cards) from the vocabulary
  const initializeGame = () => {
    // Pick 8 random words from the 16 words
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

    // Shuffle the 16 cards
    setCards(newCards.sort(() => Math.random() - 0.5));
    setSelectedCards([]);
    setMatchesCount(0);
    setMoves(0);
    setIsFinished(false);
    setEncouragement('בואו נתחיל! הפכו קלף ראשון ובדקו את הפועל!');
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
    } else {
      const matchWord = VOCABULARY_WORDS.find((w) => w.id === currentCard.wordId);
      if (matchWord) speakWord(matchWord.english);
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
        // MATCH!
        playSoundCorrect();
        onAddScore(25);
        const randomCompliment =
          CONFIDENCE_MESSAGES_CORRECT[Math.floor(Math.random() * CONFIDENCE_MESSAGES_CORRECT.length)];
        const matchedWord = VOCABULARY_WORDS.find((w) => w.id === first.wordId);
        setEncouragement(`${randomCompliment} (${matchedWord?.english} = ${matchedWord?.hebrew})`);

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
            // FINISHED STAGE 1!
            playSoundLadder();
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
            setIsFinished(true);
            setEncouragement('אלופים של צמרות באר יעקב! סיימתם את שלב 1 בהצטיינות! 🏆');
          }
        }, 600);
      } else {
        // NO MATCH
        setEncouragement('כמעט! המשיכו לנסות, אתם לומדים מכל ניסיון! 💫');
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c
            )
          );
          setSelectedCards([]);
        }, 1100);
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
            <span className="text-2xl p-1 bg-[#FFD700] rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              🃏
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-black">
              שלב 1: סולם הזיכרון וההתאמה
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-bold text-black/70">
            התאימו בין כרטיס המילה באנגלית לתרגומה בעברית. בכל לחיצה נשמע את ההגייה!
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
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFD700] hover:bg-[#fcd000] text-black text-xs font-black transition-all border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5 text-black" />
            למפת הסולמות
          </button>
        </div>
      </div>

      {/* Confidence Encouragement Bento Strip */}
      <div className="relative z-10 my-5 p-4 rounded-2xl bg-[#FFF9E6] border-3 border-black flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-black text-black shadow-[3px_3px_0px_0px_#000]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-black shrink-0" />
          <span>{encouragement}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-black font-black shrink-0">
          <span className="bg-[#4ECDC4] border-2 border-black px-2.5 py-1 rounded-lg shadow-[1px_1px_0px_0px_#000]">
            זוגות: {matchesCount} / 8
          </span>
          <span className="bg-white border-2 border-black px-2.5 py-1 rounded-lg shadow-[1px_1px_0px_0px_#000]">
            מהלכים: {moves}
          </span>
        </div>
      </div>

      {/* 4x4 Grid of Bento Memory Cards */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 max-w-2xl mx-auto py-2">
        {cards.map((card, idx) => {
          const isOpen = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              disabled={isOpen || selectedCards.length >= 2}
              className={`h-24 sm:h-28 rounded-2xl p-2 font-black transition-all duration-200 transform flex flex-col items-center justify-center relative cursor-pointer border-3 border-black ${
                card.isMatched
                  ? 'bg-[#4ECDC4]/30 text-black scale-95 shadow-[2px_2px_0px_0px_#000]'
                  : isOpen
                  ? card.type === 'english'
                    ? 'bg-[#4ECDC4] text-black shadow-[4px_4px_0px_0px_#000]'
                    : 'bg-[#FFD700] text-black shadow-[4px_4px_0px_0px_#000]'
                  : 'bg-[#FF8C42] hover:bg-[#ff7e2e] text-white shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px]'
              }`}
              id={`memory-card-${idx}`}
            >
              {isOpen ? (
                <>
                  <span className="text-xl mb-0.5">{card.emoji}</span>
                  <span
                    className={`text-base sm:text-lg font-black ${
                      card.type === 'english' ? 'font-english tracking-wide text-black' : 'text-black'
                    }`}
                  >
                    {card.text}
                  </span>
                  <span className="text-[10px] text-black/70 uppercase font-black mt-0.5">
                    {card.type === 'english' ? 'English' : 'עברית'}
                  </span>
                  {card.isMatched && (
                    <span className="absolute top-1 right-1 text-black bg-white rounded-full p-0.5 border border-black">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-2xl sm:text-3xl">🪜</span>
                  <span className="text-xs font-black text-black mt-0.5 bg-[#FFD700] px-2 py-0.2 rounded-md border border-black">
                    צמרות
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Completion Bento Banner */}
      {isFinished && (
        <div className="relative z-10 mt-7 p-6 rounded-[2rem] bg-[#4ECDC4] border-4 border-black text-black text-center shadow-[6px_6px_0px_0px_#000] animate-in zoom-in-95">
          <Trophy className="w-12 h-12 mx-auto mb-2 text-[#FFD700] filter drop-shadow animate-bounce" />
          <h3 className="text-2xl sm:text-3xl font-black mb-1">
            כל הכבוד! סיימתם את סולם הזיכרון!
          </h3>
          <p className="text-xs sm:text-sm font-bold text-black/80 max-w-md mx-auto mb-5">
            השלמתם את התאמת הפעלים בהצלחה רבה! צברתם 200 נקודות וקידמתם את מד הביטחון שלכם.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onComplete(200)}
              className="px-7 py-3 bg-[#FFD700] hover:bg-[#ffe066] text-black font-black border-3 border-black rounded-xl text-sm transition-all shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
            >
              המשך לשלב 2: סולם הבחירה המהירה! 🚀
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
