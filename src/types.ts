export type GradeLevel = 'kelas1-2' | 'kelas3-4' | 'kelas5-6' | 'adaptive';

export type UiScale = 'small' | 'medium' | 'large' | 'huge';

export type BoardMode = 'normal' | 'compact' | 'hidden';

export type MathOperation = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed';

export type ThemeId =
  | 'smart_race'
  | 'garden_race'
  | 'monster_evolution'
  | 'color_kingdom'
  | 'rocket_launch'
  | 'water_fill'
  | 'battery_charge'
  | 'panjat_pinang';

export type PlayerId = 1 | 2 | 3 | 4;

export interface MathProblem {
  id: string;
  questionStr: string;
  num1: number;
  num2: number;
  operator: '+' | '-' | '×' | '÷';
  answer: number;
  choices?: number[];
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  visualHint?: string; // e.g. "🍎🍎 + 🍎🍎🍎" for grade 1-2
}

export interface Badge {
  id: string;
  title: string;
  icon: string;
  description: string;
  earnedAt?: number;
}

export interface PlayerStats {
  score: number; // Board position or points
  totalCorrect: number;
  totalAttempted: number;
  streak: number;
  highestStreak: number;
  speedBonusCount: number;
  averageSpeedMs: number;
  badges: Badge[];
}

export interface PlayerState {
  id: PlayerId;
  name: string;
  avatar: string; // Emoji / Character ID
  color: string; // Tailwind color theme hex/class
  bgGradient: string;
  accentColor: string;
  gradeLevel: GradeLevel;
  operations: MathOperation[];
  
  // Game progress
  position: number; // 0 to MAX_STEPS (e.g. 25)
  stats: PlayerStats;
  
  // Round state
  currentProblem: MathProblem | null;
  currentInput: string;
  feedback: 'none' | 'correct' | 'wrong' | 'locked';
  feedbackMsg?: string;
  lastAnswerTimeMs?: number;
  
  // Visual state
  customThemeStage?: number; // e.g., plant stage 0-4 or monster stage 0-4
  territoryCount?: number; // for Color Kingdom
  health?: number; // for Clash of Numbers (100 HP)
}

export interface GameSettings {
  playerCount: 1 | 2 | 3 | 4;
  themeId: ThemeId;
  targetSteps: number; // Steps required to finish / win (e.g., 20 or 30)
  timePerRound: number; // Seconds per problem (0 = unlimited / race mode)
  soundEnabled: boolean;
  inputType: 'numpad' | 'multiple_choice';
  allowIndividualGrade: boolean; // Each player can have distinct grade level
  blindMode?: boolean; // New setting for Mode Buta (Problem disappears in 3s)
}

export type GameStage = 'setup' | 'countdown' | 'playing' | 'paused' | 'victory';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  subtitle: string;
  emoji: string;
  bgGradient: string;
  cardBg: string;
  borderColor: string;
  accentColor: string;
  boardType: 'race_track' | 'growth_garden' | 'evolution_arena' | 'territory_grid' | 'rocket_sky' | 'water_container' | 'battery_fill' | 'pinang_climb';
  description: string;
  avatarOptions: { id: string; name: string; icon: string; color: string }[];
  stepLabels?: string[]; // E.g., for evolution: ["Telur", "Baby", "Junior", "Mega", "Cosmic"]
}
