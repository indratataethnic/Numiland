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
      className={`w-full h-full rounded-3xl border-2 ${theme.borderColor} ${theme.cardBg} p-3 sm:p-4 flex flex-col justify-between backdrop-blur-md shadow-2xl relative overflow-hidden select-none`}
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

        {/* THEME 5: MENERBANGKAN ROKET (Vertical Rocket Launch from Earth to Space) */}
        {theme.boardType === 'rocket_sky' && (
          <div className={`grid gap-3 sm:gap-4 items-end justify-center py-2 ${
            players.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' :
            players.length === 2 ? 'grid-cols-2 max-w-md mx-auto' :
            players.length === 3 ? 'grid-cols-3 max-w-2xl mx-auto' :
            'grid-cols-2 sm:grid-cols-4'
          }`}>
            {players.map((p) => {
              const progressPct = Math.min(100, Math.round((p.position / targetSteps) * 100));
              const stageIdx = Math.min(4, Math.floor((p.position / targetSteps) * 5));
              const altitudeKm = Math.round(p.position * 20); // e.g. 0 km to 600 km

              return (
                <div
                  key={p.id}
                  className="relative bg-slate-950/85 p-3 rounded-2xl border-2 border-indigo-800/70 shadow-2xl flex flex-col items-center justify-between transition-all"
                >
                  {/* Player Header & Stage Label */}
                  <div className="w-full flex flex-col items-center gap-1 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: p.color }} />
                      <span className="text-white font-black text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[120px]">
                        {p.name}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-indigo-300 bg-indigo-950/80 px-2.5 py-0.5 rounded-md border border-indigo-700/50">
                      {theme.stepLabels?.[stageIdx] || `Ketinggian ${progressPct}%`}
                    </span>
                  </div>

                  {/* Vertical Rocket Launch Chamber (Earth at bottom, Space at top) */}
                  <div className="relative w-28 sm:w-32 h-60 sm:h-72 bg-[linear-gradient(to_top,#047857_0%,#0284c7_30%,#312e81_65%,#030712_100%)] rounded-2xl border-4 border-indigo-500/60 p-1.5 flex flex-col justify-between overflow-hidden shadow-[0_0_25px_rgba(99,102,241,0.25)]">
                    {/* Top Goal: Outer Space & Stars (100%) */}
                    <div className="w-full flex justify-between items-center px-1.5 text-[10px] sm:text-[11px] z-20 font-extrabold text-amber-300 bg-slate-950/80 py-0.5 rounded-md border border-indigo-500/40">
                      <span>🌌 Angkasa</span>
                      <span>🌟</span>
                    </div>

                    {/* Stage Altitude Markers on Wall */}
                    <div className="absolute inset-x-0 bottom-[75%] border-b border-indigo-400/30 flex items-center justify-between px-1.5 pointer-events-none z-10 text-[8px] sm:text-[9px] font-bold text-indigo-200/60">
                      <span>Stratosfer</span>
                      <span>75%</span>
                    </div>
                    <div className="absolute inset-x-0 bottom-[50%] border-b border-sky-400/30 flex items-center justify-between px-1.5 pointer-events-none z-10 text-[8px] sm:text-[9px] font-bold text-sky-200/60">
                      <span>Awan ☁️</span>
                      <span>50%</span>
                    </div>
                    <div className="absolute inset-x-0 bottom-[25%] border-b border-emerald-400/30 flex items-center justify-between px-1.5 pointer-events-none z-10 text-[8px] sm:text-[9px] font-bold text-emerald-200/60">
                      <span>Pohon 🌳</span>
                      <span>25%</span>
                    </div>

                    {/* Launch Guide Track / Laser Beam */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-6 bottom-6 w-0.5 bg-indigo-400/30 border-l border-dashed border-indigo-300/50 pointer-events-none" />

                    {/* Ascending Rocket Character Pod */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 transition-all duration-700 ease-out z-30 flex flex-col items-center pointer-events-none"
                      style={{
                        bottom: `calc(${Math.min(88, Math.max(5, progressPct))}% - 20px)`,
                      }}
                    >
                      {/* Rocket Pod Container */}
                      <div
                        className="flex items-center gap-1 bg-slate-950/90 border-2 rounded-2xl px-2 py-1 shadow-2xl backdrop-blur-sm relative"
                        style={{ borderColor: p.color }}
                      >
                        <span className="text-2xl sm:text-3xl animate-pulse">{p.avatar}</span>
                      </div>

                      {/* Animated Thruster Flame & Smoke Trail */}
                      <div className="flex flex-col items-center -mt-1">
                        <span className="text-xs animate-bounce">🔥</span>
                        <div className="flex items-center gap-0.5 text-[8px] text-amber-300/80 -mt-1">
                          <span className="animate-ping delay-100">💨</span>
                          <span className="animate-pulse delay-200">✨</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Base: Earth / Children's Home (0%) */}
                    <div className="w-full flex justify-between items-center px-1.5 text-[10px] z-20 font-black text-emerald-200 bg-emerald-950/90 py-1 rounded-md border border-emerald-700/60">
                      <span className="flex items-center gap-1">🏡 🌍 Bumi</span>
                      <span>0 km</span>
                    </div>
                  </div>

                  {/* Footer Altitude Km & Score */}
                  <div className="w-full text-center mt-2 pt-1 border-t border-slate-800/80 flex items-center justify-center gap-1 text-xs">
                    <span className="text-indigo-300 font-extrabold">
                      🚀 {altitudeKm} KM
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      ({p.position}/{targetSteps})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* THEME 6: MENGISI AIR AJAIB (Water Container Fill) */}
        {theme.boardType === 'water_container' && (
          <div className={`grid gap-3 sm:gap-4 items-end justify-center py-2 ${
            players.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' :
            players.length === 2 ? 'grid-cols-2 max-w-md mx-auto' :
            players.length === 3 ? 'grid-cols-3 max-w-2xl mx-auto' :
            'grid-cols-2 sm:grid-cols-4'
          }`}>
            {players.map((p) => {
              const progressPct = Math.min(100, Math.round((p.position / targetSteps) * 100));
              const stageIdx = Math.min(4, Math.floor((p.position / targetSteps) * 5));

              return (
                <div
                  key={p.id}
                  className="relative bg-slate-950/85 p-3 rounded-2xl border-2 border-cyan-800/80 shadow-2xl flex flex-col items-center justify-between transition-all"
                >
                  {/* Player Header & Stage Label */}
                  <div className="w-full flex flex-col items-center gap-1 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: p.color }} />
                      <span className="text-white font-black text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[120px]">
                        {p.name}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-md border border-cyan-800/50">
                      {theme.stepLabels?.[stageIdx] || `Terisi ${progressPct}%`}
                    </span>
                  </div>

                  {/* Vertical Water Tank Container */}
                  <div className="relative flex flex-col items-center my-1">
                    {/* Top Water Faucet / Spout */}
                    <div className="w-full flex items-center justify-between px-2 bg-slate-900/90 py-1 rounded-t-xl border-t-2 border-x-2 border-cyan-500/50 z-10">
                      <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                        🚰 Kran Air
                      </span>
                      <span className="text-[10px] font-extrabold text-sky-400 animate-pulse">
                        💧 Kucuran
                      </span>
                    </div>

                    {/* Main Water Vessel */}
                    <div className="relative w-28 sm:w-32 h-56 sm:h-64 bg-slate-900/95 rounded-b-2xl border-x-4 border-b-4 border-cyan-500/70 p-1.5 flex flex-col justify-end overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.25)]">
                      {/* Graduation Marks (25%, 50%, 75%) */}
                      <div className="absolute inset-x-0 bottom-[75%] border-b border-cyan-400/30 flex items-center justify-end pr-1.5 pointer-events-none z-10">
                        <span className="text-[9px] font-extrabold text-cyan-300/60">75%</span>
                      </div>
                      <div className="absolute inset-x-0 bottom-[50%] border-b border-cyan-400/30 flex items-center justify-end pr-1.5 pointer-events-none z-10">
                        <span className="text-[9px] font-extrabold text-cyan-300/60">50%</span>
                      </div>
                      <div className="absolute inset-x-0 bottom-[25%] border-b border-cyan-400/30 flex items-center justify-end pr-1.5 pointer-events-none z-10">
                        <span className="text-[9px] font-extrabold text-cyan-300/60">25%</span>
                      </div>

                      {/* Animated Water Liquid Fill (Bottom to Top) */}
                      <div
                        className="w-full bg-gradient-to-t from-blue-700 via-cyan-500 to-sky-300 rounded-xl transition-all duration-700 ease-out relative shadow-[0_0_20px_rgba(6,182,212,0.6)] flex flex-col justify-between overflow-hidden"
                        style={{ height: `${Math.max(8, progressPct)}%` }}
                      >
                        {/* Surface Wave Effect */}
                        <div className="w-full h-1.5 bg-white/70 animate-pulse shadow-[0_0_8px_#ffffff]" />

                        {/* Floating Bubbles & Water Drops */}
                        {progressPct >= 15 && (
                          <div className="flex justify-around items-end opacity-70 pointer-events-none pb-1">
                            <span className="text-[10px] animate-bounce delay-100">🫧</span>
                            <span className="text-[12px] animate-pulse delay-300">💧</span>
                            <span className="text-[10px] animate-bounce delay-200">🫧</span>
                          </div>
                        )}
                      </div>

                      {/* Floating Player Avatar on Water Level */}
                      <div
                        className="absolute inset-x-1 transition-all duration-700 ease-out z-30 flex items-center justify-center pointer-events-none"
                        style={{
                          bottom: `calc(${Math.min(88, Math.max(6, progressPct))}% - 14px)`,
                        }}
                      >
                        <div
                          className="flex items-center gap-1 bg-slate-950/95 border-2 rounded-xl px-2 py-0.5 shadow-2xl"
                          style={{ borderColor: p.color }}
                        >
                          <span className="text-xl animate-bounce">{p.avatar}</span>
                          <span className="text-[10px] font-black text-cyan-400">💧</span>
                        </div>
                      </div>

                      {/* Center Overlay Text showing Percentage */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                        <span className="text-[11px] sm:text-xs font-black text-white bg-slate-950/85 px-2 py-1 rounded-full border border-cyan-400/60 shadow-lg text-center">
                          {progressPct === 100 ? '🌊 100% MELUAP' : `💧 ${progressPct}% TERISI`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Score Stats */}
                  <div className="w-full text-center mt-2 pt-1 border-t border-slate-800/80">
                    <span className="text-xs font-extrabold text-cyan-300">
                      {p.position} / {targetSteps} Poin
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* THEME 7: MENGISI ENERGI BATERAI (Vertical Battery Fill) */}
        {theme.boardType === 'battery_fill' && (
          <div className={`grid gap-3 sm:gap-4 items-end justify-center py-2 ${
            players.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' :
            players.length === 2 ? 'grid-cols-2 max-w-md mx-auto' :
            players.length === 3 ? 'grid-cols-3 max-w-2xl mx-auto' :
            'grid-cols-2 sm:grid-cols-4'
          }`}>
            {players.map((p) => {
              const progressPct = Math.min(100, Math.round((p.position / targetSteps) * 100));
              const stageIdx = Math.min(4, Math.floor((p.position / targetSteps) * 5));

              return (
                <div
                  key={p.id}
                  className="relative bg-slate-950/85 p-3 rounded-2xl border-2 border-emerald-900/70 shadow-2xl flex flex-col items-center justify-between transition-all"
                >
                  {/* Player Name & Badge Header */}
                  <div className="w-full flex flex-col items-center gap-1 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: p.color }} />
                      <span className="text-white font-black text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[120px]">
                        {p.name}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/50">
                      {theme.stepLabels?.[stageIdx] || `Daya ${progressPct}%`}
                    </span>
                  </div>

                  {/* Vertical Battery Visual Unit */}
                  <div className="relative flex flex-col items-center my-1">
                    {/* Battery Positive (+) Terminal Cap */}
                    <div className="w-8 h-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-t-md border-t-2 border-x-2 border-emerald-300 shadow-md flex items-center justify-center -mb-[2px] z-10">
                      <span className="text-[10px] font-black text-slate-950 leading-none">+</span>
                    </div>

                    {/* Main Vertical Battery Chamber */}
                    <div className="relative w-24 sm:w-28 h-52 sm:h-60 bg-slate-900/95 rounded-2xl border-4 border-emerald-500/70 p-1.5 flex flex-col justify-end overflow-hidden shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                      {/* Horizontal Percentage Marker Lines (25%, 50%, 75%) */}
                      <div className="absolute inset-x-0 bottom-[25%] border-b border-emerald-500/25 flex items-center justify-end pr-1 pointer-events-none z-20">
                        <span className="text-[9px] font-bold text-emerald-500/60">25%</span>
                      </div>
                      <div className="absolute inset-x-0 bottom-[50%] border-b border-emerald-500/25 flex items-center justify-end pr-1 pointer-events-none z-20">
                        <span className="text-[9px] font-bold text-emerald-500/60">50%</span>
                      </div>
                      <div className="absolute inset-x-0 bottom-[75%] border-b border-emerald-500/25 flex items-center justify-end pr-1 pointer-events-none z-20">
                        <span className="text-[9px] font-bold text-emerald-500/60">75%</span>
                      </div>

                      {/* Vertical Green Energy Fill Bar (Bottom to Top) */}
                      <div
                        className="w-full bg-gradient-to-t from-emerald-700 via-emerald-500 to-green-400 rounded-xl transition-all duration-700 ease-out relative overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.6)] flex flex-col justify-between"
                        style={{ height: `${Math.max(6, progressPct)}%` }}
                      >
                        {/* Animated Glowing Wave/Shimmer Effect */}
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.45)_0%,transparent_50%,rgba(0,0,0,0.2)_100%)] pointer-events-none" />

                        {/* Top Edge Glow line */}
                        <div className="w-full h-1 bg-white/80 shadow-[0_0_8px_#ffffff] shrink-0" />

                        {/* Floating Sparks inside filled green bar */}
                        {progressPct >= 15 && (
                          <div className="flex justify-around items-center text-xs py-1 text-emerald-100 opacity-80 pointer-events-none">
                            <span className="animate-ping delay-100">⚡</span>
                            <span className="animate-pulse delay-300">✨</span>
                          </div>
                        )}
                      </div>

                      {/* Floating Player Avatar Marker attached to fill level height */}
                      <div
                        className="absolute inset-x-1 transition-all duration-700 ease-out z-30 flex items-center justify-center pointer-events-none"
                        style={{
                          bottom: `calc(${Math.min(88, Math.max(5, progressPct))}% - 14px)`,
                        }}
                      >
                        <div
                          className="flex items-center gap-1 bg-slate-950/95 border-2 rounded-xl px-2 py-0.5 shadow-2xl"
                          style={{ borderColor: p.color }}
                        >
                          <span className="text-xl animate-bounce">{p.avatar}</span>
                          <span className="text-[10px] font-black text-emerald-400">⚡</span>
                        </div>
                      </div>

                      {/* Center Overlay Text showing Percentage */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                        <span className="text-[11px] sm:text-xs font-black text-white bg-slate-950/85 px-2 py-1 rounded-full border border-emerald-500/60 shadow-lg text-center">
                          {progressPct === 100 ? '⚡ 100% FULL' : `⚡ ${progressPct}%`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Step Stats */}
                  <div className="w-full text-center mt-2 pt-1 border-t border-slate-800/80">
                    <span className="text-xs font-extrabold text-emerald-300">
                      {p.position} / {targetSteps} Poin
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* THEME 8: PANJAT PINANG KEMERDEKAAN (Authentic Indonesian Areca Palm Tree Climb) */}
        {theme.boardType === 'pinang_climb' && (
          <div className={`grid gap-3 sm:gap-4 items-end justify-center py-2 ${
            players.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' :
            players.length === 2 ? 'grid-cols-2 max-w-md mx-auto' :
            players.length === 3 ? 'grid-cols-3 max-w-2xl mx-auto' :
            'grid-cols-2 sm:grid-cols-4'
          }`}>
            {players.map((p) => {
              const progressPct = Math.min(100, Math.round((p.position / targetSteps) * 100));
              const stageIdx = Math.min(4, Math.floor((p.position / targetSteps) * 5));

              return (
                <div
                  key={p.id}
                  className="relative bg-slate-950/90 p-3 rounded-2xl border-2 border-red-800/80 shadow-2xl flex flex-col items-center justify-between transition-all"
                >
                  {/* Player Header & Stage Label */}
                  <div className="w-full flex flex-col items-center gap-1 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: p.color }} />
                      <span className="text-white font-black text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[120px]">
                        {p.name}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-amber-300 bg-red-950/90 px-2.5 py-0.5 rounded-md border border-red-700/60 shadow-sm">
                      {theme.stepLabels?.[stageIdx] || `Tinggi ${progressPct}%`}
                    </span>
                  </div>

                  {/* Complete Panjat Pinang Tree Construction */}
                  <div className="relative flex flex-col items-center my-1 w-full">
                    {/* 1. TOP CROWN: PALM FRONDS & FLAG */}
                    <div className="relative flex flex-col items-center z-30">
                      {/* Flag at Peak */}
                      <div className="flex items-center gap-1 bg-red-600 text-white px-2 py-0.5 rounded-full text-[10px] font-black shadow-lg border border-amber-300 animate-bounce">
                        <span>🇲🇨</span>
                        <span>MERDEKA!</span>
                      </div>

                      {/* Palm Tree Leaves Crown */}
                      <div className="text-2xl -my-1 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] pointer-events-none">
                        🌴 🌴 🌴
                      </div>

                      {/* 2. BAMBOO PRIZE WHEEL (Roda Bamboo Hadiah 17an) */}
                      <div className="w-28 sm:w-32 bg-gradient-to-r from-amber-800 via-yellow-700 to-amber-800 border-2 border-amber-300 rounded-full py-1.5 px-2 flex flex-col items-center shadow-xl relative overflow-hidden -mt-1">
                        <div className="text-[9px] font-black text-amber-200 tracking-wider uppercase flex items-center gap-1">
                          🎁 Hadiah Puncak 🎁
                        </div>
                        {/* Hanging Prizes Grid */}
                        <div className="flex items-center justify-around w-full mt-1 text-sm sm:text-base bg-slate-950/60 rounded-lg py-1 px-1 border border-amber-500/40 shadow-inner">
                          <span title="Sepeda" className="animate-pulse">🚲</span>
                          <span title="Radio" className="animate-bounce delay-100">📻</span>
                          <span title="Baju" className="animate-pulse delay-200">👕</span>
                          <span title="Panci" className="animate-bounce delay-300">🍳</span>
                          <span title="Kado" className="animate-pulse delay-150">🎁</span>
                        </div>
                      </div>
                    </div>

                    {/* 3. MAIN OILY WOODEN TREE TRUNK */}
                    <div className="relative w-24 sm:w-28 h-44 sm:h-52 md:h-56 bg-amber-950 rounded-b-xl border-x-4 border-b-4 border-amber-800/90 p-1 flex flex-col justify-end overflow-hidden shadow-[0_0_20px_rgba(180,83,9,0.3)] -mt-1">
                      {/* Tree Bark Notch Rings & Texture */}
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(120,53,15,0.9)_0%,rgba(69,26,3,0.95)_50%,rgba(120,53,15,0.9)_100%)] pointer-events-none" />
                      
                      {/* Horizontal Bark Rings */}
                      <div className="absolute inset-x-0 top-[15%] border-b border-amber-900/60 pointer-events-none" />
                      <div className="absolute inset-x-0 top-[30%] border-b border-amber-900/60 pointer-events-none" />
                      <div className="absolute inset-x-0 top-[45%] border-b border-amber-900/60 pointer-events-none" />
                      <div className="absolute inset-x-0 top-[60%] border-b border-amber-900/60 pointer-events-none" />
                      <div className="absolute inset-x-0 top-[75%] border-b border-amber-900/60 pointer-events-none" />

                      {/* Glossy Oil / Pelumas Sheen Effect */}
                      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-5 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent pointer-events-none" />

                      {/* Slick Oil Drops Drip Animation */}
                      <div className="absolute inset-0 flex justify-between px-2 opacity-50 pointer-events-none z-10">
                        <span className="text-[10px] animate-bounce delay-75">💧</span>
                        <span className="text-[12px] animate-pulse delay-300">💦</span>
                      </div>

                      {/* Height Percentage Guide Markers */}
                      <div className="absolute inset-x-0 bottom-[75%] border-b border-dashed border-amber-500/40 flex items-center justify-between px-1 pointer-events-none z-10 text-[8px] font-extrabold text-amber-300/70">
                        <span>75%</span>
                        <span>Hampir Puncak 🏁</span>
                      </div>
                      <div className="absolute inset-x-0 bottom-[50%] border-b border-dashed border-amber-500/40 flex items-center justify-between px-1 pointer-events-none z-10 text-[8px] font-extrabold text-amber-300/70">
                        <span>50%</span>
                        <span>Pertengahan</span>
                      </div>
                      <div className="absolute inset-x-0 bottom-[25%] border-b border-dashed border-amber-500/40 flex items-center justify-between px-1 pointer-events-none z-10 text-[8px] font-extrabold text-amber-300/70">
                        <span>25%</span>
                        <span>Panjat Licin</span>
                      </div>

                      {/* Climbing Fill Gradient on Pole */}
                      <div
                        className="w-full bg-gradient-to-t from-red-900 via-amber-600 to-yellow-400 rounded-lg transition-all duration-700 ease-out relative shadow-[0_0_12px_rgba(251,191,36,0.6)] flex flex-col justify-between overflow-hidden"
                        style={{ height: `${Math.max(8, progressPct)}%` }}
                      >
                        <div className="w-full h-1.5 bg-yellow-100 animate-pulse shadow-[0_0_8px_#fef08a]" />
                      </div>

                      {/* CLIMBER PLAYER AVATAR ON TRUNK */}
                      <div
                        className="absolute inset-x-0 transition-all duration-700 ease-out z-30 flex items-center justify-center pointer-events-none"
                        style={{
                          bottom: `calc(${Math.min(88, Math.max(6, progressPct))}% - 14px)`,
                        }}
                      >
                        <div
                          className="flex items-center gap-1 bg-slate-950/95 border-2 rounded-xl px-2 py-0.5 shadow-2xl scale-105"
                          style={{ borderColor: p.color }}
                        >
                          <span className="text-xl animate-bounce">{p.avatar}</span>
                          <span className="text-[10px] font-black text-amber-300">🧗</span>
                        </div>
                      </div>

                      {/* Percentage Badge Overlay on Trunk Center */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                        <span className="text-[10px] sm:text-[11px] font-black text-white bg-slate-950/85 px-2 py-0.5 rounded-full border border-amber-400/60 shadow-lg text-center">
                          {progressPct === 100 ? '🎉 100% CAPAI PUNCAK' : `🌴 ${progressPct}% TINGGI`}
                        </span>
                      </div>
                    </div>

                    {/* 4. BOTTOM GROUND: GRASS, MUD & SPECTATORS */}
                    <div className="w-28 sm:w-32 bg-gradient-to-r from-emerald-950 via-green-900 to-emerald-950 py-1 px-2 rounded-b-xl border-x-2 border-b-2 border-emerald-600/70 flex items-center justify-between text-[9px] font-bold text-emerald-200 z-20 shadow-md">
                      <span className="flex items-center gap-0.5">🌱 Tanah 🇲🇨</span>
                      <span className="text-[10px]">👏 🥳</span>
                    </div>
                  </div>

                  {/* Footer Score Stats */}
                  <div className="w-full text-center mt-2 pt-1 border-t border-slate-800/80">
                    <span className="text-xs font-extrabold text-red-400">
                      {p.position} / {targetSteps} Poin
                    </span>
                  </div>
                </div>
              );
            })}
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
