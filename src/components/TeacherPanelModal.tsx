import React from 'react';
import { GradeLevel, MathOperation, PlayerState } from '../types';
import { X, GraduationCap, RefreshCw, Sparkles, TrendingUp, Award, CheckCircle2 } from 'lucide-react';

interface TeacherPanelModalProps {
  players: PlayerState[];
  onUpdatePlayerGrade: (playerId: 1 | 2 | 3 | 4, newGrade: GradeLevel) => void;
  onUpdatePlayerOps: (playerId: 1 | 2 | 3 | 4, ops: MathOperation[]) => void;
  onClose: () => void;
}

export const TeacherPanelModal: React.FC<TeacherPanelModalProps> = ({
  players,
  onUpdatePlayerGrade,
  onUpdatePlayerOps,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 z-50 overflow-y-auto select-none">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-purple-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl border border-white/20">
              <GraduationCap className="w-6 h-6 text-indigo-200" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Panel Guru & Pemantauan Numerasi</h2>
              <p className="text-xs text-indigo-200">
                Atur tingkat kesulitan dan pantau perkembangan akurasi siswa secara langsung
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[70vh]">
          <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-3.5 text-xs text-indigo-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              <strong>Diferensiasi Pembelajaran:</strong> Anda dapat mengubah kelas/tingkat kesulitan untuk tiap siswa tanpa menghentikan permainan!
            </span>
          </div>

          <div className="space-y-3">
            {players.map((p) => {
              const accuracyPct = p.stats.totalAttempted > 0
                ? Math.round((p.stats.totalCorrect / p.stats.totalAttempted) * 100)
                : 0;

              return (
                <div key={p.id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{p.avatar}</span>
                      <div>
                        <div className="font-bold text-sm text-white flex items-center gap-2">
                          <span>{p.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                            Pemain {p.id}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">
                          Posisi: <strong className="text-amber-400">{p.position} Langkah</strong>
                        </div>
                      </div>
                    </div>

                    {/* Stats Metrics */}
                    <div className="flex items-center gap-3 text-xs">
                      <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
                        <span className="text-slate-400 block text-[10px]">Akurasi</span>
                        <strong className="text-emerald-400 text-sm">{accuracyPct}%</strong>
                      </div>

                      <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
                        <span className="text-slate-400 block text-[10px]">Benar/Soal</span>
                        <strong className="text-white text-sm">{p.stats.totalCorrect} / {p.stats.totalAttempted}</strong>
                      </div>

                      <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
                        <span className="text-slate-400 block text-[10px]">Streak Terbaik</span>
                        <strong className="text-amber-400 text-sm">{p.stats.highestStreak}x</strong>
                      </div>
                    </div>
                  </div>

                  {/* Difficulty Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Ubah Tingkat Kesulitan Siswa Ini:
                      </label>
                      <select
                        value={p.gradeLevel}
                        onChange={(e) => onUpdatePlayerGrade(p.id, e.target.value as GradeLevel)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-amber-300 font-medium focus:outline-none focus:border-indigo-400"
                      >
                        <option value="kelas1-2">👶 Kelas 1 - 2 (Pemula: 1-20 + Hint Visual)</option>
                        <option value="kelas3-4">👦 Kelas 3 - 4 (Menengah: 1-100 & Perkalian)</option>
                        <option value="kelas5-6">🎓 Kelas 5 - 6 (Mahir: Operasi Campuran Ratusan)</option>
                        <option value="adaptive">⚡ Dinamis / Adaptif (Menyesuaikan Otomatis)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Badges Diraih:
                      </label>
                      <div className="flex flex-wrap gap-1">
                        {p.stats.badges.length > 0 ? (
                          p.stats.badges.map((b) => (
                            <span
                              key={b.id}
                              className="px-2 py-0.5 rounded-lg bg-purple-950 border border-purple-700 text-purple-300 text-[11px] font-semibold flex items-center gap-1"
                              title={b.description}
                            >
                              <span>{b.icon}</span>
                              <span>{b.title}</span>
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-500 italic">Belum ada lencana</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition cursor-pointer"
          >
            Tutup Panel
          </button>
        </div>
      </div>
    </div>
  );
};
