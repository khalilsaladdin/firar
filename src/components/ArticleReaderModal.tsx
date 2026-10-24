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
import { ArticleItem } from '../types';

interface ArticleReaderModalProps {
  article: ArticleItem | null;
  visible: boolean;
  onClose: () => void;
}

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({
  article,
  visible,
  onClose,
}) => {
  if (!article) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View style={styles.badgeRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{article.categoryLabel}</Text>
              </View>
              <Text style={styles.readTimeText}>⏱️ {article.readTimeMinutes} Menit Baca</Text>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Scrollable Reader Body */}
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Titles */}
            {article.arabicTitle && (
              <Text style={styles.arabicHeader}>{article.arabicTitle}</Text>
            )}
            <Text style={styles.articleTitle}>{article.title}</Text>

            {/* Author / Source Meta */}
            <View style={styles.metaBox}>
              <Text style={styles.authorText}>✍️ Sumber: {article.authorOrSource}</Text>
              <Text style={styles.dateText}>{article.publishedDate}</Text>
            </View>

            {/* Dalil Callout Box */}
            {article.dalilQuote && (
              <View style={styles.dalilBox}>
                <Text style={styles.dalilArabic}>{article.dalilQuote.arabic}</Text>
                <Text style={styles.dalilTranslation}>"{article.dalilQuote.translation}"</Text>
                <Text style={styles.dalilRef}>— {article.dalilQuote.reference}</Text>
              </View>
            )}

            {/* Paragraphs */}
            <View style={styles.paragraphsContainer}>
              {article.paragraphs.map((p, idx) => (
                <Text key={idx} style={styles.paragraphText}>
                  {p}
                </Text>
              ))}
            </View>

            {/* Takeaway Box */}
            <View style={styles.takeawayCard}>
              <Text style={styles.takeawayHeader}>KESIMPULAN & LANGKAH NYATA:</Text>
              <Text style={styles.takeawayText}>{article.takeaway}</Text>
            </View>

            {/* Action Finish Button */}
            <TouchableOpacity style={styles.finishBtn} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.finishBtnText}>✓ Alhamdulillah, Selesai Membaca</Text>
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
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.gold,
    letterSpacing: 0.5,
  },
  readTimeText: {
    fontSize: 11,
    color: THEME.colors.textTertiary,
  },
  closeBtn: {
    padding: 6,
  },
  closeBtnText: {
    fontSize: 18,
    color: THEME.colors.textSecondary,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: THEME.spacing.md,
  },
  arabicHeader: {
    fontSize: 22,
    color: THEME.colors.gold,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: THEME.spacing.sm,
    marginBottom: 4,
  },
  articleTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    lineHeight: 28,
    marginTop: 4,
    marginBottom: 8,
  },
  metaBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
    paddingBottom: THEME.spacing.sm,
    marginBottom: THEME.spacing.md,
  },
  authorText: {
    fontSize: 11,
    color: THEME.colors.gold,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 10,
    color: THEME.colors.textTertiary,
  },
  dalilBox: {
    backgroundColor: THEME.colors.surfaceLighter,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: THEME.colors.gold,
    marginBottom: THEME.spacing.lg,
  },
  dalilArabic: {
    fontSize: 18,
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
  paragraphsContainer: {
    marginBottom: THEME.spacing.lg,
  },
  paragraphText: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    lineHeight: 24,
    marginBottom: 14,
    textAlign: 'justify',
  },
  takeawayCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: THEME.spacing.lg,
  },
  takeawayHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.emerald,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  takeawayText: {
    fontSize: 12,
    color: THEME.colors.textPrimary,
    lineHeight: 18,
    fontStyle: 'italic',
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
    letterSpacing: 0.5,
  },
});
