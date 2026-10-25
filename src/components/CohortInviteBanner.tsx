import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
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
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(223, 186, 88, 0.35)',
    marginVertical: THEME.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: THEME.spacing.xs,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.goldGlow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(223, 186, 88, 0.35)',
  },
  liveDot: {
    color: THEME.colors.gold,
    fontSize: 9,
    marginRight: 6,
  },
  liveText: {
    color: THEME.colors.goldLight,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    marginTop: 6,
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
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#07090E',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
