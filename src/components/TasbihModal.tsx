import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { THEME } from '../constants/theme';

interface TasbihModalProps {
  visible: boolean;
  onClose: () => void;
}

export const TasbihModal: React.FC<TasbihModalProps> = ({ visible, onClose }) => {
  const [count, setCount] = useState<number>(0);
  const target = 100;

  const handleTap = () => {
    const next = count + 1;
    setCount(next);

    if (Platform.OS !== 'web') {
      if (next === target) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const handleReset = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setCount(0);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>TASBIH DIGITAL ISTIGHFAR</Text>
              <Text style={styles.subtitle}>Target Sunnah: 100x Setiap Hari</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Lafadz Istighfar */}
          <View style={styles.dhikrBox}>
            <Text style={styles.arabicDhikr}>أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ</Text>
            <Text style={styles.latinDhikr}>"Astaghfirullāha wa atūbu ilayh"</Text>
            <Text style={styles.meaningDhikr}>
              "Aku memohon ampun kepada Allah dan bertaubat kepada-Nya."
            </Text>
          </View>

          {/* Big Tap Area */}
          <TouchableOpacity
            style={[styles.tapArea, count >= target && styles.tapAreaCompleted]}
            onPress={handleTap}
            activeOpacity={0.85}
          >
            <Text style={styles.countText}>{count}</Text>
            <Text style={styles.targetText}>/ {target} KALI</Text>
            <Text style={styles.tapInstruction}>
              {count >= target
                ? '✓ Maa Syaa Allah, Target 100x Selesai!'
                : 'Sentuh Lingkaran Ini untuk Menghitung'}
            </Text>
          </TouchableOpacity>

          {/* Progress Bar */}
          <View style={styles.progressBarWrap}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min(100, (count / target) * 100)}%` },
              ]}
            />
          </View>

          {/* Bottom Controls */}
          <View style={styles.bottomRow}>
            <TouchableOpacity onPress={handleReset} style={styles.resetBtn} activeOpacity={0.7}>
              <Text style={styles.resetBtnText}>↻ Ulang Hitungan</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} style={styles.doneBtn} activeOpacity={0.8}>
              <Text style={styles.doneBtnText}>Selesai</Text>
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
    maxWidth: 420,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    borderWidth: 1.5,
    borderColor: THEME.colors.goldMuted,
    padding: THEME.spacing.md,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
    paddingBottom: THEME.spacing.sm,
    marginBottom: THEME.spacing.md,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.gold,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    color: THEME.colors.textTertiary,
    fontSize: 18,
  },
  dhikrBox: {
    backgroundColor: THEME.colors.surfaceLighter,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
  },
  arabicDhikr: {
    fontSize: 22,
    color: THEME.colors.gold,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  latinDhikr: {
    fontSize: 12,
    color: THEME.colors.textPrimary,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  meaningDhikr: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
  },
  tapArea: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderWidth: 3,
    borderColor: THEME.colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: THEME.spacing.sm,
  },
  tapAreaCompleted: {
    borderColor: THEME.colors.emerald,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  countText: {
    fontSize: 54,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
    letterSpacing: -1,
  },
  targetText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.gold,
    letterSpacing: 1,
    marginTop: -4,
  },
  tapInstruction: {
    fontSize: 10,
    color: THEME.colors.textTertiary,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  progressBarWrap: {
    width: '100%',
    height: 6,
    backgroundColor: THEME.colors.surfaceLighter,
    borderRadius: 3,
    marginVertical: THEME.spacing.md,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: THEME.colors.emerald,
    borderRadius: 3,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: THEME.spacing.xs,
  },
  resetBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  resetBtnText: {
    color: THEME.colors.textTertiary,
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  doneBtn: {
    backgroundColor: THEME.colors.gold,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: THEME.borderRadius.md,
  },
  doneBtnText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '800',
  },
});
