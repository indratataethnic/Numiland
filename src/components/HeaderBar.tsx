import React from 'react';
import { Volume2, VolumeX, Maximize, Pause, Play, RotateCcw, Settings, GraduationCap, Award } from 'lucide-react';
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
    <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-white select-none z-30 shadow-lg">
      {/* Brand & Theme Tag */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black px-3.5 py-1.5 rounded-xl shadow-md tracking-wider text-base sm:text-lg">
          <span className="text-xl">🔢</span>
          <span>NUMILAND</span>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700 text-xs sm:text-sm font-medium">
          <span>{theme.emoji}</span>
          <span className="text-slate-200">{theme.name}</span>
          <span className="text-slate-400">({settings.playerCount} Pemain)</span>
        </div>
      </div>

      {/* Middle Status (when playing) */}
      {stage === 'playing' || stage === 'paused' ? (
        <div className="flex items-center gap-2 bg-slate-950/60 px-4 py-1.5 rounded-full border border-slate-800">
          <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Target:</span>
          <span className="text-sm font-bold text-white">{settings.targetSteps} Langkah</span>
          {stage === 'paused' && (
            <span className="ml-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded text-xs font-bold animate-pulse">
              DIPAUS
            </span>
          )}
        </div>
      ) : null}

      {/* Controls / Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Teacher Panel Button */}
        <button
          onClick={onOpenTeacherPanel}
          className="flex items-center gap-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition active:scale-95 cursor-pointer"
          title="Panel Guru & Statistik"
        >
          <GraduationCap className="w-4 h-4 text-indigo-400" />
          <span className="hidden sm:inline">Panel Guru</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition active:scale-95 cursor-pointer"
          title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Pause/Resume (Only when playing/paused) */}
        {(stage === 'playing' || stage === 'paused') && (
          <button
            onClick={onPauseResume}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition active:scale-95 cursor-pointer"
            title={stage === 'paused' ? 'Lanjutkan' : 'Paus Game'}
          >
            {stage === 'paused' ? <Play className="w-4 h-4 text-amber-400" /> : <Pause className="w-4 h-4 text-slate-300" />}
          </button>
        )}

        {/* Restart Match */}
        {(stage === 'playing' || stage === 'paused') && (
          <button
            onClick={onRestartMatch}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition active:scale-95 cursor-pointer"
            title="Ulangi Pertandingan"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
          </button>
        )}

        {/* Setup / Settings */}
        <button
          onClick={onOpenSetup}
          className="p-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition active:scale-95 cursor-pointer shadow"
          title="Pengaturan Game Baru"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition active:scale-95 cursor-pointer hidden sm:block"
          title="Layar Penuh"
        >
          <Maximize className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
