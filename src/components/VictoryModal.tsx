import React, { useEffect, useState } from 'react';
import { GameSettings, PlayerState, ThemeConfig } from '../types';
import confetti from 'canvas-confetti';
import { Trophy, Award, Sparkles, RotateCcw, Settings, Flame, Zap, CheckCircle2, Users } from 'lucide-react';
import { audio } from '../utils/audio';
import { saveGameSession } from '../utils/historyStorage';

interface VictoryModalProps {
  players: PlayerState[];
  settings: GameSettings;
  theme: ThemeConfig;
  onPlayAgain: () => void;
  onOpenSetup: () => void;
  onOpenPlayerHistory?: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  players,
  settings,
  theme,
  onPlayAgain,
  onOpenSetup,
  onOpenPlayerHistory,
}) => {
  const [aiSummary, setAiSummary] = useState<{ summary: string; recommendation: string } | null>(null);
  const [loadingAi, setLoadingAi] = useState<boolean>(true);

  // Sort players by position & accuracy
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.position !== a.position) return b.position - a.position;
    return b.stats.totalCorrect - a.stats.totalCorrect;
  });

  const winner = sortedPlayers[0];

  useEffect(() => {
    // Save game session data to localStorage
    try {
      saveGameSession({
        themeId: theme.id,
        themeName: theme.name,
        themeEmoji: theme.emoji,
        playerCount: settings.playerCount,
        targetSteps: settings.targetSteps,
        winnerName: winner.name,
        winnerAvatar: winner.avatar,
        players: sortedPlayers.map((p) => ({
          id: p.id,
          name: p.name,
          avatar: p.avatar,
          position: p.position,
          totalCorrect: p.stats.totalCorrect,
          totalAttempted: p.stats.totalAttempted,
          accuracy: p.stats.totalAttempted > 0 ? Math.round((p.stats.totalCorrect / p.stats.totalAttempted) * 100) : 0,
          highestStreak: p.stats.highestStreak,
          gradeLevel: p.gradeLevel,
        })),
      });
    } catch (err) {
      console.error('Error auto-saving victory session:', err);
    }

    // Trigger victory sound & rich multi-burst confetti shower
    audio.playVictory();

    const duration = 3000;
    const end = Date.now() + duration;

    // Initial big burst
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'],
    });

    // Side cannon blasts interval
    const interval: any = setInterval(() => {
      const timeLeft = end - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        particleCount,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#fbbf24', '#34d399', '#60a5fa', '#f472b6'],
      });
      confetti({
        particleCount,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#fbbf24', '#34d399', '#60a5fa', '#f472b6'],
      });
    }, 250);

    // Fetch AI Coach Summary
    const fetchAiCoach = async () => {
      try {
        setLoadingAi(true);
        const res = await fetch('/api/ai-coach-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            players: sortedPlayers.map((p) => ({
              name: p.name,
              position: p.position,
              accuracy: p.stats.totalAttempted > 0 ? Math.round((p.stats.totalCorrect / p.stats.totalAttempted) * 100) : 0,
              highestStreak: p.stats.highestStreak,
              gradeLevel: p.gradeLevel,
            })),
            themeName: theme.name,
            totalRounds: settings.targetSteps,
          }),
        });
        const data = await res.json();
        setAiSummary(data);
      } catch (err) {
        console.error('Error fetching AI coach:', err);
        setAiSummary({
          summary: 'Luar biasa! Semua pemain di Papan Numiland telah berusaha dengan gigih!',
          recommendation: 'Tingkatkan terus latihan berhitung setiap hari agar semakin mahir.',
        });
      } finally {
        setLoadingAi(false);
      }
    };

    fetchAiCoach();
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 z-50 overflow-y-auto select-none">
      <div className="bg-slate-900 border border-amber-500/50 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Victory Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 text-slate-950 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 opacity-30 animate-pulse pointer-events-none" />
          <div className="text-5xl sm:text-6xl mb-1 animate-bounce">🏆</div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight uppercase">
            {winner.name} JUARA NUMILAND!
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-900/90 mt-1">
            Selamat kepada para pejuang numerasi hebat tema {theme.name}!
          </p>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 text-slate-200">
          {/* PODIUM DISPLAY */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {sortedPlayers.map((p, idx) => {
              const ranks = ['🥇 Juara 1', '🥈 Juara 2', '🥉 Juara 3', '🏅 Juara 4'];
              const rankColor =
                idx === 0
                  ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400/40'
                  : 'border-slate-800 bg-slate-950/60 text-slate-300';

              const acc =
                p.stats.totalAttempted > 0
                  ? Math.round((p.stats.totalCorrect / p.stats.totalAttempted) * 100)
                  : 0;

              return (
                <div
                  key={p.id}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center justify-between text-center relative ${rankColor}`}
                >
                  <span className="text-[11px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800">
                    {ranks[idx]}
                  </span>

                  <div className="my-2 text-4xl">{p.avatar}</div>

                  <div className="font-extrabold text-sm text-white truncate max-w-full">{p.name}</div>

                  <div className="my-2 space-y-1 text-xs">
                    <div className="text-amber-400 font-bold">{p.position} Langkah</div>
                    <div className="text-slate-400 text-[11px]">Akurasi: {acc}%</div>
                    <div className="text-purple-300 text-[11px]">Streak: {p.stats.highestStreak}x</div>
                  </div>

                  {/* Badges list */}
                  <div className="flex flex-wrap justify-center gap-1 mt-1 pt-2 border-t border-slate-800 w-full">
                    {p.stats.badges.map((b) => (
                      <span key={b.id} title={b.description} className="text-base">
                        {b.icon}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI GURU NUMERASI COACH SUMMARY */}
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Catatan Evaluasi Guru Numerasi AI:</span>
            </div>

            {loadingAi ? (
              <div className="text-xs text-slate-400 animate-pulse italic">
                Menyusun rangkuman motivasi numerasi siswa...
              </div>
            ) : (
              <div className="text-xs text-slate-200 space-y-1.5 leading-relaxed">
                <p>"{aiSummary?.summary}"</p>
                {aiSummary?.recommendation && (
                  <p className="text-amber-300 font-medium">💡 Saran: {aiSummary.recommendation}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSetup}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Settings className="w-4 h-4 text-amber-400" />
              <span>Pengaturan</span>
            </button>

            {onOpenPlayerHistory && (
              <button
                onClick={onOpenPlayerHistory}
                className="px-4 py-2.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-200 border border-indigo-700/60 font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4 text-indigo-400" />
                <span>👥 Data Pemain</span>
              </button>
            )}
          </div>

          <button
            onClick={onPlayAgain}
            className="px-6 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm sm:text-base shadow-xl transition transform active:scale-95 flex items-center gap-2 cursor-pointer ml-auto"
          >
            <RotateCcw className="w-5 h-5" />
            <span>MAIN LAGI SERENTAK!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
