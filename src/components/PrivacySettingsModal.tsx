import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { THEME } from '../constants/theme';
import { UserState } from '../types';
import { HABIT_OPTIONS } from '../constants/habits';

interface PrivacySettingsModalProps {
  visible: boolean;
  userState: UserState;
  onClose: () => void;
  onWipeData: () => void;
  onResetDiagnosis: () => void;
}

export const PrivacySettingsModal: React.FC<PrivacySettingsModalProps> = ({
  visible,
  userState,
  onClose,
  onWipeData,
  onResetDiagnosis,
}) => {
  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleConfirmWipe = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    Alert.alert(
      'Hapus Bersih Seluruh Data?',
      'Seluruh data muhasabah, catatan hari bersih, dan fokus penjagaan Anda akan dimusnahkan secara permanen dari perangkat ini.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Lanjutkan Hapus',
          style: 'destructive',
          onPress: () => {
            // Konfirmasi Ganda (Double Confirmation) sesuai Threat Model
            Alert.alert(
              'Konfirmasi Akhir',
              'Apakah Anda benar-benar yakin? Tindakan ini tidak dapat dibatalkan.',
              [
                { text: 'Batalkan', style: 'cancel' },
                {
                  text: 'Ya, Musnahkan Semua Data',
                  style: 'destructive',
                  onPress: () => {
                    onClose();
                    onWipeData();
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const activeHabitLabels = userState.selectedHabits
    .map((id) => HABIT_OPTIONS.find((h) => h.id === id)?.label)
    .filter(Boolean);

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerIcon}>🛡️</Text>
              <View>
                <Text style={styles.headerTitle}>PRIVASI & KEAMANAN AKUN</Text>
                <Text style={styles.headerSubtitle}>Kerahasiaan Aib & Kendali Penuh di Tangan Anda</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* 1. Status Penyimpanan Offline-First */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardBadge}>OFFLINE-FIRST</Text>
                <Text style={styles.verifiedDot}>✓ 100% Lokal di Ponsel</Text>
              </View>
              <Text style={styles.cardTitle}>Data Anda Tidak Pernah Dikirim ke Cloud</Text>
              <Text style={styles.cardDesc}>
                Setiap pilihan muhasabah dan catatan taubat Anda tersimpan terenkripsi di penyimpanan lokal perangkat ini. Kami tidak memiliki server yang mengumpulkan riwayat dosa Anda.
              </Text>
            </View>

            {/* 2. Standar Notifikasi Netral (Lock Screen Safeguard) */}
            <View style={styles.card}>
              <Text style={styles.cardBadge}>LAYAR KUNCI AMAN</Text>
              <Text style={styles.cardTitle}>Pengingat Netral Tanpa Membuka Aib</Text>
              <Text style={styles.cardDesc}>
                Jika notifikasi aktif, aplikasi hanya akan memunculkan kalimat umum yang sejuk agar tidak menimbulkan kecurigaan saat ponsel dilihat orang lain:
              </Text>
              <View style={styles.sampleNotification}>
                <Text style={styles.sampleNotifSender}>Firar • Pengingat Harian</Text>
                <Text style={styles.sampleNotifBody}>"Waktunya sejenak menyapa hatimu di hadapan Allah."</Text>
              </View>
              <Text style={styles.notifNote}>
                *Aplikasi tidak akan pernah menampilkan kata 'maksiat', 'pornografi', atau 'rokok' pada notifikasi.
              </Text>
            </View>

            {/* 3. Ringkasan Fokus Saat Ini */}
            <View style={styles.card}>
              <Text style={styles.cardBadge}>FOKUS PENJAGAAN</Text>
              <Text style={styles.cardTitle}>Kebiasaan yang Sedang Dijaga:</Text>
              <View style={styles.habitWrap}>
                {activeHabitLabels.map((lbl, idx) => (
                  <View key={idx} style={styles.habitPill}>
                    <Text style={styles.habitPillText}>• {lbl}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={styles.reDiagnoseBtn}
                onPress={() => {
                  triggerHaptic();
                  onClose();
                  onResetDiagnosis();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.reDiagnoseBtnText}>Ubah Pilihan Fokus Diagnosis ›</Text>
              </TouchableOpacity>
            </View>

            {/* 4. Danger Zone: Wipe All Data */}
            <View style={[styles.card, styles.dangerCard]}>
              <Text style={styles.dangerBadge}>ZONA KENDALI MUTLAK</Text>
              <Text style={styles.dangerTitle}>Hapus Bersih Seluruh Data (Wipe Data)</Text>
              <Text style={styles.dangerDesc}>
                Bila Anda ingin menghapus seluruh jejak riwayat hari bertahan dan catatan muhasabah dari ponsel ini, Anda dapat memusnahkannya secara instan.
              </Text>

              <TouchableOpacity
                style={styles.wipeButton}
                onPress={handleConfirmWipe}
                activeOpacity={0.8}
              >
                <Text style={styles.wipeButtonText}>🗑️ Hapus Bersih Seluruh Data Saya</Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: THEME.borderRadius.xl,
    borderTopRightRadius: THEME.borderRadius.xl,
    borderTopWidth: 1.5,
    borderTopColor: THEME.colors.goldMuted,
    maxHeight: '88%',
    paddingBottom: THEME.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  headerIcon: {
    fontSize: 22,
    marginRight: 10,
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
    padding: 6,
  },
  closeBtnText: {
    fontSize: 18,
    color: THEME.colors.textTertiary,
  },
  scrollArea: {
    padding: THEME.spacing.md,
  },
  card: {
    backgroundColor: THEME.colors.surfaceLighter,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: THEME.colors.gold,
    letterSpacing: 1,
  },
  verifiedDot: {
    fontSize: 10,
    color: THEME.colors.emerald,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
  },
  sampleNotification: {
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: THEME.colors.emerald,
    marginVertical: 8,
  },
  sampleNotifSender: {
    fontSize: 10,
    color: THEME.colors.emerald,
    fontWeight: '700',
    marginBottom: 2,
  },
  sampleNotifBody: {
    fontSize: 11,
    color: THEME.colors.textPrimary,
    fontStyle: 'italic',
  },
  notifNote: {
    fontSize: 10,
    color: THEME.colors.textTertiary,
    fontStyle: 'italic',
  },
  habitWrap: {
    marginVertical: 6,
    gap: 4,
  },
  habitPill: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.sm,
  },
  habitPillText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
  },
  reDiagnoseBtn: {
    marginTop: 8,
    paddingVertical: 6,
  },
  reDiagnoseBtnText: {
    fontSize: 11,
    color: THEME.colors.gold,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  dangerCard: {
    borderColor: 'rgba(239, 68, 68, 0.4)',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  dangerBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: THEME.colors.crimson,
    letterSpacing: 1,
    marginBottom: 4,
  },
  dangerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.crimson,
    marginBottom: 4,
  },
  dangerDesc: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    lineHeight: 16,
    marginBottom: THEME.spacing.sm,
  },
  wipeButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.crimson,
  },
  wipeButtonText: {
    color: THEME.colors.crimson,
    fontSize: 12,
    fontWeight: '800',
  },
});
