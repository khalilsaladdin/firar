import { SinItem } from '../types';

export const KABA_IR_INTRO = {
  definitionSalaf:
    'Ibnu Abbas radhiyallahu ‘anhuma dan Syaikhul Islam Ibnu Taimiyyah mendefinisikan dosa besar (Al-Kabirah) sebagai: "Setiap dosa yang diiringi ancaman siksa neraka, murka Allah, laknat-Nya, atau hukuman had (pidana syariat) di dunia, ataupun penafian kesempurnaan iman."',
  salafGoldenRule:
    'Para ulama Salaf menegaskan kaidah agung: "Lā kabīrata ma’al istighfār, wa lā shaghīrata ma’al ishrār" — Tidak ada dosa besar bila diiringi taubat dan istighfar yang tulus, dan tidak ada dosa kecil bila diremehkan dan terus-menerus dikerjakan.',
};

export const KABA_IR_SINS: SinItem[] = [
  // KELOMPOK 1: HAK ALLAH (HAQQULLAH)
  {
    id: 'dosa-syirik-riya',
    kabairNumber: 1,
    category: 'haqqullah',
    categoryLabel: '⚡ Hak Allah (Tauhid)',
    title: 'Syirik kepada Allah & Riya’ (Pamer Amal)',
    arabicTitle: 'الشِّرْكُ بِاللَّهِ وَالرِّيَاءُ',
    definition:
      'Memalingkan hak ibadah kepada selain Allah, atau menyertakan niat ingin dipuji manusia dalam beramal saleh (Syirik Ashghar).',
    dangerAndConsequence:
      'Dosa terbesar yang membatalkan seluruh amal saleh. Jika mati dalam keadaan syirik akbar tanpa bertaubat, pelakunya kekal di dalam neraka Jahannam.',
    dalil: {
      arabic: 'إِنَّ اللَّهَ لَا يَغْفِرُ أَنْ يُشْرَكَ بِهِ وَيَعْفِرُ مَا دُونَ ذَٰلِكَ لِمَنْ يَشَاءُ',
      translation:
        'Sesungguhnya Allah tidak akan mengampuni dosa syirik, dan Dia mengampuni segala dosa yang selain dari (syirik) itu, bagi siapa yang dikehendaki-Nya.',
      reference: 'QS. An-Nisa: 48 & Kitab Al-Kaba\'ir no. 1',
    },
    salafWarning: {
      scholar: 'Imam Adz-Dzahabi',
      quote:
        'Syirik adalah dosa terbesar dari segala dosa besar. Dan di antara cabang syirik tersembunyi adalah riya’, yaitu seorang hamba shalat atau berinfak demi mendapatkan sanjungan manusia.',
      book: 'Kitab Al-Kaba\'ir',
    },
    taubatGuidance:
      'Memperbaharui kalimat Syahadat dengan penuh keyakinan tauhid, membersihkan hati dari kebiasaan ingin dipuji, dan memperbanyak doa: "Allahumma inni a’udzu bika an usyrika bika wa ana a’lam, wa astaghfiruka lima laa a’lam."',
  },
  {
    id: 'dosa-meninggalkan-shalat',
    kabairNumber: 4,
    category: 'haqqullah',
    categoryLabel: '⚡ Hak Allah (Ibadah Fardhu)',
    title: 'Meninggalkan Shalat Fardhu Secara Sengaja',
    arabicTitle: 'تَرْكُ الصَّلَاةِ الْمَكْتُوبَةِ',
    definition:
      'Melalaikan shalat fardhu lima waktu hingga keluar batas waktunya tanpa uzur syar’i, atau meninggalkannya karena malas dan meremehkan.',
    dangerAndConsequence:
      'Pembatas antara keimanan dan kekufuran. Orang yang meninggalkan shalat diancam dengan jurang "Ghayya" dan "Saqar" di dasar neraka Jahannam.',
    dalil: {
      arabic: 'بَيْنَ الرَّجُلِ وَبَيْنَ الشِّرْكِ وَالْكُفْرِ تَرْكُ الصَّلَاةِ',
      translation:
        'Pembatas antara seseorang dengan kesyirikan dan kekafiran adalah meninggalkan shalat.',
      reference: 'HR. Muslim no. 82 & Kitab Al-Kaba\'ir no. 4',
    },
    salafWarning: {
      scholar: 'Umar bin Al-Khaththab radhiyallahu \'anhu',
      quote:
        'Tidak ada bagian dalam Islam bagi siapa saja yang menyia-nyiakan shalat. Siapa yang meremehkan shalatnya, maka ia pasti akan lebih meremehkan perkara agama yang lainnya.',
      book: 'Tashih Mukhtashar Al-Kaba\'ir',
    },
    taubatGuidance:
      'Bertaubat nasuha seketika, berjanji tidak akan pernah lagi menunda shalat, menyegerakan wudhu begitu azan berkumandang, dan menjaga shalat berjamaah di masjid bagi kaum laki-laki.',
  },
  {
    id: 'dosa-putus-asa-dari-rahmat',
    kabairNumber: 46,
    category: 'haqqullah',
    categoryLabel: '⚡ Hak Allah (Prasangka pada Rabb)',
    title: 'Berputus Asa dari Rahmat Allah (Al-Ya’su)',
    arabicTitle: 'الْيَأْسُ مِنْ رَوْحِ اللَّهِ',
    definition:
      'Meyakini bahwa dosanya terlalu besar sehingga mustahil diampuni oleh Allah, lalu berhenti berdoa dan berhenti bertaubat.',
    dangerAndConsequence:
      'Meremehkan keluasan rahmat dan sifat Maha Pengampun Allah Ta’ala. Keputusasaan adalah salah satu perangkap Iblis yang paling mematikan bagi orang berdosa.',
    dalil: {
      arabic: 'إِنَّهُ لَا يَيْأَسُ مِنْ رَوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ',
      translation:
        'Sesungguhnya tiada berputus asa dari rahmat Allah, melainkan kaum yang kafir.',
      reference: 'QS. Yusuf: 87 & Kitab Al-Kaba\'ir no. 46',
    },
    salafWarning: {
      scholar: 'Ibnu Mas’ud radhiyallahu \'anhu',
      quote:
        'Dosa besar yang paling membinasakan ada dua: seseorang berputus asa dari rahmat Allah, dan seseorang merasa aman dari makar dan hukuman Allah.',
      book: 'Mushannaf Abdurrazzaq no. 19701',
    },
    taubatGuidance:
      'Membaca dan merenungi QS. Az-Zumar: 53. Sadarilah bahwa rahmat Allah mendahului murka-Nya. Seberapa pun kelam masa lalumu, pintu taubat selalu terbuka sebelum ajal tiba.',
  },

  // KELOMPOK 2: KEHORMATAN & RAGA
  {
    id: 'dosa-zina-dan-sarana-pornografi',
    kabairNumber: 10,
    category: 'raga_kehormatan',
    categoryLabel: '💔 Kehormatan & Raga',
    title: 'Zina & Segala Perantara Menuju Zina (Pornografi/Zina Mata)',
    arabicTitle: 'الزِّنَا وَمُقَدِّمَاتُهُ',
    definition:
      'Menyalurkan syahwat di luar pernikahan yang sah, termasuk zina mata (menonton pornografi), zina tangan, dan perbuatan khalwat (berdua-duaan tanpa mahram).',
    dangerAndConsequence:
      'Mencabut cahaya keimanan dari dada, mewariskan kemiskinan batin, menimbulkan penyakit jasmani dan kejiwaan, serta menyalakan kemurkaan Allah.',
    dalil: {
      arabic: 'وَلَا تَقْرَبُوا الزِّنَا ۖ إِنَّهُ كَانَ فَاحِشَةً وَسَاءَ سَبِيلًا',
      translation:
        'Dan janganlah kamu mendekati zina; sesungguhnya zina itu adalah suatu perbuatan yang keji dan suatu jalan yang buruk.',
      reference: 'QS. Al-Isra: 32 & Kitab Al-Kaba\'ir no. 10',
    },
    salafWarning: {
      scholar: 'Imam Adz-Dzahabi',
      quote:
        'Tingkatan dosa zina yang paling berat adalah berzina dengan istri tetangga, mahramnya, atau melakukannya terang-terangan. Namun segala perantara seperti pandangan haram dan sentuhan adalah benih zina yang dilaknat.',
      book: 'Kitab Al-Kaba\'ir',
    },
    taubatGuidance:
      'Menundukkan pandangan (ghadhul bashar), menghapus seluruh koleksi foto/video haram, memblokir akses gawai dari pemicu syahwat, dan menyibukkan diri dengan puasa sunnah atau menikah jika mampu.',
  },
  {
    id: 'dosa-meminum-khamr',
    kabairNumber: 14,
    category: 'raga_kehormatan',
    categoryLabel: '💔 Kehormatan & Raga',
    title: 'Meminum Khamr & Mengonsumsi Zat Pemabuk',
    arabicTitle: 'شُرْبُ الْخَمْرِ وَالْمُسْكِرَاتِ',
    definition:
      'Meminum atau memasukkan segala zat yang menutupi dan merusak akal sehat, baik berupa minuman beralkohol, narkotika, maupun zat adiktif terlarang.',
    dangerAndConsequence:
      'Dikenal sebagai "Ummul Khabaits" (Induk Segala Keburukan). Shalat tidak diterima selama 40 hari dan dilaknat penjual, pembeli, serta peminumnya.',
    dalil: {
      arabic: 'كُلُّ مُسْكِرٍ خَمْرٌ وَكُلُّ مُسْكِرٍ حَرَامٌ',
      translation: 'Setiap yang memabukkan adalah khamr, dan setiap khamr adalah haram.',
      reference: 'HR. Muslim no. 2003 & Kitab Al-Kaba\'ir no. 14',
    },
    salafWarning: {
      scholar: 'Utsman bin Affan radhiyallahu \'anhu',
      quote:
        'Jauhilah khamr! Demi Allah, sungguh keimanan dan kebiasaan meminum khamr tidak akan pernah berkumpul di dada seseorang melainkan salah satunya pasti akan mengusir yang lain.',
      book: 'Sunan An-Nasa\'i no. 5666',
    },
    taubatGuidance:
      'Membuang seluruh persediaan minuman/zat terlarang, memutus hubungan dengan teman pemabuk, mencari pertolongan medis jika ada ketergantungan fisik, dan mengisi jiwa dengan munajat di sepertiga malam.',
  },
  {
    id: 'dosa-merusak-diri-bunuh-diri',
    kabairNumber: 29,
    category: 'raga_kehormatan',
    categoryLabel: '💔 Kehormatan & Raga',
    title: 'Membunuh Diri Sendiri & Meracuni Raga',
    arabicTitle: 'قَتْلُ النَّفْسِ بِغَيْرِ حَقٍّ',
    definition:
      'Mengakhiri hidup dengan sengaja atau merusak kesehatan tubuh dengan zat-zat beracun mematikan (termasuk rokok berkepanjangan) karena putus asa.',
    dangerAndConsequence:
      'Pelakunya diancam akan disiksa di neraka dengan cara dan alat yang sama yang ia gunakan untuk membunuh dirinya di dunia secara berulang-ulang.',
    dalil: {
      arabic: 'وَلَا تَقْتُلُوا أَنْفُسَكُمْ ۚ إِنَّ اللَّهَ كَانَ بِكُمْ رَحِيمًا',
      translation:
        'Dan janganlah kamu membunuh dirimu; sesungguhnya Allah adalah Maha Penyayang kepadamu.',
      reference: 'QS. An-Nisa: 29 & Kitab Al-Kaba\'ir no. 29',
    },
    salafWarning: {
      scholar: 'Imam Al-Qurthubi',
      quote:
        'Ayat ini mencakup larangan membunuh diri sendiri secara langsung, maupun melakukan perbuatan membahayakan yang mengantarkan raga pada kebinasaan perlahan tanpa alasan syar’i.',
      book: 'Al-Jami\' li Ahkamil Qur\'an',
    },
    taubatGuidance:
      'Sadarilah bahwa raga ini bukan milik pribadi melainkan amanah Allah. Jika ada pikiran menyakiti diri, segera cari bantuan terdekat (layanan SEJIWA 119 ext. 8) dan bentengi diri dengan dzikir perlindungan.',
  },

  // KELOMPOK 3: KELUARGA & SILATURAHIM
  {
    id: 'dosa-durhaka-orang-tua',
    kabairNumber: 8,
    category: 'keluarga',
    categoryLabel: '👨‍👩‍👧 Keluarga & Kerabat',
    title: 'Durhaka kepada Kedua Orang Tua (Uququl Walidain)',
    arabicTitle: 'عُقُوقُ الْوَالِدَيْنِ',
    definition:
      'Menyakiti hati kedua orang tua melalui ucapan kasar (seperti membentak atau berkata "ah"), menelantarkan mereka di usia senja, atau tidak mematuhi mereka dalam kebaikan.',
    dangerAndConsequence:
      'Dosa yang sanksi hukumannya disegerakan oleh Allah di dunia sebelum azab di akhirat. Ridha Allah bergantung pada ridha orang tua, dan murka Allah ada pada murka orang tua.',
    dalil: {
      arabic: 'أَلَا أُنَبِّئُكُمْ بِأَكْبَرِ الْكَبَائِرِ؟ قَالُوا: بَلَى يَا رَسُولَ اللَّهِ، قَالَ: الإِشْرَاكُ بِاللَّهِ، وَعُقُوقُ الْوَالِدَيْنِ',
      translation:
        'Maukah aku beritahukan kepada kalian tentang dosa yang paling besar di antara dosa-dosa besar? Yaitu: Syirik kepada Allah dan durhaka kepada kedua orang tua.',
      reference: 'HR. Bukhari no. 5976 & Kitab Al-Kaba\'ir no. 8',
    },
    salafWarning: {
      scholar: 'Imam Adz-Dzahabi',
      quote:
        'Di antara bentuk durhaka adalah seseorang membuat ibu atau ayahnya menangis bersedih karena perbuatan maksiat yang dilakukannya di luar rumah.',
      book: 'Kitab Al-Kaba\'ir',
    },
    taubatGuidance:
      'Mendatangi orang tua, mencium tangan dan kaki mereka, memohon maaf dengan tulus, dan berbakti semampunya. Jika mereka sudah wafat, doakan mereka dalam setiap sujud dan sedekahkan amal atas nama mereka.',
  },

  // KELOMPOK 4: HARTA & MUAMALAH
  {
    id: 'dosa-memakan-riba',
    kabairNumber: 12,
    category: 'harta',
    categoryLabel: '💰 Harta & Hak Manusia',
    title: 'Memakan & Bertransaksi dengan Harta Riba',
    arabicTitle: 'أَكْلُ الرِّبَا وَالتَّعَامُلُ بِهِ',
    definition:
      'Mengambil keuntungan tambahan tanpa transaksi riil melalui pinjaman berbunga atau transaksi keuangan ribawi yang dilarang syariat.',
    dangerAndConsequence:
      'Diumumkan perang secara langsung oleh Allah dan Rasul-Nya. Orang yang memakan riba kelak dibangkitkan dari kubur dalam keadaan sempoyongan seperti orang kesurupan setan.',
    dalil: {
      arabic: 'فَإِنْ لَمْ تَفْعَلُوا فَأْذَنُوا بِحَرْبٍ مِنَ اللَّهِ وَرَسُولِهِ',
      translation:
        'Maka jika kamu tidak mengerjakan (meninggalkan sisa riba), maka ketahuilah, bahwa Allah dan Rasul-Nya akan memerangimu.',
      reference: 'QS. Al-Baqarah: 279 & Kitab Al-Kaba\'ir no. 12',
    },
    salafWarning: {
      scholar: 'Ibnu Abbas radhiyallahu \'anhuma',
      quote:
        'Akan dikatakan kepada pemakan riba pada hari Kiamat: "Ambillah senjatamu dan bersiaplah berperang melawan Allah!"',
      book: 'Tafsir Ibnu Jarir Ath-Thabari',
    },
    taubatGuidance:
      'Keluar dari transaksi ribawi, melunasi pokok hutang secepatnya, menyalurkan bunga riba ke fasilitas umum tanpa mengharap pahala sedekah, dan beralih ke muamalah syar’i.',
  },

  // KELOMPOK 5: LISAN & SOSIAL
  {
    id: 'dosa-ghibah-dan-namimah',
    kabairNumber: 36,
    category: 'lisan_sosial',
    categoryLabel: '🗣️ Lisan & Sosial',
    title: 'Ghibah (Menggunjing) & Namimah (Adu Domba)',
    arabicTitle: 'الْغِيبَةُ وَالنَّمِيمَةُ',
    definition:
      'Ghibah adalah membicarakan hal tentang saudaramu yang ia benci jika mendengarnya. Namimah adalah menyebarkan omongan orang lain untuk memecah belah hubungan.',
    dangerAndConsequence:
      'Diumpamakan seperti memakan bangkai daging saudara sendiri yang sudah mati. Namimah adalah salah satu sebab utama azab kubur yang pedih.',
    dalil: {
      arabic: 'وَلَا يَغْتَبْ بَعْضُكُمْ بَعْضًا ۚ أَيُحِبُّ أَحَدُكُمْ أَنْ يَأْكُلَ لَحْمَ أَخِيهِ مَيْتًا فَكَرِهْتُمُوهُ',
      translation:
        'Dan janganlah sebahagian kamu menggunjing sebahagian yang lain. Sukakah salah seorang di antara kamu memakan daging saudaranya yang sudah mati? Maka tentulah kamu merasa jijik kepadanya.',
      reference: 'QS. Al-Hujurat: 12 & Kitab Al-Kaba\'ir no. 36',
    },
    salafWarning: {
      scholar: 'Hasan Al-Bashri',
      quote:
        'Demi Allah, sungguh ghibah itu lebih cepat menggerogoti dan menghabiskan pahala amal kebaikan seorang mukmin daripada penyakit kusta menggerogoti tubuh.',
      book: 'Jami\' al-\'Ulum wal-Hikam',
    },
    taubatGuidance:
      'Menahan lisan dan jari jemari di media sosial, segera menghentikan obrolan jika ada yang mulai membicarakan orang lain, mendoakan kebaikan bagi orang yang pernah dighibahi, dan meminta maaf jika tidak menimbulkan mafsadat yang lebih besar.',
  },
];
