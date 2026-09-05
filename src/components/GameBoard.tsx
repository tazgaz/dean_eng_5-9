import React from 'react';
import { Sparkles, Trophy, Play, CheckCircle2, Star, ArrowLeft } from 'lucide-react';
import { StageId } from '../types';
import { STAGES_CONFIG } from '../data/words';

interface GameBoardProps {
  boardPosition: number;
  currentStage: StageId;
  completedStages: number[];
  avatar: string;
  playerName: string;
  onSelectStage: (stageId: StageId) => void;
  onAdvancePosition: (newPos: number) => void;
  confidenceLevel: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  currentStage,
  completedStages,
  avatar,
  playerName,
  onSelectStage,
  confidenceLevel,
}) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      
      {/* Clean Bento Hero Card */}
      <div className="bg-white border-4 border-black rounded-[2rem] p-6 sm:p-8 relative shadow-[6px_6px_0px_0px_#000] overflow-hidden">
        <div className="absolute inset-0 bento-dot-bg opacity-10 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-right">
            <div className="inline-flex items-center gap-1.5 bg-[#FFD700] text-black border-2 border-black px-3.5 py-1 rounded-full text-xs font-black shadow-[2px_2px_0px_0px_#000] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>מסלול הלמידה • צמרות באר יעקב</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black leading-tight">
              שלום {playerName} {avatar}! מוכנים ללמוד ולהצליח?
            </h2>

            <p className="text-sm sm:text-base font-bold text-black/75 mt-2 max-w-xl">
              לומדים את 16 הפעלים צעד אחר צעד: קודם מכירים ומבינים, אחר כך מתרגלים ומאייתים, בודקים את הזיכרון ומסיימים במבחן האלופים!
            </p>
          </div>

          {/* Player Quick Action */}
          <div className="shrink-0 flex flex-col items-center gap-2">
            <button
              onClick={() => onSelectStage(currentStage)}
              className="px-6 py-3.5 bg-[#4ECDC4] hover:bg-[#3dbdb4] text-black border-3 border-black font-black rounded-2xl text-sm sm:text-base flex items-center gap-2.5 transition-all shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
              id="continue-current-stage-btn"
            >
              <Play className="w-4 h-4 fill-black text-black" />
              <span>המשך לשלב {currentStage}</span>
            </button>
            <span className="text-[11px] font-bold text-black/60">
              הושלמו {completedStages.length} מתוך 5 שלבים
            </span>
          </div>
        </div>
      </div>

      {/* Spacious 5-Stage Bento Cards */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-black text-black flex items-center gap-2">
            <span>📚</span>
            <span>שלבי המסלול לפי הסדר הנכון:</span>
          </h3>
          <span className="text-xs font-bold text-black/60">
            לחצו על כל שלב כדי להתחיל
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {STAGES_CONFIG.map((stage) => {
            const isCompleted = completedStages.includes(stage.id);
            const isCurrent = currentStage === stage.id;

            // Card border & accent colors
            const bgClass = isCurrent
              ? 'bg-[#FFF9E6] border-4 border-black shadow-[6px_6px_0px_0px_#000]'
              : isCompleted
              ? 'bg-white border-3 border-black shadow-[3px_3px_0px_0px_#000] opacity-95'
              : 'bg-white border-3 border-black shadow-[3px_3px_0px_0px_#000]';

            const badgeColor =
              stage.id === 1
                ? 'bg-[#FFD700]'
                : stage.id === 2
                ? 'bg-[#4ECDC4]'
                : stage.id === 3
                ? 'bg-[#FF8C42] text-white'
                : stage.id === 4
                ? 'bg-[#A29BFE]'
                : 'bg-[#FF6B6B] text-white';

            return (
              <div
                key={stage.id}
                onClick={() => onSelectStage(stage.id as StageId)}
                className={`p-4 sm:p-5 rounded-[1.8rem] transition-all duration-200 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:translate-x-[-1px] hover:translate-y-[-1px] ${bgClass}`}
                id={`stage-card-${stage.id}`}
              >
                {/* Stage Info */}
                <div className="flex items-center gap-4 text-center sm:text-right w-full sm:w-auto">
                  <div
                    className={`w-14 h-14 rounded-2xl border-3 border-black flex items-center justify-center text-2xl shrink-0 shadow-[2px_2px_0px_0px_#000] ${badgeColor}`}
                  >
                    {stage.icon}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start mb-1">
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-full border border-black bg-white text-black shadow-[1px_1px_0px_0px_#000]">
                        שלב {stage.id}
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-black">
                        {stage.name.replace(/^שלב \d+:\s*/, '')}
                      </h4>
                    </div>

                    <p className="text-xs font-bold text-black/70 max-w-xl">
                      {stage.description}
                    </p>
                  </div>
                </div>

                {/* Stage Status & Action Button */}
                <div className="shrink-0 flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t-2 border-black/10 sm:border-0 pt-2 sm:pt-0">
                  {isCompleted ? (
                    <span className="flex items-center gap-1.5 text-xs font-black text-black bg-[#4ECDC4] border-2 border-black px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_0px_#000]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>הושלם בהצלחה!</span>
                    </span>
                  ) : isCurrent ? (
                    <span className="flex items-center gap-1.5 text-xs font-black text-black bg-[#FFD700] border-2 border-black px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_0px_#000]">
                      <Star className="w-4 h-4 fill-black" />
                      <span>השלב הבא שלך!</span>
                    </span>
                  ) : null}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectStage(stage.id as StageId);
                    }}
                    className={`px-4 py-2 rounded-xl border-2 border-black font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer ${
                      isCurrent
                        ? 'bg-[#FFD700] hover:bg-[#fed600] text-black'
                        : 'bg-white hover:bg-gray-100 text-black'
                    }`}
                  >
                    <span>{isCompleted ? 'שחק שוב' : 'התחל שלב'}</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
