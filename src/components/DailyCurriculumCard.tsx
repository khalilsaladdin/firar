import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { THEME } from '../constants/theme';
import { CurriculumDay } from '../types';

interface DailyCurriculumCardProps {
  dayData: CurriculumDay;
  isCompleted: boolean;
  savedNote?: string;
  onToggleComplete: () => void;
  onSaveNote: (note: string) => void;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onOpenTasbih: () => void;
  onOpenRoadmap: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export const DailyCurriculumCard: React.FC<DailyCurriculumCardProps> = ({
  dayData,
  isCompleted,
  savedNote = '',
  onToggleComplete,
  onSaveNote,
  onPreviousDay,
  onNextDay,
  onOpenTasbih,
  onOpenRoadmap,
  hasPrevious,
  hasNext,
}) => {
  const [noteText, setNoteText] = useState(savedNote);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  useEffect(() => {
    setNoteText(savedNote || '');
    setIsSavedSuccess(false);
  }, [savedNote, dayData.day]);

  const handleToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onToggleComplete();
  };

  const handleSave = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    onSaveNote(noteText);
    setIsSavedSuccess(true);
    setTimeout(() => setIsSavedSuccess(false), 2500);
  };

  return (
    <View style={styles.card}>
      {/* Top Navigation Row */}
      <View style={styles.topRow}>
        <TouchableOpacity
          onPress={onPreviousDay}
          disabled={!hasPrevious}
          style={[styles.navArrow, !hasPrevious && styles.navArrowDisabled]}
        >
          <Text style={styles.navArrowText}>‹ Hari {dayData.day - 1}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onOpenRoadmap} activeOpacity={0.7} style={styles.dayBadge}>
          <Text style={styles.dayBadgeText}>HARI KE-{dayData.day} / 30 🗺️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onNextDay}
          disabled={!hasNext}
          style={[styles.navArrow, !hasNext && styles.navArrowDisabled]}
        >
          <Text style={styles.navArrowText}>Hari {dayData.day + 1} ›</Text>
        </TouchableOpacity>
      </View>

      {/* Phase Label & Title */}
      <Text style={styles.phaseLabel}>
        {dayData.phase.toUpperCase()} • {dayData.phaseTitle}
      </Text>
      <Text style={styles.mainTitle}>{dayData.title}</Text>
      <Text style={styles.arabicTitle}>{dayData.arabicTitle}</Text>

      {/* Dalil Box */}
      <View style={styles.dalilBox}>
        <Text style={styles.arabicDalil}>{dayData.verseOrHadith.arabic}</Text>
        <Text style={styles.translationDalil}>"{dayData.verseOrHadith.translation}"</Text>
        <Text style={styles.referenceDalil}>— {dayData.verseOrHadith.reference}</Text>
      </View>

      {/* Salaf Quote */}
      {dayData.salafQuote && (
        <View style={styles.quoteBox}>
          <Text style={styles.quoteText}>"{dayData.salafQuote.text}"</Text>
          <Text style={styles.quoteAuthor}>
            — {dayData.salafQuote.scholar} <Text style={styles.quoteBook}>({dayData.salafQuote.book})</Text>
          </Text>
        </View>
      )}

      {/* Reflection Summary */}
      <Text style={styles.summaryText}>{dayData.summary}</Text>

      {/* Action Item Box */}
      <TouchableOpacity
        style={[styles.actionBox, isCompleted && styles.actionBoxDone]}
        onPress={handleToggle}
        activeOpacity={0.8}
      >
        <Text style={styles.checkboxIcon}>{isCompleted ? '☑' : '☐'}</Text>
        <View style={styles.actionTextWrap}>
          <Text style={styles.actionLabel}>AMAL YAUMI (TINDAKAN HARI INI):</Text>
          <Text style={styles.actionDesc}>{dayData.actionItem}</Text>
        </View>
      </TouchableOpacity>

      {/* Quick Tools Row (Tasbih & Catatan Refleksi) */}
      <View style={styles.toolsRow}>
        <TouchableOpacity style={styles.toolPill} onPress={onOpenTasbih} activeOpacity={0.8}>
          <Text style={styles.toolPillText}>📿 Tasbih Istighfar (100x)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolPill, showNoteInput && styles.toolPillActive]}
          onPress={() => setShowNoteInput(!showNoteInput)}
          activeOpacity={0.8}
        >
          <Text style={styles.toolPillText}>
            {savedNote ? '✍️ Buka Catatan Jiwa (Ada Isi)' : '✍️ Tulis Catatan Jiwa'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Expandable Catatan Muhasabah Jiwa */}
      {showNoteInput && (
        <View style={styles.noteSection}>
          <Text style={styles.noteLabel}>CATATAN MUHASABAH RAHASIA (HARI KE-{dayData.day}):</Text>
          <TextInput
            style={styles.noteInput}
            multiline
            placeholder="Tuliskan renungan batinmu hari ini: apa yang engkau syukuri, apa godaan terberat, atau permohonan ampunmu kepada Allah..."
            placeholderTextColor={THEME.colors.textTertiary}
            value={noteText}
            onChangeText={setNoteText}
          />
          <View style={styles.noteSaveRow}>
            {isSavedSuccess && <Text style={styles.savedFeedback}>✓ Catatan Tersimpan Aman</Text>}
            <TouchableOpacity style={styles.saveNoteBtn} onPress={handleSave} activeOpacity={0.8}>
              <Text style={styles.saveNoteBtnText}>Simpan Catatan</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  navArrow: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  navArrowDisabled: {
    opacity: 0.2,
  },
  navArrowText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  dayBadge: {
    backgroundColor: 'rgba(223, 186, 88, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: THEME.borderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(223, 186, 88, 0.35)',
  },
  dayBadgeText: {
    color: THEME.colors.goldLight,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  phaseLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.emeraldLight,
    letterSpacing: 1.2,
    marginTop: 4,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    marginTop: 3,
    marginBottom: 4,
  },
  arabicTitle: {
    fontSize: 17,
    color: THEME.colors.gold,
    marginBottom: THEME.spacing.sm,
    fontWeight: '700',
  },
  dalilBox: {
    backgroundColor: THEME.colors.surfaceLighter,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(223, 186, 88, 0.18)',
    marginBottom: THEME.spacing.sm,
  },
  arabicDalil: {
    fontSize: 17,
    color: THEME.colors.goldLight,
    textAlign: 'right',
    lineHeight: 28,
    marginBottom: 8,
    fontWeight: '700',
  },
  translationDalil: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  referenceDalil: {
    fontSize: 11,
    color: THEME.colors.gold,
    marginTop: 6,
    fontWeight: '700',
  },
  quoteBox: {
    borderLeftWidth: 2,
    borderLeftColor: THEME.colors.gold,
    paddingLeft: THEME.spacing.sm,
    marginVertical: THEME.spacing.sm,
  },
  quoteText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  quoteAuthor: {
    fontSize: 11,
    color: THEME.colors.textPrimary,
    marginTop: 4,
    fontWeight: '700',
  },
  quoteBook: {
    color: THEME.colors.textTertiary,
    fontWeight: '400',
  },
  summaryText: {
    fontSize: 13,
    color: THEME.colors.textPrimary,
    lineHeight: 20,
    marginVertical: THEME.spacing.sm,
  },
  actionBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(223, 186, 88, 0.08)',
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(223, 186, 88, 0.35)',
    marginTop: THEME.spacing.xs,
    alignItems: 'flex-start',
  },
  actionBoxDone: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: THEME.colors.emerald,
  },
  checkboxIcon: {
    fontSize: 20,
    color: THEME.colors.emerald,
    marginRight: THEME.spacing.sm,
    marginTop: -2,
  },
  actionTextWrap: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.gold,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  actionDesc: {
    fontSize: 12,
    color: THEME.colors.textPrimary,
    lineHeight: 16,
  },
  toolsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: THEME.spacing.md,
  },
  toolPill: {
    flex: 1,
    backgroundColor: THEME.colors.surfaceLighter,
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
  },
  toolPillActive: {
    borderColor: THEME.colors.gold,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  toolPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  noteSection: {
    backgroundColor: THEME.colors.surfaceLighter,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    marginTop: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: THEME.colors.borderLight,
  },
  noteLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.gold,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  noteInput: {
    backgroundColor: THEME.colors.surface,
    color: THEME.colors.textPrimary,
    borderRadius: THEME.borderRadius.sm,
    padding: THEME.spacing.sm,
    minHeight: 70,
    fontSize: 12,
    lineHeight: 18,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 8,
  },
  noteSaveRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savedFeedback: {
    color: THEME.colors.emerald,
    fontSize: 11,
    fontWeight: '600',
  },
  saveNoteBtn: {
    backgroundColor: THEME.colors.gold,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: THEME.borderRadius.md,
    marginLeft: 'auto',
  },
  saveNoteBtnText: {
    color: '#07090E',
    fontSize: 11,
    fontWeight: '800',
  },
});
