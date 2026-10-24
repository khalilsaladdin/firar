import { HabitOption } from '../types';

export const HABIT_OPTIONS: HabitOption[] = [
  {
    id: 'pandangan_zina',
    label: 'Pandangan & konten yang menjerumuskan pada zina',
    arabicLabel: 'حِفْظُ الْبَصَرِ',
    description: 'Pornografi, sulit menundukkan pandangan (ghadhul bashar), dan rangsangan visual syahwat',
    icon: 'eye-off-outline',
  },
  {
    id: 'rokok_khamr',
    label: 'Rokok atau khamr',
    arabicLabel: 'حِفْظُ النَّفْسِ وَالْعَقْلِ',
    description: 'Keterikatan fisik dan pelarian saat stres atau cemas melalui zat yang merusak',
    icon: 'flame-outline',
  },
  {
    id: 'medsos_ghibah',
    label: 'Terlalu lama di media sosial & dosa lisan',
    arabicLabel: 'حِفْظُ الْوَقْتِ وَاللِّسَانِ',
    description: 'Menghabiskan umur dalam kelalaian, ghibah, membandingkan diri, dan debat yang mengeruhkan hati',
    icon: 'phone-portrait-outline',
  },
  {
    id: 'shalat_terlambat',
    label: 'Shalat yang sering tertinggal atau terlambat',
    arabicLabel: 'إِقَامُ الصَّلَاةِ',
    description: 'Merasa berat melangkah untuk ibadah, menunda shalat hingga akhir waktu, atau kehilangan kekhusyukan',
    icon: 'time-outline',
  },
  {
    id: 'dosa_rahasia',
    label: 'Kebiasaan / dosa rahasia lainnya',
    arabicLabel: 'سِتْرُ الْعَيْبِ',
    description: 'Perkara yang engkau rasakan menyita hatimu di kala sunyi dan hanya Allah yang mengetahuinya',
    icon: 'lock-closed-outline',
  },
  {
    id: 'not_sure',
    label: 'Saya belum yakin, saya hanya ingin memeriksa hati saya',
    arabicLabel: 'مُحَاسَبَةُ النَّفْسِ',
    description: 'Memulai perjalanan muhasabah dengan tenang tanpa harus memberi label pada diri sendiri',
    icon: 'heart-outline',
  },
];
