import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { THEME } from '../constants/theme';

export const AboutFirarSection: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const toggleCollapse = () => {
    triggerHaptic();
    setIsCollapsed((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      {/* Header Row with Toggle */}
      <TouchableOpacity
        style={styles.headerBtn}
        onPress={toggleCollapse}
        activeOpacity={0.7}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.tagRow}>
            <Text style={styles.tagText}>TENTANG PLATFORM</Text>
            <View style={styles.tagDot} />
            <Text style={styles.subTagText}>Misi & Ruang Gerak</Text>
          </View>
          <Text style={styles.titleText}>Mengenal Firar (فِرَار)</Text>
        </View>

        <View style={styles.collapsePill}>
          <Text style={styles.collapsePillText}>
            {isCollapsed ? 'Buka ↓' : 'Tutup ↑'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <View style={styles.body}>
          {/* 1. Asal Usul Nama */}
          <View style={styles.block}>
            <Text style={styles.blockHeading}>1. Asal Usul Nama & Makna</Text>
            <Text style={styles.paragraph}>
              Nama <Text style={styles.boldWhite}>Firar (فِرَار)</Text> diambil dari firman Allah Ta'ala:
            </Text>
            <View style={styles.quoteBox}>
              <Text style={styles.quoteArabic}>فَفِرُّوا إِلَى اللَّهِ ۖ إِنِّي لَكُمْ مِنْهُ نَذِيرٌ مُبِينٌ</Text>
              <Text style={styles.quoteTranslation}>
                "Maka berlarilah kembali menuju Allah. Sesungguhnya aku adalah seorang pemberi peringatan yang nyata dari-Nya untukmu." (QS. Az-Zariyat: 50)
              </Text>
            </View>
            <Text style={styles.paragraph}>
              Ibnul Qayyim menjelaskan rahasia ayat ini: <Text style={styles.italicText}>"Segala sesuatu yang engkau takuti di dunia ini, engkau akan lari menjauh darinya. Namun jika engkau takut kepada Allah, engkau justru akan berlari mendekat dan bersimpuh di hadapan-Nya."</Text>
            </Text>
          </View>

          {/* 2. Bergerak di Bidang Apa */}
          <View style={styles.block}>
            <Text style={styles.blockHeading}>2. Bergerak di Bidang Apa?</Text>
            <Text style={styles.paragraph}>
              Firar bergerak di bidang <Text style={styles.boldWhite}>Tazkiyatun Nufus (Penyucian Jiwa), Dakwah Pemulihan Perilaku, & Kesehatan Mental Islami</Text>:
            </Text>
            <View style={styles.bulletList}>
              <View style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>
                  <Text style={styles.boldWhite}>Integrasi Syar'i & Neurosains:</Text> Memadukan khazanah kitab para ulama Salafus Shalih (*Kitab Al-Kaba'ir karya Imam Adz-Dzahabi, Al-Jawab Al-Kafi karya Ibnul Qayyim*) dengan pemahaman ilmiah modern mengenai pemulihan sirkuit dopamin otak (*Prefrontal Cortex*).
                </Text>
              </View>
              <View style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>
                  <Text style={styles.boldWhite}>Payung Ekosistem (Meta Hub):</Text> Menaungi aplikasi spesialis untuk menuntaskan dua fitnah terbesar manusia: <Text style={styles.boldWhite}>Fitnah Syahwat</Text> (melalui pilar Iffah) dan <Text style={styles.boldWhite}>Fitnah Syubhat</Text> (melalui pilar Yaqeen).
                </Text>
              </View>
              <View style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>
                  <Text style={styles.boldWhite}>100% Menjaga Aib & Privasi:</Text> Menolak budaya menghakimi (*zero judgment*), tanpa stigma, dan data perjalanan tersimpan secara anonim langsung di perangkat pengguna.
                </Text>
              </View>
            </View>
          </View>

          {/* 3. Tujuan Utama Didirikan */}
          <View style={styles.block}>
            <Text style={styles.blockHeading}>3. Tujuan Utama Firar</Text>
            <View style={styles.bulletList}>
              <View style={styles.bulletRow}>
                <Text style={styles.bulletDot}>1.</Text>
                <Text style={styles.bulletText}>
                  Menyediakan suaka dan bimbingan terstruktur 30 hari bagi setiap Muslim yang ingin keluar dari lingkaran maksiat berulang (*pornografi, rokok, miras, kelalaian shalat*).
                </Text>
              </View>
              <View style={styles.bulletRow}>
                <Text style={styles.bulletDot}>2.</Text>
                <Text style={styles.bulletText}>
                  Menghilangkan jerat keputusasaan pasca terjatuh (*shame spiral*) dengan mengubah rasa bersalah menjadi bahan bakar taubat dan amal saleh pengganti.
                </Text>
              </View>
              <View style={styles.bulletRow}>
                <Text style={styles.bulletDot}>3.</Text>
                <Text style={styles.bulletText}>
                  Menghadirkan lingkungan sahabat seperjuangan (*Halaqah Ukhuwah*) agar tidak ada jiwa yang merasa berjuang sendirian di jalan hijrah ini.
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.surface,
    borderColor: THEME.colors.border,
    borderWidth: 1,
    borderRadius: THEME.borderRadius.md,
    marginVertical: 8,
    overflow: 'hidden',
  },
  headerBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#161616',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  tagText: {
    color: '#8E8E93',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  tagDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#636366',
  },
  subTagText: {
    color: '#636366',
    fontSize: 9,
    fontWeight: '500',
  },
  titleText: {
    color: '#F5F5F7',
    fontSize: 13,
    fontWeight: '600',
  },
  collapsePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: THEME.colors.border,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.pill,
  },
  collapsePillText: {
    color: '#8E8E93',
    fontSize: 10,
    fontWeight: '600',
  },
  body: {
    padding: 12,
    gap: 12,
  },
  block: {
    gap: 4,
  },
  blockHeading: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F5F5F7',
    marginBottom: 2,
  },
  paragraph: {
    fontSize: 11,
    color: '#8E8E93',
    lineHeight: 16,
  },
  boldWhite: {
    color: '#F5F5F7',
    fontWeight: '600',
  },
  italicText: {
    fontStyle: 'italic',
    color: '#CBD5E1',
  },
  quoteBox: {
    backgroundColor: '#181818',
    borderColor: '#262626',
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginVertical: 4,
  },
  quoteArabic: {
    color: '#F5F5F7',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '500',
  },
  quoteTranslation: {
    color: '#8E8E93',
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
  },
  bulletList: {
    marginTop: 4,
    gap: 6,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  bulletDot: {
    color: '#8E8E93',
    fontSize: 10,
    fontWeight: 'bold',
  },
  bulletText: {
    flex: 1,
    color: '#8E8E93',
    fontSize: 11,
    lineHeight: 16,
  },
});
