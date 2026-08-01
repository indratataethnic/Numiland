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
      className={`w-full h-full rounded-2xl sm:rounded-3xl border-2 ${theme.borderColor} ${theme.cardBg} p-2 sm:p-2.5 flex flex-col justify-between backdrop-blur-md shadow-2xl relative overflow-hidden select-none`}
    >
      {/* Background Decor Ambient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950/80 pointer-events-none" />

      {/* Board Header Banner */}
      <div className="relative z-10 flex items-center justify-between pb-1.5 border-b border-slate-800/80">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-base sm:text-xl">{theme.emoji}</span>
          <div>
            <h2 className="text-xs sm:text-sm font-black text-white tracking-wide uppercase">
              {theme.name}
            </h2>
            <p className="text-[10px] text-amber-400 font-semibold hidden sm:block">{theme.subtitle}</p>
          </div>
        </div>

        {/* Lead Player Tracker */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-slate-700">
          <Trophy className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-400" />
          <span className="text-[10px] sm:text-xs text-slate-400 hidden sm:inline">Pemimpin:</span>
          {(() => {
            const sorted = [...players].sort((a, b) => b.position - a.position);
            const leader = sorted[0];
            return (
              <span className="text-[10px] sm:text-xs font-bold text-white flex items-center gap-1">
                <span>{leader.avatar}</span>
                <span className="truncate max-w-[60px] sm:max-w-[80px]">{leader.name}</span>
                <span className="text-amber-400">({leader.position})</span>
              </span>
            );
          })()}
        </div>
      </div>

      {/* BOARD VISUALIZATION PER THEME */}
      <div className="relative z-10 my-1 sm:my-2 flex-1 flex flex-col justify-center overflow-hidden">
        {/* THEME 1: SMART RACE (Race Track) */}
        {theme.boardType === 'race_track' && (
          <div className="space-y-1.5">
            {players.map((p) => {
              const progressPct = Math.min(100, Math.round((p.position / targetSteps) * 100));
              return (
                <div key={p.id} className="relative bg-slate-950/80 p-1.5 sm:p-2 rounded-xl border border-slate-800 shadow-inner">
                  {/* Lane Label */}
                  <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold text-slate-300 mb-0.5 px-0.5">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      <span>{p.name}</span>
                    </div>
                    <span className="text-amber-400 font-mono text-[10px]">{p.position} / {targetSteps}</span>
                  </div>

                  {/* Track Bar */}
                  <div className="relative h-6 sm:h-7 bg-slate-900 rounded-lg overflow-hidden border border-slate-800 flex items-center px-1">
                    {/* Progress Fill */}
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-400 rounded-lg transition-all duration-500 shadow-lg"
                      style={{ width: `${Math.max(5, progressPct)}%` }}
                    />

                    {/* Finish Flag Marker */}
                    <div className="absolute right-1.5 text-xs sm:text-sm z-10">🏁</div>

                    {/* Moving Avatar Token */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 transition-all duration-500 ease-out z-20 flex items-center justify-center bg-slate-900 border-2 rounded-lg p-0.5 shadow-xl"
                      style={{
                        left: `calc(${Math.min(90, Math.max(2, progressPct))}% - 12px)`,
                        borderColor: p.color,
                      }}
                    >
                      <span className="text-xs sm:text-sm animate-pulse">{p.avatar}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* THEME 2: GARDEN RACE (Plant Growth) */}
        {theme.boardType === 'growth_garden' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2.5 h-[11vh] sm:h-[14vh] min-h-[80px] max-h-[150px] items-end">
            {players.map((p) => {
              const progressPct = Math.min(100, Math.max(8, Math.round((p.position / targetSteps) * 100)));
              const stageIdx = Math.min(4, Math.floor((p.position / targetSteps) * 5));
              
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
                  className="bg-emerald-950/50 p-1.5 rounded-xl border border-emerald-800/80 flex flex-col items-center justify-between h-full relative overflow-hidden shadow-inner"
                >
                  {/* Player Tag */}
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-200 z-10 w-full justify-between bg-slate-950/60 px-1.5 py-0.5 rounded-md border border-emerald-900/50">
                    <div className="flex items-center gap-1 truncate">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                      <span className="truncate max-w-[50px]">{p.name}</span>
                    </div>
                    <span className="text-[10px] text-amber-400 font-mono font-extrabold">{p.position}/{targetSteps}</span>
                  </div>

                  {/* Soil & Garden Vessel Area */}
                  <div className="relative w-full flex-1 flex flex-col justify-end items-center my-0.5 overflow-hidden">
                    <div className="relative w-full flex flex-col items-center justify-end h-full">
                      {/* Blooming Flower Head at top of stem */}
                      <div
                        className="transition-all duration-700 ease-out z-20 flex flex-col items-center"
                        style={{
                          transform: `translateY(0px) scale(${0.7 + (progressPct / 100) * 0.4})`,
                        }}
                      >
                        <span className="text-xl sm:text-2xl filter drop-shadow-[0_2px_4px_rgba(16,185,129,0.5)] animate-bounce">
                          {topIcon}
                        </span>
                      </div>

                      {/* Dynamic Growing Green Stem Bar */}
                      <div
                        className="w-2 sm:w-2.5 bg-gradient-to-t from-emerald-700 via-green-500 to-emerald-400 rounded-t-full transition-all duration-700 ease-out relative shadow-lg flex flex-col items-center"
                        style={{ height: `${progressPct}%` }}
                      >
                        {progressPct >= 25 && (
                          <div className="absolute top-[20%] -left-2 text-[8px] transform -rotate-45 animate-pulse">
                            🍃
                          </div>
                        )}
                        {progressPct >= 50 && (
                          <div className="absolute top-[50%] -right-2 text-[8px] transform rotate-45 animate-pulse">
                            🌿
                          </div>
                        )}
                        {progressPct >= 75 && (
                          <div className="absolute top-[80%] -left-2 text-[8px] transform -rotate-45 animate-pulse">
                            🍃
                          </div>
                        )}
                      </div>

                      {/* Pot / Earth Base */}
                      <div className="w-12 sm:w-14 h-4 bg-amber-950 border-t border-amber-800 rounded-b-lg flex items-center justify-center text-[9px] text-amber-400 font-bold z-10 shadow-sm">
                        🪴 tanah
                      </div>
                    </div>
                  </div>

                  {/* Growth Status Badge */}
                  <div className="w-full bg-slate-950/80 rounded-md py-0.5 px-1 text-center border border-emerald-900 z-10">
                    <span className="text-[9px] text-emerald-300 font-bold block truncate">
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
            {players.map((p) => {
              const stageIdx = Math.min(4, Math.floor((p.position / targetSteps) * 5));
              const monsterForms = ['🥚', '🐣', '👾', '🦖', '👑 🐉'];
              return (
                <div
                  key={p.id}
                  className="bg-purple-950/40 p-1.5 rounded-xl border border-purple-800/60 flex flex-col items-center justify-between text-center relative overflow-hidden"
                >
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-purple-200">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="truncate max-w-[70px]">{p.name}</span>
                  </div>

                  <div className="my-1 relative">
                    <div className="text-2xl sm:text-3xl animate-bounce">{monsterForms[stageIdx]}</div>
                    <div className="text-xs absolute -top-1 -right-2">{p.avatar}</div>
                  </div>

                  <div className="w-full bg-purple-950 rounded-full h-1.5 border border-purple-700/50 overflow-hidden">
                    <div
                      className="bg-purple-400 h-full transition-all duration-500"
                      style={{ width: `${(p.position / targetSteps) * 100}%` }}
                    />
                  </div>

                  <span className="text-[9px] text-purple-300 font-semibold mt-0.5 truncate">
                    {theme.stepLabels?.[stageIdx] || `Stage ${stageIdx + 1}`}
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
            <div className="grid grid-cols-6 gap-1 p-1.5 bg-slate-950 rounded-xl border border-slate-800 max-w-sm w-full shadow-inner">
              {Array.from({ length: 24 }).map((_, tileIdx) => {
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
                    className="h-5 sm:h-6 rounded border border-slate-800 flex items-center justify-center transition-all duration-300"
                    style={{
                      backgroundColor: owner ? owner.color + '40' : '#0f172a',
                      borderColor: owner ? owner.color : '#1e293b',
                    }}
                  >
                    {owner ? <span className="text-[10px]">{owner.avatar}</span> : <span className="text-[8px] text-slate-700">🏰</span>}
                  </div>
                );
              })}
            </div>

            {/* Territory Legend */}
            <div className="flex flex-wrap justify-center gap-2 mt-1">
              {players.map((p) => (
                <div key={p.id} className="flex items-center gap-1 text-[10px] font-bold text-slate-300">
                  <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: p.color }} />
                  <span>{p.name}:</span>
                  <span className="text-cyan-400">{p.position} Petak</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* THEME 5: MENERBANGKAN ROKET (Vertical Rocket Launch from Earth to Space) */}
        {theme.boardType === 'rocket_sky' && (
          <div className={`grid gap-1.5 sm:gap-2.5 items-end justify-center py-1 ${
            players.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' :
            players.length === 2 ? 'grid-cols-2 max-w-sm mx-auto' :
            players.length === 3 ? 'grid-cols-3 max-w-xl mx-auto' :
            'grid-cols-2 sm:grid-cols-4'
          }`}>
            {players.map((p) => {
              const progressPct = Math.min(100, Math.round((p.position / targetSteps) * 100));
              const stageIdx = Math.min(4, Math.floor((p.position / targetSteps) * 5));
              const altitudeKm = Math.round(p.position * 20);

              return (
                <div
                  key={p.id}
                  className="relative bg-slate-950/85 p-1.5 sm:p-2 rounded-xl border border-indigo-800/70 shadow-xl flex flex-col items-center justify-between transition-all"
                >
                  {/* Player Header & Stage Label */}
                  <div className="w-full flex flex-col items-center gap-0.5 mb-1">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: p.color }} />
                      <span className="text-white font-black text-[11px] sm:text-xs truncate max-w-[80px] sm:max-w-[100px]">
                        {p.name}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-700/50">
                      {theme.stepLabels?.[stageIdx] || `${progressPct}%`}
                    </span>
                  </div>

                  {/* Vertical Rocket Launch Chamber */}
                  <div className="relative w-20 sm:w-24 h-[10vh] sm:h-[13vh] min-h-[80px] max-h-[140px] bg-[linear-gradient(to_top,#047857_0%,#0284c7_30%,#312e81_65%,#030712_100%)] rounded-xl border-2 border-indigo-500/60 p-1 flex flex-col justify-between overflow-hidden shadow-[0_0_15px_rgba(99,102,241,0.25)]">
                    {/* Top Goal: Outer Space */}
                    <div className="w-full flex justify-between items-center px-1 text-[9px] z-20 font-extrabold text-amber-300 bg-slate-950/80 py-0.5 rounded border border-indigo-500/40">
                      <span>🌌 Angkasa</span>
                      <span>🌟</span>
                    </div>

                    {/* Launch Guide Track */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-0.5 bg-indigo-400/30 border-l border-dashed border-indigo-300/50 pointer-events-none" />

                    {/* Ascending Rocket Character Pod */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 transition-all duration-700 ease-out z-30 flex flex-col items-center pointer-events-none"
                      style={{
                        bottom: `calc(${Math.min(85, Math.max(8, progressPct))}% - 14px)`,
                      }}
                    >
                      <div
                        className="flex items-center gap-0.5 bg-slate-950/90 border rounded-lg px-1 py-0.5 shadow-xl"
                        style={{ borderColor: p.color }}
                      >
                        <span className="text-sm sm:text-base animate-pulse">{p.avatar}</span>
                      </div>
                    </div>

                    {/* Bottom Base: Earth */}
                    <div className="w-full flex justify-between items-center px-1 text-[8px] sm:text-[9px] z-20 font-black text-emerald-200 bg-emerald-950/90 py-0.5 rounded border border-emerald-700/60">
                      <span>🌍 Bumi</span>
                      <span>0km</span>
                    </div>
                  </div>

                  {/* Footer Altitude Km */}
                  <div className="w-full text-center mt-1 pt-0.5 border-t border-slate-800/80 flex items-center justify-center gap-1 text-[10px]">
                    <span className="text-indigo-300 font-extrabold">🚀 {altitudeKm} KM</span>
                    <span className="text-slate-400">({p.position}/{targetSteps})</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* THEME 6: MENGISI AIR AJAIB (Water Container Fill) */}
        {theme.boardType === 'water_container' && (
          <div className={`grid gap-1.5 sm:gap-2.5 items-end justify-center py-1 ${
            players.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' :
            players.length === 2 ? 'grid-cols-2 max-w-sm mx-auto' :
            players.length === 3 ? 'grid-cols-3 max-w-xl mx-auto' :
            'grid-cols-2 sm:grid-cols-4'
          }`}>
            {players.map((p) => {
              const progressPct = Math.min(100, Math.round((p.position / targetSteps) * 100));
              const stageIdx = Math.min(4, Math.floor((p.position / targetSteps) * 5));

              return (
                <div
                  key={p.id}
                  className="relative bg-slate-950/85 p-1.5 sm:p-2 rounded-xl border border-cyan-800/80 shadow-xl flex flex-col items-center justify-between transition-all"
                >
                  {/* Player Header & Stage Label */}
                  <div className="w-full flex flex-col items-center gap-0.5 mb-1">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: p.color }} />
                      <span className="text-white font-black text-[11px] sm:text-xs truncate max-w-[80px] sm:max-w-[100px]">
                        {p.name}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/50">
                      {theme.stepLabels?.[stageIdx] || `Terisi ${progressPct}%`}
                    </span>
                  </div>

                  {/* Vertical Water Tank Container */}
                  <div className="relative flex flex-col items-center my-0.5">
                    {/* Top Water Faucet */}
                    <div className="w-full flex items-center justify-between px-1.5 bg-slate-900/90 py-0.5 rounded-t-lg border-t border-x border-cyan-500/50 z-10 text-[9px]">
                      <span className="font-bold text-cyan-300">🚰 Kran</span>
                      <span className="font-extrabold text-sky-400 animate-pulse">💧 Air</span>
                    </div>

                    {/* Main Water Vessel */}
                    <div className="relative w-20 sm:w-24 h-[10vh] sm:h-[13vh] min-h-[80px] max-h-[140px] bg-slate-900/95 rounded-b-xl border-x-2 border-b-2 border-cyan-500/70 p-1 flex flex-col justify-end overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.25)]">
                      {/* Water Liquid Fill */}
                      <div
                        className="w-full bg-gradient-to-t from-blue-700 via-cyan-500 to-sky-300 rounded-lg transition-all duration-700 ease-out relative shadow-[0_0_12px_rgba(6,182,212,0.6)] flex flex-col justify-between overflow-hidden"
                        style={{ height: `${Math.max(8, progressPct)}%` }}
                      >
                        <div className="w-full h-1 bg-white/70 animate-pulse" />
                      </div>

                      {/* Floating Player Avatar on Water Level */}
                      <div
                        className="absolute inset-x-0.5 transition-all duration-700 ease-out z-30 flex items-center justify-center pointer-events-none"
                        style={{
                          bottom: `calc(${Math.min(85, Math.max(6, progressPct))}% - 12px)`,
                        }}
                      >
                        <div
                          className="flex items-center gap-0.5 bg-slate-950/95 border rounded-lg px-1 py-0.5 shadow-xl"
                          style={{ borderColor: p.color }}
                        >
                          <span className="text-sm sm:text-base animate-bounce">{p.avatar}</span>
                          <span className="text-[9px] font-black text-cyan-400">💧</span>
                        </div>
                      </div>

                      {/* Center Percentage Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                        <span className="text-[9px] sm:text-[10px] font-black text-white bg-slate-950/85 px-1.5 py-0.5 rounded-full border border-cyan-400/60 shadow-md text-center">
                          {progressPct === 100 ? '🌊 FULL' : `${progressPct}%`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Score Stats */}
                  <div className="w-full text-center mt-1 pt-0.5 border-t border-slate-800/80">
                    <span className="text-[10px] font-extrabold text-cyan-300">
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
          <div className={`grid gap-1.5 sm:gap-2.5 items-end justify-center py-1 ${
            players.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' :
            players.length === 2 ? 'grid-cols-2 max-w-sm mx-auto' :
            players.length === 3 ? 'grid-cols-3 max-w-xl mx-auto' :
            'grid-cols-2 sm:grid-cols-4'
          }`}>
            {players.map((p) => {
              const progressPct = Math.min(100, Math.round((p.position / targetSteps) * 100));
              const stageIdx = Math.min(4, Math.floor((p.position / targetSteps) * 5));

              return (
                <div
                  key={p.id}
                  className="relative bg-slate-950/85 p-1.5 sm:p-2 rounded-xl border border-emerald-900/70 shadow-xl flex flex-col items-center justify-between transition-all"
                >
                  {/* Player Name & Badge Header */}
                  <div className="w-full flex flex-col items-center gap-0.5 mb-1">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: p.color }} />
                      <span className="text-white font-black text-[11px] sm:text-xs truncate max-w-[80px] sm:max-w-[100px]">
                        {p.name}
                      </span>
                    </div>
                    <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/50">
                      {theme.stepLabels?.[stageIdx] || `Daya ${progressPct}%`}
                    </span>
                  </div>

                  {/* Vertical Battery Visual Unit */}
                  <div className="relative flex flex-col items-center my-0.5">
                    {/* Battery Terminal Cap */}
                    <div className="w-6 h-2 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-t border-t border-x border-emerald-300 shadow-sm flex items-center justify-center -mb-[1px] z-10">
                      <span className="text-[8px] font-black text-slate-950 leading-none">+</span>
                    </div>

                    {/* Main Vertical Battery Chamber */}
                    <div className="relative w-20 sm:w-24 h-[10vh] sm:h-[13vh] min-h-[80px] max-h-[140px] bg-slate-900/95 rounded-xl border-2 border-emerald-500/70 p-1 flex flex-col justify-end overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                      {/* Green Energy Fill Bar */}
                      <div
                        className="w-full bg-gradient-to-t from-emerald-700 via-emerald-500 to-green-400 rounded-lg transition-all duration-700 ease-out relative overflow-hidden shadow-[0_0_12px_rgba(16,185,129,0.6)] flex flex-col justify-between"
                        style={{ height: `${Math.max(6, progressPct)}%` }}
                      >
                        <div className="w-full h-1 bg-white/80 shrink-0" />
                      </div>

                      {/* Floating Player Avatar */}
                      <div
                        className="absolute inset-x-0.5 transition-all duration-700 ease-out z-30 flex items-center justify-center pointer-events-none"
                        style={{
                          bottom: `calc(${Math.min(85, Math.max(5, progressPct))}% - 12px)`,
                        }}
                      >
                        <div
                          className="flex items-center gap-0.5 bg-slate-950/95 border rounded-lg px-1 py-0.5 shadow-xl"
                          style={{ borderColor: p.color }}
                        >
                          <span className="text-sm sm:text-base animate-bounce">{p.avatar}</span>
                          <span className="text-[9px] font-black text-emerald-400">⚡</span>
                        </div>
                      </div>

                      {/* Center Percentage Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                        <span className="text-[9px] sm:text-[10px] font-black text-white bg-slate-950/85 px-1.5 py-0.5 rounded-full border border-emerald-500/60 shadow-md text-center">
                          {progressPct === 100 ? '⚡ FULL' : `⚡ ${progressPct}%`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Step Stats */}
                  <div className="w-full text-center mt-1 pt-0.5 border-t border-slate-800/80">
                    <span className="text-[10px] font-extrabold text-emerald-300">
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
          <div className={`grid gap-1.5 sm:gap-2.5 items-end justify-center py-1 ${
            players.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' :
            players.length === 2 ? 'grid-cols-2 max-w-sm mx-auto' :
            players.length === 3 ? 'grid-cols-3 max-w-xl mx-auto' :
            'grid-cols-2 sm:grid-cols-4'
          }`}>
            {players.map((p) => {
              const progressPct = Math.min(100, Math.round((p.position / targetSteps) * 100));
              const stageIdx = Math.min(4, Math.floor((p.position / targetSteps) * 5));

              return (
                <div
                  key={p.id}
                  className="relative bg-slate-950/90 p-1.5 sm:p-2 rounded-xl border border-red-800/80 shadow-xl flex flex-col items-center justify-between transition-all"
                >
                  {/* Player Header & Stage Label */}
                  <div className="w-full flex flex-col items-center gap-0.5 mb-1">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: p.color }} />
                      <span className="text-white font-black text-[11px] sm:text-xs truncate max-w-[80px] sm:max-w-[100px]">
                        {p.name}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-amber-300 bg-red-950/90 px-1.5 py-0.5 rounded border border-red-700/60">
                      {theme.stepLabels?.[stageIdx] || `Tinggi ${progressPct}%`}
                    </span>
                  </div>

                  {/* Complete Panjat Pinang Tree Construction */}
                  <div className="relative flex flex-col items-center my-0.5 w-full">
                    {/* Top Crown */}
                    <div className="relative flex flex-col items-center z-30">
                      <div className="flex items-center gap-0.5 bg-red-600 text-white px-1.5 py-0.5 rounded-full text-[8px] font-black border border-amber-300 animate-bounce">
                        <span>🇲🇨</span>
                        <span>MERDEKA!</span>
                      </div>

                      <div className="text-base -my-0.5 pointer-events-none">
                        🌴 🌴
                      </div>

                      {/* Bamboo Prize Wheel */}
                      <div className="w-20 sm:w-24 bg-gradient-to-r from-amber-800 via-yellow-700 to-amber-800 border border-amber-300 rounded-full py-0.5 px-1 flex flex-col items-center shadow-md -mt-0.5">
                        <div className="flex items-center justify-around w-full text-xs sm:text-sm bg-slate-950/60 rounded py-0.5 px-0.5">
                          <span>🚲</span>
                          <span>📻</span>
                          <span>👕</span>
                          <span>🍳</span>
                        </div>
                      </div>
                    </div>

                    {/* Main Tree Trunk */}
                    <div className="relative w-20 sm:w-24 h-[9vh] sm:h-[12vh] min-h-[75px] max-h-[130px] bg-amber-950 rounded-b-lg border-x-2 border-b-2 border-amber-800/90 p-0.5 flex flex-col justify-end overflow-hidden shadow-[0_0_12px_rgba(180,83,9,0.3)] -mt-0.5">
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(120,53,15,0.9)_0%,rgba(69,26,3,0.95)_50%,rgba(120,53,15,0.9)_100%)] pointer-events-none" />

                      {/* Climbing Fill Gradient */}
                      <div
                        className="w-full bg-gradient-to-t from-red-900 via-amber-600 to-yellow-400 rounded transition-all duration-700 ease-out relative shadow-[0_0_8px_rgba(251,191,36,0.6)] flex flex-col justify-between overflow-hidden"
                        style={{ height: `${Math.max(8, progressPct)}%` }}
                      >
                        <div className="w-full h-1 bg-yellow-100 animate-pulse" />
                      </div>

                      {/* Climber Player Avatar */}
                      <div
                        className="absolute inset-x-0 transition-all duration-700 ease-out z-30 flex items-center justify-center pointer-events-none"
                        style={{
                          bottom: `calc(${Math.min(85, Math.max(6, progressPct))}% - 12px)`,
                        }}
                      >
                        <div
                          className="flex items-center gap-0.5 bg-slate-950/95 border rounded-lg px-1 py-0.5 shadow-xl"
                          style={{ borderColor: p.color }}
                        >
                          <span className="text-sm sm:text-base animate-bounce">{p.avatar}</span>
                          <span className="text-[9px] font-black text-amber-300">🧗</span>
                        </div>
                      </div>

                      {/* Percentage Badge */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                        <span className="text-[9px] font-black text-white bg-slate-950/85 px-1.5 py-0.5 rounded-full border border-amber-400/60 shadow-md text-center">
                          {progressPct === 100 ? '🎉 PUNCAK' : `${progressPct}%`}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Ground Base */}
                    <div className="w-20 sm:w-24 bg-gradient-to-r from-emerald-950 via-green-900 to-emerald-950 py-0.5 px-1 rounded-b-lg border-x border-b border-emerald-600/70 flex items-center justify-between text-[8px] font-bold text-emerald-200 z-20">
                      <span>🌱 Tanah 🇲🇨</span>
                      <span>🥳</span>
                    </div>
                  </div>

                  {/* Footer Score Stats */}
                  <div className="w-full text-center mt-1 pt-0.5 border-t border-slate-800/80">
                    <span className="text-[10px] font-extrabold text-red-400">
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
      <div className="relative z-10 pt-1 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
        <span>Start 🚦</span>
        <span className="text-amber-400 font-bold">Target: {targetSteps} Poin</span>
        <span>Finish 🏁</span>
      </div>
    </div>
  );
};
