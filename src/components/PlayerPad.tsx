import React, { useState, useEffect } from 'react';
import { PlayerState, UiScale } from '../types';
import { Delete, Check, Flame, Zap, Award, Sparkles, Eye } from 'lucide-react';
import { audio } from '../utils/audio';

interface PlayerPadProps {
  player: PlayerState;
  onAnswerSubmit: (playerId: 1 | 2 | 3 | 4, inputAnswer: number) => void;
  inputType: 'numpad' | 'multiple_choice';
  isPaused: boolean;
  totalSteps: number;
  layoutPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left-side' | 'right-side' | 'col';
  uiScale: UiScale;
  blindMode?: boolean;
}

export const PlayerPad: React.FC<PlayerPadProps> = ({
  player,
  onAnswerSubmit,
  inputType,
  isPaused,
  totalSteps,
  layoutPosition,
  uiScale,
  blindMode = false,
}) => {
  const [localInput, setLocalInput] = useState<string>('');
  const [blindTimer, setBlindTimer] = useState<number>(3);
  const [isBlindHidden, setIsBlindHidden] = useState<boolean>(false);
  const [peekActive, setPeekActive] = useState<boolean>(false);

  const currentProblem = player.currentProblem;

  // Mode Buta 3-second visibility timer
  useEffect(() => {
    if (!blindMode || !currentProblem) {
      setIsBlindHidden(false);
      setBlindTimer(3);
      setPeekActive(false);
      return;
    }

    // Reset when new problem is set or after feedback
    setBlindTimer(3);
    setIsBlindHidden(false);
    setPeekActive(false);

    const interval = setInterval(() => {
      setBlindTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsBlindHidden(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentProblem?.id, blindMode, player.feedback]);

  const handlePeek = () => {
    if (peekActive) return;
    audio.playTap();
    setPeekActive(true);
    setTimeout(() => {
      setPeekActive(false);
    }, 1000);
  };

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

  // Configuration map for responsive screen sizes and large 65" whiteboards
  const scaleStyles = {
    small: {
      padPadding: 'p-1.5 sm:p-2',
      headerPadding: 'pb-1',
      avatarSize: 'w-6 h-6 text-base',
      nameText: 'text-[11px] sm:text-xs',
      infoText: 'text-[8px]',
      streakBadge: 'text-[8px] px-1 py-0.5',
      problemMinHeight: 'min-h-[40px] py-1',
      problemText: 'text-base sm:text-lg',
      visualHintText: 'text-[9px] px-1',
      inputMinHeight: 'mt-0.5 text-xs sm:text-sm min-h-[20px] px-1 rounded min-w-[45px]',
      numpadButton: 'py-0.5 sm:py-1 rounded-md text-xs sm:text-sm',
      choiceButton: 'py-1 sm:py-1.5 px-1 rounded-lg text-xs sm:text-sm',
      submitButton: 'py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs',
      clearButton: 'py-0.5 sm:py-1 rounded-md text-[8px]',
      backspaceIcon: 'w-3 h-3',
      feedbackText: 'text-xs sm:text-sm',
    },
    medium: {
      padPadding: 'p-2 sm:p-2.5',
      headerPadding: 'pb-1',
      avatarSize: 'w-8 h-8 text-lg',
      nameText: 'text-xs sm:text-sm',
      infoText: 'text-[9px]',
      streakBadge: 'text-[9px] px-1.5 py-0.5',
      problemMinHeight: 'min-h-[50px] py-1.5',
      problemText: 'text-lg sm:text-xl md:text-2xl',
      visualHintText: 'text-[10px] px-2 py-0.5',
      inputMinHeight: 'mt-0.5 text-base sm:text-lg min-h-[24px] px-2 py-0.5 rounded-lg min-w-[65px]',
      numpadButton: 'py-1 sm:py-1.5 rounded-lg text-sm sm:text-base',
      choiceButton: 'py-1.5 sm:py-2 px-2 rounded-lg text-base sm:text-lg',
      submitButton: 'py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm',
      clearButton: 'py-1 sm:py-1.5 rounded-lg text-[10px]',
      backspaceIcon: 'w-4 h-4',
      feedbackText: 'text-sm sm:text-base',
    },
    large: {
      padPadding: 'p-3 sm:p-3.5',
      headerPadding: 'pb-1.5',
      avatarSize: 'w-10 h-10 text-2xl',
      nameText: 'text-sm sm:text-base md:text-lg',
      infoText: 'text-[11px] sm:text-xs',
      streakBadge: 'text-xs px-2 py-0.5',
      problemMinHeight: 'min-h-[70px] py-2',
      problemText: 'text-2xl sm:text-3xl',
      visualHintText: 'text-xs sm:text-sm px-2.5 py-0.5',
      inputMinHeight: 'mt-1 text-xl sm:text-2xl min-h-[32px] px-3 py-0.5 rounded-xl min-w-[85px]',
      numpadButton: 'py-2 sm:py-2.5 rounded-xl text-lg sm:text-xl',
      choiceButton: 'py-2.5 sm:py-3 px-3 rounded-xl text-xl sm:text-2xl',
      submitButton: 'py-2 sm:py-2.5 rounded-xl text-sm sm:text-base',
      clearButton: 'py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm',
      backspaceIcon: 'w-5 h-5',
      feedbackText: 'text-base sm:text-lg',
    },
    huge: {
      padPadding: 'p-4 sm:p-5',
      headerPadding: 'pb-2',
      avatarSize: 'w-12 h-12 text-3xl',
      nameText: 'text-base sm:text-lg md:text-xl',
      infoText: 'text-xs sm:text-sm',
      streakBadge: 'text-sm px-2.5 py-1',
      problemMinHeight: 'min-h-[90px] py-2.5',
      problemText: 'text-3xl sm:text-4xl',
      visualHintText: 'text-sm sm:text-base px-3 py-1',
      inputMinHeight: 'mt-1.5 text-2xl sm:text-3xl min-h-[38px] px-4 py-1 rounded-2xl min-w-[100px]',
      numpadButton: 'py-2.5 sm:py-3.5 rounded-2xl text-xl sm:text-2xl',
      choiceButton: 'py-3 sm:py-4 px-4 rounded-2xl text-2xl sm:text-3xl',
      submitButton: 'py-2.5 sm:py-3.5 rounded-2xl text-base sm:text-lg',
      clearButton: 'py-2.5 sm:py-3.5 rounded-2xl text-sm sm:text-base',
      backspaceIcon: 'w-6 h-6',
      feedbackText: 'text-lg sm:text-xl',
    }
  };

  const style = scaleStyles[uiScale] || scaleStyles.medium;

  return (
    <div
      className={`relative flex flex-col justify-between ${style.padPadding} rounded-3xl border-2 transition-all shadow-xl select-none h-full overflow-hidden ${
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
            {/* Mode Buta status badge */}
            {blindMode && (
              <div className="mb-1 flex items-center justify-between gap-1.5 w-full px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-purple-950/80 border border-purple-500/40 text-purple-300">
                <span className="flex items-center gap-1">
                  <span>🙈 Mode Buta:</span>
                  {!isBlindHidden || peekActive ? (
                    <span className="text-amber-300 font-black animate-pulse">
                      {peekActive ? 'Mengintip (1s)...' : `Tampil ${blindTimer}s...`}
                    </span>
                  ) : (
                    <span className="text-purple-300 font-extrabold">
                      Soal Tersembunyi!
                    </span>
                  )}
                </span>

                {isBlindHidden && (
                  <button
                    onClick={handlePeek}
                    disabled={peekActive}
                    className="flex items-center gap-1 bg-purple-800/80 hover:bg-purple-700 text-purple-100 px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold transition active:scale-95 cursor-pointer border border-purple-400/40"
                    title="Intip soal sekejap (1 detik)"
                  >
                    <Eye className="w-3 h-3 text-purple-200" />
                    <span>Intip</span>
                  </button>
                )}
              </div>
            )}

            {/* Problem text / Visual Hint or Hidden state */}
            {blindMode && isBlindHidden && !peekActive ? (
              <div className="flex flex-col items-center justify-center py-1">
                <div className={`${style.problemText} font-black text-purple-400 tracking-wider font-mono flex items-center gap-2`}>
                  <span>🙈</span>
                  <span>? ? ?</span>
                </div>
                <span className="text-[10px] sm:text-xs text-purple-300/80 font-medium mt-0.5">
                  Fokus & ingat angka soal tadi!
                </span>
              </div>
            ) : (
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
              </>
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
