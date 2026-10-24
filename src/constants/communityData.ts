import { CommunityPost } from '../types';

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  // Posting Khusus Ruang Ikhwan
  {
    id: 'post-ikhwan-1',
    authorAlias: 'Abu Hamzah (Jawa Timur)',
    gender: 'ikhwan',
    timeAgo: '20 menit yang lalu',
    content: 'Alhamdulillah, hari ini berhasil melewati jam rawan malam hari tanpa menyentuh konten haram. Kuncinya tadi langsung wudhu dan membaca dzikir petang. Ya Rabb, kuatkan kami semua di halaqah ini.',
    aamiinCount: 24,
    hasAamiined: false,
  },
  {
    id: 'post-ikhwan-2',
    authorAlias: 'Hamba Allah #108 (Jakarta)',
    gender: 'ikhwan',
    timeAgo: '1 jam yang lalu',
    content: 'Untuk saudaraku yang hari ini merasa berat melawan keterikatan rokok/vape: bertahanlah di 3 hari pertama. Tadi saat mulut terasa asam, saya langsung gigit siwak dan minum air putih dingin. Ternyata godaan itu cuma sebentar lalu reda.',
    aamiinCount: 38,
    hasAamiined: false,
  },
  {
    id: 'post-ikhwan-3',
    authorAlias: 'Abu Rayyan (Sumatera)',
    gender: 'ikhwan',
    timeAgo: '3 jam yang lalu',
    content: 'Materi rekaman Fase 1 tentang Kitab Al-Jawab Al-Kafi sangat menampar hati saya. Betapa banyak rezeki yang sempat seret karena dosa mata yang saya anggap sepele. Bismillah, mari istiqomah bersama ikhwah.',
    aamiinCount: 42,
    hasAamiined: false,
  },

  // Posting Khusus Ruang Akhwat
  {
    id: 'post-akhwat-1',
    authorAlias: 'Ummu Aisyah (Yogyakarta)',
    gender: 'akhwat',
    timeAgo: '15 menit yang lalu',
    content: 'Alhamdulillah, hari ke-5 detoks media sosial. Hati terasa jauh lebih lapang tanpa rasa membandingkan diri dan ghibah. Mohon doanya saudariku agar istiqomah menjaga lisan dan pandangan.',
    aamiinCount: 31,
    hasAamiined: false,
  },
  {
    id: 'post-akhwat-2',
    authorAlias: 'Amatullah #042 (Bandung)',
    gender: 'akhwat',
    timeAgo: '2 jam yang lalu',
    content: 'Tadi sempat ada bisikan futur saat shalat Subuh, tapi langsung ingat firman Allah di QS. Az-Zumar: 53. Jangan pernah putus asa dari rahmat-Nya ya ukhti fillah. Kita pasti bisa melangkah pulang.',
    aamiinCount: 49,
    hasAamiined: false,
  },
];
