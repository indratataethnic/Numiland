import React from 'react';
import { Volume2, VolumeX, Maximize, Pause, Play, RotateCcw, Settings, GraduationCap, Home, XCircle } from 'lucide-react';
import { GameSettings, GameStage, ThemeConfig } from '../types';

interface HeaderBarProps {
  stage: GameStage;
  settings: GameSettings;
  theme: ThemeConfig;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onPauseResume: () => void;
  onRestartMatch: () => void;
  onOpenSetup: () => void;
  onOpenTeacherPanel: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  stage,
  settings,
  theme,
  soundEnabled,
  onToggleSound,
  onPauseResume,
  onRestartMatch,
  onOpenSetup,
  onOpenTeacherPanel,
}) => {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.log(err));
    } else {
      document.exitFullscreen().catch((err) => console.log(err));
    }
  };

  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-2.5 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between text-white select-none z-30 shadow-lg flex-wrap gap-y-2">
      {/* Brand & Theme Tag */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl shadow-md tracking-wider text-sm sm:text-lg">
          <span className="text-lg sm:text-xl">🔢</span>
          <span>NUMILAND</span>
        </div>
        <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-slate-300 font-medium bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
          <span>✨ Oleh: <strong className="text-amber-300">Indra Tata</strong> (berbantuan AI)</span>
        </div>
        <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700 text-xs sm:text-sm font-medium">
          <span>{theme.emoji}</span>
          <span className="text-slate-200">{theme.name}</span>
          <span className="text-slate-400">({settings.playerCount} Pemain)</span>
        </div>
      </div>

      {/* Middle Status (when playing) */}
      {stage === 'playing' || stage === 'paused' ? (
        <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-950/60 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full border border-slate-800 text-xs sm:text-sm">
          <span className="text-amber-400 font-semibold uppercase tracking-wider text-[10px] sm:text-xs">Target:</span>
          <span className="font-bold text-white">{settings.targetSteps} Langkah</span>
          {stage === 'paused' && (
            <span className="ml-1 px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded text-[10px] sm:text-xs font-bold animate-pulse">
              DIPAUS
            </span>
          )}
        </div>
      ) : null}

      {/* Controls / Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Kembali ke Beranda / Menu Utama (Always Visible on ALL Devices) */}
        {(stage === 'playing' || stage === 'paused') && (
          <button
            onClick={onOpenSetup}
            className="flex items-center gap-1 sm:gap-1.5 bg-rose-600 hover:bg-rose-500 text-white px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer shadow-md ring-1 ring-rose-400/40"
            title="Kembali ke Beranda / Menu Utama"
          >
            <Home className="w-4 h-4 text-white shrink-0" />
            <span className="text-xs font-extrabold tracking-wide">Beranda</span>
          </button>
        )}

        {/* Teacher Panel Button */}
        <button
          onClick={onOpenTeacherPanel}
          className="flex items-center gap-1 sm:gap-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-medium transition active:scale-95 cursor-pointer"
          title="Panel Guru & Statistik"
        >
          <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="hidden md:inline">Panel Guru</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          className="p-1.5 sm:p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition active:scale-95 cursor-pointer"
          title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Pause/Resume (Only when playing/paused) */}
        {(stage === 'playing' || stage === 'paused') && (
          <button
            onClick={onPauseResume}
            className="p-1.5 sm:p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition active:scale-95 cursor-pointer"
            title={stage === 'paused' ? 'Lanjutkan' : 'Paus Game'}
          >
            {stage === 'paused' ? <Play className="w-4 h-4 text-amber-400" /> : <Pause className="w-4 h-4 text-slate-300" />}
          </button>
        )}

        {/* Restart Match */}
        {(stage === 'playing' || stage === 'paused') && (
          <button
            onClick={onRestartMatch}
            className="p-1.5 sm:p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition active:scale-95 cursor-pointer"
            title="Ulangi Pertandingan"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
          </button>
        )}

        {/* Setup / Settings */}
        <button
          onClick={onOpenSetup}
          className="p-1.5 sm:p-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl transition active:scale-95 cursor-pointer shadow"
          title="Pengaturan Game"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-1.5 sm:p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition active:scale-95 cursor-pointer hidden sm:block"
          title="Layar Penuh"
        >
          <Maximize className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
