import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { THEME } from '../constants/theme';

interface StreakCardProps {
  streakDays: number;
  longestStreak: number;
  relapseCount: number;
  onAuditPress: () => void;
}

export const StreakCard: React.FC<StreakCardProps> = ({
  streakDays,
  longestStreak,
  relapseCount,
  onAuditPress,
}) => {
  const [hideNumber, setHideNumber] = useState<boolean>(false);

  const toggleHide = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setHideNumber(!hideNumber);
  };

  return (
    <View style={styles.card}>
      {/* Top Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeDot}>●</Text>
          <Text style={styles.badgeText}>HARI INI DALAM PENJAGAAN ALLAH</Text>
        </View>

        <View style={styles.actionLinks}>
          <TouchableOpacity onPress={toggleHide} style={styles.miniLinkBtn} activeOpacity={0.7}>
            <Text style={styles.miniLinkText}>
              {hideNumber ? '👁️ Tampilkan Angka' : '🔒 Sembunyikan'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.dotSeparator}>•</Text>
          <TouchableOpacity onPress={onAuditPress} style={styles.miniLinkBtn} activeOpacity={0.7}>
            <Text style={styles.miniLinkText}>Audit Diri</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Counter Row atau Mode Fokus Batiniah */}
      <View style={styles.counterRow}>
        {!hideNumber ? (
          <>
            <Text style={styles.countNumber}>{streakDays}</Text>
            <View style={styles.labelWrapper}>
              <Text style={styles.countUnit}>HARI BERTAHAN</Text>
              <Text style={styles.spiritualNote}>
                Alhamdulillah, langkahmu dijaga dari maksiat karena Allah.
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.hiddenModeBox}>
            <Text style={styles.hiddenModeTitle}>Fokus Hari Ini: Menjaga Hati</Text>
            <Text style={styles.hiddenModeSubtext}>
              Angka disembunyikan agar hati terhindar dari penyakit ujub dan tetap tawadhu'.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.divider} />

      {/* Meta Row (Menggunakan Bahasa Kembali, Bukan Menghukum) */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Perjalanan Bertahan</Text>
          <Text style={styles.metaValue}>{longestStreak} Hari</Text>
        </View>

        <View style={styles.verticalDivider} />

        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Langkah Kembali</Text>
          <Text style={styles.metaValue}>
            {relapseCount > 0 ? `${relapseCount} Kali Bangkit` : 'Terus Terjaga'}
          </Text>
        </View>

        <View style={styles.verticalDivider} />

        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Pintu Rahmat</Text>
          <Text style={[styles.metaValue, { color: THEME.colors.emerald }]}>
            Selalu Terbuka
          </Text>
        </View>
      </View>

      {/* Pengingat Adab Muhasabah */}
      <View style={styles.adabFooter}>
        <Text style={styles.adabText}>
          "Bukan tingginya angka yang dinilai Allah, melainkan kejujuran niat dan kesungguhanmu untuk terus pulang kepada-Nya."
        </Text>
      </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.pill,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  badgeDot: {
    color: '#10B981',
    fontSize: 8,
    marginRight: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#E4E6EB',
    letterSpacing: 0.2,
  },
  actionLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniLinkBtn: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  miniLinkText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    textDecorationLine: 'none',
  },
  dotSeparator: {
    color: THEME.colors.textTertiary,
    marginHorizontal: 4,
    fontSize: 10,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 4,
  },
  countNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginRight: 8,
  },
  labelWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  countUnit: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    letterSpacing: 0.5,
  },
  spiritualNote: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 1,
    lineHeight: 15,
  },
  hiddenModeBox: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 4,
  },
  hiddenModeTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  hiddenModeSubtext: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 1,
    fontStyle: 'normal',
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.border,
    marginVertical: 10,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  verticalDivider: {
    width: 1,
    height: 20,
    backgroundColor: THEME.colors.border,
  },
  metaLabel: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  adabFooter: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  adabText: {
    fontSize: 10,
    color: THEME.colors.textTertiary,
    textAlign: 'center',
    fontStyle: 'normal',
    lineHeight: 14,
  },
});
