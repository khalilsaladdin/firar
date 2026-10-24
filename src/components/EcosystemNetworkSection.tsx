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
    borderRadius: THEME.borderRadius.lg,
    overflow: 'hidden',
  },
  sectionHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: THEME.spacing.md,
    backgroundColor: THEME.colors.surfaceLighter,
  },
  headerTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  headerTag: {
    color: THEME.colors.gold,
    fontSize: 10,
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
    fontSize: 10,
    fontWeight: '600',
  },
  sectionTitle: {
    color: THEME.colors.gold,
    fontSize: 14,
    fontWeight: '800',
  },
  collapsePill: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderColor: 'rgba(212, 175, 55, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.pill,
  },
  collapsePillText: {
    color: THEME.colors.gold,
    fontSize: 10,
    fontWeight: '700',
  },
  bodyWrapper: {
    padding: 12,
  },
  sectionDesc: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  boldLight: {
    color: THEME.colors.textPrimary,
    fontWeight: '600',
  },
  cardsList: {
    gap: 8,
  },
  appCard: {
    backgroundColor: THEME.colors.surfaceLighter,
    borderColor: THEME.colors.border,
    borderWidth: 1,
    borderRadius: THEME.borderRadius.md,
    padding: 12,
  },
  appCardActive: {
    borderColor: 'rgba(16, 185, 129, 0.5)',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  appCardInactive: {
    borderColor: THEME.colors.border,
    opacity: 0.8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  appIconEmoji: {
    fontSize: 18,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  appName: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  arabicName: {
    color: THEME.colors.gold,
    fontSize: 13,
    fontWeight: '600',
  },
  appCategory: {
    color: THEME.colors.textTertiary,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 6,
  },
  detailsToggle: {
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  detailsToggleText: {
    color: THEME.colors.gold,
    fontSize: 11,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  featuresList: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    gap: 4,
  },
  featureItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  featureBullet: {
    color: THEME.colors.gold,
    fontSize: 10,
    fontWeight: 'bold',
  },
  featureItemText: {
    flex: 1,
    color: THEME.colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  cardFooter: {
    marginTop: 2,
  },
  btnGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  primaryWebBtn: {
    flex: 1,
    backgroundColor: THEME.colors.emerald,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryWebBtnText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: THEME.colors.surface,
    borderColor: THEME.colors.border,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: THEME.colors.textPrimary,
    fontSize: 11,
    fontWeight: '600',
  },
  comingSoonPill: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    alignItems: 'center',
  },
  comingSoonText: {
    color: THEME.colors.textTertiary,
    fontSize: 10,
    fontStyle: 'italic',
  },
});
