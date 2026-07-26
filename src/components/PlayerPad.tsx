import React, { useState } from 'react';
import { PlayerState } from '../types';
import { Delete, Check, Flame, Zap, Award, Sparkles } from 'lucide-react';
import { audio } from '../utils/audio';

interface PlayerPadProps {
  player: PlayerState;
  onAnswerSubmit: (playerId: 1 | 2 | 3 | 4, inputAnswer: number) => void;
  inputType: 'numpad' | 'multiple_choice';
  isPaused: boolean;
  totalSteps: number;
  layoutPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left-side' | 'right-side' | 'col';
}

export const PlayerPad: React.FC<PlayerPadProps> = ({
  player,
  onAnswerSubmit,
  inputType,
  isPaused,
  totalSteps,
  layoutPosition,
}) => {
  const [localInput, setLocalInput] = useState<string>('');

  const handleNumClick = (val: string) => {
    if (player.feedback === 'locked' || isPaused || !player.currentProblem) return;
    audio.playTap();
    if (localInput.length < 5) {
      setLocalInput((prev) => prev + val);
    }
  };

  const handleBackspace = () => {
    if (player.feedback === 'locked' || isPaused) return;
    audio.playTap();
    setLocalInput((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (player.feedback === 'locked' || isPaused) return;
    audio.playTap();
    setLocalInput('');
  };

  const handleSubmit = (forcedVal?: number) => {
    if (player.feedback === 'locked' || isPaused || !player.currentProblem) return;

    let ansToSubmit: number | null = null;
    if (forcedVal !== undefined) {
      ansToSubmit = forcedVal;
    } else if (localInput.trim() !== '') {
      ansToSubmit = parseInt(localInput, 10);
    }

    if (ansToSubmit !== null && !isNaN(ansToSubmit)) {
      onAnswerSubmit(player.id, ansToSubmit);
      setLocalInput('');
    }
  };

  const currentProblem = player.currentProblem;

  return (
    <div
      className={`relative flex flex-col justify-between p-3.5 sm:p-4 rounded-3xl border-2 transition-all shadow-xl select-none h-full overflow-hidden ${
        player.feedback === 'correct'
          ? 'border-emerald-400 bg-emerald-950/60 ring-4 ring-emerald-400/30'
          : player.feedback === 'wrong'
          ? 'border-rose-500 bg-rose-950/60 animate-shake'
          : 'border-slate-800 bg-slate-900/90'
      }`}
      style={{
        boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.37)`,
      }}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
        {/* Player Badge */}
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-2xl shadow-md border border-white/20"
            style={{ backgroundColor: player.color }}
          >
            {player.avatar}
          </div>
          <div>
            <div className="font-extrabold text-sm sm:text-base text-white tracking-wide truncate max-w-[120px] sm:max-w-[160px]">
              {player.name}
            </div>
            <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <span>Posisi:</span>
              <strong className="text-amber-400">
                {player.position} / {totalSteps}
              </strong>
            </div>
          </div>
        </div>

        {/* Streak & Badges */}
        <div className="flex items-center gap-1.5">
          {player.stats.streak >= 2 && (
            <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-full text-amber-300 text-xs font-bold animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{player.stats.streak}x Combo</span>
            </div>
          )}

          {/* Badge count */}
          {player.stats.badges.length > 0 && (
            <div className="flex items-center gap-1 bg-purple-500/20 border border-purple-500/40 px-2 py-0.5 rounded-full text-purple-300 text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-purple-400" />
              <span>{player.stats.badges.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* Problem Display Card */}
      <div className="my-2 p-3 sm:p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[100px] sm:min-h-[120px]">
        {currentProblem ? (
          <>
            <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-wider font-mono">
              {currentProblem.questionStr}
            </div>

            {/* Visual Hint for Grade 1-2 */}
            {currentProblem.visualHint && (
              <div className="mt-1 text-xs sm:text-sm text-amber-300 font-medium tracking-widest bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                {currentProblem.visualHint}
              </div>
            )}

            {/* Input Display (Numpad mode) */}
            {inputType === 'numpad' && (
              <div className="mt-2 text-xl sm:text-2xl font-black text-amber-400 tracking-widest min-h-[32px] bg-slate-900/90 border border-amber-500/30 px-4 py-0.5 rounded-xl min-w-[90px] text-center font-mono">
                {localInput || <span className="text-slate-600 font-normal">?</span>}
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-slate-500 animate-pulse">Menyiapkan soal...</div>
        )}

        {/* Feedback Messages Overlay */}
        {player.feedback === 'correct' && (
          <div className="absolute inset-0 bg-emerald-600/90 backdrop-blur-sm flex items-center justify-center text-white font-black text-lg sm:text-xl tracking-wide animate-bounce z-10 rounded-2xl">
            ✨ BENAR! +1 LANGKAH
          </div>
        )}

        {player.feedback === 'wrong' && (
          <div className="absolute inset-0 bg-rose-700/90 backdrop-blur-sm flex items-center justify-center text-white font-extrabold text-sm sm:text-base tracking-wide z-10 rounded-2xl">
            ❌ BELUM TEPAT (COBA LAGI)
          </div>
        )}
      </div>

      {/* Input Controls */}
      <div className="mt-1">
        {inputType === 'numpad' ? (
          /* NUMPAD TOUCHPAD GRID (0-9, Backspace, Submit) */
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumClick(num.toString())}
                disabled={player.feedback === 'locked' || isPaused}
                className="py-2.5 sm:py-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 text-white font-black text-lg sm:text-xl border border-slate-700 shadow transition active:scale-95 disabled:opacity-50 cursor-pointer font-mono"
              >
                {num}
              </button>
            ))}

            {/* Clear Button */}
            <button
              onClick={handleClear}
              disabled={player.feedback === 'locked' || isPaused}
              className="py-2.5 sm:py-3 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 font-bold text-xs sm:text-sm border border-rose-800/80 transition active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center"
            >
              C
            </button>

            {/* Zero Button */}
            <button
              onClick={() => handleNumClick('0')}
              disabled={player.feedback === 'locked' || isPaused}
              className="py-2.5 sm:py-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 text-white font-black text-lg sm:text-xl border border-slate-700 shadow transition active:scale-95 disabled:opacity-50 cursor-pointer font-mono"
            >
              0
            </button>

            {/* Backspace Button */}
            <button
              onClick={handleBackspace}
              disabled={player.feedback === 'locked' || isPaused}
              className="py-2.5 sm:py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold border border-slate-700 transition active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center"
            >
              <Delete className="w-5 h-5" />
            </button>

            {/* Submit Button (Spans full width bottom) */}
            <button
              onClick={() => handleSubmit()}
              disabled={player.feedback === 'locked' || isPaused || localInput === ''}
              className="col-span-3 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-base shadow-lg transition active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>KIRIM JAWABAN</span>
            </button>
          </div>
        ) : (
          /* MULTIPLE CHOICE GRID (4 Choice Buttons) */
          <div className="grid grid-cols-2 gap-2">
            {currentProblem?.choices?.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handleSubmit(choice)}
                disabled={player.feedback === 'locked' || isPaused}
                className="py-3 sm:py-4 px-3 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 active:scale-95 text-white font-black text-xl sm:text-2xl border border-slate-700/80 shadow transition disabled:opacity-50 cursor-pointer font-mono flex items-center justify-center"
              >
                {choice}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
