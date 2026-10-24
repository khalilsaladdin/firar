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
import { SinItem } from '../types';

interface EditSinModalProps {
  visible: boolean;
  sinToEdit: SinItem | null;
  onSave: (sin: SinItem) => void;
  onClose: () => void;
}

export const EditSinModal: React.FC<EditSinModalProps> = ({
  visible,
  sinToEdit,
  onSave,
  onClose,
}) => {
  const [kabairNumber, setKabairNumber] = useState<string>('1');
  const [title, setTitle] = useState<string>('');
  const [arabicTitle, setArabicTitle] = useState<string>('');
  const [category, setCategory] = useState<
    'haqqullah' | 'raga_kehormatan' | 'lisan_sosial' | 'harta' | 'keluarga'
  >('haqqullah');
  const [definition, setDefinition] = useState<string>('');
  const [dangerAndConsequence, setDangerAndConsequence] = useState<string>('');
  const [dalilArabic, setDalilArabic] = useState<string>('');
  const [dalilTranslation, setDalilTranslation] = useState<string>('');
  const [dalilReference, setDalilReference] = useState<string>('');
  const [salafScholar, setSalafScholar] = useState<string>('Imam Adz-Dzahabi');
  const [salafQuote, setSalafQuote] = useState<string>('');
  const [salafBook, setSalafBook] = useState<string>('Kitab Al-Kaba\'ir');
  const [taubatGuidance, setTaubatGuidance] = useState<string>('');

  useEffect(() => {
    if (sinToEdit) {
      setKabairNumber(sinToEdit.kabairNumber.toString());
      setTitle(sinToEdit.title);
      setArabicTitle(sinToEdit.arabicTitle);
      setCategory(sinToEdit.category);
      setDefinition(sinToEdit.definition);
      setDangerAndConsequence(sinToEdit.dangerAndConsequence);
      setDalilArabic(sinToEdit.dalil.arabic);
      setDalilTranslation(sinToEdit.dalil.translation);
      setDalilReference(sinToEdit.dalil.reference);
      setSalafScholar(sinToEdit.salafWarning.scholar);
      setSalafQuote(sinToEdit.salafWarning.quote);
      setSalafBook(sinToEdit.salafWarning.book);
      setTaubatGuidance(sinToEdit.taubatGuidance);
    } else {
      // Form Kosong Baru
      setKabairNumber('5');
      setTitle('');
      setArabicTitle('');
      setCategory('haqqullah');
      setDefinition('');
      setDangerAndConsequence('');
      setDalilArabic('');
      setDalilTranslation('');
      setDalilReference('');
      setSalafScholar('Imam Adz-Dzahabi');
      setSalafQuote('');
      setSalafBook('Kitab Al-Kaba\'ir');
      setTaubatGuidance('');
    }
  }, [sinToEdit, visible]);

  const categoryLabels = {
    haqqullah: '⚡ Hak Allah',
    raga_kehormatan: '💔 Raga & Zina',
    keluarga: '👨‍👩‍👧 Orang Tua & Kerabat',
    harta: '💰 Riba & Harta',
    lisan_sosial: '🗣️ Ghibah & Lisan',
  };

  const handleSave = () => {
    if (!title.trim() || !definition.trim()) {
      Alert.alert('Perhatian', 'Judul dan definisi dosa wajib diisi.');
      return;
    }

    const savedSin: SinItem = {
      id: sinToEdit ? sinToEdit.id : `sin-${Date.now()}`,
      kabairNumber: parseInt(kabairNumber, 10) || 1,
      category,
      categoryLabel: categoryLabels[category],
      title: title.trim(),
      arabicTitle: arabicTitle.trim() || 'الْكَبِيرَةُ',
      definition: definition.trim(),
      dangerAndConsequence: dangerAndConsequence.trim() || 'Mendatangkan murka Allah Ta\'ala.',
      dalil: {
        arabic: dalilArabic.trim() || 'وَلَا تَقْرَبُوا الْفَوَاحِشَ',
        translation: dalilTranslation.trim() || 'Dan janganlah kamu mendekati perbuatan keji.',
        reference: dalilReference.trim() || 'Kitab Al-Kaba\'ir',
      },
      salafWarning: {
        scholar: salafScholar.trim() || 'Imam Adz-Dzahabi',
        quote: salafQuote.trim() || 'Dosa besar ini harus dijauhi oleh setiap muslim.',
        book: salafBook.trim() || 'Kitab Al-Kaba\'ir',
      },
      taubatGuidance:
        taubatGuidance.trim() || 'Bertaubat nasuha dan iringi dengan banyak beristighfar.',
    };

    onSave(savedSin);
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
                {sinToEdit ? `Edit: Dosa Ke-${sinToEdit.kabairNumber}` : '+ Tambah Dosa Besar Baru'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Form Fields */}
            <View style={styles.row}>
              <View style={{ width: 90 }}>
                <Text style={styles.label}>NO. DOSA:</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={kabairNumber}
                  onChangeText={setKabairNumber}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.label}>JUDUL DOSA (INDONESIA):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Misal: Durhaka Kepada Orang Tua"
                  placeholderTextColor={THEME.colors.textTertiary}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>JUDUL ARAB:</Text>
              <TextInput
                style={[styles.input, { textAlign: 'right', fontSize: 16, color: THEME.colors.gold }]}
                placeholder="Misal: عُقُوقُ الْوَالِدَيْنِ"
                placeholderTextColor={THEME.colors.textTertiary}
                value={arabicTitle}
                onChangeText={setArabicTitle}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>KATEGORI DOSA:</Text>
              <View style={styles.categoryPicker}>
                {(['haqqullah', 'raga_kehormatan', 'keluarga', 'harta', 'lisan_sosial'] as const).map(
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
              <Text style={styles.label}>DEFINISI & BATASAN SYAR'I:</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                multiline
                placeholder="Jelaskan batasan apa saja yang masuk ke dalam dosa ini..."
                placeholderTextColor={THEME.colors.textTertiary}
                value={definition}
                onChangeText={setDefinition}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>TEKS ARAB DALIL (AYAT / HADITS):</Text>
              <TextInput
                style={[styles.input, styles.textArea, { textAlign: 'right' }]}
                multiline
                placeholder="Ketik atau tempel teks Arab dalil..."
                placeholderTextColor={THEME.colors.textTertiary}
                value={dalilArabic}
                onChangeText={setDalilArabic}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>TERJEMAHAN DALIL:</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                multiline
                placeholder="Terjemahan bahasa Indonesia..."
                placeholderTextColor={THEME.colors.textTertiary}
                value={dalilTranslation}
                onChangeText={setDalilTranslation}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>RUJUKAN DALIL (SURAH/HADITS):</Text>
              <TextInput
                style={styles.input}
                placeholder="Misal: HR. Bukhari no. 5976 / QS. Al-Isra: 32"
                placeholderTextColor={THEME.colors.textTertiary}
                value={dalilReference}
                onChangeText={setDalilReference}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>AKIBAT & ANCAMAN SIKSA DI AKHIRAT:</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                multiline
                placeholder="Sanksi di akhirat atau laknat yang diancamkan..."
                placeholderTextColor={THEME.colors.textTertiary}
                value={dangerAndConsequence}
                onChangeText={setDangerAndConsequence}
              />
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>NAMA ULAMA SALAF:</Text>
                <TextInput
                  style={styles.input}
                  value={salafScholar}
                  onChangeText={setSalafScholar}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>KITAB RUJUKAN:</Text>
                <TextInput
                  style={styles.input}
                  value={salafBook}
                  onChangeText={setSalafBook}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>KUTIPAN ATSAR ULAMA:</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                multiline
                placeholder="Kutipan perkataan ulama..."
                placeholderTextColor={THEME.colors.textTertiary}
                value={salafQuote}
                onChangeText={setSalafQuote}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>PANDUAN CARA BERTAUBAT:</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                multiline
                placeholder="Langkah nyata bertaubat dari dosa ini..."
                placeholderTextColor={THEME.colors.textTertiary}
                value={taubatGuidance}
                onChangeText={setTaubatGuidance}
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
              <Text style={styles.saveBtnText}>💾 Simpan Perubahan ke Web</Text>
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
  input: {
    backgroundColor: THEME.colors.surfaceLighter,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: THEME.spacing.sm,
    color: THEME.colors.textPrimary,
    fontSize: 12,
  },
  textArea: {
    minHeight: 65,
    textAlignVertical: 'top',
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
