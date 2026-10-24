// Arsitektur Ekosistem Firar: Dua Gerbang Utama Penawar Fitnah
// Berdasarkan Kaidah Ibnul Qayyim & Syaikhul Islam Ibnu Taimiyyah (Ighatsatul Lahafan)
// Seluruh kebinasaan berakar pada: 
// 1. Fitnah Syahwat (Dosa Hawa Nafsu Fisik) -> Ditundukkan dengan 'Iffah (Kesabaran)
// 2. Fitnah Syubhat (Dosa Keraguan & Was-Was Akidah) -> Dihancurkan dengan Yaqeen (Ilmu & Keyakinan)

export interface EcosystemApp {
  id: string;
  name: string;
  arabicName: string;
  category: string;
  tagline: string;
  status: 'active' | 'coming_soon';
  description: string;
  badge: string;
  features: string[];
  url?: string;
  accentColor: string;
  bgGlow: string;
  icon: string;
}

export const ECOSYSTEM_APPS: EcosystemApp[] = [
  {
    id: 'iffah',
    name: 'Iffah',
    arabicName: 'عِفَّة',
    category: 'PILAR 1 • PENAKLUK FITNAH SYAHWAT',
    tagline: 'Pemulihan Total Segala Dosa Syahwat (Zina Mata, Pornografi, Rokok, Miras & Hawa Nafsu)',
    status: 'active',
    badge: 'AKTIF & TERSEDIA',
    accentColor: '#10B981', // Emerald
    bgGlow: 'rgba(16, 185, 129, 0.12)',
    icon: '💎',
    description:
      'Pintu gerbang bagi jiwa yang sedang berjuang menundukkan hawa nafsu dan kenikmatan semu fisik. Menampung seluruh detoksifikasi dosa syahwat: pornografi, zina mata, rokok/vape, miras/khamr, judi, dan ketamakan syahwat.',
    features: [
      '👁️ Detoksifikasi Zina Mata & Pornografi (Pemulihan Rem Otak)',
      '🚭 Pemutusan Ketergantungan Fisik (Rokok, Vape, & Miras)',
      '🛡️ Benteng Jam Rawan Malam Otomatis (Pukul 22.00 – 04.30)',
      '🚨 Tombol Darurat SOS Penakluk Syahwat 90 Detik',
      '🎧 Audio Murottal Penyejuk Jiwa & Ikrar Suci Menjaga Kehormatan'
    ],
    url: 'https://iffah-taupe.vercel.app/'
  },
  {
    id: 'yaqeen',
    name: 'Yaqeen',
    arabicName: 'يَقِين',
    category: 'PILAR 2 • PENAKLUK FITNAH SYUBHAT',
    tagline: 'Pembersihan Keraguan Akidah, Was-Was Hati, & Racun Pemikiran',
    status: 'coming_soon',
    badge: 'SEGERA HADIR (DALAM PERSIAPAN)',
    accentColor: '#3B82F6', // Blue / As-Sama'
    bgGlow: 'rgba(59, 130, 246, 0.12)',
    icon: '🧠',
    description:
      'Pintu gerbang bagi akal dan hati yang diserang keraguan iman, was-was berulang dalam thaharah & shalat, bisikan skeptisisme takdir, serta kekacauan logika syubhat zaman ini.',
    features: [
      '💧 Penawar Was-Was Thaharah, Wudhu, Shalat & Niat Berdasarkan Dalil',
      '💎 Pengokoh Tauhid & Penjawab Keraguan Eksistensi serta Keadilan Takdir',
      '📖 Bedah Kritis Racun Pemikiran Modern & Logika Syubhat Menyimpang',
      '🛡️ Benteng Bashirah (Keyakinan Hati) Bersama Khazanah Salafus Shalih'
    ]
  }
];
