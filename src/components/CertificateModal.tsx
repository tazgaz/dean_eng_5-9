import React, { useRef } from 'react';
import { X, Award, Printer, Sparkles } from 'lucide-react';
import { PlayerProfile } from '../types';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PlayerProfile;
  score: number;
  examScore: number;
  date: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  profile,
  score,
  examScore,
  date,
}) => {
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white border-4 border-black rounded-[2.5rem] max-w-3xl w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden my-auto">
        
        {/* Top Control Bar */}
        <div className="bg-[#FF6B6B] border-b-4 border-black text-white px-5 py-3 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-sm font-black">
            <Award className="w-5 h-5 text-[#FFD700]" />
            <span>תעודת אלוף/ת הפעלים באנגלית - כיתה ה'</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl bg-white hover:bg-gray-100 text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Certificate Area */}
        <div
          ref={certRef}
          className="p-6 sm:p-10 bg-[#FFF9E6] border-8 border-black relative text-center"
          id="official-tzamarot-certificate"
        >
          {/* Decorative Corner Stars */}
          <div className="absolute top-4 right-4 text-3xl select-none">⭐</div>
          <div className="absolute top-4 left-4 text-3xl select-none">⭐</div>
          <div className="absolute bottom-4 right-4 text-3xl select-none">⭐</div>
          <div className="absolute bottom-4 left-4 text-3xl select-none">⭐</div>

          {/* School Emblem & Header */}
          <div className="mb-5">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FFD700] border-3 border-black text-3xl shadow-[3px_3px_0px_0px_#000] mb-2">
              🏫
            </div>
            <div className="text-xs sm:text-sm font-black tracking-wider text-black/70 uppercase">
              בית ספר צמרות באר יעקב • מחוז מרכז
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-black mt-1 tracking-tight">
              תעודת הצטיינות והצלחה
            </h1>
            <div className="h-1.5 w-32 bg-black mx-auto rounded-full mt-2" />
          </div>

          {/* Recipient Details */}
          <div className="my-6 space-y-2">
            <p className="text-sm sm:text-base text-black/75 font-bold">
              תעודה זו מוענקת בזאת בגאווה רבה לתלמיד/ה:
            </p>
            <div className="text-2xl sm:text-3xl font-black text-black inline-block px-7 py-2 bg-[#4ECDC4] rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_#000]">
              {profile.avatar} {profile.name}
            </div>
            <p className="text-xs sm:text-sm text-black/70 font-black">
              כיתה ה' • בית ספר צמרות באר יעקב
            </p>
          </div>

          {/* Praise & Accomplishment Bento Box */}
          <div className="max-w-xl mx-auto text-xs sm:text-sm font-bold text-black bg-white p-5 rounded-2xl border-3 border-black shadow-[3px_3px_0px_0px_#000] mb-6">
            על גילוי התמדה, ביטחון עצמי גבוה ושליטה מוחלטת ב-16 פעלי המפתח באנגלית:
            <div className="mt-2.5 text-[11px] sm:text-xs text-black font-black font-english flex flex-wrap justify-center gap-1.5">
              <span className="bg-[#FFF9E6] border border-black px-1.5 py-0.5 rounded-md">Swim</span>
              <span className="bg-[#FFF9E6] border border-black px-1.5 py-0.5 rounded-md">Work</span>
              <span className="bg-[#FFF9E6] border border-black px-1.5 py-0.5 rounded-md">Make</span>
              <span className="bg-[#FFF9E6] border border-black px-1.5 py-0.5 rounded-md">Ride</span>
              <span className="bg-[#FFF9E6] border border-black px-1.5 py-0.5 rounded-md">Learn</span>
              <span className="bg-[#FFF9E6] border border-black px-1.5 py-0.5 rounded-md">Match</span>
              <span className="bg-[#FFF9E6] border border-black px-1.5 py-0.5 rounded-md">Say</span>
              <span className="bg-[#FFF9E6] border border-black px-1.5 py-0.5 rounded-md">Find</span>
              <span className="bg-[#FFF9E6] border border-black px-1.5 py-0.5 rounded-md">Watch</span>
              <span className="bg-[#FFF9E6] border border-black px-1.5 py-0.5 rounded-md">Kick</span>
              <span className="bg-[#FFF9E6] border border-black px-1.5 py-0.5 rounded-md">Read</span>
              <span className="bg-[#FFF9E6] border border-black px-1.5 py-0.5 rounded-md">Study</span>
              <span className="bg-[#FFF9E6] border border-black px-1.5 py-0.5 rounded-md">Play</span>
              <span className="bg-[#FFF9E6] border border-black px-1.5 py-0.5 rounded-md">Wait</span>
              <span className="bg-[#FFF9E6] border border-black px-1.5 py-0.5 rounded-md">Write</span>
              <span className="bg-[#FFF9E6] border border-black px-1.5 py-0.5 rounded-md">Sing</span>
            </div>
          </div>

          {/* Scores & Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 my-5">
            <div className="bg-white border-3 border-black rounded-2xl p-3 px-5 text-center shadow-[3px_3px_0px_0px_#000]">
              <span className="text-xs font-black text-black/70 block">ציון במבחן</span>
              <span className="text-2xl font-black text-[#FF6B6B]">{examScore} מתוך 100</span>
            </div>

            {/* Gold Bento Seal Stamp */}
            <div className="relative flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#FFD700] border-4 border-black shadow-[4px_4px_0px_0px_#000] flex flex-col items-center justify-center text-black p-1">
                <Sparkles className="w-4 h-4 text-black" />
                <span className="text-[11px] font-black leading-tight">אלוף צמרות</span>
                <span className="text-[9px] font-black">תשפ"ו</span>
              </div>
            </div>

            <div className="bg-white border-3 border-black rounded-2xl p-3 px-5 text-center shadow-[3px_3px_0px_0px_#000]">
              <span className="text-xs font-black text-black/70 block">ניקוד מצטבר</span>
              <span className="text-2xl font-black text-[#FF8C42]">{score} נקודות</span>
            </div>
          </div>

          {/* Signatures & Date */}
          <div className="mt-8 pt-4 border-t-3 border-black flex items-center justify-between text-xs text-black px-4 sm:px-12">
            <div className="text-center">
              <div className="font-black text-black">צוות אנגלית כיתה ה'</div>
              <div className="text-[11px] font-bold text-black/60">בית ספר צמרות</div>
            </div>

            <div className="text-center">
              <div className="font-black text-black">תאריך הענקה:</div>
              <div className="text-[11px] font-mono font-bold text-black/70">{date}</div>
            </div>

            <div className="text-center">
              <div className="font-black text-black">הנהלת בית הספר</div>
              <div className="text-[11px] font-bold text-black/60">צמרות באר יעקב</div>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-[#FFF9E6] border-t-4 border-black flex flex-wrap items-center justify-center gap-3 no-print">
          <button
            onClick={handlePrint}
            className="px-6 py-2.5 bg-[#FFD700] hover:bg-[#fed600] text-black border-2 border-black font-black rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
          >
            <Printer className="w-4 h-4 text-black" />
            <span>הדפס או שמור כ-PDF 🖨️</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white hover:bg-gray-100 text-black border-2 border-black font-black rounded-xl text-xs sm:text-sm transition-colors shadow-[2px_2px_0px_0px_#000] cursor-pointer"
          >
            סגור וחזור למשחק
          </button>
        </div>

      </div>
    </div>
  );
};
