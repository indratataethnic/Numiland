export interface PlayerSessionRecord {
  id: number;
  name: string;
  avatar: string;
  position: number;
  totalCorrect: number;
  totalAttempted: number;
  accuracy: number;
  highestStreak: number;
  gradeLevel: string;
}

export interface GameHistorySession {
  id: string;
  dateStr: string;
  timestamp: number;
  themeId: string;
  themeName: string;
  themeEmoji: string;
  playerCount: number;
  targetSteps: number;
  winnerName: string;
  winnerAvatar: string;
  players: PlayerSessionRecord[];
}

const STORAGE_KEY = 'numiland_game_history_v1';
const VISITOR_KEY = 'numiland_page_views_v1';

// Increment page view count
export function incrementPageViewCount(): number {
  try {
    const current = parseInt(localStorage.getItem(VISITOR_KEY) || '0', 10);
    const updated = current + 1;
    localStorage.setItem(VISITOR_KEY, updated.toString());
    return updated;
  } catch (err) {
    console.error('Error incrementing page views:', err);
    return 1;
  }
}

export function getPageViewCount(): number {
  try {
    return parseInt(localStorage.getItem(VISITOR_KEY) || '1', 10);
  } catch (err) {
    return 1;
  }
}

// Get all saved history sessions
export function getGameHistory(): GameHistorySession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading game history:', err);
    return [];
  }
}

// Save a new match session to history
export function saveGameSession(session: Omit<GameHistorySession, 'id' | 'dateStr' | 'timestamp'>): GameHistorySession {
  const history = getGameHistory();
  const now = new Date();
  
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  const dateStr = now.toLocaleDateString('id-ID', options);

  const newSession: GameHistorySession = {
    ...session,
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    dateStr,
    timestamp: Date.now(),
  };

  // Keep last 50 sessions
  const updatedHistory = [newSession, ...history].slice(0, 50);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (err) {
    console.error('Error saving game history:', err);
  }

  return newSession;
}

// Clear all history
export function clearGameHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing game history:', err);
  }
}
