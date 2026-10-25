import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { THEME } from '../constants/theme';
import { ECOSYSTEM_APPS, EcosystemApp } from '../constants/ecosystemData';

export const EcosystemNetworkSection: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [expandedAppId, setExpandedAppId] = useState<string | null>('iffah'); // default expand iffah details

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const toggleSection = () => {
    triggerHaptic();
    setIsCollapsed((prev) => !prev);
  };

  const handleOpenApp = async (app: EcosystemApp) => {
    triggerHaptic();

    if (app.status === 'coming_soon') {
      Alert.alert(
        `${app.name} (${app.arabicName})`,
        `Pilar khusus penakluk Fitnah Syubhat sedang dalam persiapan tim. Nantikan rilisnya di ekosistem Firar!`
      );
      return;
    }

    if (app.url) {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.open(app.url, '_blank');
      } else {
        const supported = await Linking.canOpenURL(app.url);
        if (supported) {
          await Linking.openURL(app.url);
        } else {
          Alert.alert('Buka Aplikasi', `Kunjungi tautan: ${app.url}`);
        }
      }
    }
  };

  const handleOpenGitHub = (e: any) => {
    e.stopPropagation?.();
    triggerHaptic();
    const githubUrl = 'https://github.com/khalilsaladdin/iffah';
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(githubUrl, '_blank');
    } else {
      Linking.openURL(githubUrl);
    }
  };

  return (
    <View style={styles.container}>
      {/* Section Header with Minimalist Collapse Toggle */}
      <TouchableOpacity
        style={styles.sectionHeaderBtn}
        onPress={toggleSection}
        activeOpacity={0.7}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.headerTagRow}>
            <Text style={styles.headerTag}>FIRAR NETWORK</Text>
            <View style={styles.tagDot} />
            <Text style={styles.headerSubTag}>2 Pilar Pemulihan</Text>
          </View>
          <Text style={styles.sectionTitle}>Gerbang Syahwat & Syubhat</Text>
        </View>

        <View style={styles.collapsePill}>
          <Text style={styles.collapsePillText}>
            {isCollapsed ? 'Buka Kolom ↓' : 'Tutup Kolom ↑'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <View style={styles.bodyWrapper}>
          {/* Minimalist Subtitle */}
          <Text style={styles.sectionDesc}>
            Sesuai kaidah ulama Salaf: <Text style={styles.boldLight}>Fitnah Syahwat</Text> ditundukkan dengan <Text style={styles.boldLight}>'Iffah</Text>, dan <Text style={styles.boldLight}>Fitnah Syubhat</Text> dihancurkan dengan <Text style={styles.boldLight}>Yaqeen</Text>.
          </Text>

          {/* Cards List: Clean, Understated, Minimalist */}
          <View style={styles.cardsList}>
            {ECOSYSTEM_APPS.map((app) => {
              const isActive = app.status === 'active';
              const isDetailsExpanded = expandedAppId === app.id;

              return (
                <View
                  key={app.id}
                  style={[
                    styles.appCard,
                    isActive ? styles.appCardActive : styles.appCardInactive,
                  ]}
                >
                  {/* Card Header Row */}
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <Text style={styles.appIconEmoji}>{app.icon}</Text>
                      <View>
                        <View style={styles.nameRow}>
                          <Text style={styles.appName}>{app.name}</Text>
                          <Text style={styles.arabicName}>({app.arabicName})</Text>
                        </View>
                        <Text style={styles.appCategory}>{app.category}</Text>
                      </View>
                    </View>

                    {/* Minimal Status Dot */}
                    <View style={styles.statusRow}>
                      <View
                        style={[
                          styles.statusDot,
                          { backgroundColor: isActive ? '#10B981' : '#64748B' },
                        ]}
                      />
                      <Text
                        style={[
                          styles.statusText,
                          { color: isActive ? '#10B981' : '#94A3B8' },
                        ]}
                      >
                        {isActive ? 'Aktif' : 'Persiapan'}
                      </Text>
                    </View>
                  </View>

                  {/* Clean Short Description */}
                  <Text style={styles.appTagline}>{app.tagline}</Text>

                  {/* Expandable Details Toggle */}
                  <TouchableOpacity
                    style={styles.detailsToggle}
                    onPress={() => {
                      triggerHaptic();
                      setExpandedAppId(isDetailsExpanded ? null : app.id);
                    }}
                    activeOpacity={0.6}
                  >
                    <Text style={styles.detailsToggleText}>
                      {isDetailsExpanded ? 'Sembunyikan rincian -' : 'Lihat rincian fitur +'}
                    </Text>
                  </TouchableOpacity>

                  {/* Features (Visible if expanded) */}
                  {isDetailsExpanded && (
                    <View style={styles.featuresList}>
                      {app.features.map((feat, fIdx) => (
                        <View key={fIdx} style={styles.featureItemRow}>
                          <Text style={styles.featureBullet}>•</Text>
                          <Text style={styles.featureItemText}>{feat}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Action Buttons: Minimalist & Clean */}
                  <View style={styles.cardFooter}>
                    {isActive ? (
                      <View style={styles.btnGroup}>
                        <TouchableOpacity
                          style={styles.primaryWebBtn}
                          onPress={() => handleOpenApp(app)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.primaryWebBtnText}>
                            Buka {app.name} (Web App) ↗
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.secondaryBtn}
                          onPress={handleOpenGitHub}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.secondaryBtnText}>GitHub</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.comingSoonPill}>
                        <Text style={styles.comingSoonText}>
                          Dalam tahap penyusunan materi & kurikulum
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: THEME.spacing.md,
    backgroundColor: THEME.colors.surface,
    borderColor: THEME.colors.border,
    borderWidth: 1,
    borderRadius: THEME.borderRadius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: THEME.colors.surfaceLighter,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(223, 186, 88, 0.1)',
  },
  headerTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  headerTag: {
    color: THEME.colors.gold,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  tagDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: THEME.colors.textTertiary,
  },
  headerSubTag: {
    color: THEME.colors.textSecondary,
    fontSize: 9,
    fontWeight: '600',
  },
  sectionTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  collapsePill: {
    backgroundColor: 'rgba(223, 186, 88, 0.1)',
    borderColor: 'rgba(223, 186, 88, 0.35)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.borderRadius.pill,
  },
  collapsePillText: {
    color: THEME.colors.goldLight,
    fontSize: 10,
    fontWeight: '700',
  },
  bodyWrapper: {
    padding: 14,
  },
  sectionDesc: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  boldLight: {
    color: THEME.colors.goldLight,
    fontWeight: '700',
  },
  cardsList: {
    gap: 12,
  },
  appCard: {
    backgroundColor: THEME.colors.surfaceLighter,
    borderColor: THEME.colors.border,
    borderWidth: 1,
    borderRadius: THEME.borderRadius.lg,
    padding: 14,
  },
  appCardActive: {
    borderColor: 'rgba(16, 185, 129, 0.45)',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    shadowColor: THEME.colors.emerald,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  appCardInactive: {
    borderColor: 'rgba(255, 255, 255, 0.07)',
    opacity: 0.85,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  appIconEmoji: {
    fontSize: 22,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appName: {
    color: THEME.colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  arabicName: {
    color: THEME.colors.gold,
    fontSize: 14,
    fontWeight: '700',
  },
  appCategory: {
    color: THEME.colors.emeraldLight,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.pill,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  appTagline: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 8,
  },
  detailsToggle: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  detailsToggleText: {
    color: THEME.colors.gold,
    fontSize: 11,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  featuresList: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: THEME.borderRadius.sm,
    padding: 10,
    marginBottom: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  featureItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  featureBullet: {
    color: THEME.colors.gold,
    fontSize: 10,
    marginTop: 1,
  },
  featureItemText: {
    flex: 1,
    color: THEME.colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  cardFooter: {
    marginTop: 4,
  },
  btnGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  primaryWebBtn: {
    flex: 1,
    backgroundColor: THEME.colors.emerald,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryWebBtnText: {
    color: '#07090E',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  secondaryBtn: {
    backgroundColor: THEME.colors.surface,
    borderColor: THEME.colors.border,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  comingSoonPill: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
  },
  comingSoonText: {
    color: THEME.colors.textTertiary,
    fontSize: 11,
    fontStyle: 'italic',
  },
});
