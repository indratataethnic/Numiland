import React from 'react';
import { PlayerState, ThemeConfig } from '../types';
import { Flame, Trophy, Sparkles, Shield, Heart } from 'lucide-react';

interface GameBoardProps {
  theme: ThemeConfig;
  players: PlayerState[];
  targetSteps: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({ theme, players, targetSteps }) => {
  return (
    <div
      className={`w-full h-full min-h-[300px] sm:min-h-[360px] rounded-3xl border-2 ${theme.borderColor} ${theme.cardBg} p-4 sm:p-5 flex flex-col justify-between backdrop-blur-md shadow-2xl relative overflow-hidden select-none`}
    >
      {/* Background Decor Ambient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950/80 pointer-events-none" />

      {/* Board Header Banner */}
      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl sm:text-3xl">{theme.emoji}</span>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-wide uppercase">
              {theme.name}
            </h2>
            <p className="text-xs text-amber-400 font-semibold">{theme.subtitle}</p>
          </div>
        </div>

        {/* Lead Player Tracker */}
        <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1 rounded-xl border border-slate-700">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-slate-400">Pemimpin:</span>
          {(() => {
            const sorted = [...players].sort((a, b) => b.position - a.position);
            const leader = sorted[0];
            return (
              <span className="text-xs font-bold text-white flex items-center gap-1">
                <span>{leader.avatar}</span>
                <span className="truncate max-w-[80px]">{leader.name}</span>
                <span className="text-amber-400">({leader.position})</span>
              </span>
            );
          })()}
        </div>
      </div>

      {/* BOARD VISUALIZATION PER THEME */}
      <div className="relative z-10 my-3 flex-1 flex flex-col justify-center">
        {/* THEME 1: SMART RACE (Race Track) */}
        {theme.boardType === 'race_track' && (
          <div className="space-y-3">
            {players.map((p) => {
              const progressPct = Math.min(100, Math.round((p.position / targetSteps) * 100));
              return (
                <div key={p.id} className="relative bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800 shadow-inner">
                  {/* Lane Label */}
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1 px-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                      <span>{p.name}</span>
                    </div>
                    <span className="text-amber-400 font-mono">{p.position} / {targetSteps} Steps</span>
                  </div>

                  {/* Track Bar */}
                  <div className="relative h-9 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center px-1">
                    {/* Progress Fill */}
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-400 rounded-xl transition-all duration-500 shadow-lg"
                      style={{ width: `${Math.max(5, progressPct)}%` }}
                    />

                    {/* Finish Flag Marker */}
                    <div className="absolute right-2 text-base z-10">🏁</div>

                    {/* Moving Avatar Token */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 transition-all duration-500 ease-out z-20 flex items-center justify-center bg-slate-900 border-2 rounded-xl p-1 shadow-2xl"
                      style={{
                        left: `calc(${Math.min(90, Math.max(2, progressPct))}% - 16px)`,
                        borderColor: p.color,
                      }}
                    >
                      <span className="text-xl animate-pulse">{p.avatar}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* THEME 2: GARDEN RACE (Plant Growth) */}
        {theme.boardType === 'growth_garden' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 h-[220px] sm:h-[250px] items-end">
            {players.map((p) => {
              const progressPct = Math.min(100, Math.max(8, Math.round((p.position / targetSteps) * 100)));
              const stageIdx = Math.min(4, Math.floor((p.position / targetSteps) * 5));
              
              // Determine flower head icon based on avatar and growth
              let topIcon = '🌱';
              if (progressPct >= 90) {
                topIcon = p.avatar === '🌻' ? '🌻' : p.avatar === '🌷' ? '🌷' : p.avatar === '🌳' ? '🌳' : p.avatar === '🍄' ? '🍄' : '🌺';
              } else if (progressPct >= 60) {
                topIcon = p.avatar === '🌷' ? '🌷' : p.avatar === '🌻' ? '🌼' : p.avatar === '🌳' ? '🌲' : '🪴';
              } else if (progressPct >= 35) {
                topIcon = '🌿';
              } else if (progressPct >= 15) {
                topIcon = '🌱';
              } else {
                topIcon = '🌰';
              }

              return (
                <div
                  key={p.id}
                  className="bg-emerald-950/50 p-2.5 sm:p-3 rounded-2xl border border-emerald-800/80 flex flex-col items-center justify-between h-full relative overflow-hidden shadow-inner"
                >
                  {/* Player Tag */}
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-200 z-10 w-full justify-between bg-slate-950/60 px-2 py-1 rounded-xl border border-emerald-900/50">
                    <div className="flex items-center gap-1 truncate">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                      <span className="truncate max-w-[65px]">{p.name}</span>
                    </div>
                    <span className="text-[11px] text-amber-400 font-mono font-extrabold">{p.position} / {targetSteps}</span>
                  </div>

                  {/* Soil & Garden Vessel Area */}
                  <div className="relative w-full flex-1 flex flex-col justify-end items-center my-1.5 overflow-hidden">
                    {/* Growth Stem Container */}
                    <div className="relative w-full flex flex-col items-center justify-end h-full">
                      {/* Blooming Flower Head at top of stem */}
                      <div
                        className="transition-all duration-700 ease-out z-20 flex flex-col items-center"
                        style={{
                          transform: `translateY(0px) scale(${0.8 + (progressPct / 100) * 0.5})`,
                        }}
                      >
                        <span className="text-3xl sm:text-4xl filter drop-shadow-[0_4px_8px_rgba(16,185,129,0.5)] animate-bounce">
                          {topIcon}
                        </span>
                      </div>

                      {/* Dynamic Growing Green Stem Bar */}
                      <div
                        className="w-3 bg-gradient-to-t from-emerald-700 via-green-500 to-emerald-400 rounded-t-full transition-all duration-700 ease-out relative shadow-lg flex flex-col items-center"
                        style={{ height: `${progressPct}%` }}
                      >
                        {/* Sprouting Leaves along the stem */}
                        {progressPct >= 25 && (
                          <div className="absolute top-[20%] -left-3 text-xs transform -rotate-45 animate-pulse">
                            🍃
                          </div>
                        )}
                        {progressPct >= 50 && (
                          <div className="absolute top-[50%] -right-3 text-xs transform rotate-45 animate-pulse">
                            🌿
                          </div>
                        )}
                        {progressPct >= 75 && (
                          <div className="absolute top-[80%] -left-3 text-xs transform -rotate-45 animate-pulse">
                            🍃
                          </div>
                        )}
                      </div>

                      {/* Pot / Earth Base */}
                      <div className="w-16 h-7 bg-amber-950 border-t-2 border-amber-800 rounded-b-xl flex items-center justify-center text-xs text-amber-400 font-bold z-10 shadow-md">
                        🪴 tanah
                      </div>
                    </div>
                  </div>

                  {/* Growth Status Badge */}
                  <div className="w-full bg-slate-950/80 rounded-xl py-0.5 px-2 text-center border border-emerald-900 z-10">
                    <span className="text-[10px] text-emerald-300 font-bold block truncate">
                      {theme.stepLabels?.[stageIdx] || `Tumbuh ${progressPct}%`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* THEME 3: MONSTER EVOLUTION */}
        {theme.boardType === 'evolution_arena' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {players.map((p) => {
              const stageIdx = Math.min(4, Math.floor((p.position / targetSteps) * 5));
              const monsterForms = ['🥚', '🐣', '👾', '🦖', '👑 🐉'];
              return (
                <div
                  key={p.id}
                  className="bg-purple-950/40 p-3 rounded-2xl border border-purple-800/60 flex flex-col items-center justify-between text-center relative overflow-hidden"
                >
                  <div className="flex items-center gap-1 text-xs font-bold text-purple-200">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="truncate max-w-[80px]">{p.name}</span>
                  </div>

                  <div className="my-2 relative">
                    <div className="text-4xl sm:text-5xl animate-bounce">{monsterForms[stageIdx]}</div>
                    <div className="text-lg absolute -top-1 -right-2">{p.avatar}</div>
                  </div>

                  <div className="w-full bg-purple-950 rounded-full h-2 border border-purple-700/50 overflow-hidden">
                    <div
                      className="bg-purple-400 h-full transition-all duration-500"
                      style={{ width: `${(p.position / targetSteps) * 100}%` }}
                    />
                  </div>

                  <span className="text-[10px] text-purple-300 font-semibold mt-1">
                    Evolusi: {theme.stepLabels?.[stageIdx] || `Stage ${stageIdx + 1}`}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* THEME 4: COLOR KINGDOM (Territory Map Grid) */}
        {theme.boardType === 'territory_grid' && (
          <div className="flex flex-col items-center">
            {/* Grid Map */}
            <div className="grid grid-cols-6 gap-1.5 p-3 bg-slate-950 rounded-2xl border border-slate-800 max-w-md w-full shadow-inner">
              {Array.from({ length: 24 }).map((_, tileIdx) => {
                // Determine owner based on position shares
                const totalProgress = players.reduce((sum, p) => sum + p.position, 0);
                let owner: PlayerState | null = null;
                if (totalProgress > 0) {
                  let accumulated = 0;
                  for (const p of players) {
                    accumulated += p.position;
                    if (tileIdx / 24 < accumulated / Math.max(1, totalProgress)) {
                      owner = p;
                      break;
                    }
                  }
                }

                return (
                  <div
                    key={tileIdx}
                    className="h-8 rounded-lg border border-slate-800 flex items-center justify-center transition-all duration-300"
                    style={{
                      backgroundColor: owner ? owner.color + '40' : '#0f172a',
                      borderColor: owner ? owner.color : '#1e293b',
                    }}
                  >
                    {owner ? <span className="text-xs">{owner.avatar}</span> : <span className="text-[10px] text-slate-700">🏰</span>}
                  </div>
                );
              })}
            </div>

            {/* Territory Legend */}
            <div className="flex flex-wrap justify-center gap-3 mt-3">
              {players.map((p) => (
                <div key={p.id} className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                  <span className="w-3 h-3 rounded" style={{ backgroundColor: p.color }} />
                  <span>{p.name}:</span>
                  <span className="text-cyan-400">{p.position} Petak</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* THEME 5: CLASH OF NUMBERS (RPG Battle) */}
        {theme.boardType === 'rpg_battle' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-slate-950/80 p-3 rounded-2xl border border-rose-900/60">
              <div className="flex items-center gap-2">
                <span className="text-3xl">🧌</span>
                <div>
                  <div className="font-extrabold text-sm text-rose-300">Raja Monster Angka</div>
                  <div className="text-[10px] text-slate-400">Tingkat Kesulitan RPG Arena</div>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-rose-950 px-2.5 py-1 rounded-xl border border-rose-800">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span className="text-xs font-bold text-white">Boss Arena</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {players.map((p) => (
                <div key={p.id} className="bg-slate-950/70 p-2.5 rounded-2xl border border-slate-800 text-center">
                  <div className="text-3xl mb-1">{p.avatar}</div>
                  <div className="text-xs font-bold text-white truncate">{p.name}</div>
                  <div className="text-[10px] text-rose-400 font-bold mt-0.5">Power: {p.position * 10} HP</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* THEME 6: MATH CHEF */}
        {theme.boardType === 'kitchen_counters' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {players.map((p) => {
              const ordersCompleted = Math.floor(p.position / 3);
              return (
                <div key={p.id} className="bg-orange-950/40 p-3 rounded-2xl border border-orange-800/60 text-center">
                  <div className="text-3xl mb-1">{p.avatar}</div>
                  <div className="text-xs font-bold text-white truncate">{p.name}</div>
                  <div className="my-2 text-2xl">
                    {ordersCompleted >= 3 ? '🍔 🍕 🍣' : ordersCompleted >= 1 ? '🍔 🍕' : '🍔'}
                  </div>
                  <div className="text-[10px] text-amber-300 font-bold">
                    {ordersCompleted} Pesanan Selesai
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* THEME 7: PLANET DEFENDER */}
        {theme.boardType === 'planet_orbit' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {players.map((p) => (
              <div key={p.id} className="bg-indigo-950/50 p-3 rounded-2xl border border-indigo-800/60 text-center">
                <div className="text-3xl mb-1">{p.avatar}</div>
                <div className="text-xs font-bold text-white truncate">{p.name}</div>
                <div className="text-xs text-indigo-300 font-mono mt-1">
                  💥 {p.position} Meteor Hancur
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Board Footer Step Milestones */}
      <div className="relative z-10 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
        <span>Garis Start 🚦</span>
        <span className="text-amber-400">Target: {targetSteps} Poin</span>
        <span>Garis Finish 🏁</span>
      </div>
    </div>
  );
};
