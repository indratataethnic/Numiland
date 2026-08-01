import React, { useEffect, useState, useCallback } from 'react';
import {
  Badge,
  GameSettings,
  GameStage,
  GradeLevel,
  MathOperation,
  MathProblem,
  PlayerState,
  ThemeId,
  UiScale,
  BoardMode,
} from './types';
import { THEMES } from './data/themes';
import { BADGE_DEFINITIONS } from './data/badges';
import { generateMathProblem } from './utils/mathGenerator';
import { HeaderBar } from './components/HeaderBar';
import { SetupModal } from './components/SetupModal';
import { PlayerPad } from './components/PlayerPad';
import { GameBoard } from './components/GameBoard';
import { TeacherPanelModal } from './components/TeacherPanelModal';
import { VictoryModal } from './components/VictoryModal';
import { PlayerHistoryModal } from './components/PlayerHistoryModal';
import { audio } from './utils/audio';
import { incrementPageViewCount } from './utils/historyStorage';

const INITIAL_SETTINGS: GameSettings = {
  playerCount: 2,
  themeId: 'smart_race',
  targetSteps: 20,
  timePerRound: 0,
  soundEnabled: true,
  inputType: 'numpad',
  allowIndividualGrade: true,
  blindMode: false,
};

const INITIAL_PLAYERS: PlayerState[] = [
  {
    id: 1,
    name: 'Pemain 1',
    avatar: '🏎️',
    color: '#ef4444',
    bgGradient: 'from-red-600 to-rose-700',
    accentColor: '#f87171',
    gradeLevel: 'kelas1-2',
    operations: ['addition', 'subtraction'],
    position: 0,
    stats: {
      score: 0,
      totalCorrect: 0,
      totalAttempted: 0,
      streak: 0,
      highestStreak: 0,
      speedBonusCount: 0,
      averageSpeedMs: 0,
      badges: [],
    },
    currentProblem: null,
    currentInput: '',
    feedback: 'none',
  },
  {
    id: 2,
    name: 'Pemain 2',
    avatar: '🚀',
    color: '#3b82f6',
    bgGradient: 'from-blue-600 to-indigo-700',
    accentColor: '#60a5fa',
    gradeLevel: 'kelas1-2',
    operations: ['addition', 'subtraction'],
    position: 0,
    stats: {
      score: 0,
      totalCorrect: 0,
      totalAttempted: 0,
      streak: 0,
      highestStreak: 0,
      speedBonusCount: 0,
      averageSpeedMs: 0,
      badges: [],
    },
    currentProblem: null,
    currentInput: '',
    feedback: 'none',
  },
  {
    id: 3,
    name: 'Pemain 3',
    avatar: '🐆',
    color: '#10b981',
    bgGradient: 'from-emerald-600 to-teal-700',
    accentColor: '#34d399',
    gradeLevel: 'kelas1-2',
    operations: ['addition', 'subtraction'],
    position: 0,
    stats: {
      score: 0,
      totalCorrect: 0,
      totalAttempted: 0,
      streak: 0,
      highestStreak: 0,
      speedBonusCount: 0,
      averageSpeedMs: 0,
      badges: [],
    },
    currentProblem: null,
    currentInput: '',
    feedback: 'none',
  },
  {
    id: 4,
    name: 'Pemain 4',
    avatar: '🦖',
    color: '#f59e0b',
    bgGradient: 'from-amber-500 to-orange-600',
    accentColor: '#fbbf24',
    gradeLevel: 'kelas1-2',
    operations: ['addition', 'subtraction'],
    position: 0,
    stats: {
      score: 0,
      totalCorrect: 0,
      totalAttempted: 0,
      streak: 0,
      highestStreak: 0,
      speedBonusCount: 0,
      averageSpeedMs: 0,
      badges: [],
    },
    currentProblem: null,
    currentInput: '',
    feedback: 'none',
  },
];

