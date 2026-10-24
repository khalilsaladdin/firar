import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { THEME } from '../constants/theme';
import { HABIT_OPTIONS } from '../constants/habits';
import { HabitId } from '../types';

interface OnboardingScreenProps {
  onComplete: (habits: HabitId[], age: number, commitment?: string) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [screenIndex, setScreenIndex] = useState<number>(1);
  const [selectedHabits, setSelectedHabits] = useState<HabitId[]>([]);
  const [selectedCommitmentIndex, setSelectedCommitmentIndex] = useState<number>(0);
  const [showSayyidulIstighfar, setShowSayyidulIstighfar] = useState<boolean>(false);

  const commitmentOptions = [
    'Hari ini saya akan menjauhkan diri dari sumber maksiat sejauh yang saya mampu.',
    'Hari ini saya akan menunaikan shalat tepat waktu, dimulai dari shalat fardhu terdekat.',
    'Hari ini saya akan menutup celah maksiat dengan istighfar 100 kali dan membaca satu halaman Al-Qur’an.',
  ];

  const triggerHaptic = (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(style);
    }
  };

  const toggleHabit = (id: HabitId) => {
    triggerHaptic();
    if (id === 'not_sure') {
      // Jika memilih opsi "belum yakin", jadikan opsi tunggal agar hati tenang
      setSelectedHabits(['not_sure']);
      return;
    }

    const filtered = selectedHabits.filter((h) => h !== 'not_sure');
    if (filtered.includes(id)) {
      setSelectedHabits(filtered.filter((h) => h !== id));
    } else {
      setSelectedHabits([...filtered, id]);
    }
  };

  const handleFinishOnboarding = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    const chosenCommitment = commitmentOptions[selectedCommitmentIndex];
    onComplete(selectedHabits, 25, chosenCommitment);
  };

  const handleLearnCohort = () => {
    Alert.alert(
      'Tentang Kelas Bimbingan Tazkiyah',
      'Halaqah Firar adalah pembinaan bertahap 30 hari berlandaskan Kitab Al-Jawab Al-Kafi (Ibnul Qayyim) dan Madarijus Salikin. Dipandu langsung oleh asatidzah berkompeten dengan ukhuwah tertutup (ikhwan dan akhwat terpisah).\n\nTidak ada biaya tersembunyi. Jika Anda dalam kesulitan, tersedia beasiswa penuh.\n\nApakah Anda ingin didaftarkan ke daftar antrean pembukaan angkatan pertama?',
      [
        { text: 'Nanti Dulu', style: 'cancel' },
        {
          text: 'Bismillah, Daftarkan Saya',
          onPress: () => {
            Alert.alert(
              'Jazakumullahu Khairan',
              'Nama Anda telah dimasukkan ke daftar antrean. Sekarang, mari kita mulai langkah pertama melalui panduan harian Firar.'
            );
            handleFinishOnboarding();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header Bar */}
        <View style={styles.header}>
          <Text style={styles.appName}>FIRAR • فِرَار</Text>
          <View style={styles.progressDots}>
            {[1, 2, 3, 4, 5].map((idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  screenIndex === idx && styles.dotActive,
                  screenIndex > idx && styles.dotCompleted,
                ]}
              />
            ))}
          </View>
        </View>

        {/* ============================================================== */}
        {/* SCREEN 1: THE MIRROR (Diagnosis Diri & Pengakuan Hati)        */}
        {/* ============================================================== */}
        {screenIndex === 1 && (
          <View style={styles.flexOne}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
              <Text style={styles.screenGreeting}>Assalamu’alaikum.</Text>
              <Text style={styles.screenHeading}>Sebelum kita melangkah, mari kita jujur sejenak, hanya kepada diri sendiri.</Text>
              <Text style={styles.screenSubtext}>
                Apa kebiasaan yang selama ini ingin Anda lepaskan, tetapi terasa berat? Pilih yang paling dekat dengan hati Anda. Boleh lebih dari satu.
              </Text>

              <View style={styles.habitList}>
                {HABIT_OPTIONS.map((habit) => {
                  const isSelected = selectedHabits.includes(habit.id);
                  return (
                    <TouchableOpacity
                      key={habit.id}
                      style={[styles.habitCard, isSelected && styles.habitCardSelected]}
                      onPress={() => toggleHabit(habit.id)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.habitCardTop}>
                        <Text style={[styles.habitLabel, isSelected && styles.textGold]}>
                          {habit.label}
                        </Text>
                        <Text style={styles.habitArabic}>{habit.arabicLabel}</Text>
                      </View>
                      <Text style={styles.habitDesc}>{habit.description}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Dalil Penguat Al-Qiyamah: 14 */}
              <View style={styles.dalilContainer}>
                <Text style={styles.dalilArabic}>بَلِ الْإِنْسَانُ عَلَىٰ نَفْسِهِ بَصِيرَةٌ</Text>
                <Text style={styles.dalilTranslation}>
                  "Bahkan manusia itu menjadi saksi atas dirinya sendiri."
                </Text>
                <Text style={styles.dalilRef}>— QS. Al-Qiyamah: 14</Text>
              </View>

              <Text style={styles.microcopy}>
                🔒 Pilihan ini hanya tersimpan di perangkat Anda dan tidak ditampilkan kepada siapa pun.
              </Text>
            </ScrollView>

            <View style={styles.footerBar}>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  selectedHabits.length === 0 && styles.buttonDisabled,
                ]}
                disabled={selectedHabits.length === 0}
                onPress={() => {
                  triggerHaptic();
                  setScreenIndex(2);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Lanjutkan dengan Jujur ›</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ============================================================== */}
        {/* SCREEN 2: MEMENTO MORI (Tazkirul Maut dengan Martabat)        */}
        {/* ============================================================== */}
        {screenIndex === 2 && (
          <View style={styles.flexOne}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
              <Text style={styles.mementoHeading}>
                Pernahkah Anda memperhitungkan berapa banyak hari yang tersisa?
              </Text>

              <View style={styles.mementoCard}>
                <Text style={styles.mementoParagraph}>
                  Dunia ini singkat. Hari-hari berlalu tanpa perlu izin kita. Nafas yang kita hirup hari ini adalah pinjaman, dan Allah bisa mengambilnya kapan saja, tanpa pemberitahuan dan tanpa janji.
                </Text>

                <Text style={styles.mementoParagraph}>
                  Rasulullah ﷺ mengingatkan kita untuk memperbanyak mengingat pemutus kelezatan, yaitu kematian. Ia datang kepada orang yang sedang sibuk dengan dunianya, dan kepada orang yang sedang menikmati dosanya.
                </Text>

                <View style={styles.haditsCallout}>
                  <Text style={styles.haditsCalloutText}>
                    "Tidak akan bergeser kedua kaki anak Adam pada hari kiamat sampai ia ditanya tentang umurnya untuk apa dihabiskan, tentang masa mudanya untuk apa dipakai, tentang hartanya dari mana didapat dan ke mana dibelanjakan, serta tentang ilmunya apa yang diamalkan."
                  </Text>
                  <Text style={styles.haditsCalloutRef}>— HR. At-Tirmidzi</Text>
                </View>

                <Text style={styles.mementoParagraph}>
                  Lalu kita akan berdiri sendiri di Padang Mahsyar. Tidak ada teman yang bisa menggantikan, tidak ada gawai yang bisa menjadi perisai.
                </Text>

                <Text style={styles.mementoParagraphHighlighted}>
                  Namun ingatlah: yang membuat kita gentar bukan hanya hisab, tetapi juga kesadaran bahwa kita masih punya waktu untuk bersiap dan kembali.
                </Text>
              </View>

              <Text style={styles.microcopyTransisi}>
                Ingat, khauf (rasa takut) ini adalah pintu pulang, bukan jurang keputusasaan.
              </Text>
            </ScrollView>

            <View style={styles.footerBar}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                  triggerHaptic();
                  setScreenIndex(3);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Saya Siap Melanjutkan ›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {
                  triggerHaptic();
                  setScreenIndex(1);
                }}
              >
                <Text style={styles.secondaryButtonText}>Kembali ke Diagnosis Diri</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ============================================================== */}
        {/* SCREEN 3: THE HOPE (Pintu Taubat Selalu Terbuka)               */}
        {/* ============================================================== */}
        {screenIndex === 3 && (
          <View style={styles.flexOne}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
              <Text style={styles.hopeHeading}>
                Jika Anda sudah sampai di sini, ada satu hal yang ingin kami sampaikan dengan sepenuh hati.
              </Text>

              <Text style={styles.screenSubtext}>
                Allah ﷻ berfirman dengan lembut kepada hamba-hamba-Nya yang merasa telah jauh:
              </Text>

              {/* Ayat Rahmat Utama: QS. Az-Zumar: 53 */}
              <View style={styles.hopeAyatBox}>
                <Text style={styles.hopeAyatArabic}>
                  قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنْفُسِهِمْ لَا تَقْنَطُوا مِنْ رَحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا ۚ إِنَّهُ هُوَ الْغَفُورُ الرَّحِيمُ
                </Text>
                <Text style={styles.hopeAyatTranslation}>
                  "Katakanlah: 'Wahai hamba-hamba-Ku yang melampaui batas terhadap diri mereka sendiri, janganlah kamu berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni dosa-dosa semuanya. Sungguh, Dialah Yang Maha Pengampun lagi Maha Penyayang.'"
                </Text>
                <Text style={styles.hopeAyatRef}>— QS. Az-Zumar: 53</Text>
              </View>

              <View style={styles.salafAffirmation}>
                <Text style={styles.affirmationHeading}>Allah Tidak Menanyakan Seberapa Sering Kita Jatuh</Text>
                <Text style={styles.affirmationBody}>
                  Yang Dia lihat adalah seberapa sering kita bangkit dan kembali. Rasulullah ﷺ bersabda:
                </Text>
                <Text style={styles.affirmationQuote}>
                  "Setiap anak Adam itu banyak berbuat salah, dan sebaik-baik yang berbuat salah adalah yang bertaubat."
                  {'\n'}<Text style={{ fontSize: 11, color: THEME.colors.textTertiary }}>— HR. Tirmidzi & Ibnu Majah (Hasan)</Text>
                </Text>
                <Text style={styles.affirmationBody}>
                  Dan dalam sebuah hadits qudsi yang menenangkan jiwa, Allah berfirman:
                </Text>
                <Text style={styles.affirmationQuote}>
                  "Wahai anak Adam, selama engkau berdoa kepada-Ku dan berharap kepada-Ku, Aku ampuni dosamu sesuai keadaanmu, dan Aku tidak peduli seberapa banyak dosamu..."
                  {'\n'}<Text style={{ fontSize: 11, color: THEME.colors.textTertiary }}>— HR. Tirmidzi (Hasan)</Text>
                </Text>
                <Text style={[styles.affirmationBody, { color: THEME.colors.gold, fontWeight: '700', marginTop: 8 }]}>
                  Pintu ini tidak tertutup. Hanya kita yang perlu melangkah.
                </Text>
              </View>

              <Text style={styles.microcopy}>
                Taubat tidak menunggu kesempurnaan. Ia dimulai dari satu niat tulus hari ini.
              </Text>
            </ScrollView>

            <View style={styles.footerBar}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                  triggerHaptic();
                  setScreenIndex(4);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Saya Ingin Kembali ›</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ============================================================== */}
        {/* SCREEN 4: THE COMMITMENT (Janji Istiqamah Langkah Nyata Hari Ini)*/}
        {/* ============================================================== */}
        {screenIndex === 4 && (
          <View style={styles.flexOne}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
              <Text style={styles.commitHeading}>
                Taubat yang paling dicintai Allah adalah yang dilakukan dengan langkah nyata, sekecil apa pun.
              </Text>
              <Text style={styles.commitSubheading}>
                Mari kita mulai dengan satu hal. Bukan seluruh hidup, cukup hari ini.
              </Text>

              <Text style={styles.fieldLabel}>PILIH SATU NIAT UNTUK HARI INI:</Text>

              {commitmentOptions.map((opt, i) => {
                const isSelected = selectedCommitmentIndex === i;
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.commitOptionCard, isSelected && styles.commitOptionSelected]}
                    onPress={() => {
                      triggerHaptic();
                      setSelectedCommitmentIndex(i);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.radioIndicator}>{isSelected ? '◉' : '○'}</Text>
                    <Text style={[styles.commitOptionText, isSelected && { color: THEME.colors.textPrimary }]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {/* Doa Taubat Harian */}
              <View style={styles.prayerCard}>
                <Text style={styles.prayerTitle}>Doa Menyerahkan Hati:</Text>
                <Text style={styles.prayerText}>
                  "Ya Allah, aku memohon ampun kepada-Mu dan aku bertaubat kepada-Mu. Aku tahu hatiku sering lalai dan langkahku sering goyah. Maka bimbinglah aku, kuatkanlah aku, dan jangan Engkau biarkan aku bergantung kepada diriku sendiri walau sekejap mata."
                </Text>
              </View>

              {/* Tombol Toggle Sayyidul Istighfar */}
              <TouchableOpacity
                style={styles.istighfarToggle}
                onPress={() => {
                  triggerHaptic();
                  setShowSayyidulIstighfar(!showSayyidulIstighfar);
                }}
              >
                <Text style={styles.istighfarToggleText}>
                  {showSayyidulIstighfar ? '▲ Tutup Sayyidul Istighfar' : '▼ Baca Sayyidul Istighfar (Doa Utama Taubat)'}
                </Text>
              </TouchableOpacity>

              {showSayyidulIstighfar && (
                <View style={styles.istighfarBox}>
                  <Text style={styles.istighfarArabic}>
                    اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي، فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ
                  </Text>
                  <Text style={styles.istighfarTranslation}>
                    "Ya Allah, Engkau adalah Rabb-ku, tidak ada ilah yang berhak disembah selain Engkau. Engkau yang menciptakan aku dan aku adalah hamba-Mu. Aku memegang perjanjian dan janji-Mu semampuku. Aku berlindung kepada-Mu dari keburukan apa yang kuperbuat. Aku mengakui nikmat-Mu kepadaku dan aku mengakui dosaku, maka ampunilah aku. Karena sesungguhnya tidak ada yang mengampuni dosa selain Engkau."
                  </Text>
                  <Text style={styles.istighfarRef}>— HR. Bukhari no. 6306</Text>
                </View>
              )}

              <Text style={styles.microcopy}>
                Alhamdulillah. Langkah pertama sudah diambil. Allah melihat niat tulus itu.
              </Text>
            </ScrollView>

            <View style={styles.footerBar}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                  triggerHaptic();
                  setScreenIndex(5);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Saya Berniat Hari Ini ›</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ============================================================== */}
        {/* SCREEN 5: THE INVITATION (Mukadimah Kelas Tazkiyah)           */}
        {/* ============================================================== */}
        {screenIndex === 5 && (
          <View style={styles.flexOne}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
              <Text style={styles.invitationHeading}>
                Anda sudah mengambil langkah pertama. Itu luar biasa, dan Allah melihatnya.
              </Text>

              <Text style={styles.invitationBody}>
                Namun kita semua tahu, hati yang lama lalai tidak cukup disembuhkan dengan niat sesaat. Ia butuh pembinaan, lingkungan yang menguatkan, dan orang yang membimbing dengan ilmu.
              </Text>

              <Text style={styles.invitationBody}>
                Para ulama salaf mengajarkan bahwa <Text style={{ color: THEME.colors.gold, fontWeight: '700' }}>tazkiyatun nufus</Text> (pembersihan jiwa) adalah perjalanan bersama: dengan Al-Qur’an dan Sunnah, dengan ilmu yang bersumber dari ulama, dan dengan saudara seperjuangan.
              </Text>

              <View style={styles.cohortFeatureBox}>
                <Text style={styles.cohortFeatureTitle}>PROGRAM BIMBINGAN TAZKIYAH TERSTRUKTUR:</Text>

                <View style={styles.featureRow}>
                  <Text style={styles.featureIcon}>📖</Text>
                  <View style={styles.featureTextWrap}>
                    <Text style={styles.featureHeading}>Materi Bertahap Berbasis Dalil</Text>
                    <Text style={styles.featureSub}>Bersumber dari Al-Qur'an, Hadits Shahih, dan Kitab Ulama Salaf.</Text>
                  </View>
                </View>

                <View style={styles.featureRow}>
                  <Text style={styles.featureIcon}>🌱</Text>
                  <View style={styles.featureTextWrap}>
                    <Text style={styles.featureHeading}>Pendampingan Asatidzah</Text>
                    <Text style={styles.featureSub}>Bimbingan dari pembimbing yang memahami tantangan dan fitnah zaman ini.</Text>
                  </View>
                </View>

                <View style={styles.featureRow}>
                  <Text style={styles.featureIcon}>🤝</Text>
                  <View style={styles.featureTextWrap}>
                    <Text style={styles.featureHeading}>Ukhuwah & Sahabat Shalih</Text>
                    <Text style={styles.featureSub}>Komunitas tertutup (terpisah ikhwan/akhwat) yang saling menjaga tanpa penghakiman.</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.invitationNote}>
                Anda tidak harus siap sekarang. Cukup mulai dari yang paling Anda butuhkan.
              </Text>
            </ScrollView>

            <View style={styles.footerBar}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleLearnCohort}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Pelajari Kelas Bimbingan Tazkiyah ›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleFinishOnboarding}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>Mulai dengan Panduan Harian Firar ›</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: THEME.colors.background,
  },
  container: {
    flex: 1,
  },
  flexOne: {
    flex: 1,
  },
  scrollPadding: {
    paddingHorizontal: THEME.spacing.md,
    paddingBottom: THEME.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  appName: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.gold,
    letterSpacing: 1.5,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.colors.surfaceLighter,
  },
  dotActive: {
    width: 18,
    backgroundColor: THEME.colors.gold,
  },
  dotCompleted: {
    backgroundColor: THEME.colors.emerald,
  },
  screenGreeting: {
    fontSize: 16,
    color: THEME.colors.gold,
    fontWeight: '700',
    marginTop: THEME.spacing.md,
    marginBottom: 4,
  },
  screenHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    lineHeight: 26,
    marginBottom: 8,
  },
  screenSubtext: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    lineHeight: 20,
    marginBottom: THEME.spacing.md,
  },
  habitList: {
    marginBottom: THEME.spacing.md,
  },
  habitCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.sm,
  },
  habitCardSelected: {
    borderColor: THEME.colors.gold,
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
  },
  habitCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  habitLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    flex: 1,
    paddingRight: 8,
  },
  habitArabic: {
    fontSize: 12,
    color: THEME.colors.textTertiary,
  },
  habitDesc: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    lineHeight: 16,
  },
  dalilContainer: {
    backgroundColor: THEME.colors.surfaceLighter,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: THEME.colors.gold,
    marginVertical: THEME.spacing.sm,
  },
  dalilArabic: {
    fontSize: 18,
    color: THEME.colors.gold,
    textAlign: 'right',
    fontWeight: '700',
    marginBottom: 4,
  },
  dalilTranslation: {
    fontSize: 12,
    color: THEME.colors.textPrimary,
    fontStyle: 'italic',
  },
  dalilRef: {
    fontSize: 10,
    color: THEME.colors.textTertiary,
    marginTop: 4,
  },
  microcopy: {
    fontSize: 11,
    color: THEME.colors.textTertiary,
    textAlign: 'center',
    marginVertical: THEME.spacing.sm,
    lineHeight: 16,
  },
  microcopyTransisi: {
    fontSize: 12,
    color: THEME.colors.gold,
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: THEME.spacing.sm,
  },
  footerBar: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    backgroundColor: THEME.colors.background,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: THEME.colors.gold,
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  buttonDisabled: {
    opacity: 0.35,
  },
  textGold: {
    color: THEME.colors.gold,
  },

  // Screen 2 Memento Mori styles
  mementoHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    lineHeight: 28,
    marginTop: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  mementoCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
  },
  mementoParagraph: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    lineHeight: 21,
    marginBottom: THEME.spacing.md,
  },
  mementoParagraphHighlighted: {
    fontSize: 13,
    color: THEME.colors.textPrimary,
    lineHeight: 21,
    fontWeight: '600',
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    padding: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.sm,
  },
  haditsCallout: {
    backgroundColor: THEME.colors.surfaceLighter,
    borderLeftWidth: 3,
    borderLeftColor: THEME.colors.gold,
    padding: THEME.spacing.md,
    marginVertical: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.sm,
  },
  haditsCalloutText: {
    fontSize: 12,
    color: THEME.colors.textPrimary,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  haditsCalloutRef: {
    fontSize: 10,
    color: THEME.colors.gold,
    marginTop: 6,
    fontWeight: '700',
  },

  // Screen 3 Hope styles
  hopeHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    lineHeight: 26,
    marginTop: THEME.spacing.md,
    marginBottom: 8,
  },
  hopeAyatBox: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.goldMuted,
    marginVertical: THEME.spacing.sm,
  },
  hopeAyatArabic: {
    fontSize: 18,
    color: THEME.colors.gold,
    textAlign: 'right',
    lineHeight: 30,
    fontWeight: '700',
    marginBottom: 8,
  },
  hopeAyatTranslation: {
    fontSize: 12,
    color: THEME.colors.textPrimary,
    lineHeight: 19,
    fontStyle: 'italic',
  },
  hopeAyatRef: {
    fontSize: 11,
    color: THEME.colors.gold,
    marginTop: 6,
    fontWeight: '700',
  },
  salafAffirmation: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginVertical: THEME.spacing.sm,
  },
  affirmationHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.colors.emerald,
    marginBottom: 6,
  },
  affirmationBody: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  affirmationQuote: {
    fontSize: 12,
    color: THEME.colors.textPrimary,
    fontStyle: 'italic',
    backgroundColor: THEME.colors.surfaceLighter,
    padding: 10,
    borderRadius: THEME.borderRadius.sm,
    marginVertical: 4,
    lineHeight: 18,
  },

  // Screen 4 Commitment styles
  commitHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    lineHeight: 26,
    marginTop: THEME.spacing.md,
    marginBottom: 6,
  },
  commitSubheading: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.md,
    lineHeight: 18,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.gold,
    letterSpacing: 1,
    marginBottom: THEME.spacing.sm,
  },
  commitOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.sm,
  },
  commitOptionSelected: {
    borderColor: THEME.colors.emerald,
    backgroundColor: THEME.colors.emeraldGlow,
  },
  radioIndicator: {
    fontSize: 18,
    color: THEME.colors.emerald,
    marginRight: 10,
  },
  commitOptionText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    flex: 1,
    lineHeight: 17,
  },
  prayerCard: {
    backgroundColor: THEME.colors.surfaceLighter,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: THEME.colors.gold,
    marginVertical: THEME.spacing.sm,
  },
  prayerTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.colors.gold,
    marginBottom: 4,
  },
  prayerText: {
    fontSize: 12,
    color: THEME.colors.textPrimary,
    fontStyle: 'italic',
    lineHeight: 19,
  },
  istighfarToggle: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  istighfarToggleText: {
    fontSize: 12,
    color: THEME.colors.gold,
    fontWeight: '700',
  },
  istighfarBox: {
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.sm,
  },
  istighfarArabic: {
    fontSize: 16,
    color: THEME.colors.gold,
    lineHeight: 28,
    textAlign: 'right',
    marginBottom: 8,
  },
  istighfarTranslation: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 17,
  },
  istighfarRef: {
    fontSize: 10,
    color: THEME.colors.textTertiary,
    marginTop: 4,
  },

  // Screen 5 Invitation styles
  invitationHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    lineHeight: 26,
    marginTop: THEME.spacing.md,
    marginBottom: 8,
  },
  invitationBody: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    lineHeight: 20,
    marginBottom: THEME.spacing.sm,
  },
  cohortFeatureBox: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.goldMuted,
    marginVertical: THEME.spacing.md,
  },
  cohortFeatureTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.gold,
    letterSpacing: 1,
    marginBottom: THEME.spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    marginBottom: THEME.spacing.md,
    alignItems: 'flex-start',
  },
  featureIcon: {
    fontSize: 22,
    marginRight: 12,
    marginTop: 2,
  },
  featureTextWrap: {
    flex: 1,
  },
  featureHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 2,
  },
  featureSub: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    lineHeight: 16,
  },
  invitationNote: {
    fontSize: 12,
    color: THEME.colors.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: THEME.spacing.sm,
  },
});
