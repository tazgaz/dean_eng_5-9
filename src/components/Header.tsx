import React from 'react';
import { Volume2, VolumeX, BookOpen, Flame, Star, Award, Sparkles, Map } from 'lucide-react';
import { PlayerProfile } from '../types';
import { AVATARS } from '../data/words';

interface HeaderProps {
  score: number;
  confidenceLevel: number;
  streak: number;
  profile: PlayerProfile;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenWordBank: () => void;
  onToggleView: (view: 'board' | 'game') => void;
  currentView: 'board' | 'game';
  currentStageId: number;
  onChangeProfile: (profile: PlayerProfile) => void;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  confidenceLevel,
  streak,
  profile,
  isMuted,
  onToggleMute,
  onOpenWordBank,
  onToggleView,
  currentView,
  currentStageId,
  onChangeProfile,
}) => {
  const [isEditingProfile, setIsEditingProfile] = React.useState(false);
  const [tempName, setTempName] = React.useState(profile.name);
  const [tempAvatar, setTempAvatar] = React.useState(profile.avatar);

  const getConfidenceTitle = (lvl: number) => {
    if (lvl >= 90) return { title: 'אלוף על בצמרות! 👑', color: 'from-amber-400 to-yellow-500 text-slate-900' };
    if (lvl >= 70) return { title: 'מומחה באנגלית! 🚀', color: 'from-emerald-400 to-teal-500 text-white' };
    if (lvl >= 45) return { title: 'מתקדם בשלבים! 🌟', color: 'from-blue-400 to-indigo-500 text-white' };
    if (lvl >= 20) return { title: 'חוקר נלהב! 💡', color: 'from-purple-400 to-pink-500 text-white' };
    return { title: 'מתחיל בעוצמה! 💪', color: 'from-amber-300 to-orange-400 text-slate-900' };
  };

  const confidenceInfo = getConfidenceTitle(confidenceLevel);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onChangeProfile({
      ...profile,
      name: tempName.trim() || 'תלמיד/ה אלוף/ה',
      avatar: tempAvatar,
    });
    setIsEditingProfile(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FFF9E6]/95 backdrop-blur-md px-2 sm:px-4 py-1.5 sm:py-2 border-b border-black/15" id="main-header">
      <div className="max-w-5xl mx-auto bg-white border-2 sm:border-3 border-black rounded-xl sm:rounded-2xl px-2 sm:px-4 py-1.5 sm:py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        
        {/* Single Compact Row: Everything fits in one line on mobile */}
        <div className="flex items-center justify-between gap-1 sm:gap-3">
          
          {/* Right side: Avatar + Title & Student Name */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
            <button
              onClick={() => setIsEditingProfile(true)}
              className="relative bg-[#FFD700] w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-black flex items-center justify-center text-base sm:text-lg shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] shrink-0 cursor-pointer"
              title="לחצו לשינוי דמות ושם"
              id="avatar-button"
            >
              <span>{profile.avatar}</span>
            </button>

            <div className="min-w-0 flex flex-col justify-center">
              <h1 className="text-xs sm:text-sm font-black text-black leading-tight truncate">
                צמרות • <span className="text-[#FF8C42]">{profile.name}</span>
              </h1>
              <span className="text-[10px] font-bold text-black/60 hidden sm:inline leading-none mt-0.5">
                כיתה ה' • 16 פעלים
              </span>
            </div>
          </div>

          {/* Center: Score & Streak badge */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <div className="flex items-center gap-1 bg-[#FFF9E6] px-2 py-0.5 sm:py-1 rounded-lg border-2 border-black shadow-[1px_1px_0px_0px_#000]">
              <Star className="w-3.5 h-3.5 fill-[#FFD700] text-black stroke-2" />
              <span id="score-counter" className="text-xs sm:text-sm font-black text-[#FF6B6B] leading-none">
                {score}
              </span>
            </div>

            {streak > 1 && (
              <div className="flex items-center gap-0.5 bg-[#FF8C42] text-black text-[10px] sm:text-xs font-black border-2 border-black px-1.5 py-0.5 rounded-lg shadow-[1px_1px_0px_0px_#000]">
                <Flame className="w-3 h-3 fill-yellow-300 text-black" />
                <span>{streak}x</span>
              </div>
            )}
          </div>

          {/* Left side: Action buttons (WordBank, View Switcher, Mute) */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Word Bank Button */}
            <button
              onClick={onOpenWordBank}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg bg-[#FDCB6E] hover:bg-[#ffe082] text-black border-2 border-black text-xs font-black transition-all shadow-[1px_1px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
              title="מילון 16 הפעלים"
              id="open-wordbank-btn"
            >
              <BookOpen className="w-3.5 h-3.5 text-black" />
              <span className="hidden xs:inline sm:inline">מילון</span>
            </button>

            {/* Board / Game View Switcher */}
            <button
              onClick={() => onToggleView(currentView === 'board' ? 'game' : 'board')}
              className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-lg bg-[#4ECDC4] hover:bg-[#3dbdb4] text-black border-2 border-black text-xs font-black shadow-[1px_1px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
              id="toggle-view-btn"
            >
              {currentView === 'board' ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                  <span>שלב {currentStageId}</span>
                </>
              ) : (
                <>
                  <Map className="w-3.5 h-3.5 text-black" />
                  <span>מסלול</span>
                </>
              )}
            </button>

            {/* Audio Toggle */}
            <button
              onClick={onToggleMute}
              className={`p-1 sm:p-1.5 rounded-lg border-2 border-black shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer ${
                isMuted ? 'bg-slate-200 text-slate-500' : 'bg-[#FFD700] text-black'
              }`}
              title={isMuted ? 'הפעל צלילים' : 'השתק צלילים'}
              id="mute-sound-btn"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>

        </div>

        {/* Ultra-slim confidence progress line at bottom of header */}
        <div
          className="absolute bottom-0 inset-x-0 h-1 bg-black/5 overflow-hidden"
          title={`מד ביטחון: ${confidenceLevel}% - ${confidenceInfo.title}`}
        >
          <div
            className="bg-[#4ECDC4] h-full transition-all duration-500"
            style={{ width: `${Math.max(6, confidenceLevel)}%` }}
          />
        </div>

      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-6 max-w-sm w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-black text-black mb-1 text-center">
              כרטיס התלמיד/ה של צמרות 🎒
            </h3>
            <p className="text-xs font-bold text-black/60 text-center mb-4">
              בית ספר צמרות באר יעקב • כיתה ה'
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-black mb-1">
                  השם שלך:
                </label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="הקלידו את שמכם..."
                  className="w-full px-3 py-2 border-3 border-black rounded-xl focus:outline-none focus:bg-[#FFF9E6] text-sm font-black shadow-[2px_2px_0px_0px_#000]"
                  maxLength={25}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-2">
                  בחרו דמות שחקן/ית:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {AVATARS.map((av) => (
                    <button
                      type="button"
                      key={av.id}
                      onClick={() => setTempAvatar(av.emoji)}
                      className={`p-2.5 rounded-2xl border-3 text-2xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        tempAvatar === av.emoji
                          ? 'border-black bg-[#FFD700] scale-105 shadow-[3px_3px_0px_0px_#000]'
                          : 'border-black/30 bg-white hover:border-black'
                      }`}
                    >
                      <span>{av.emoji}</span>
                      <span className="text-[10px] font-black text-black">{av.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#4ECDC4] hover:bg-[#3dbdb4] text-black font-black border-3 border-black rounded-xl text-sm transition-all shadow-[3px_3px_0px_0px_#000] cursor-pointer"
                >
                  שמור והמשך לשחק!
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2.5 bg-white hover:bg-gray-100 text-black font-black border-3 border-black rounded-xl text-sm transition-colors cursor-pointer shadow-[2px_2px_0px_0px_#000]"
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
