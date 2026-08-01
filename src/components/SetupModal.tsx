import React, { useState, useEffect } from 'react';
import { GameSettings, GradeLevel, MathOperation, PlayerState, ThemeId } from '../types';
import { THEMES } from '../data/themes';
import { Play, Users, Sparkles, Check, ChevronRight, GraduationCap } from 'lucide-react';

interface SetupModalProps {
  initialSettings: GameSettings;
  initialPlayers: PlayerState[];
  onStartGame: (settings: GameSettings, players: PlayerState[]) => void;
  onClose?: () => void;
  isInitialSetup?: boolean;
  onOpenPlayerHistory?: () => void;
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
  onOpenPlayerHistory,
}) => {
  const [settings, setSettings] = useState<GameSettings>(initialSettings);
  const [activeTab, setActiveTab] = useState<'rules' | 'theme' | 'players'>('rules');
  const [globalGradeLevel, setGlobalGradeLevel] = useState<GradeLevel>(
    initialPlayers[0]?.gradeLevel || 'kelas1-2'
  );
  const [globalOperations, setGlobalOperations] = useState<MathOperation[]>(
    initialPlayers[0]?.operations || ['addition', 'subtraction']
  );

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

  // Keep avatars aligned with theme when theme changes or modal loads
  useEffect(() => {
    const currentTheme = THEMES[selectedThemeId];
    if (!currentTheme) return;
    setPlayerConfigs((prev) =>
      prev.map((p, idx) => {
        const isAvatarInTheme = currentTheme.avatarOptions.some((opt) => opt.icon === p.avatar);
        if (!isAvatarInTheme) {
          return {
            ...p,
            avatar: currentTheme.avatarOptions[idx % currentTheme.avatarOptions.length].icon,
          };
        }
        return p;
      })
    );
  }, [selectedThemeId]);

  const handlePlayerCountChange = (count: 1 | 2 | 3 | 4) => {
    setSettings((prev) => ({ ...prev, playerCount: count }));
  };

  const handleGlobalGradeChange = (newGrade: GradeLevel) => {
    setGlobalGradeLevel(newGrade);

    let defaultOps: MathOperation[] = ['addition', 'subtraction'];
    if (newGrade === 'kelas3-4') {
      defaultOps = ['addition', 'subtraction', 'multiplication'];
    } else if (newGrade === 'kelas5-6') {
      defaultOps = ['addition', 'subtraction', 'multiplication', 'division'];
    } else if (newGrade === 'adaptive') {
      defaultOps = ['addition', 'subtraction', 'multiplication'];
    }

    setGlobalOperations(defaultOps);
    setPlayerConfigs((prev) =>
      prev.map((p) => ({
        ...p,
        gradeLevel: newGrade,
        operations: defaultOps,
      }))
    );
  };

  const handleGlobalOperationToggle = (op: MathOperation) => {
    setGlobalOperations((prev) => {
      let updated: MathOperation[];
      if (prev.includes(op)) {
        if (prev.length > 1) {
          updated = prev.filter((o) => o !== op);
        } else {
          updated = prev;
        }
      } else {
        updated = [...prev, op];
      }
      setPlayerConfigs((pConfigs) =>
        pConfigs.map((p) => ({ ...p, operations: updated }))
      );
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
        gradeLevel: globalGradeLevel,
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
                Papan Interaktif Digital Numerasi (1 - 4 Pemain)
              </p>
              <p className="text-[11px] sm:text-xs text-amber-200/90 font-medium mt-0.5 flex items-center gap-1">
                <span>✨ Pembuat:</span>
                <strong className="text-white font-bold">Indra Tata</strong>
                <span className="text-amber-200/80">(berbantuan AI)</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onOpenPlayerHistory && (
              <button
                type="button"
                onClick={onOpenPlayerHistory}
                className="flex items-center gap-1.5 bg-slate-950/50 hover:bg-slate-950/80 text-amber-200 px-3 py-1.5 rounded-xl border border-white/30 text-xs font-bold transition shadow-sm active:scale-95 cursor-pointer"
              >
                <Users className="w-4 h-4 text-amber-300" />
                <span>👥 Data Pemain</span>
              </button>
            )}
            <div className="hidden sm:flex items-center gap-2 bg-slate-950/30 px-3 py-1.5 rounded-xl border border-white/20 text-xs font-semibold">
              <span>⚡ Serentak & Interaktif</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 p-2 gap-2">
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'rules'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>🎯</span>
            <span>1. Aturan & Mode</span>
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'theme'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>🎨</span>
            <span>2. Pilihan Tema</span>
          </button>

          <button
            onClick={() => setActiveTab('players')}
            className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
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
          {/* TAB 1: RULES & MODE (Including Global Grade Level) */}
          {activeTab === 'rules' && (
            <div className="space-y-6">
              {/* Grade / Class Selection (Chosen ONCE globally) */}
              <div>
                <label className="block text-sm font-bold text-white mb-1.5 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                  <span>Pemilihan Kelas / Fase SD (Pilih 1 Kali):</span>
                </label>
                <p className="text-xs text-slate-400 mb-3">
                  Pilihan tingkat kesulitan ini berlaku otomatis untuk seluruh pemain di permainan.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    {
                      id: 'kelas1-2',
                      title: '👶 Kelas 1 - 2 (Fase A)',
                      desc: 'Penjumlahan & Pengurangan (1 - 20) + Petunjuk Visual Emoji',
                    },
                    {
                      id: 'kelas3-4',
                      title: '👦 Kelas 3 - 4 (Fase B)',
                      desc: 'Penjumlahan, Pengurangan (1 - 100) & Perkalian Dasar',
                    },
                    {
                      id: 'kelas5-6',
                      title: '🎓 Kelas 5 - 6 (Fase C)',
                      desc: 'Perkalian, Pembagian & Operasi Hitung Ratusan',
                    },
                    {
                      id: 'adaptive',
                      title: '⚡ Dinamis / Adaptif',
                      desc: 'Tingkat kesulitan menyesuaikan otomatis berdasarkan streak',
                    },
                  ].map((g) => {
                    const isSelected = globalGradeLevel === g.id;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => handleGlobalGradeChange(g.id as GradeLevel)}
                        className={`p-3 sm:p-3.5 rounded-2xl border-2 text-left transition flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? 'border-amber-400 bg-amber-500/15 text-white ring-1 ring-amber-400/50'
                            : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div
                          className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-amber-400 bg-amber-400' : 'border-slate-600'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                        </div>
                        <div>
                          <div className={`font-bold text-sm ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                            {g.title}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">{g.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Math Operations Selection */}
              <div>
                <label className="block text-sm font-bold text-white mb-1.5 flex items-center gap-2">
                  <span>🧮</span>
                  <span>Opsi Operasi Hitung (Berlaku Semua Pemain):</span>
                </label>
                <p className="text-xs text-slate-400 mb-2.5">
                  Pilih jenis operasi hitung matematika yang akan diikutsertakan dalam soal permainan.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'addition', label: '➕ Penjumlahan', desc: 'Soal Tambah' },
                    { id: 'subtraction', label: '➖ Pengurangan', desc: 'Soal Kurang' },
                    { id: 'multiplication', label: '✖️ Perkalian', desc: 'Soal Perkalian' },
                    { id: 'division', label: '➗ Pembagian', desc: 'Soal Pembagian' },
                  ].map((op) => {
                    const active = globalOperations.includes(op.id as MathOperation);
                    return (
                      <button
                        key={op.id}
                        type="button"
                        onClick={() => handleGlobalOperationToggle(op.id as MathOperation)}
                        className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between ${
                          active
                            ? 'border-amber-400 bg-amber-500/15 text-white ring-1 ring-amber-400/50'
                            : 'border-slate-800 bg-slate-900/80 text-slate-500 hover:border-slate-700'
                        }`}
                      >
                        <div className={`font-bold text-sm ${active ? 'text-amber-300' : 'text-slate-400'}`}>
                          {op.label}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">{op.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Player Count */}
              <div>
                <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Jumlah Pemain di Papan Digital:</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handlePlayerCountChange(num as 1 | 2 | 3 | 4)}
                      className={`py-3 px-3 rounded-xl border-2 font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
                        settings.playerCount === num
                          ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-md'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <span className="text-lg">{num === 1 ? '👤' : '👥'}</span>
                      <span>{num === 1 ? '1 Pemain (Solo)' : `${num} Pemain`}</span>
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
                      type="button"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
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
                    type="button"
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

              {/* Mode Buta (Blind / Memory Mode) */}
              <div>
                <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <span>🙈</span>
                  <span>Tantangan 'Mode Buta' (Fokus & Memori Cepat):</span>
                </label>
                <button
                  type="button"
                  onClick={() => setSettings((prev) => ({ ...prev, blindMode: !prev.blindMode }))}
                  className={`w-full p-3.5 rounded-2xl border-2 font-medium text-left transition cursor-pointer flex items-center justify-between ${
                    settings.blindMode
                      ? 'border-purple-400 bg-purple-500/20 text-white ring-2 ring-purple-400/50'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl sm:text-3xl">🙈</div>
                    <div>
                      <div className={`font-bold text-sm sm:text-base ${settings.blindMode ? 'text-purple-300' : 'text-white'}`}>
                        {settings.blindMode ? 'AKTIF — Mode Buta (Soal Hilang Dalam 3 Detik)' : 'NONAKTIF — Mode Normal (Soal Tampak Terus)'}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Soal matematika hanya tampil 3 detik lalu tersembunyi. Pemain melatih ingatan angka & konsentrasi tinggi!
                      </div>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase shrink-0 ${
                      settings.blindMode
                        ? 'bg-purple-500 text-white shadow-lg animate-pulse'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {settings.blindMode ? 'AKTIF' : 'OFF'}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: THEME SELECTION */}
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

          {/* TAB 3: PLAYER CONFIG & CUSTOMIZATION */}
          {activeTab === 'players' && (
            <div className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Karakter Pemain:</strong> Sesuaikan nama dan ikon avatar untuk masing-masing pemain (Kelas Terpilih:{' '}
                  <strong className="text-white">
                    {globalGradeLevel === 'kelas1-2'
                      ? 'Kelas 1 - 2'
                      : globalGradeLevel === 'kelas3-4'
                      ? 'Kelas 3 - 4'
                      : globalGradeLevel === 'kelas5-6'
                      ? 'Kelas 5 - 6'
                      : 'Dinamis / Adaptif'}
                  </strong>
                  ).
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
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {/* Avatar Pick */}
                        <div className="flex gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-700 justify-around sm:justify-start">
                          {themeAvatars.map((a) => (
                            <button
                              key={a.id}
                              type="button"
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
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">
              Dibuat oleh <strong className="text-slate-300">Indra Tata</strong> berbantuan AI
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {activeTab !== 'players' ? (
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'rules' ? 'theme' : 'players')}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition flex items-center gap-2 cursor-pointer"
              >
                <span>Lanjut</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : null}

            <button
              type="button"
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
