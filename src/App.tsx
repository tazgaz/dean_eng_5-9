import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GameBoard } from './components/GameBoard';
import { WordBankModal } from './components/WordBankModal';
import { CertificateModal } from './components/CertificateModal';
import { Stage1Alphabet } from './components/stages/Stage1Alphabet';
import { Stage2VocabularyFirstLetter } from './components/stages/Stage2VocabularyFirstLetter';
import { Stage3SentenceMatch } from './components/stages/Stage3SentenceMatch';
import { Stage4ReadingComprehension } from './components/stages/Stage4ReadingComprehension';
import { Stage5GrandExam } from './components/stages/Stage5GrandExam';
import { PlayerProfile, GameProgress, StageId } from './types';
import { VOCABULARY_WORDS, STAGES_CONFIG } from './data/words';
import { toggleAudioMute, getAudioMuted, playSoundLadder } from './utils/audio';

const STORAGE_KEY_PROGRESS = 'tzamarot_game_progress_v1';
const STORAGE_KEY_PROFILE = 'tzamarot_player_profile_v1';

const DEFAULT_PROFILE: PlayerProfile = {
  name: 'תלמיד/ה אלוף/ה',
  avatar: '🦁',
  gender: 'neutral',
  school: 'בית ספר צמרות באר יעקב',
  grade: "כיתה ה'",
};

const DEFAULT_PROGRESS: GameProgress = {
  currentStage: 1,
  boardPosition: 1,
  score: 0,
  confidenceLevel: 15,
  streak: 0,
  maxStreak: 0,
  completedStages: [],
  examScore: null,
  masteredWords: [],
};