export default function App() {
  const [stage, setStage] = useState<GameStage>('setup');
  const [settings, setSettings] = useState<GameSettings>(INITIAL_SETTINGS);
  const [players, setPlayers] = useState<PlayerState[]>(INITIAL_PLAYERS);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showTeacherPanel, setShowTeacherPanel] = useState<boolean>(false);
  const [showPlayerHistory, setShowPlayerHistory] = useState<boolean>(false);
  const [countdownNum, setCountdownNum] = useState<number>(3);
  const [uiScale, setUiScale] = useState<UiScale>('medium');
  const [boardMode, setBoardMode] = useState<BoardMode>('normal');

  // Increment page view on mount
  useEffect(() => {
    incrementPageViewCount();
  }, []);

  // Sound sync
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audio.setEnabled(next);
  };

  // Launch countdown then start match
  const startMatch = (newSettings: GameSettings, newPlayers: PlayerState[]) => {
    setSettings(newSettings);

    // Initialize problems for all active players
    const prepared = newPlayers.map((p) => ({
      ...p,
      position: 0,
      stats: {
        score: 0,
        totalCorrect: 0,
        totalAttempted: 0,
        streak: 0,
        highestStreak: 0,
        speedBonusCount: 0,
        averageSpeedMs: 0,
        badges: [],
      },
      currentProblem: generateMathProblem(p.gradeLevel, p.operations, 0),
      currentInput: '',
      feedback: 'none' as const,
      lastAnswerTimeMs: Date.now(),
    }));

    setPlayers(prepared);
    setStage('countdown');
    setCountdownNum(3);

    audio.playCountdown();
  };

  // Countdown timer effect
  useEffect(() => {
    if (stage !== 'countdown') return;

    if (countdownNum > 0) {
      const timer = setTimeout(() => {
        const next = countdownNum - 1;
        setCountdownNum(next);
        audio.playCountdown(next === 0);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setStage('playing');
    }
  }, [stage, countdownNum]);

  // Handle Answer Submission (Simultaneous input per player)
  const handleAnswerSubmit = useCallback(
    (playerId: 1 | 2 | 3 | 4, inputAns: number) => {
      if (stage !== 'playing') return;

      setPlayers((prevPlayers) => {
        const pIdx = prevPlayers.findIndex((p) => p.id === playerId);
        if (pIdx === -1) return prevPlayers;

        const player = prevPlayers[pIdx];
        if (!player.currentProblem || player.feedback === 'locked') return prevPlayers;

        const isCorrect = inputAns === player.currentProblem.answer;
        const now = Date.now();
        const responseTimeSec = player.lastAnswerTimeMs ? (now - player.lastAnswerTimeMs) / 1000 : 5;

        const updated = [...prevPlayers];
        const newStats = { ...player.stats };
        newStats.totalAttempted += 1;

        if (isCorrect) {
          audio.playCorrect();
          newStats.totalCorrect += 1;
          newStats.streak += 1;
          if (newStats.streak > newStats.highestStreak) {
            newStats.highestStreak = newStats.streak;
          }

          // Step Progress
          let stepBonus = 1;

          // Badges check
          const earnedBadges = [...newStats.badges];

          // 1. Kilat Math (Fast response under 3s)
          if (responseTimeSec <= 3 && !earnedBadges.some((b) => b.id === 'kilat_math')) {
            earnedBadges.push({ ...BADGE_DEFINITIONS.kilat_math, earnedAt: now });
            stepBonus += 1; // Extra speed step!
          }

          // 2. Streak Master (5 streak)
          if (newStats.streak >= 5 && !earnedBadges.some((b) => b.id === 'streak_master')) {
            earnedBadges.push({ ...BADGE_DEFINITIONS.streak_master, earnedAt: now });
            audio.playStreak();
          }

          newStats.badges = earnedBadges;
          const newPos = player.position + stepBonus;

          updated[pIdx] = {
            ...player,
            position: newPos,
            stats: newStats,
            feedback: 'correct',
            currentProblem: player.currentProblem,
          };

          // Check Win Condition
          if (newPos >= settings.targetSteps) {
            setTimeout(() => {
              setStage('victory');
            }, 600);
          } else {
            // Next problem after 600ms
            setTimeout(() => {
              setPlayers((latest) => {
                const latestCopy = [...latest];
                const curP = latestCopy[pIdx];
                if (!curP) return latest;
                latestCopy[pIdx] = {
                  ...curP,
                  feedback: 'none',
                  currentProblem: generateMathProblem(curP.gradeLevel, curP.operations, curP.stats.streak),
                  lastAnswerTimeMs: Date.now(),
                };
                return latestCopy;
              });
            }, 600);
          }
        } else {
          // Incorrect Answer
          audio.playWrong();
          newStats.streak = 0;

          updated[pIdx] = {
            ...player,
            stats: newStats,
            feedback: 'wrong',
          };

          // Unlock after 1.2s penalty
          setTimeout(() => {
            setPlayers((latest) => {
              const latestCopy = [...latest];
              const curP = latestCopy[pIdx];
              if (!curP) return latest;
              latestCopy[pIdx] = {
                ...curP,
                feedback: 'none',
                currentProblem: generateMathProblem(curP.gradeLevel, curP.operations, 0),
                lastAnswerTimeMs: Date.now(),
              };
              return latestCopy;
            });
          }, 1200);
        }

        return updated;
      });
    },
    [stage, settings.targetSteps]
  );

  // Teacher Panel Updates
  const handleUpdatePlayerGrade = (pId: 1 | 2 | 3 | 4, newGrade: GradeLevel) => {
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === pId) {
          return {
            ...p,
            gradeLevel: newGrade,
            currentProblem: generateMathProblem(newGrade, p.operations, p.stats.streak),
          };
        }
        return p;
      })
    );
  };

  const handleUpdatePlayerOps = (pId: 1 | 2 | 3 | 4, ops: MathOperation[]) => {
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === pId) {
          return {
            ...p,
            operations: ops,
            currentProblem: generateMathProblem(p.gradeLevel, ops, p.stats.streak),
          };
        }
        return p;
      })
    );
  };

  const currentTheme = THEMES[settings.themeId];
  const activePlayers = players.slice(0, settings.playerCount);

  const isGameplay = stage === 'playing' || stage === 'paused' || stage === 'countdown';

  const boardHeightClass =
    uiScale === 'small' ? 'h-[22vh] sm:h-[25vh] min-h-[130px] max-h-[200px]' :
    uiScale === 'large' ? 'h-[28vh] sm:h-[32vh] min-h-[170px] max-h-[290px]' :
    uiScale === 'huge' ? 'h-[24vh] sm:h-[26vh] min-h-[140px] max-h-[220px]' :
    'h-[25vh] sm:h-[28vh] min-h-[150px] max-h-[250px]';

  return (
    <div className={`w-full bg-gradient-to-br ${currentTheme.bgGradient} text-white flex flex-col font-sans select-none ${isGameplay ? 'h-screen max-h-screen overflow-hidden' : 'min-h-screen overflow-x-hidden'}`}>
      {/* Top Bar Header */}
      <HeaderBar
        stage={stage}
        settings={settings}
        theme={currentTheme}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onPauseResume={() => setStage((prev) => (prev === 'paused' ? 'playing' : 'paused'))}
        onRestartMatch={() => startMatch(settings, players)}
        onOpenSetup={() => setStage('setup')}
        onOpenTeacherPanel={() => setShowTeacherPanel(true)}
        onOpenPlayerHistory={() => setShowPlayerHistory(true)}
        uiScale={uiScale}
        onUiScaleChange={setUiScale}
        boardMode={boardMode}
        onBoardModeChange={setBoardMode}
      />

      {/* MAIN GAME CONTAINER (Responsive Smartboard Layout) */}
      <main className={`flex-1 max-w-[1600px] mx-auto w-full flex flex-col justify-between ${isGameplay ? 'p-2 sm:p-3 gap-2 overflow-hidden h-full min-h-0' : 'p-3 sm:p-5 gap-4'}`}>
        {/* COUNTDOWN OVERLAY */}
        {stage === 'countdown' && (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center z-40 select-none">
            <div className="text-amber-400 font-black text-8xl sm:text-9xl animate-ping font-mono">
              {countdownNum > 0 ? countdownNum : 'MULAI!'}
            </div>
            <p className="mt-6 text-xl sm:text-2xl font-bold text-white tracking-widest uppercase">
              Bersiaplah! Jawab Soal Bersamaan!
            </p>
          </div>
        )}

        {/* SETUP MODAL */}
        {stage === 'setup' && (
          <SetupModal
            initialSettings={settings}
            initialPlayers={players}
            onStartGame={startMatch}
            onOpenPlayerHistory={() => setShowPlayerHistory(true)}
          />
        )}

        {/* TEACHER PANEL MODAL */}
        {showTeacherPanel && (
          <TeacherPanelModal
            players={activePlayers}
            onUpdatePlayerGrade={handleUpdatePlayerGrade}
            onUpdatePlayerOps={handleUpdatePlayerOps}
            onClose={() => setShowTeacherPanel(false)}
          />
        )}

        {/* PLAYER HISTORY MODAL */}
        {showPlayerHistory && (
          <PlayerHistoryModal onClose={() => setShowPlayerHistory(false)} />
        )}

        {/* VICTORY MODAL */}
        {stage === 'victory' && (
          <VictoryModal
            players={activePlayers}
            settings={settings}
            theme={currentTheme}
            onPlayAgain={() => startMatch(settings, players)}
            onOpenSetup={() => setStage('setup')}
            onOpenPlayerHistory={() => setShowPlayerHistory(true)}
          />
        )}

        {/* PLAYING / PAUSED INTERACTIVE BOARD LAYOUT */}
        {(stage === 'playing' || stage === 'paused' || stage === 'countdown') && (
          <div className="flex-1 flex flex-col gap-2 sm:gap-3 min-h-0 overflow-hidden">
            {/* CENTRAL THEME BOARD VISUALIZER / COMPACT STATS */}
            {boardMode === 'normal' && (
              <div className={`w-full shrink-0 ${boardHeightClass}`}>
                <GameBoard theme={currentTheme} players={activePlayers} targetSteps={settings.targetSteps} />
              </div>
            )}

            {boardMode === 'compact' && (
              <div className="w-full shrink-0 bg-slate-900/90 border border-slate-800 rounded-2xl p-2 flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold shrink-0">
                  <span>{currentTheme.emoji}</span>
                  <span className="truncate max-w-[80px]">{currentTheme.name}</span>
                </div>
                <div className="flex-1 flex items-center gap-3 justify-end overflow-hidden">
                  {activePlayers.map((player) => {
                    const pct = Math.min(100, Math.round((player.position / settings.targetSteps) * 100));
                    return (
                      <div key={player.id} className="flex items-center gap-2 bg-slate-950/60 px-2 py-1 rounded-xl border border-slate-800 text-[11px] font-semibold flex-1 max-w-[180px]">
                        <span className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: player.color }}>
                          {player.avatar}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-white truncate font-black">{player.name}</span>
                            <span className="text-amber-400 font-black">{player.position}/{settings.targetSteps}</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-0.5">
                            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, backgroundColor: player.color }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SIMULTANEOUS PLAYER STATIONS GRID */}
            <div
              className={`grid gap-2 sm:gap-3 flex-1 min-h-0 overflow-hidden ${
                settings.playerCount === 1
                  ? 'grid-cols-1 max-w-2xl mx-auto w-full'
                  : settings.playerCount === 2
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : settings.playerCount === 3
                  ? 'grid-cols-1 sm:grid-cols-3'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              }`}
            >
              {activePlayers.map((player) => (
                <PlayerPad
                  key={player.id}
                  player={player}
                  onAnswerSubmit={handleAnswerSubmit}
                  inputType={settings.inputType}
                  isPaused={stage === 'paused'}
                  totalSteps={settings.targetSteps}
                  layoutPosition="col"
                  uiScale={uiScale}
                  blindMode={settings.blindMode}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Global Footer Attribution */}
      <footer className="w-full text-center py-1.5 text-[11px] text-slate-400 bg-slate-950/90 border-t border-slate-800/80 shrink-0 select-none z-20">
        <span>✨ Numiland — Pembuat: <strong className="text-amber-300 font-bold">Indra Tata</strong> (berbantuan AI)</span>
      </footer>
    </div>
  );
}
