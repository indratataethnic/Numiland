import { Badge } from '../types';

export const BADGE_DEFINITIONS: Record<string, Omit<Badge, 'earnedAt'>> = {
  kilat_math: {
    id: 'kilat_math',
    title: 'Kilat Math',
    icon: '⚡',
    description: 'Menjawab soal dalam waktu di bawah 3 detik!',
  },
  streak_master: {
    id: 'streak_master',
    title: 'Streak Master',
    icon: '🔥',
    description: 'Menjawab 5 soal berturut-turut tanpa salah!',
  },
  genius_numerasi: {
    id: 'genius_numerasi',
    title: 'Genius Numerasi',
    icon: '🧠',
    description: 'Akurasi sempurna 100% sepanjang permainan!',
  },
  pantang_menyerah: {
    id: 'pantang_menyerah',
    title: 'Pantang Menyerah',
    icon: '🛡️',
    description: 'Bangkit dari kesalahan dan meraih 3 jawaban benar berturut-turut!',
  },
  raja_numiland: {
    id: 'raja_numiland',
    title: 'Raja Numiland',
    icon: '👑',
    description: 'Berhasil mencapai garis akhir pertama kali dan memenangkan pertandingan!',
  },
  speed_demon: {
    id: 'speed_demon',
    title: 'Super Cepat',
    icon: '🚀',
    description: 'Mendapatkan bonus kecepatan jawaban pertama sebanyak 3 kali!',
  },
};
