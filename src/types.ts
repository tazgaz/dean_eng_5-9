export interface WordItem {
  id: string;
  english: string;
  hebrew: string;
  hebrewNote?: string;
  phonetic: string;
  category?: string;
  exampleSentence: string;
  sentenceHebrew: string;
  emoji: string;
}

export type StageId = 1 | 2 | 3 | 4 | 5;

export interface StageInfo {
  id: StageId;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  minPoints: number;
  tileTarget: number;
}

export interface PlayerProfile {
  name: string;
  avatar: string;
  gender: 'male' | 'female' | 'neutral';
  school: string;
  grade: string;
}

export interface GameProgress {
  currentStage: StageId;
  boardPosition: number; // 1 to 25
  score: number;
  confidenceLevel: number; // 0 to 100
  streak: number;
  maxStreak: number;
  completedStages: number[];
  examScore: number | null;
  masteredWords: string[];
}