export default function App() {
  const [profile, setProfile] = useState<PlayerProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [progress, setProgress] = useState<GameProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      return saved ? JSON.parse(saved) : DEFAULT_PROGRESS;
    } catch {
      return DEFAULT_PROGRESS;
    }
  });

  const [currentView, setCurrentView] = useState<'board' | 'game'>('board');
  const [activePlayingStage, setActivePlayingStage] = useState<StageId>(1);
  const [isWordBankOpen, setIsWordBankOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(getAudioMuted());

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
    } catch (e) {
      console.error(e);
    }
  }, [progress]);

  const handleToggleMute = () => {
    const muted = toggleAudioMute();
    setIsMuted(muted);
  };

  const handleAddScore = (pts: number) => {
    setProgress((prev) => ({
      ...prev,
      score: prev.score + pts,
      streak: prev.streak + 1,
      maxStreak: Math.max(prev.maxStreak, prev.streak + 1),
      confidenceLevel: Math.min(100, prev.confidenceLevel + 2),
    }));
  };

  const handleAdvanceBoardPosition = (newPos: number) => {
    setProgress((prev) => ({
      ...prev,
      boardPosition: newPos,
    }));
  };

  const handleStageSelect = (stageId: StageId) => {
    setActivePlayingStage(stageId);
    setCurrentView('game');
  };

  const handleStageComplete = (stageId: StageId, scoreGain: number, examScore?: number) => {
    playSoundLadder();
    setProgress((prev) => {
      const nextStage = (stageId < 5 ? (stageId + 1) as StageId : 5);
      const newCompleted = prev.completedStages.includes(stageId)
        ? prev.completedStages
        : [...prev.completedStages, stageId];

      // Next board milestone
      const stageTargets: Record<StageId, number> = { 1: 6, 2: 11, 3: 16, 4: 21, 5: 25 };
      const newBoardPos = Math.max(prev.boardPosition, stageTargets[stageId]);

      // Add mastered words for this stage
      const stageMastery = VOCABULARY_WORDS.slice(0, stageId * 3.5).map((w) => w.id);
      const allMastered = Array.from(new Set([...prev.masteredWords, ...stageMastery]));

      return {
        ...prev,
        score: prev.score + scoreGain,
        currentStage: Math.max(prev.currentStage, nextStage) as StageId,
        boardPosition: newBoardPos,
        completedStages: newCompleted,
        confidenceLevel: Math.min(100, prev.confidenceLevel + 20),
        examScore: examScore !== undefined ? examScore : prev.examScore,
        masteredWords: allMastered,
      };
    });

    if (stageId === 5) {
      setIsCertificateOpen(true);
    }
  };

  const formattedDate = new Date().toLocaleDateString('he-IL', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#FFF9E6] flex flex-col font-sans relative">
      <div className="fixed inset-0 bento-dot-bg opacity-15 pointer-events-none" />
      
      {/* Persistent Top Navigation & Status Bar */}
      <Header
        score={progress.score}
        confidenceLevel={progress.confidenceLevel}
        streak={progress.streak}
        profile={profile}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenWordBank={() => setIsWordBankOpen(true)}
        onToggleView={(view) => setCurrentView(view)}
        currentView={currentView}
        currentStageId={activePlayingStage}
        onChangeProfile={setProfile}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto p-2 sm:p-6 pb-10">
        
        {/* VIEW 1: Interactive Snakes and Ladders Board */}
        {currentView === 'board' && (
          <GameBoard
            boardPosition={progress.boardPosition}
            currentStage={progress.currentStage}
            completedStages={progress.completedStages}
            avatar={profile.avatar}
            playerName={profile.name}
            onSelectStage={handleStageSelect}
            onAdvancePosition={handleAdvanceBoardPosition}
            confidenceLevel={progress.confidenceLevel}
          />
        )}

        {/* VIEW 2: Active Mini-Game for the Selected Stage */}
        {currentView === 'game' && (
          <div className="space-y-3">
            {/* Stage 1: Alphabet - Capital & Lowercase Letters */}
            {activePlayingStage === 1 && (
              <Stage1Alphabet
                onComplete={(gain) => {
                  handleStageComplete(1, gain);
                  setActivePlayingStage(2);
                  setCurrentView('board');
                }}
                onBackToBoard={() => setCurrentView('board')}
                onAddScore={handleAddScore}
              />
            )}

            {/* Stage 2: Vocabulary & First Letter for Picture */}
            {activePlayingStage === 2 && (
              <Stage2VocabularyFirstLetter
                onComplete={(gain) => {
                  handleStageComplete(2, gain);
                  setActivePlayingStage(3);
                  setCurrentView('board');
                }}
                onBackToBoard={() => setCurrentView('board')}
                onAddScore={handleAddScore}
              />
            )}

            {/* Stage 3: Sentence to Picture Matching */}
            {activePlayingStage === 3 && (
              <Stage3SentenceMatch
                onComplete={(gain) => {
                  handleStageComplete(3, gain);
                  setActivePlayingStage(4);
                  setCurrentView('board');
                }}
                onBackToBoard={() => setCurrentView('board')}
                onAddScore={handleAddScore}
              />
            )}

            {/* Stage 4: Reading Comprehension Short Stories */}
            {activePlayingStage === 4 && (
              <Stage4ReadingComprehension
                onComplete={(gain) => {
                  handleStageComplete(4, gain);
                  setActivePlayingStage(5);
                  setCurrentView('board');
                }}
                onBackToBoard={() => setCurrentView('board')}
                onAddScore={handleAddScore}
              />
            )}

            {/* Stage 5: The Grand Final Exam */}
            {activePlayingStage === 5 && (
              <Stage5GrandExam
                onComplete={(gain, examScore) => {
                  handleStageComplete(5, gain, examScore);
                }}
                onBackToBoard={() => setCurrentView('board')}
                onAddScore={handleAddScore}
                onOpenCertificate={() => setIsCertificateOpen(true)}
                profile={profile}
              />
            )}

          </div>
        )}

      </main>

      {/* Word Bank Reference Modal */}
      <WordBankModal
        isOpen={isWordBankOpen}
        onClose={() => setIsWordBankOpen(false)}
        masteredWords={progress.masteredWords}
      />

      {/* Official Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        profile={profile}
        score={progress.score}
        examScore={progress.examScore || 100}
        date={formattedDate}
      />

    </div>
  );
}
