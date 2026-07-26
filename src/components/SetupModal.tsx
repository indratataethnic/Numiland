import React, { useState } from 'react';
import { GameSettings, GradeLevel, MathOperation, PlayerState, ThemeId } from '../types';
import { THEMES } from '../data/themes';
import { Play, Users, Sparkles, Check, ChevronRight } from 'lucide-react';

interface SetupModalProps {
  initialSettings: GameSettings;
  initialPlayers: PlayerState[];
  onStartGame: (settings: GameSettings, players: PlayerState[]) => void;
  onClose?: () => void;
  isInitialSetup?: boolean;
}

const PLAYER_COLORS = [
  { name: 'Merah', color: '#ef4444', bg: 'from-red-600 to-rose-700', accent: '#f87171' },
  { name: 'Biru', color: '#3b82f6', bg: 'from-blue-600 to-indigo-700', accent: '#60a5fa' },
  { name: 'Hijau', color: '#10b981', bg: 'from-emerald-600 to-teal-700', accent: '#34d399' },
  { name: 'Kuning', color: '#f59e0b', bg: 'from-amber-500 to-orange-600', accent: '#fbbf24' },
];

export const SetupModal: React.FC<SetupModalProps> = ({
  initialSettings,
  initialPlayers,
  onStartGame,
  isInitialSetup = false,
}) => {
  const [settings, setSettings] = useState<GameSettings>(initialSettings);
  const [activeTab, setActiveTab] = useState<'theme' | 'rules' | 'players'>('theme');

  // Players state
  const [playerConfigs, setPlayerConfigs] = useState<
    { id: 1 | 2 | 3 | 4; name: string; avatar: string; gradeLevel: GradeLevel; operations: MathOperation[] }[]
  >([
    {
      id: 1,
      name: initialPlayers[0]?.name || 'Pemain 1',
      avatar: initialPlayers[0]?.avatar || THEMES[initialSettings.themeId].avatarOptions[0].icon,
      gradeLevel: initialPlayers[0]?.gradeLevel || 'kelas1-2',
      operations: initialPlayers[0]?.operations || ['addition', 'subtraction'],
    },
    {
      id: 2,
      name: initialPlayers[1]?.name || 'Pemain 2',
      avatar: initialPlayers[1]?.avatar || THEMES[initialSettings.themeId].avatarOptions[1]?.icon || '🚀',
      gradeLevel: initialPlayers[1]?.gradeLevel || 'kelas1-2',
      operations: initialPlayers[1]?.operations || ['addition', 'subtraction'],
    },
    {
      id: 3,
      name: initialPlayers[2]?.name || 'Pemain 3',
      avatar: initialPlayers[2]?.avatar || THEMES[initialSettings.themeId].avatarOptions[2]?.icon || '🐆',
      gradeLevel: initialPlayers[2]?.gradeLevel || 'kelas1-2',
      operations: initialPlayers[2]?.operations || ['addition', 'subtraction'],
    },
    {
      id: 4,
      name: initialPlayers[3]?.name || 'Pemain 4',
      avatar: initialPlayers[3]?.avatar || THEMES[initialSettings.themeId].avatarOptions[3]?.icon || '🦖',
      gradeLevel: initialPlayers[3]?.gradeLevel || 'kelas1-2',
      operations: initialPlayers[3]?.operations || ['addition', 'subtraction'],
    },
  ]);

  const [selectedThemeId, setSelectedThemeId] = useState<ThemeId>(settings.themeId);
  const selectedTheme = THEMES[selectedThemeId];

  const handlePlayerCountChange = (count: 2 | 3 | 4) => {
    setSettings((prev) => ({ ...prev, playerCount: count }));
  };

  const handleOperationToggle = (pIdx: number, op: MathOperation) => {
    setPlayerConfigs((prev) => {
      const updated = [...prev];
      const p = { ...updated[pIdx] };
      if (p.operations.includes(op)) {
        if (p.operations.length > 1) {
          p.operations = p.operations.filter((o) => o !== op);
        }
      } else {
        p.operations = [...p.operations, op];
      }
      updated[pIdx] = p;
      return updated;
    });
  };

  const handleLaunchMatch = () => {
    const activePlayers: PlayerState[] = playerConfigs.slice(0, settings.playerCount).map((p, idx) => {
      const colorScheme = PLAYER_COLORS[idx];
      return {
        id: p.id,
        name: p.name.trim() || `Pemain ${p.id}`,
        avatar: p.avatar,
        color: colorScheme.color,
        bgGradient: colorScheme.bg,
        accentColor: colorScheme.accent,
        gradeLevel: p.gradeLevel,
        operations: p.operations,
        position: 0,
        stats: {
          score: 0,
          totalCorrect: 0,
          totalAttempted: 0,
          streak: 0,
          highestStreak: 0,
          speedBonusCount: 0,
          averageSpeedMs: 0,
          badges: [],
        },
        currentProblem: null,
        currentInput: '',
        feedback: 'none',
      };
    });

    onStartGame({ ...settings, themeId: selectedThemeId }, activePlayers);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 z-50 overflow-y-auto select-none">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 p-5 sm:p-6 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-950/30 flex items-center justify-center text-3xl shadow-inner border border-white/20">
              🎲
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-sm">NUMILAND</h1>
              <p className="text-xs sm:text-sm text-amber-100 font-medium">
                Papan Interaktif Digital Numerasi (2 - 4 Pemain Serentak)
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-slate-950/30 px-3 py-1.5 rounded-xl border border-white/20 text-xs font-semibold">
            <span>⚡ Serentak & Interaktif</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 p-2 gap-2">
          <button
            onClick={() => setActiveTab('theme')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'theme'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>🎨</span>
            <span>1. Pilihan Tema</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'rules'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>🎯</span>
            <span>2. Aturan & Mode</span>
          </button>

          <button
            onClick={() => setActiveTab('players')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'players'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>3. Karakter Pemain</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-slate-200">
          {/* TAB 1: THEME SELECTION */}
          {activeTab === 'theme' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>Pilih Tema Bermain Numiland</span>
                  </h3>
                  <p className="text-xs text-slate-400">Pilih suasana petualangan numerasi yang disukai siswa!</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {(Object.keys(THEMES) as ThemeId[]).map((tId) => {
                  const t = THEMES[tId];
                  const isSelected = selectedThemeId === tId;

                  return (
                    <div
                      key={tId}
                      onClick={() => {
                        setSelectedThemeId(tId);
                        // Update avatars based on new theme
                        setPlayerConfigs((prev) =>
                          prev.map((p, idx) => ({
                            ...p,
                            avatar: t.avatarOptions[idx % t.avatarOptions.length].icon,
                          }))
                        );
                      }}
                      className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between overflow-hidden ${
                        isSelected
                          ? `${t.borderColor} bg-slate-800 shadow-xl ring-2 ring-amber-400/50 scale-[1.02]`
                          : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      {/* Selected Badge */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}

                      <div>
                        <div className="text-3xl mb-2">{t.emoji}</div>
                        <h4 className="font-bold text-white text-base">{t.name}</h4>
                        <p className="text-xs text-amber-400/90 font-medium mb-1.5">{t.subtitle}</p>
                        <p className="text-xs text-slate-400 line-clamp-2">{t.description}</p>
                      </div>

                      {/* Avatars Preview */}
                      <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-400">Karakter:</span>
                        <div className="flex gap-1 text-sm">
                          {t.avatarOptions.map((a) => (
                            <span key={a.id} title={a.name}>
                              {a.icon}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: RULES & MODE */}
          {activeTab === 'rules' && (
            <div className="space-y-6">
              {/* Player Count */}
              <div>
                <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Jumlah Pemain di Papan Digital:</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => handlePlayerCountChange(num as 2 | 3 | 4)}
                      className={`py-3 px-4 rounded-xl border-2 font-bold text-base transition flex items-center justify-center gap-2 cursor-pointer ${
                        settings.playerCount === num
                          ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-md'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <span className="text-xl">👥</span>
                      <span>{num} Pemain</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Steps */}
              <div>
                <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <span>🚩</span>
                  <span>Panjang Lintasan / Target Langkah Menang:</span>
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[15, 20, 25, 30].map((steps) => (
                    <button
                      key={steps}
                      onClick={() => setSettings((prev) => ({ ...prev, targetSteps: steps }))}
                      className={`py-2.5 px-3 rounded-xl border font-bold text-sm transition flex flex-col items-center justify-center cursor-pointer ${
                        settings.targetSteps === steps
                          ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-base font-extrabold">{steps}</span>
                      <span className="text-[10px] text-slate-400">Langkah</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Type */}
              <div>
                <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <span>⌨️</span>
                  <span>Mekanisme Input Jawaban:</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSettings((prev) => ({ ...prev, inputType: 'numpad' }))}
                    className={`p-3 rounded-xl border-2 font-medium text-left transition cursor-pointer flex items-center gap-3 ${
                      settings.inputType === 'numpad'
                        ? 'border-amber-400 bg-amber-500/15 text-white'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-2xl">🔢</div>
                    <div>
                      <div className="font-bold text-sm text-white">Numpad Touch Pad</div>
                      <div className="text-xs text-slate-400">Ketik angka 0-9 langsung di layar (Latihan Berhitung)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSettings((prev) => ({ ...prev, inputType: 'multiple_choice' }))}
                    className={`p-3 rounded-xl border-2 font-medium text-left transition cursor-pointer flex items-center gap-3 ${
                      settings.inputType === 'multiple_choice'
                        ? 'border-amber-400 bg-amber-500/15 text-white'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-2xl">🔘</div>
                    <div>
                      <div className="font-bold text-sm text-white">Pilihan Ganda (4 Opsi)</div>
                      <div className="text-xs text-slate-400">Pilih salah satu dari 4 opsi angka (Respon Cepat)</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PLAYER CONFIG & DIFFICULTY */}
          {activeTab === 'players' && (
            <div className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Kemampuan Dinamis:</strong> Tingkat kesulitan dan jenis operasi matematika dapat disesuaikan untuk masing-masing siswa!
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {playerConfigs.slice(0, settings.playerCount).map((player, pIdx) => {
                  const themeAvatars = selectedTheme.avatarOptions;
                  const colorScheme = PLAYER_COLORS[pIdx];

                  return (
                    <div
                      key={player.id}
                      className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3 relative overflow-hidden"
                    >
                      {/* Top Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full shadow"
                            style={{ backgroundColor: colorScheme.color }}
                          />
                          <span className="font-bold text-sm text-white">Pemain {player.id}</span>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-mono">
                          Pilihan {pIdx + 1}
                        </span>
                      </div>

                      {/* Name input & Avatar selector */}
                      <div className="flex items-center gap-3">
                        {/* Avatar Pick */}
                        <div className="flex gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-700">
                          {themeAvatars.map((a) => (
                            <button
                              key={a.id}
                              onClick={() => {
                                const updated = [...playerConfigs];
                                updated[pIdx].avatar = a.icon;
                                setPlayerConfigs(updated);
                              }}
                              className={`p-1.5 rounded-lg text-xl transition cursor-pointer ${
                                player.avatar === a.icon
                                  ? 'bg-amber-500/30 ring-2 ring-amber-400 scale-110'
                                  : 'hover:bg-slate-800 opacity-60 hover:opacity-100'
                              }`}
                              title={a.name}
                            >
                              {a.icon}
                            </button>
                          ))}
                        </div>

                        {/* Name Input */}
                        <input
                          type="text"
                          value={player.name}
                          onChange={(e) => {
                            const updated = [...playerConfigs];
                            updated[pIdx].name = e.target.value;
                            setPlayerConfigs(updated);
                          }}
                          placeholder={`Pemain ${player.id}`}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-semibold focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      {/* Grade Level Selection */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          Tingkat Kesulitan / Kelas SD:
                        </label>
                        <select
                          value={player.gradeLevel}
                          onChange={(e) => {
                            const updated = [...playerConfigs];
                            updated[pIdx].gradeLevel = e.target.value as GradeLevel;
                            setPlayerConfigs(updated);
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-amber-300 font-medium focus:outline-none focus:border-amber-400"
                        >
                          <option value="kelas1-2">👶 Kelas 1 - 2 (Pemula: Penjumlahan/Pengurangan 1-20)</option>
                          <option value="kelas3-4">👦 Kelas 3 - 4 (Menengah: Penjumlahan/Pengurangan 1-100 & Perkalian)</option>
                          <option value="kelas5-6">🎓 Kelas 5 - 6 (Mahir: Perkalian, Pembagian, Operasi Ratusan)</option>
                          <option value="adaptive">⚡ Dinamis / Adaptif (Menyesuaikan Otomatis Sesuai Streak)</option>
                        </select>
                      </div>

                      {/* Operations Checkboxes */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          Operasi Hitung Aktif:
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { id: 'addition', label: '➕ Tambah' },
                            { id: 'subtraction', label: '➖ Kurang' },
                            { id: 'multiplication', label: '✖️ Kali' },
                            { id: 'division', label: '➗ Bagi' },
                          ].map((op) => {
                            const active = player.operations.includes(op.id as MathOperation);
                            return (
                              <button
                                key={op.id}
                                onClick={() => handleOperationToggle(pIdx, op.id as MathOperation)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition cursor-pointer ${
                                  active
                                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                                    : 'bg-slate-900 border-slate-700 text-slate-500'
                                }`}
                              >
                                {op.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 hidden sm:block">
            Papan Digital Siap: <strong className="text-amber-400">{selectedTheme.name}</strong> ({settings.playerCount} Pemain)
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {activeTab !== 'players' ? (
              <button
                onClick={() => setActiveTab(activeTab === 'theme' ? 'rules' : 'players')}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition flex items-center gap-2 cursor-pointer"
              >
                <span>Lanjut</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : null}

            <button
              onClick={handleLaunchMatch}
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-base shadow-xl transition transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>MULAI PERMAINAN!</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
