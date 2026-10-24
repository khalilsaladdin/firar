import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { THEME } from '../constants/theme';
import { SinItem } from '../types';

interface SinDetailModalProps {
  sin: SinItem | null;
  visible: boolean;
  onClose: () => void;
}

export const SinDetailModal: React.FC<SinDetailModalProps> = ({ sin, visible, onClose }) => {
  if (!sin) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.topBar}>
            <View>
              <Text style={styles.kabairBadge}>
                KITAB AL-KABA'IR • IMAM ADZ-DZAHABI
              </Text>
              <Text style={styles.sinRank}>DOSA BESAR KE-{sin.kabairNumber}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Arabic & Main Titles */}
            <Text style={styles.arabicTitle}>{sin.arabicTitle}</Text>
            <Text style={styles.mainTitle}>{sin.title}</Text>
            <Text style={styles.categoryLabel}>{sin.categoryLabel}</Text>

            {/* 1. Definisi Syar'i */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionHeading}>HAKIKAT & DEFINISI DOSA INI:</Text>
              <Text style={styles.sectionBody}>{sin.definition}</Text>
            </View>

            {/* 2. Dalil Pengharaman (Ayat / Hadits) */}
            <View style={styles.dalilBox}>
              <Text style={styles.dalilLabel}>DALIL PENGHARAMAN & ANCAMAN:</Text>
              <Text style={styles.dalilArabic}>{sin.dalil.arabic}</Text>
              <Text style={styles.dalilTranslation}>"{sin.dalil.translation}"</Text>
              <Text style={styles.dalilRef}>— {sin.dalil.reference}</Text>
            </View>

            {/* 3. Bahaya & Akibat Buruk */}
            <View style={styles.dangerCard}>
              <Text style={styles.dangerHeading}>AKIBAT & KONSEKUENSI DI AKHIRAT:</Text>
              <Text style={styles.dangerBody}>{sin.dangerAndConsequence}</Text>
            </View>

            {/* 4. Peringatan Ulama Salaf */}
            <View style={styles.salafBox}>
              <Text style={styles.salafHeading}>PERINGATAN SALAFUS SHALIH:</Text>
              <Text style={styles.salafQuote}>"{sin.salafWarning.quote}"</Text>
              <Text style={styles.salafAuthor}>
                — {sin.salafWarning.scholar}{' '}
                <Text style={styles.salafBook}>({sin.salafWarning.book})</Text>
              </Text>
            </View>

            {/* 5. Panduan Taubat & Pembersihan Jiwa */}
            <View style={styles.taubatCard}>
              <Text style={styles.taubatHeading}>CARA BERTAUBAT & MELEPASKANNYA:</Text>
              <Text style={styles.taubatBody}>{sin.taubatGuidance}</Text>
            </View>

            {/* Action Button */}
            <TouchableOpacity style={styles.finishBtn} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.finishBtnText}>Tutup & Kembali ke Beranda</Text>
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
  kabairBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: THEME.colors.gold,
    letterSpacing: 0.5,
  },
  sinRank: {
    fontSize: 13,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
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
    fontSize: 22,
    color: THEME.colors.gold,
    textAlign: 'center',
    fontWeight: '700',
    marginTop: THEME.spacing.sm,
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 11,
    color: THEME.colors.emerald,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: THEME.spacing.md,
  },
  sectionCard: {
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
  sectionBody: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
  },
  dalilBox: {
    backgroundColor: THEME.colors.surfaceLighter,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: THEME.colors.gold,
    marginBottom: THEME.spacing.md,
  },
  dalilLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: THEME.colors.gold,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  dalilArabic: {
    fontSize: 17,
    color: THEME.colors.gold,
    textAlign: 'right',
    lineHeight: 28,
    fontWeight: '700',
    marginBottom: 6,
  },
  dalilTranslation: {
    fontSize: 12,
    color: THEME.colors.textPrimary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  dalilRef: {
    fontSize: 10,
    color: THEME.colors.textTertiary,
    marginTop: 4,
  },
  dangerCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.06)',
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    marginBottom: THEME.spacing.md,
  },
  dangerHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.crimson,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  dangerBody: {
    fontSize: 12,
    color: THEME.colors.textPrimary,
    lineHeight: 18,
  },
  salafBox: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
  },
  salafHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.emerald,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  salafQuote: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  salafAuthor: {
    fontSize: 11,
    color: THEME.colors.textPrimary,
    fontWeight: '700',
    marginTop: 6,
  },
  salafBook: {
    color: THEME.colors.textTertiary,
    fontWeight: '400',
  },
  taubatCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: THEME.spacing.lg,
  },
  taubatHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.emerald,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  taubatBody: {
    fontSize: 12,
    color: THEME.colors.textPrimary,
    lineHeight: 18,
  },
  finishBtn: {
    backgroundColor: THEME.colors.gold,
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
  },
  finishBtnText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '800',
  },
});
