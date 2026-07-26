import React, { useState } from 'react';
import { GameHistorySession, getGameHistory, clearGameHistory, getPageViewCount } from '../utils/historyStorage';
import { X, Users, Trophy, Calendar, Search, Trash2, Award, Sparkles, CheckCircle2, Flame, Eye } from 'lucide-react';

interface PlayerHistoryModalProps {
  onClose: () => void;
}

export const PlayerHistoryModal: React.FC<PlayerHistoryModalProps> = ({ onClose }) => {
  const [history, setHistory] = useState<GameHistorySession[]>(getGameHistory());
  const [searchTerm, setSearchTerm] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const pageViews = getPageViewCount();

  // Summary calculations
  const totalGames = history.length;
  const totalPlayersParticipated = history.reduce((acc, s) => acc + s.players.length, 0);
  const totalCorrectAnswers = history.reduce(
    (acc, s) => acc + s.players.reduce((pAcc, p) => pAcc + p.totalCorrect, 0),
    0
  );

  const filteredHistory = history.filter((s) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const matchTheme = s.themeName.toLowerCase().includes(q);
    const matchWinner = s.winnerName.toLowerCase().includes(q);
    const matchPlayers = s.players.some((p) => p.name.toLowerCase().includes(q));
    return matchTheme || matchWinner || matchPlayers;
  });

  const handleClear = () => {
    clearGameHistory();
    setHistory([]);
    setShowClearConfirm(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 z-50 overflow-y-auto select-none">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-4 sm:p-5 text-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-950/20 rounded-2xl border border-black/10">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 text-slate-950" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight">Data Orang Yang Bermain</h2>
              <p className="text-xs font-semibold text-slate-900/90">
                Catatan sesi pemain & statistik aktivitas numerasi Numiland
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-slate-950/20 hover:bg-slate-950/40 text-slate-950 rounded-xl transition cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1 text-slate-200">
          {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700 flex flex-col justify-between">
              <div className="flex items-center justify-between text-amber-400">
                <span className="text-xs font-bold text-slate-400">Total Sesi Game</span>
                <Trophy className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">{totalGames}</div>
              <span className="text-[10px] text-slate-400 mt-0.5">Pertandingan Selesai</span>
            </div>

            <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700 flex flex-col justify-between">
              <div className="flex items-center justify-between text-indigo-400">
                <span className="text-xs font-bold text-slate-400">Total Pemain</span>
                <Users className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-indigo-300 mt-1">{totalPlayersParticipated}</div>
              <span className="text-[10px] text-slate-400 mt-0.5">Pemain Terlibat</span>
            </div>

            <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700 flex flex-col justify-between">
              <div className="flex items-center justify-between text-emerald-400">
                <span className="text-xs font-bold text-slate-400">Jawaban Benar</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">{totalCorrectAnswers}</div>
              <span className="text-[10px] text-slate-400 mt-0.5">Soal Berhasil Terjawab</span>
            </div>

            <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700 flex flex-col justify-between">
              <div className="flex items-center justify-between text-sky-400">
                <span className="text-xs font-bold text-slate-400">Pengunjung Laman</span>
                <Eye className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-sky-300 mt-1">{pageViews}</div>
              <span className="text-[10px] text-slate-400 mt-0.5">Kali Halaman Dilihat</span>
            </div>
          </div>

          {/* SEARCH & FILTER BAR */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama pemain / tema..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {history.length > 0 && (
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {showClearConfirm ? (
                  <div className="flex items-center gap-2 bg-rose-950/80 p-1.5 rounded-xl border border-rose-800">
                    <span className="text-[11px] text-rose-200 font-bold px-1">Yakin hapus?</span>
                    <button
                      onClick={handleClear}
                      className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      Ya, Hapus
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Bersihkan Riwayat</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* PLAYER HISTORY LIST */}
          {filteredHistory.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/40 rounded-3xl border border-slate-800 text-slate-400 space-y-2">
              <span className="text-4xl block">🎮</span>
              <p className="font-bold text-sm text-slate-300">Belum Ada Sesi Permainan Tersimpan</p>
              <p className="text-xs text-slate-500">
                {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian.' : 'Mainkan game terlebih dahulu bersama teman-teman! Hasil pertandingan akan langsung tercatat di sini.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredHistory.map((session) => (
                <div
                  key={session.id}
                  className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 hover:border-amber-500/40 transition shadow-lg space-y-3"
                >
                  {/* Session Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/80 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{session.themeEmoji}</span>
                      <div>
                        <div className="font-extrabold text-sm text-white flex items-center gap-2">
                          <span>{session.themeName}</span>
                          <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded-full text-amber-300 border border-amber-500/30">
                            {session.playerCount} Pemain
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>{session.dateStr}</span>
                          <span className="text-slate-600">•</span>
                          <span>Target: {session.targetSteps} Langkah</span>
                        </div>
                      </div>
                    </div>

                    {/* Winner Tag */}
                    <div className="flex items-center gap-2 bg-amber-500/15 border border-amber-500/40 px-3 py-1 rounded-xl">
                      <span className="text-xl animate-bounce">{session.winnerAvatar}</span>
                      <div>
                        <span className="text-[10px] text-amber-400 font-bold block">🏆 Pemenang</span>
                        <strong className="text-xs text-amber-200">{session.winnerName}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Player Stats Grid for this Session */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {session.players.map((p) => {
                      const isWinner = p.name === session.winnerName;
                      return (
                        <div
                          key={p.id}
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                            isWinner
                              ? 'bg-amber-950/40 border-amber-500/50 text-amber-100'
                              : 'bg-slate-900/80 border-slate-800 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-2xl shrink-0">{p.avatar}</span>
                            <div className="truncate">
                              <div className="font-bold text-xs truncate flex items-center gap-1">
                                <span className="truncate">{p.name}</span>
                                {isWinner && <span className="text-[10px]">👑</span>}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {p.position} Poin ({p.totalCorrect}/{p.totalAttempted} Benar)
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-xs font-black text-emerald-400">{p.accuracy}%</div>
                            <div className="text-[9px] text-slate-400">Akurasi</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>✨ Data tersimpan lokal di peramban ini (tanpa perlu portal admin).</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition cursor-pointer shadow"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
