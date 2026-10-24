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
    borderRadius: THEME.borderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  navArrow: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  navArrowDisabled: {
    opacity: 0.2,
  },
  navArrowText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
  },
  dayBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.pill,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  dayBadgeText: {
    color: '#F5F5F7',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  phaseLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8E8E93',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  mainTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
    marginTop: 2,
    marginBottom: 2,
  },
  arabicTitle: {
    fontSize: 14,
    color: '#A8A8A8',
    marginBottom: 8,
    fontWeight: '500',
  },
  dalilBox: {
    backgroundColor: '#181818',
    borderRadius: THEME.borderRadius.sm,
    padding: 10,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 8,
  },
  arabicDalil: {
    fontSize: 15,
    color: THEME.colors.textPrimary,
    textAlign: 'right',
    lineHeight: 24,
    marginBottom: 6,
    fontWeight: '500',
  },
  translationDalil: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    lineHeight: 16,
    fontStyle: 'normal',
  },
  referenceDalil: {
    fontSize: 10,
    color: '#8E8E93',
    marginTop: 4,
    fontWeight: '600',
  },
  quoteBox: {
    borderLeftWidth: 2,
    borderLeftColor: '#363636',
    paddingLeft: 8,
    marginVertical: 6,
  },
  quoteText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    lineHeight: 16,
    fontStyle: 'normal',
  },
  quoteAuthor: {
    fontSize: 10,
    color: THEME.colors.textPrimary,
    marginTop: 2,
    fontWeight: '600',
  },
  quoteBook: {
    color: THEME.colors.textTertiary,
    fontWeight: '400',
  },
  summaryText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
    marginVertical: 6,
  },
  actionBox: {
    flexDirection: 'row',
    backgroundColor: '#181818',
    borderRadius: THEME.borderRadius.sm,
    padding: 10,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginTop: 4,
    alignItems: 'flex-start',
  },
  actionBoxDone: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  checkboxIcon: {
    fontSize: 18,
    color: THEME.colors.emerald,
    marginRight: 8,
    marginTop: -1,
  },
  actionTextWrap: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#E4E6EB',
    letterSpacing: 0.2,
    marginBottom: 2,
  },
  actionDesc: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    lineHeight: 15,
  },
  toolsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  toolPill: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
  },
  toolPillActive: {
    borderColor: '#4A4A4A',
    backgroundColor: '#262626',
  },
  toolPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  noteSection: {
    backgroundColor: '#181818',
    borderRadius: THEME.borderRadius.sm,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  noteLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#8E8E93',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  noteInput: {
    backgroundColor: '#121212',
    color: THEME.colors.textPrimary,
    borderRadius: THEME.borderRadius.sm,
    padding: 8,
    minHeight: 56,
    fontSize: 11,
    lineHeight: 16,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 6,
  },
  noteSaveRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savedFeedback: {
    color: THEME.colors.emerald,
    fontSize: 10,
    fontWeight: '600',
  },
  saveNoteBtn: {
    backgroundColor: '#F5F5F7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.borderRadius.sm,
    marginLeft: 'auto',
  },
  saveNoteBtnText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '600',
  },
});
