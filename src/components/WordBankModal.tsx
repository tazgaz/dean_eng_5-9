import React, { useState } from 'react';
import { X, Volume2, Search, Sparkles, CheckCircle2, BookOpen } from 'lucide-react';
import { VOCABULARY_WORDS } from '../data/words';
import { speakWord, speakSentence } from '../utils/audio';

interface WordBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  masteredWords: string[];
}

export const WordBankModal: React.FC<WordBankModalProps> = ({
  isOpen,
  onClose,
  masteredWords,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredWords = VOCABULARY_WORDS.filter(
    (w) =>
      w.english.toLowerCase().includes(search.toLowerCase()) ||
      w.hebrew.includes(search) ||
      w.phonetic.includes(search)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white border-4 border-black rounded-[2rem] max-w-2xl w-full max-h-[90vh] flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        
        {/* Top Bento Header */}
        <div className="bg-[#FFD700] border-b-4 border-black text-black p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000]">
              <BookOpen className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black">
                מילון אוצר המילים למבחן (29 מילים) - כיתה ה'
              </h2>
              <p className="text-xs font-bold text-black/70">
                בית ספר צמרות באר יעקב • לחצו על הרמקול לשמיעת הגייה באנגלית
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white hover:bg-gray-100 text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
            aria-label="סגור מילון"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Stats Bento Strip */}
        <div className="p-4 bg-[#FFF9E6] border-b-3 border-black flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-black/50 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="חפש מילה בעברית או באנגלית..."
              className="w-full pl-3 pr-9 py-2 bg-white border-2 border-black rounded-xl text-sm font-bold text-black focus:outline-none shadow-[2px_2px_0px_0px_#000]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-black text-black self-end sm:self-auto">
            <span className="flex items-center gap-1 bg-[#4ECDC4] border-2 border-black px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_0px_#000]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              נלמדו: {masteredWords.length} / {VOCABULARY_WORDS.length}
            </span>
          </div>
        </div>

        {/* Words List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-white">
          {filteredWords.map((word) => {
            const isMastered = masteredWords.includes(word.id);

            return (
              <div
                key={word.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#FFF9E6] border-2 border-black hover:bg-[#fff4d1] transition-all shadow-[2px_2px_0px_0px_#000]"
              >
                {/* Word details */}
                <div className="flex items-start gap-3">
                  <span className="text-2xl p-2 bg-white border-2 border-black rounded-2xl shadow-[1px_1px_0px_0px_#000] select-none">
                    {word.emoji}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-black font-english">
                        {word.english}
                      </span>
                      <button
                        onClick={() => speakWord(word.english)}
                        className="p-1 bg-white hover:bg-gray-100 text-black border border-black rounded-lg transition-all shadow-[1px_1px_0px_0px_#000] cursor-pointer"
                        title="השמע הגייה באנגלית"
                        aria-label={`השמע ${word.english}`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs text-black/70 bg-white border border-black px-1.5 py-0.5 rounded-md font-mono font-bold">
                        [{word.phonetic}]
                      </span>
                      {isMastered && (
                        <span className="text-black bg-[#4ECDC4] border border-black text-[11px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-[1px_1px_0px_0px_#000]">
                          <Sparkles className="w-3 h-3" /> נשלט!
                        </span>
                      )}
                    </div>

                    <div className="text-sm font-black text-black mt-0.5">
                      פירוש: <span className="underline decoration-[#FF8C42] decoration-2">{word.hebrew}</span>
                      {word.hebrewNote && (
                        <span className="text-xs text-black/60 font-medium mr-1.5">
                          ({word.hebrewNote})
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-black/70 mt-1.5 flex flex-wrap items-center gap-1.5">
                      <button
                        onClick={() => speakSentence(word.exampleSentence)}
                        className="p-1 bg-[#FFF9E6] hover:bg-[#FFD700] text-black border border-black rounded-md flex items-center gap-1 transition-all shadow-[1px_1px_0px_0px_#000] cursor-pointer"
                        title="הקרא משפט באנגלית"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span className="text-[10px] font-black">הקרא משפט</span>
                      </button>
                      <span
                        dir="ltr"
                        onClick={() => speakSentence(word.exampleSentence)}
                        className="font-english font-bold text-black cursor-pointer hover:text-[#FF6B6B] transition-colors"
                        title="לחצו להקראת המשפט"
                      >
                        "{word.exampleSentence}"
                      </span>
                      <span className="text-black/60">({word.sentenceHebrew})</span>
                    </div>
                  </div>
                </div>

                {/* Audio quick button */}
                <button
                  onClick={() => speakWord(word.english)}
                  className="self-end sm:self-center px-3.5 py-1.5 bg-[#FFD700] hover:bg-[#fed600] text-black border-2 border-black font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-black" />
                  הגייה
                </button>
              </div>
            );
          })}

          {filteredWords.length === 0 && (
            <div className="text-center py-8 font-black text-black/50">
              לא נמצאה מילה התואמת לחיפוש "{search}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FFF9E6] border-t-3 border-black text-center">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-2.5 bg-[#FF8C42] hover:bg-[#ff7b2b] text-white border-2 border-black font-black rounded-xl text-sm transition-all shadow-[2px_2px_0px_0px_#000] cursor-pointer"
          >
            חזרה למשחק
          </button>
        </div>

      </div>
    </div>
  );
};
