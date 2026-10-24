import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { THEME } from '../constants/theme';
import { CURRICULUM_DATA } from '../constants/curriculumData';

interface RoadmapModalProps {
  visible: boolean;
  currentDay: number;
  completedDays: number[];
  onSelectDay: (day: number) => void;
  onClose: () => void;
}

export const RoadmapModal: React.FC<RoadmapModalProps> = ({
  visible,
  currentDay,
  completedDays,
  onSelectDay,
  onClose,
}) => {
  const phases = [
    { name: 'Tashfiyah', label: 'FASE 1: TASHFIYAH (Pembersihan Jiwa)', days: [1, 2, 3, 4, 5, 6, 7] },
    { name: 'Al-Wiqayah', label: 'FASE 2: AL-WIQAYAH (Memutus Pemicu)', days: [8, 9, 10, 11, 12, 13, 14] },
    { name: 'At-Tarbiyah', label: 'FASE 3: AT-TARBIYAH (Substitusi Amal)', days: [15, 16, 17, 18, 19, 20, 21] },
    { name: 'At-Tatsbit', label: 'FASE 4: AT-TATSBIT (Benteng Istiqomah)', days: [22, 23, 24, 25, 26, 27, 28, 29, 30] },
  ];

  const handleDayPress = (day: number) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onSelectDay(day);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>PETA PERJALANAN 30 HARI</Text>
              <Text style={styles.subtitle}>Kurikulum Tazkiyatun Nufus Bertahap</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {phases.map((phase, pIdx) => (
              <View key={pIdx} style={styles.phaseSection}>
                <Text style={styles.phaseHeading}>{phase.label}</Text>
                <View style={styles.gridContainer}>
                  {phase.days.map((d) => {
                    const isCurrent = d === currentDay;
                    const isDone = completedDays.includes(d);
                    const dayItem = CURRICULUM_DATA.find((item) => item.day === d);

                    return (
                      <TouchableOpacity
                        key={d}
                        style={[
                          styles.dayBox,
                          isCurrent && styles.dayBoxCurrent,
                          isDone && styles.dayBoxDone,
                        ]}
                        onPress={() => handleDayPress(d)}
                        activeOpacity={0.8}
                      >
                        <View style={styles.dayTopRow}>
                          <Text style={[styles.dayNumber, isCurrent && styles.textGold]}>
                            H-{d}
                          </Text>
                          {isDone && <Text style={styles.doneCheck}>✓</Text>}
                        </View>
                        <Text style={styles.dayTitle} numberOfLines={2}>
                          {dayItem?.title || `Hari ${d}`}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}

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
  sheet: {
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: THEME.borderRadius.xl,
    borderTopRightRadius: THEME.borderRadius.xl,
    borderTopWidth: 1.5,
    borderTopColor: THEME.colors.goldMuted,
    maxHeight: '85%',
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
    fontSize: 18,
    color: THEME.colors.textTertiary,
  },
  scrollArea: {
    padding: THEME.spacing.md,
  },
  phaseSection: {
    marginBottom: THEME.spacing.md,
  },
  phaseHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.emerald,
    letterSpacing: 0.5,
    marginBottom: THEME.spacing.sm,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayBox: {
    width: '48%',
    backgroundColor: THEME.colors.surfaceLighter,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  dayBoxCurrent: {
    borderColor: THEME.colors.gold,
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
  },
  dayBoxDone: {
    borderColor: THEME.colors.emerald,
  },
  dayTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  textGold: {
    color: THEME.colors.gold,
  },
  doneCheck: {
    fontSize: 11,
    color: THEME.colors.emerald,
    fontWeight: '800',
  },
  dayTitle: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    lineHeight: 15,
  },
});
