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
    backgroundColor: THEME.colors.surfaceLighter,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.goldMuted,
    marginVertical: THEME.spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: THEME.spacing.xs,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.goldGlow,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  liveDot: {
    color: THEME.colors.gold,
    fontSize: 10,
    marginRight: 4,
  },
  liveText: {
    color: THEME.colors.gold,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginTop: 4,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
    marginBottom: THEME.spacing.md,
  },
  actionBtn: {
    backgroundColor: THEME.colors.gold,
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
  },
});
