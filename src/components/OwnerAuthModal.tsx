import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { THEME } from '../constants/theme';
import { StorageService } from '../services/storage';
import { UserState } from '../types';

interface OwnerAuthModalProps {
  visible: boolean;
  isOwnerModeActive: boolean;
  onStateUpdate: (updated: UserState) => void;
  onClose: () => void;
}

export const OwnerAuthModal: React.FC<OwnerAuthModalProps> = ({
  visible,
  isOwnerModeActive,
  onStateUpdate,
  onClose,
}) => {
  const [pin, setPin] = useState<string>('');

  const triggerHaptic = (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(style);
    }
  };

  const handleSubmit = async () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    const result = await StorageService.toggleOwnerMode(pin.trim());
    if (result.success && result.updatedState) {
      onStateUpdate(result.updatedState);
      setPin('');
      onClose();
      Alert.alert('Sukses', result.message || 'Status Mode Pengelola diperbarui.');
    } else {
      Alert.alert('Gagal', result.message || 'PIN Pengelola salah.');
    }
  };

  const handleResetContent = () => {
    Alert.alert(
      'Reset Konten ke Bawaan?',
      'Seluruh teks dosa dan artikel yang pernah Anda edit akan dikembalikan ke teks standar bawaan awal.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Reset ke Standar',
          style: 'destructive',
          onPress: async () => {
            const updated = await StorageService.resetContentToDefault();
            onStateUpdate(updated);
            onClose();
            Alert.alert('Sukses', 'Seluruh konten telah direset ke teks standar awal.');
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.crownIcon}>👑</Text>
              <View>
                <Text style={styles.title}>MODE PENGELOLA (OWNER CMS)</Text>
                <Text style={styles.subtitle}>Edit & Kelola Teks Langsung di Web</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {isOwnerModeActive ? (
            <View style={styles.activeCard}>
              <Text style={styles.activeTitle}>✓ Mode Pengelola Saat Ini: AKTIF</Text>
              <Text style={styles.activeDesc}>
                Tombol Edit (✏️) dan Hapus (🗑️) sekarang muncul di setiap kartu Dosa Al-Kaba'ir dan Artikel Khazanah di halaman Beranda.
              </Text>

              <TouchableOpacity style={styles.deactivateBtn} onPress={handleSubmit} activeOpacity={0.8}>
                <Text style={styles.deactivateBtnText}>Nonaktifkan Mode Pengelola</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resetContentBtn}
                onPress={handleResetContent}
                activeOpacity={0.7}
              >
                <Text style={styles.resetContentBtnText}>↻ Kembalikan Semua Teks ke Standar Awal</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.loginCard}>
              <Text style={styles.loginPrompt}>
                Masukkan PIN Rahasia Pemilik untuk mengaktifkan tombol edit teks langsung di layar:
              </Text>

              <TextInput
                style={styles.pinInput}
                keyboardType="numeric"
                secureTextEntry
                placeholder="Masukkan PIN"
                placeholderTextColor={THEME.colors.textTertiary}
                value={pin}
                onChangeText={setPin}
                maxLength={6}
              />
              <Text style={styles.hintText}>*PIN Default Bawaan: 2026</Text>

              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.8}>
                <Text style={styles.submitBtnText}>Aktifkan Mode Pengelola ›</Text>
              </TouchableOpacity>
            </View>
          )}
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
    maxWidth: 420,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    borderWidth: 1.5,
    borderColor: THEME.colors.goldMuted,
    padding: THEME.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
    paddingBottom: THEME.spacing.sm,
    marginBottom: THEME.spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  crownIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.gold,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    fontSize: 18,
    color: THEME.colors.textTertiary,
  },
  activeCard: {
    paddingVertical: THEME.spacing.sm,
  },
  activeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.colors.emerald,
    marginBottom: 6,
  },
  activeDesc: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
    marginBottom: THEME.spacing.md,
  },
  deactivateBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.crimson,
    marginBottom: 10,
  },
  deactivateBtnText: {
    color: THEME.colors.crimson,
    fontSize: 12,
    fontWeight: '800',
  },
  resetContentBtn: {
    paddingVertical: 6,
    alignItems: 'center',
  },
  resetContentBtnText: {
    color: THEME.colors.textTertiary,
    fontSize: 11,
    textDecorationLine: 'underline',
  },
  loginCard: {
    paddingVertical: THEME.spacing.sm,
  },
  loginPrompt: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
    marginBottom: THEME.spacing.md,
  },
  pinInput: {
    backgroundColor: THEME.colors.surfaceLighter,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.gold,
    padding: THEME.spacing.md,
    fontSize: 20,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 8,
  },
  hintText: {
    fontSize: 10,
    color: THEME.colors.gold,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: THEME.spacing.md,
    fontStyle: 'italic',
  },
  submitBtn: {
    backgroundColor: THEME.colors.gold,
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '800',
  },
});
