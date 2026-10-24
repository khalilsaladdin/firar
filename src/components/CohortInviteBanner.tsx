import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { THEME } from '../constants/theme';

export const CohortInviteBanner: React.FC = () => {
  const handleJoinClass = () => {
    Alert.alert(
      'Halaqah & Kelas Bimbingan Firar',
      'Pendaftaran Cohort Intensif 30 Hari: "Pembersihan Jiwa dari Belenggu Maksiat" bersama Ustadz pembimbing dan komunitas tertutup (Ikhwan/Akhwat terpisah) segera dibuka.\n\nApakah Anda ingin masuk ke dalam daftar antrean prioritas (Waitlist)?',
      [
        { text: 'Nanti Dulu', style: 'cancel' },
        {
          text: 'Bismillah, Masuk Waitlist',
          onPress: () => {
            Alert.alert(
              'Alhamdulillah',
              'Nama antrean Anda telah dicatat. Kami akan memberi tahu Anda ketika pendaftaran angkatan pertama dibuka secara resmi.'
            );
          },
        },
      ]
    );
  };

  return (
    <View style={styles.bannerContainer}>
      <View style={styles.badgeRow}>
        <View style={styles.liveBadge}>
          <Text style={styles.liveDot}>●</Text>
          <Text style={styles.liveText}>KELAS INTENSIF TERBIMBING</Text>
        </View>
      </View>

      <Text style={styles.bannerTitle}>Sulit Istiqomah Sendirian?</Text>
      <Text style={styles.bannerSubtitle}>
        Ikuti Halaqah Firar 30 Hari: Bimbingan Tazkiyatun Nufus mendalam berlandaskan Kitab Al-Jawab Al-Kafi & Madarijus Salikin bersama asatidzah dan lingkungan shalih.
      </Text>

      <TouchableOpacity
        style={styles.actionBtn}
        onPress={handleJoinClass}
        activeOpacity={0.8}
      >
        <Text style={styles.actionBtnText}>Pelajari Kurikulum & Gabung Kelas ›</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: '#121212',
    borderRadius: THEME.borderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginVertical: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.borderRadius.pill,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  liveDot: {
    color: '#10B981',
    fontSize: 8,
    marginRight: 4,
  },
  liveText: {
    color: '#8E8E93',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
    marginTop: 2,
    marginBottom: 2,
  },
  bannerSubtitle: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    lineHeight: 16,
    marginBottom: 10,
  },
  actionBtn: {
    backgroundColor: '#F5F5F7',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '600',
  },
});
