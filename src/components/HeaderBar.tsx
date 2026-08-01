import React from 'react';
import { Volume2, VolumeX, Maximize, Pause, Play, RotateCcw, Settings, GraduationCap, Home, Users, Eye, EyeOff, Layers } from 'lucide-react';
import { GameSettings, GameStage, ThemeConfig, UiScale, BoardMode } from '../types';

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
  onOpenPlayerHistory?: () => void;
  uiScale: UiScale;
  onUiScaleChange: (scale: UiScale) => void;
  boardMode: BoardMode;
  onBoardModeChange: (mode: BoardMode) => void;
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
  onOpenPlayerHistory,
  uiScale,
  onUiScaleChange,
  boardMode,
  onBoardModeChange,
}) => {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.log(err));
    } else {
      document.exitFullscreen().catch((err) => console.log(err));
    }
  };

  const nextScaleMap: Record<UiScale, UiScale> = {
    small: 'medium',
    medium: 'large',
    large: 'huge',
    huge: 'small',
  };

  const scaleLabels: Record<UiScale, string> = {
    small: 'Papan Tablet',
    medium: 'Layar Biasa',
    large: 'Papan 65" (Besar)',
    huge: 'Skala Raksasa',
  };

  const nextBoardModeMap: Record<BoardMode, BoardMode> = {
    normal: 'compact',
    compact: 'hidden',
    hidden: 'normal',
  };

  const boardModeLabels: Record<BoardMode, string> = {
    normal: 'Papan Penuh',
    compact: 'Papan Ringkas',
    hidden: 'Papan Sembunyi',
  };

  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-2.5 sm:px-4 py-2 sm:py-2.5 safe-p-top safe-p-left safe-p-right flex items-center justify-between text-white select-none z-30 shadow-lg flex-wrap gap-y-2">
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
          {settings.blindMode && (
            <span className="ml-1 px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1">
              🙈 Mode Buta
            </span>
          )}
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

        {/* Data Pemain / History Button */}
        {onOpenPlayerHistory && (
          <button
            onClick={onOpenPlayerHistory}
            className="flex items-center gap-1 sm:gap-1.5 bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/40 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition active:scale-95 cursor-pointer"
            title="Lihat Data Orang Yang Bermain & Riwayat"
          >
            <Users className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Data Pemain</span>
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

        {/* Scale Selector */}
        <div className="flex items-center bg-slate-800/80 rounded-xl border border-slate-700/80 p-0.5">
          {/* Desktop/Whiteboard: full Pill selection */}
          <div className="hidden lg:flex items-center">
            {(['small', 'medium', 'large', 'huge'] as UiScale[]).map((sc) => (
              <button
                key={sc}
                onClick={() => onUiScaleChange(sc)}
                className={`px-2 py-1 rounded-lg text-[11px] font-black tracking-tight transition-all cursor-pointer ${
                  uiScale === sc ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sc === 'small' ? '📱 Tablet' : sc === 'medium' ? '🖥️ Biasa' : sc === 'large' ? '📺 Papan 65"' : '🎪 Raksasa'}
              </button>
            ))}
          </div>

          {/* Tablet/Mobile: Simple single cycle-button to save space */}
          <button
            onClick={() => onUiScaleChange(nextScaleMap[uiScale])}
            className="flex lg:hidden items-center gap-1 px-2 py-1 text-xs font-black text-amber-300 hover:bg-slate-700 rounded-lg cursor-pointer transition active:scale-95"
            title="Klik untuk ubah ukuran tombol / skala layar"
          >
            <span className="text-sm">📐</span>
            <span className="text-[10px] font-bold text-slate-300">{scaleLabels[uiScale]}</span>
          </button>
        </div>

        {/* Board Mode Selector */}
        <div className="flex items-center bg-slate-800/80 rounded-xl border border-slate-700/80 p-0.5">
          {/* Desktop/Whiteboard: full Pill selection */}
          <div className="hidden lg:flex items-center">
            {(['normal', 'compact', 'hidden'] as BoardMode[]).map((bm) => (
              <button
                key={bm}
                onClick={() => onBoardModeChange(bm)}
                className={`px-2 py-1 rounded-lg text-[11px] font-black tracking-tight transition-all cursor-pointer ${
                  boardMode === bm ? 'bg-indigo-500 text-white shadow-md font-extrabold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {bm === 'normal' ? '🗺️ Penuh' : bm === 'compact' ? '➖ Ringkas' : '🙈 Sembunyi'}
              </button>
            ))}
          </div>

          {/* Tablet/Mobile: Simple single cycle-button to save space */}
          <button
            onClick={() => onBoardModeChange(nextBoardModeMap[boardMode])}
            className="flex lg:hidden items-center gap-1 px-2 py-1 text-xs font-black text-indigo-300 hover:bg-slate-700 rounded-lg cursor-pointer transition active:scale-95"
            title="Klik untuk ubah tampilan papan skor"
          >
            <span className="text-sm">🗺️</span>
            <span className="text-[10px] font-bold text-slate-300">{boardModeLabels[boardMode]}</span>
          </button>
        </div>

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
