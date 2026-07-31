import React, { useState } from 'react';
import { PlayerState, UiScale } from '../types';
import { Delete, Check, Flame, Zap, Award, Sparkles } from 'lucide-react';
import { audio } from '../utils/audio';

interface PlayerPadProps {
  player: PlayerState;
  onAnswerSubmit: (playerId: 1 | 2 | 3 | 4, inputAnswer: number) => void;
  inputType: 'numpad' | 'multiple_choice';
  isPaused: boolean;
  totalSteps: number;
  layoutPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left-side' | 'right-side' | 'col';
  uiScale: UiScale;
}

export const PlayerPad: React.FC<PlayerPadProps> = ({
  player,
  onAnswerSubmit,
  inputType,
  isPaused,
  totalSteps,
  layoutPosition,
  uiScale,
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

  // Configuration map for responsive screen sizes and large 65" whiteboards
  const scaleStyles = {
    small: {
      padPadding: 'p-1.5 sm:p-2',
      headerPadding: 'pb-1',
      avatarSize: 'w-7 h-7 text-lg',
      nameText: 'text-[11px] sm:text-xs',
      infoText: 'text-[8px]',
      streakBadge: 'text-[8px] px-1 py-0.5',
      problemMinHeight: 'min-h-[50px] sm:min-h-[65px]',
      problemText: 'text-base sm:text-lg md:text-xl',
      visualHintText: 'text-[9px] px-1',
      inputMinHeight: 'mt-0.5 text-sm sm:text-base min-h-[22px] px-1 rounded min-w-[50px]',
      numpadButton: 'py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm',
      choiceButton: 'py-1.5 sm:py-2 px-1 rounded-lg text-sm sm:text-base',
      submitButton: 'py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs',
      clearButton: 'py-1 sm:py-1.5 rounded-lg text-[8px]',
      backspaceIcon: 'w-3.5 h-3.5',
      feedbackText: 'text-sm sm:text-base',
    },
    medium: {
      padPadding: 'p-2 sm:p-3',
      headerPadding: 'pb-1.5',
      avatarSize: 'w-9 h-9 text-xl',
      nameText: 'text-xs sm:text-sm',
      infoText: 'text-[10px]',
      streakBadge: 'text-[10px] px-1.5 py-0.5',
      problemMinHeight: 'min-h-[75px] sm:min-h-[90px]',
      problemText: 'text-xl sm:text-2xl md:text-3xl',
      visualHintText: 'text-xs px-2 py-0.5',
      inputMinHeight: 'mt-1 text-lg sm:text-xl min-h-[28px] px-3 py-0.5 rounded-xl min-w-[80px]',
      numpadButton: 'py-1.5 sm:py-2 rounded-xl text-base sm:text-lg',
      choiceButton: 'py-2 sm:py-2.5 px-2 rounded-xl text-lg sm:text-xl',
      submitButton: 'py-1.5 sm:py-2 rounded-xl text-sm sm:text-base',
      clearButton: 'py-1.5 sm:py-2 rounded-xl text-xs',
      backspaceIcon: 'w-4.5 h-4.5',
      feedbackText: 'text-base sm:text-lg',
    },
    large: {
      padPadding: 'p-4.5 sm:p-5',
      headerPadding: 'pb-2.5',
      avatarSize: 'w-12 h-12 text-3xl',
      nameText: 'text-base sm:text-lg md:text-xl',
      infoText: 'text-xs sm:text-sm',
      streakBadge: 'text-sm px-2.5 py-1',
      problemMinHeight: 'min-h-[120px] sm:min-h-[145px]',
      problemText: 'text-3xl sm:text-4xl md:text-5xl',
      visualHintText: 'text-sm sm:text-base px-3 py-1',
      inputMinHeight: 'mt-2.5 text-2xl sm:text-3xl min-h-[40px] px-5 py-1 rounded-xl min-w-[110px]',
      numpadButton: 'py-3.5 sm:py-4 rounded-2xl text-xl sm:text-2xl md:text-3xl',
      choiceButton: 'py-4.5 sm:py-5 px-4 rounded-2xl text-2xl sm:text-3xl md:text-4xl',
      submitButton: 'py-3.5 sm:py-4 rounded-2xl text-lg sm:text-xl',
      clearButton: 'py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base',
      backspaceIcon: 'w-6 h-6',
      feedbackText: 'text-xl sm:text-2xl',
    },
    huge: {
      padPadding: 'p-5.5 sm:p-7',
      headerPadding: 'pb-3.5',
      avatarSize: 'w-16 h-16 text-4xl',
      nameText: 'text-lg sm:text-xl md:text-2xl',
      infoText: 'text-sm sm:text-base',
      streakBadge: 'text-base px-3.5 py-1.5',
      problemMinHeight: 'min-h-[140px] sm:min-h-[175px]',
      problemText: 'text-4xl sm:text-5xl md:text-6xl',
      visualHintText: 'text-base sm:text-lg px-4 py-1.5',
      inputMinHeight: 'mt-3 text-3xl sm:text-4xl min-h-[48px] px-6 py-1.5 rounded-2xl min-w-[130px]',
      numpadButton: 'py-4.5 sm:py-5.5 rounded-2xl text-2xl sm:text-3xl md:text-4xl',
      choiceButton: 'py-5.5 sm:py-6.5 px-5 rounded-2xl text-3xl sm:text-4xl md:text-5xl',
      submitButton: 'py-4.5 sm:py-5.5 rounded-2xl text-xl sm:text-2xl',
      clearButton: 'py-4.5 sm:py-5.5 rounded-2xl text-base sm:text-lg',
      backspaceIcon: 'w-7 h-7',
      feedbackText: 'text-2xl sm:text-3xl',
    }
  };

  const style = scaleStyles[uiScale] || scaleStyles.medium;

  return (
    <div
      className={`relative flex flex-col justify-between ${style.padPadding} rounded-3xl border-2 transition-all shadow-xl select-none h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent ${
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
      <div className={`flex items-center justify-between gap-2 ${style.headerPadding} border-b border-slate-800/80`}>
        {/* Player Badge */}
        <div className="flex items-center gap-2">
          <div
            className={`${style.avatarSize} rounded-2xl flex items-center justify-center shadow-md border border-white/20`}
            style={{ backgroundColor: player.color }}
          >
            {player.avatar}
          </div>
          <div>
            <div className={`font-extrabold ${style.nameText} text-white tracking-wide truncate max-w-[120px] sm:max-w-[160px]`}>
              {player.name}
            </div>
            <div className={`${style.infoText} font-semibold text-slate-400 flex items-center gap-1`}>
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
            <div className={`flex items-center gap-1 bg-amber-500/20 border border-amber-500/40 ${style.streakBadge} rounded-full text-amber-300 font-bold animate-pulse`}>
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{player.stats.streak}x Combo</span>
            </div>
          )}

          {/* Badge count */}
          {player.stats.badges.length > 0 && (
            <div className={`flex items-center gap-1 bg-purple-500/20 border border-purple-500/40 ${style.streakBadge} rounded-full text-purple-300 font-bold`}>
              <Award className="w-3.5 h-3.5 text-purple-400" />
              <span>{player.stats.badges.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* Problem Display Card */}
      <div className={`my-1 sm:my-2 p-2 sm:p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden ${style.problemMinHeight}`}>
        {currentProblem ? (
          <>
            <div className={`${style.problemText} font-black text-white tracking-wider font-mono`}>
              {currentProblem.questionStr}
            </div>

            {/* Visual Hint for Grade 1-2 */}
            {currentProblem.visualHint && (
              <div className={`mt-1 ${style.visualHintText} text-amber-300 font-medium tracking-widest bg-amber-950/40 rounded-full border border-amber-500/20`}>
                {currentProblem.visualHint}
              </div>
            )}

            {/* Input Display (Numpad mode) */}
            {inputType === 'numpad' && (
              <div className={`${style.inputMinHeight} font-black text-amber-400 tracking-widest bg-slate-900/90 border border-amber-500/30 text-center font-mono`}>
                {localInput || <span className="text-slate-600 font-normal">?</span>}
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-slate-500 animate-pulse">Menyiapkan soal...</div>
        )}

        {/* Feedback Messages Overlay */}
        {player.feedback === 'correct' && (
          <div className={`absolute inset-0 bg-emerald-600/90 backdrop-blur-sm flex items-center justify-center text-white font-black ${style.feedbackText} tracking-wide animate-bounce z-10 rounded-2xl`}>
            ✨ BENAR! +1 LANGKAH
          </div>
        )}

        {player.feedback === 'wrong' && (
          <div className={`absolute inset-0 bg-rose-700/90 backdrop-blur-sm flex items-center justify-center text-white font-extrabold ${style.feedbackText} tracking-wide z-10 rounded-2xl`}>
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
                className={`${style.numpadButton} bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 text-white font-black border border-slate-700 shadow transition active:scale-95 disabled:opacity-50 cursor-pointer font-mono`}
              >
                {num}
              </button>
            ))}

            {/* Clear Button */}
            <button
              onClick={handleClear}
              disabled={player.feedback === 'locked' || isPaused}
              className={`${style.clearButton} bg-rose-950/60 hover:bg-rose-900 text-rose-300 font-bold border border-rose-800/80 transition active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center`}
            >
              C
            </button>

            {/* Zero Button */}
            <button
              onClick={() => handleNumClick('0')}
              disabled={player.feedback === 'locked' || isPaused}
              className={`${style.numpadButton} bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 text-white font-black border border-slate-700 shadow transition active:scale-95 disabled:opacity-50 cursor-pointer font-mono`}
            >
              0
            </button>

            {/* Backspace Button */}
            <button
              onClick={handleBackspace}
              disabled={player.feedback === 'locked' || isPaused}
              className={`${style.numpadButton} bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold border border-slate-700 transition active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center`}
            >
              <Delete className={style.backspaceIcon} />
            </button>

            {/* Submit Button (Spans full width bottom) */}
            <button
              onClick={() => handleSubmit()}
              disabled={player.feedback === 'locked' || isPaused || localInput === ''}
              className={`col-span-3 ${style.submitButton} bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black shadow-lg transition active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2`}
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
                className={`${style.choiceButton} bg-slate-800 hover:bg-amber-500 hover:text-slate-950 active:scale-95 text-white font-black border border-slate-700/80 shadow transition disabled:opacity-50 cursor-pointer font-mono flex items-center justify-center`}
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
