import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { THEME } from '../constants/theme';

interface PauseModalProps {
  visible: boolean;
  onClose: () => void;
  onRelapse: () => void;
  onSuccessResist: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  visible,
  onClose,
  onRelapse,
  onSuccessResist,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(180);
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [step3Done, setStep3Done] = useState(false);
  const [showCrisisHelp, setShowCrisisHelp] = useState(false);

  useEffect(() => {
    let timer: any = null;
    if (visible) {
      setSecondsLeft(180);
      setStep1Done(false);
      setStep2Done(false);
      setStep3Done(false);
      setShowCrisisHelp(false);

      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      timer = setInterval(() => {
        setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [visible]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleResistSuccess = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    onSuccessResist();
  };

  const handleOpenCrisisDialog = () => {
    Alert.alert(
      'Bantuan & Ruang Aman',
      'Rasa sakit dan berat yang Anda rasakan saat ini nyata, dan Anda tidak sendirian.\n\nNamun ingatlah, mengakhiri hidup atau menyakiti diri bukanlah jalan keluar dan bukan jalan menuju rahmat Allah yang Maha Pengasih.\n\nJika Anda membutuhkan teman bicara darurat, Anda dapat menghubungi Layanan Konseling SEJIWA di nomor 119 ext. 8 (Bebas Pulsa) atau layanan darurat 112, serta berbicaralah dengan orang terdekat atau asatidzah terpercaya di sekitar Anda.',
      [{ text: 'Saya Mengerti, Terima Kasih', style: 'default' }]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header Bar yang Menenangkan */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>🌿</Text>
              </View>
              <View>
                <Text style={styles.headerTitle}>JEDA SEJENAK (AS-SAKINAH)</Text>
                <Text style={styles.headerSubtitle}>Tarik napas perlahan. Beri waktu hatimu untuk hening.</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Ayat Pengingat Berwibawa & Lembut */}
            <View style={styles.ayatCard}>
              <Text style={styles.arabicText}>
                إِنَّ الَّذِينَ اتَّقَوْا إِذَا مَسَّهُمْ طَائِفٌ مِنَ الشَّيْطَانِ تَذَكَّرُوا فَإِذَا هُمْ مُبْصِرُونَ
              </Text>
              <Text style={styles.translationText}>
                "Sesungguhnya orang-orang yang bertakwa bila mereka ditimpa was-was dari setan, mereka ingat kepada Allah, maka ketika itu juga mereka melihat (kesalahan-kesalahannya)."
              </Text>
              <Text style={styles.referenceText}>— QS. Al-A'raf: 201</Text>
            </View>

            {/* Timer Jeda (Penenang Jiwa) */}
            <View style={styles.timerCard}>
              <Text style={styles.timerLabel}>BERI JEDA UNTUK JIWAMU</Text>
              <Text style={styles.timerValue}>{formatTime(secondsLeft)}</Text>
              <Text style={styles.timerNote}>
                Dorongan syahwat atau kegelisahan biasanya memuncak hanya 3 menit. Jika engkau menahannya sekarang dengan perlindungan Allah, gelombang itu akan mereda.
              </Text>
            </View>

            {/* 3 Langkah Nyata */}
            <Text style={styles.sectionHeader}>3 LANGKAH KECIL SAAT INI:</Text>

            <TouchableOpacity
              style={[styles.stepItem, step1Done && styles.stepItemActive]}
              onPress={() => {
                setStep1Done(!step1Done);
                if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.stepCheckbox}>{step1Done ? '☑' : '☐'}</Text>
              <View style={styles.stepTextContainer}>
                <Text style={styles.stepTitle}>1. Bangkit & Basuh Wajah dengan Air Dingin</Text>
                <Text style={styles.stepDesc}>Lepaskan posisi duduk atau berbaring. Ambil air wudhu untuk memadamkan hawa panas di dada.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.stepItem, step2Done && styles.stepItemActive]}
              onPress={() => {
                setStep2Done(!step2Done);
                if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.stepCheckbox}>{step2Done ? '☑' : '☐'}</Text>
              <View style={styles.stepTextContainer}>
                <Text style={styles.stepTitle}>2. Pindah Ruangan & Letakkan Gawai</Text>
                <Text style={styles.stepDesc}>Buka pintu kamar atau berjalan ke tempat terbuka. Jangan berdiam sendirian di ruang tertutup.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.stepItem, step3Done && styles.stepItemActive]}
              onPress={() => {
                setStep3Done(!step3Done);
                if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.stepCheckbox}>{step3Done ? '☑' : '☐'}</Text>
              <View style={styles.stepTextContainer}>
                <Text style={styles.stepTitle}>3. Lirihkan Isti'adzah & Istighfar</Text>
                <Text style={styles.stepDesc}>"A'ūdzu billāhi minasy-syaithānir-rajīm. Rabbi innī zhalamtu nafsī faghfir lī."</Text>
              </View>
            </TouchableOpacity>

            {/* Tombol Perlindungan Krisis / Bantuan */}
            <TouchableOpacity
              style={styles.crisisBtn}
              onPress={handleOpenCrisisDialog}
              activeOpacity={0.7}
            >
              <Text style={styles.crisisBtnText}>
                🤍 Sedang merasa sangat hampa, putus asa, atau ingin menyakiti diri?
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.footerActions}>
            <TouchableOpacity
              style={styles.successBtn}
              onPress={handleResistSuccess}
              activeOpacity={0.8}
            >
              <Text style={styles.successBtnText}>✓ Alhamdulillah, Hati Mulai Tenang</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.relapseBtn}
              onPress={onRelapse}
              activeOpacity={0.8}
            >
              <Text style={styles.relapseBtnText}>
                Saya Sedang Khilaf / Butuh Memulai Taubat Baru
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.md,
  },
  container: {
    width: '100%',
    maxHeight: '92%',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    borderWidth: 1.5,
    borderColor: THEME.colors.goldMuted,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: THEME.colors.surfaceLighter,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: THEME.colors.goldMuted,
  },
  iconText: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.gold,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 8,
  },
  closeText: {
    color: THEME.colors.textTertiary,
    fontSize: 18,
  },
  scrollContent: {
    padding: THEME.spacing.md,
  },
  ayatCard: {
    backgroundColor: THEME.colors.surfaceLighter,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
  },
  arabicText: {
    fontSize: 18,
    color: THEME.colors.gold,
    textAlign: 'right',
    fontWeight: '700',
    lineHeight: 28,
    marginBottom: 6,
  },
  translationText: {
    fontSize: 12,
    color: THEME.colors.textPrimary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  referenceText: {
    fontSize: 10,
    color: THEME.colors.textTertiary,
    marginTop: 4,
  },
  timerCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    marginBottom: THEME.spacing.md,
  },
  timerLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.emerald,
    letterSpacing: 1,
  },
  timerValue: {
    fontSize: 40,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
    marginVertical: 2,
    letterSpacing: 2,
  },
  timerNote: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.colors.textTertiary,
    letterSpacing: 0.5,
    marginBottom: THEME.spacing.sm,
  },
  stepItem: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surfaceLighter,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.sm,
    alignItems: 'flex-start',
  },
  stepItemActive: {
    borderColor: THEME.colors.emerald,
    backgroundColor: THEME.colors.emeraldGlow,
  },
  stepCheckbox: {
    fontSize: 20,
    color: THEME.colors.emerald,
    marginRight: THEME.spacing.sm,
    marginTop: -2,
  },
  stepTextContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    lineHeight: 15,
  },
  crisisBtn: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginVertical: THEME.spacing.xs,
  },
  crisisBtnText: {
    fontSize: 11,
    color: THEME.colors.textTertiary,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  footerActions: {
    padding: THEME.spacing.md,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    gap: 8,
  },
  successBtn: {
    backgroundColor: THEME.colors.emerald,
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
  },
  successBtnText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 13,
  },
  relapseBtn: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    alignItems: 'center',
  },
  relapseBtnText: {
    color: THEME.colors.textTertiary,
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});
