import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { THEME } from '../constants/theme';
import { LessonModule } from '../types';

interface LessonPlayerModalProps {
  lesson: LessonModule | null;
  visible: boolean;
  isCompleted: boolean;
  onToggleCompleted: (lessonId: string) => void;
  onClose: () => void;
}

export const LessonPlayerModal: React.FC<LessonPlayerModalProps> = ({
  lesson,
  visible,
  isCompleted,
  onToggleCompleted,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(35); // mock percent

  if (!lesson) return null;

  const handlePlayToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setIsPlaying(!isPlaying);
  };

  const handleCompletePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    onToggleCompleted(lesson.id);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View>
              <Text style={styles.phaseBadge}>{lesson.phaseTitle.toUpperCase()}</Text>
              <Text style={styles.lessonNumber}>MODUL {lesson.lessonNumber} / 8</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Titles */}
            {lesson.arabicTitle && (
              <Text style={styles.arabicTitle}>{lesson.arabicTitle}</Text>
            )}
            <Text style={styles.mainTitle}>{lesson.title}</Text>

            {/* Speaker & Book Reference Meta */}
            <View style={styles.metaCard}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>PEMBIMBING:</Text>
                <Text style={styles.metaValue}>{lesson.speaker}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>KITAB RUJUKAN:</Text>
                <Text style={[styles.metaValue, { color: THEME.colors.gold }]}>
                  {lesson.bookReference}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>DURASI:</Text>
                <Text style={styles.metaValue}>{lesson.durationMinutes} Menit Kajian Audio</Text>
              </View>
            </View>

            {/* Audio Player Card */}
            <View style={styles.playerCard}>
              <View style={styles.playerTop}>
                <View style={styles.soundWaveIcon}>
                  <Text style={{ fontSize: 24 }}>🎙️</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.nowPlayingText}>
                    {isPlaying ? 'Sedang Memutar Audio Kajian...' : 'Siap Diputar (Audio Terbimbing)'}
                  </Text>
                  <Text style={styles.trackDuration}>
                    {isPlaying ? '11:45 / ' : '00:00 / '}
                    {lesson.durationMinutes}:00
                  </Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: isPlaying ? '40%' : '0%' }]} />
              </View>

              {/* Play / Pause Button */}
              <TouchableOpacity
                style={[styles.playBtn, isPlaying && styles.pauseBtnActive]}
                onPress={handlePlayToggle}
                activeOpacity={0.8}
              >
                <Text style={styles.playBtnText}>
                  {isPlaying ? '⏸️ Jeda Kajian' : '▶️ Dengarkan Rekaman Sekarang'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Description */}
            <View style={styles.sectionBox}>
              <Text style={styles.sectionHeading}>DESKRIPSI PELAJARAN:</Text>
              <Text style={styles.descriptionText}>{lesson.description}</Text>
            </View>

            {/* Key Discussion Points */}
            <View style={styles.sectionBox}>
              <Text style={styles.sectionHeading}>POIN KUNCI YANG HARUS DIFAHAMI:</Text>
              {lesson.keyPoints.map((point, idx) => (
                <View key={idx} style={styles.pointRow}>
                  <Text style={styles.pointBullet}>•</Text>
                  <Text style={styles.pointText}>{point}</Text>
                </View>
              ))}
            </View>

            {/* Action Mark as Completed */}
            <TouchableOpacity
              style={[styles.completeToggleBtn, isCompleted && styles.completeToggleBtnDone]}
              onPress={handleCompletePress}
              activeOpacity={0.8}
            >
              <Text style={styles.completeToggleText}>
                {isCompleted
                  ? '✓ Modul Ini Sudah Tuntas Dipelajari'
                  : '☐ Tandai Selesai Mendengarkan Modul Ini'}
              </Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  phaseBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.emerald,
    letterSpacing: 0.5,
  },
  lessonNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.gold,
    letterSpacing: 1,
  },
  closeBtn: {
    padding: 6,
  },
  closeBtnText: {
    fontSize: 18,
    color: THEME.colors.textSecondary,
  },
  scrollArea: {
    padding: THEME.spacing.md,
  },
  arabicTitle: {
    fontSize: 20,
    color: THEME.colors.gold,
    textAlign: 'center',
    fontWeight: '700',
    marginTop: THEME.spacing.xs,
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    lineHeight: 26,
    marginBottom: THEME.spacing.md,
  },
  metaCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.textTertiary,
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  playerCard: {
    backgroundColor: THEME.colors.surfaceLighter,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.goldMuted,
    marginBottom: THEME.spacing.md,
  },
  playerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  soundWaveIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nowPlayingText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  trackDuration: {
    fontSize: 11,
    color: THEME.colors.textTertiary,
    marginTop: 2,
  },
  progressTrack: {
    height: 6,
    backgroundColor: THEME.colors.surface,
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: THEME.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.gold,
    borderRadius: 3,
  },
  playBtn: {
    backgroundColor: THEME.colors.gold,
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    marginTop: 4,
  },
  pauseBtnActive: {
    backgroundColor: THEME.colors.emerald,
  },
  playBtnText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '800',
  },
  sectionBox: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.gold,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
  },
  pointRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  pointBullet: {
    fontSize: 14,
    color: THEME.colors.emerald,
    marginRight: 6,
    lineHeight: 18,
  },
  pointText: {
    fontSize: 12,
    color: THEME.colors.textPrimary,
    lineHeight: 18,
    flex: 1,
  },
  completeToggleBtn: {
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderRadius: THEME.borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  completeToggleBtnDone: {
    backgroundColor: THEME.colors.emeraldGlow,
    borderColor: THEME.colors.emerald,
  },
  completeToggleText: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
});
