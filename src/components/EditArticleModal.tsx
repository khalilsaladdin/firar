import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { THEME } from '../constants/theme';
import { ArticleItem, HabitId } from '../types';

interface EditArticleModalProps {
  visible: boolean;
  articleToEdit: ArticleItem | null;
  onSave: (article: ArticleItem) => void;
  onClose: () => void;
}

export const EditArticleModal: React.FC<EditArticleModalProps> = ({
  visible,
  articleToEdit,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState<string>('');
  const [arabicTitle, setArabicTitle] = useState<string>('');
  const [category, setCategory] = useState<HabitId | 'umum'>('pandangan_zina');
  const [authorOrSource, setAuthorOrSource] = useState<string>('');
  const [readTimeMinutes, setReadTimeMinutes] = useState<string>('4');
  const [summary, setSummary] = useState<string>('');
  const [dalilArabic, setDalilArabic] = useState<string>('');
  const [dalilTranslation, setDalilTranslation] = useState<string>('');
  const [dalilReference, setDalilReference] = useState<string>('');
  const [bodyText, setBodyText] = useState<string>('');
  const [takeaway, setTakeaway] = useState<string>('');

  useEffect(() => {
    if (articleToEdit) {
      setTitle(articleToEdit.title);
      setArabicTitle(articleToEdit.arabicTitle || '');
      setCategory(articleToEdit.category === 'memento_mori' ? 'umum' : articleToEdit.category);
      setAuthorOrSource(articleToEdit.authorOrSource);
      setReadTimeMinutes(articleToEdit.readTimeMinutes.toString());
      setSummary(articleToEdit.summary);
      setDalilArabic(articleToEdit.dalilQuote?.arabic || '');
      setDalilTranslation(articleToEdit.dalilQuote?.translation || '');
      setDalilReference(articleToEdit.dalilQuote?.reference || '');
      setBodyText(articleToEdit.paragraphs.join('\n\n'));
      setTakeaway(articleToEdit.takeaway);
    } else {
      setTitle('');
      setArabicTitle('');
      setCategory('pandangan_zina');
      setAuthorOrSource('Dewan Risalah Firar');
      setReadTimeMinutes('4');
      setSummary('');
      setDalilArabic('');
      setDalilTranslation('');
      setDalilReference('');
      setBodyText('');
      setTakeaway('');
    }
  }, [articleToEdit, visible]);

  const categoryLabels: Record<string, string> = {
    pandangan_zina: '👁️ Zina Mata & Pornografi',
    rokok_khamr: '🚭 Rokok & Khamr',
    shalat_terlambat: '⏳ Lalai Shalat',
    medsos_ghibah: '📱 Medsos & Lisan',
    umum: '📖 Tazkiyah & Umum',
  };

  const handleSave = () => {
    if (!title.trim() || !bodyText.trim()) {
      Alert.alert('Perhatian', 'Judul dan isi artikel wajib diisi.');
      return;
    }

    // Pisahkan teks menjadi paragraf berdasarkan jeda baris kosong
    const paragraphs = bodyText
      .split('\n\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const savedArticle: ArticleItem = {
      id: articleToEdit ? articleToEdit.id : `article-${Date.now()}`,
      category,
      categoryLabel: categoryLabels[category] || 'Risalah Umum',
      title: title.trim(),
      arabicTitle: arabicTitle.trim() || undefined,
      authorOrSource: authorOrSource.trim() || 'Dewan Risalah Firar',
      readTimeMinutes: parseInt(readTimeMinutes, 10) || 4,
      summary: summary.trim() || title.trim(),
      dalilQuote: dalilArabic.trim()
        ? {
            arabic: dalilArabic.trim(),
            translation: dalilTranslation.trim(),
            reference: dalilReference.trim() || 'Al-Qur’an / Sunnah',
          }
        : undefined,
      paragraphs: paragraphs.length > 0 ? paragraphs : [bodyText.trim()],
      takeaway: takeaway.trim() || 'Amalkan nasehat ini hari ini.',
      publishedDate: 'Hari ini',
    };

    onSave(savedArticle);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View>
              <Text style={styles.modeBadge}>MODE PENGELOLA (OWNER CMS)</Text>
              <Text style={styles.topTitle}>
                {articleToEdit ? 'Edit Artikel Risalah' : '+ Tulis Risalah Baru'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>JUDUL ARTIKEL:</Text>
              <TextInput
                style={styles.input}
                placeholder="Misal: Bahaya Zina Mata Menurut Ibnul Qayyim"
                placeholderTextColor={THEME.colors.textTertiary}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>PENULIS / SUMBER:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Misal: Ibnul Qayyim / Nama Anda"
                  placeholderTextColor={THEME.colors.textTertiary}
                  value={authorOrSource}
                  onChangeText={setAuthorOrSource}
                />
              </View>
              <View style={{ width: 100 }}>
                <Text style={styles.label}>DURASI (MNT):</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={readTimeMinutes}
                  onChangeText={setReadTimeMinutes}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>KATEGORI RISALAH:</Text>
              <View style={styles.categoryPicker}>
                {(['pandangan_zina', 'rokok_khamr', 'shalat_terlambat', 'medsos_ghibah', 'umum'] as const).map(
                  (catKey) => {
                    const isSelected = category === catKey;
                    return (
                      <TouchableOpacity
                        key={catKey}
                        style={[styles.catOption, isSelected && styles.catOptionSelected]}
                        onPress={() => setCategory(catKey)}
                      >
                        <Text style={[styles.catText, isSelected && styles.catTextSelected]}>
                          {categoryLabels[catKey]}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                )}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>RINGKASAN SINGKAT (1-2 KALIMAT):</Text>
              <TextInput
                style={[styles.input, { minHeight: 50 }]}
                multiline
                placeholder="Ringkasan singkat yang muncul di kartu depan..."
                placeholderTextColor={THEME.colors.textTertiary}
                value={summary}
                onChangeText={setSummary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>TEKS ARAB DALIL KUNCI (OPSIONAL):</Text>
              <TextInput
                style={[styles.input, { textAlign: 'right', minHeight: 50 }]}
                multiline
                placeholder="Teks Arab ayat / hadits rujukan..."
                placeholderTextColor={THEME.colors.textTertiary}
                value={dalilArabic}
                onChangeText={setDalilArabic}
              />
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>TERJEMAHAN DALIL:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Artinya..."
                  placeholderTextColor={THEME.colors.textTertiary}
                  value={dalilTranslation}
                  onChangeText={setDalilTranslation}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>RUJUKAN (QS / HADITS):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Misal: QS. An-Nur: 30"
                  placeholderTextColor={THEME.colors.textTertiary}
                  value={dalilReference}
                  onChangeText={setDalilReference}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>ISI LENGKAP ARTIKEL:</Text>
              <Text style={styles.fieldHint}>
                *Gunakan dua kali Enter (baris kosong) untuk memisahkan paragraf.
              </Text>
              <TextInput
                style={[styles.input, styles.bodyTextArea]}
                multiline
                placeholder="Tuliskan naskah lengkap artikel Anda di sini..."
                placeholderTextColor={THEME.colors.textTertiary}
                value={bodyText}
                onChangeText={setBodyText}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>KESIMPULAN & LANGKAH AMAL HARI INI:</Text>
              <TextInput
                style={[styles.input, { minHeight: 60 }]}
                multiline
                placeholder="Nasehat penutup praktis untuk diamalkan..."
                placeholderTextColor={THEME.colors.textTertiary}
                value={takeaway}
                onChangeText={setTakeaway}
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
              <Text style={styles.saveBtnText}>💾 Simpan Artikel ke Web</Text>
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
  modeBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: THEME.colors.gold,
    letterSpacing: 0.5,
  },
  topTitle: {
    fontSize: 14,
    fontWeight: '800',
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
  formGroup: {
    marginBottom: THEME.spacing.md,
  },
  row: {
    flexDirection: 'row',
    marginBottom: THEME.spacing.md,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.gold,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  fieldHint: {
    fontSize: 10,
    color: THEME.colors.textTertiary,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  input: {
    backgroundColor: THEME.colors.surfaceLighter,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: THEME.spacing.sm,
    color: THEME.colors.textPrimary,
    fontSize: 12,
  },
  bodyTextArea: {
    minHeight: 180,
    textAlignVertical: 'top',
    lineHeight: 20,
  },
  categoryPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  catOption: {
    backgroundColor: THEME.colors.surfaceLighter,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.pill,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  catOptionSelected: {
    borderColor: THEME.colors.gold,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
  },
  catText: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
    fontWeight: '600',
  },
  catTextSelected: {
    color: THEME.colors.gold,
    fontWeight: '800',
  },
  saveBtn: {
    backgroundColor: THEME.colors.gold,
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    marginTop: THEME.spacing.sm,
  },
  saveBtnText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '800',
  },
});
