import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { THEME } from '../constants/theme';
import { UserState, ArticleItem, SinItem } from '../types';
import { CURRICULUM_DATA } from '../constants/curriculumData';
import { KABA_IR_INTRO } from '../constants/kabairData';
import { StreakCard } from '../components/StreakCard';
import { DailyCurriculumCard } from '../components/DailyCurriculumCard';
import { CohortInviteBanner } from '../components/CohortInviteBanner';
import { PauseModal } from '../components/PauseModal';
import { PrivacySettingsModal } from '../components/PrivacySettingsModal';
import { TasbihModal } from '../components/TasbihModal';
import { RoadmapModal } from '../components/RoadmapModal';
import { ArticleReaderModal } from '../components/ArticleReaderModal';
import { SinDetailModal } from '../components/SinDetailModal';
import { OwnerAuthModal } from '../components/OwnerAuthModal';
import { EditSinModal } from '../components/EditSinModal';
import { EditArticleModal } from '../components/EditArticleModal';
import { HalaqahPortal } from '../components/HalaqahPortal';
import { EcosystemNetworkSection } from '../components/EcosystemNetworkSection';
import { AboutFirarSection } from '../components/AboutFirarSection';
import { StorageService } from '../services/storage';

interface DashboardScreenProps {
  userState: UserState;
  onStateUpdate: (updated: UserState) => void;
  onResetToOnboarding: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  userState,
  onStateUpdate,
  onResetToOnboarding,
}) => {
  // Main Tab: 'beranda' (Public Main Page) vs 'halaqah' (Member Portal & Cohort)
  const [activeMainTab, setActiveMainTab] = useState<'beranda' | 'halaqah'>('beranda');

  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(
    userState.currentCurriculumDay || 1
  );
  const [pauseModalVisible, setPauseModalVisible] = useState<boolean>(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState<boolean>(false);
  const [tasbihModalVisible, setTasbihModalVisible] = useState<boolean>(false);
  const [roadmapModalVisible, setRoadmapModalVisible] = useState<boolean>(false);

  // Collapse/Expand section toggles for clean feed scrolling
  const [isKabairCollapsed, setIsKabairCollapsed] = useState<boolean>(false);
  const [isArticlesCollapsed, setIsArticlesCollapsed] = useState<boolean>(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('semua');
  const [activeArticle, setActiveArticle] = useState<ArticleItem | null>(null);

  // Al-Kabair Sins State
  const [selectedSinCategory, setSelectedSinCategory] = useState<string>('semua');
  const [activeSin, setActiveSin] = useState<SinItem | null>(null);

  // Owner CMS Modals State
  const [ownerAuthModalVisible, setOwnerAuthModalVisible] = useState<boolean>(false);
  const [secretTapCount, setSecretTapCount] = useState<number>(0);
  const [editSinModalVisible, setEditSinModalVisible] = useState<boolean>(false);
  const [sinToEdit, setSinToEdit] = useState<SinItem | null>(null);
  const [editArticleModalVisible, setEditArticleModalVisible] = useState<boolean>(false);
  const [articleToEdit, setArticleToEdit] = useState<ArticleItem | null>(null);

  const currentDayData =
    CURRICULUM_DATA.find((d) => d.day === selectedDayNumber) || CURRICULUM_DATA[0];

  const isDayCompleted = userState.completedCurriculumDays.includes(selectedDayNumber);
  const currentSavedNote = userState.dailyReflections?.[selectedDayNumber] || '';

  const triggerLightHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleToggleDayComplete = async () => {
    const updated = await StorageService.markDayCompleted(selectedDayNumber);
    onStateUpdate(updated);
  };

  const handleSaveNote = async (note: string) => {
    const updated = await StorageService.saveDailyReflection(selectedDayNumber, note);
    onStateUpdate(updated);
  };

  const handleOpenPause = () => {
    triggerLightHaptic();
    setPauseModalVisible(true);
  };

  const handleSecretTitlePress = () => {
    setSecretTapCount((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        triggerLightHaptic();
        setOwnerAuthModalVisible(true);
        return 0;
      }
      return next;
    });
  };

  const handlePauseSuccess = () => {
    setPauseModalVisible(false);
    Alert.alert(
      'Alhamdulillah, Jiwa Mulai Tenang',
      'Setiap kali kita menahan diri dari syahwat karena Allah, Allah menumbuhkan seberkas cahaya keimanan di dalam dada. Teruskan langkah istiqomah ini hari ini.',
      [{ text: 'Alhamdulillah', style: 'default' }]
    );
  };

  const handleRelapseRecord = async () => {
    setPauseModalVisible(false);
    Alert.alert(
      'Pintu Taubat Selalu Terbuka',
      'Tidak apa-apa. Terpeleset bukan berarti engkau gagal selamanya. Rasulullah ﷺ bersabda: "Sebaik-baik orang yang bersalah adalah yang bertaubat."\n\nMari ambil air wudhu dengan tenang, dirikan shalat taubat 2 rakaat, dan kita mulai kembali langkah hari ini dengan bismillah.',
      [
        {
          text: 'Bismillah, Mulai Kembali',
          onPress: async () => {
            const updated = await StorageService.recordRelapse();
            onStateUpdate(updated);
          },
        },
      ]
    );
  };

  // =========================================================================
  // OWNER CMS HANDLERS (EDIT, TAMBAH, HAPUS DOSA & ARTIKEL LANGSUNG DI WEB)
  // =========================================================================
  const allSins = userState.customSins || [];
  const allArticles = userState.customArticles || [];

  const handleSaveSin = async (savedSin: SinItem) => {
    triggerLightHaptic();
    const existingIdx = allSins.findIndex((s) => s.id === savedSin.id);
    let updatedList: SinItem[];
    if (existingIdx >= 0) {
      updatedList = [...allSins];
      updatedList[existingIdx] = savedSin;
    } else {
      updatedList = [savedSin, ...allSins];
    }
    const updatedState = await StorageService.saveCustomSins(updatedList);
    onStateUpdate(updatedState);
    Alert.alert('Sukses', `Data Dosa "${savedSin.title}" berhasil disimpan ke web!`);
  };

  const handleDeleteSin = (sinId: string, sinTitle: string) => {
    Alert.alert('Hapus Dosa?', `Apakah Anda yakin ingin menghapus data dosa "${sinTitle}" dari web?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          triggerLightHaptic();
          const filtered = allSins.filter((s) => s.id !== sinId);
          const updatedState = await StorageService.saveCustomSins(filtered);
          onStateUpdate(updatedState);
        },
      },
    ]);
  };

  const handleSaveArticle = async (savedArticle: ArticleItem) => {
    triggerLightHaptic();
    const existingIdx = allArticles.findIndex((a) => a.id === savedArticle.id);
    let updatedList: ArticleItem[];
    if (existingIdx >= 0) {
      updatedList = [...allArticles];
      updatedList[existingIdx] = savedArticle;
    } else {
      updatedList = [savedArticle, ...allArticles];
    }
    const updatedState = await StorageService.saveCustomArticles(updatedList);
    onStateUpdate(updatedState);
    Alert.alert('Sukses', `Artikel "${savedArticle.title}" berhasil disimpan dan terbit di web!`);
  };

  const handleDeleteArticle = (articleId: string, articleTitle: string) => {
    Alert.alert('Hapus Artikel?', `Apakah Anda yakin ingin menghapus artikel "${articleTitle}"?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          triggerLightHaptic();
          const filtered = allArticles.filter((a) => a.id !== articleId);
          const updatedState = await StorageService.saveCustomArticles(filtered);
          onStateUpdate(updatedState);
        },
      },
    ]);
  };

  // Filter lists
  const filteredArticles =
    selectedCategoryFilter === 'semua'
      ? allArticles
      : allArticles.filter((a) => a.category === selectedCategoryFilter);

  const filteredSins =
    selectedSinCategory === 'semua'
      ? allSins
      : allSins.filter((s) => s.category === selectedSinCategory);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top App Header */}
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleSecretTitlePress}
          >
            <Text style={styles.headerTitle}>FIRAR • فِرَار</Text>
            <Text style={styles.headerSubtitle}>
              {activeMainTab === 'beranda'
                ? 'Halaman Utama • Pulang Menuju Allah'
                : 'Portal Murid • Bimbingan & Ukhuwah'}
            </Text>
          </TouchableOpacity>

          {/* Quick Action Badges */}
          <View style={styles.headerActions}>
            {/* Tombol Mode Pengelola Owner - Hanya Tampil Jika Sedang Aktif */}
            {userState.isOwnerMode && (
              <TouchableOpacity
                onPress={() => {
                  triggerLightHaptic();
                  setOwnerAuthModalVisible(true);
                }}
                style={[
                  styles.ownerBadge,
                  styles.ownerBadgeActive,
                ]}
                activeOpacity={0.7}
              >
                <Text style={[styles.ownerBadgeText, styles.textGold]}>
                  👑 Owner: AKTIF
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => {
                triggerLightHaptic();
                setTasbihModalVisible(true);
              }}
              style={styles.iconBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.iconBtnText}>📿</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                triggerLightHaptic();
                setPrivacyModalVisible(true);
              }}
              style={styles.privacyBadge}
              activeOpacity={0.7}
            >
              <Text style={styles.privacyBadgeText}>🛡️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ================================================================ */}
        {/* TAB 1: BERANDA PUBLIK (ALL CORE & PUBLIC FEATURES)              */}
        {/* ================================================================ */}
        {activeMainTab === 'beranda' ? (
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Banner Mode Pengelola Aktif */}
            {userState.isOwnerMode && (
              <View style={styles.ownerActiveBanner}>
                <Text style={styles.ownerActiveBannerTitle}>
                  👑 MODE PENGELOLA AKTIF: Anda dapat menambah, mengedit, atau menghapus teks langsung di halaman ini.
                </Text>
              </View>
            )}

            {/* Niat Hari Ini Banner */}
            {userState.todayCommitment && (
              <View style={styles.commitmentBanner}>
                <Text style={styles.commitmentLabel}>NIAT SAYA HARI INI:</Text>
                <Text style={styles.commitmentText}>"{userState.todayCommitment}"</Text>
              </View>
            )}

            {/* Streak Card */}
            <StreakCard
              streakDays={userState.cleanStreakDays}
              longestStreak={userState.longestStreakDays}
              relapseCount={userState.relapseCount}
              onAuditPress={() => setPrivacyModalVisible(true)}
            />

            {/* Memento Reminder Banner */}
            <View style={styles.mementoPill}>
              <Text style={styles.mementoPillText}>
                ⏳ "Dunia ini singkat, dan nafas kita adalah pinjaman. Jadikan setiap detik hari ini bersih dalam keridhaan-Nya."
              </Text>
            </View>

            {/* Seksi: Tentang FIRAR (Misi, Ruang Gerak & Tujuan) */}
            <AboutFirarSection />

            {/* Daily Curriculum Card */}
            <DailyCurriculumCard
              dayData={currentDayData}
              isCompleted={isDayCompleted}
              savedNote={currentSavedNote}
              onToggleComplete={handleToggleDayComplete}
              onSaveNote={handleSaveNote}
              onPreviousDay={() => {
                triggerLightHaptic();
                setSelectedDayNumber((prev) => Math.max(1, prev - 1));
              }}
              onNextDay={() => {
                triggerLightHaptic();
                setSelectedDayNumber((prev) => Math.min(30, prev + 1));
              }}
              onOpenTasbih={() => setTasbihModalVisible(true)}
              onOpenRoadmap={() => setRoadmapModalVisible(true)}
              hasPrevious={selectedDayNumber > 1}
              hasNext={selectedDayNumber < 30}
            />

            {/* ============================================================ */}
            {/* SEKSI: MENGENAL DOSA-DOSA (KITAB AL-KABA'IR)                */}
            {/* ============================================================ */}
            <View style={styles.kabairSection}>
              <View style={styles.sectionHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionTitle}>⚖️ MENGENAL DOSA-DOSA (KITAB AL-KABA'IR)</Text>
                  <Text style={styles.sectionSubtitle}>
                    Kajian rujukan Imam Adz-Dzahabi & Salafus Shalih
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  {/* Tombol Tambah Dosa Baru jika Mode Pengelola Aktif */}
                  {userState.isOwnerMode && (
                    <TouchableOpacity
                      style={styles.ownerAddBtn}
                      onPress={() => {
                        triggerLightHaptic();
                        setSinToEdit(null);
                        setEditSinModalVisible(true);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.ownerAddBtnText}>+ Dosa</Text>
                    </TouchableOpacity>
                  )}

                  {/* Tombol Tutup / Buka Kolom Al-Kabair */}
                  <TouchableOpacity
                    style={styles.collapseHeaderPill}
                    onPress={() => {
                      triggerLightHaptic();
                      setIsKabairCollapsed((prev) => !prev);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.collapseHeaderPillText}>
                      {isKabairCollapsed ? 'Buka ↓' : 'Tutup ↑'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {!isKabairCollapsed && (
                <>
                  {/* Kaidah Emas Salaf Box */}
                  <View style={styles.goldenRuleCard}>
                <Text style={styles.goldenRuleQuote}>{KABA_IR_INTRO.salafGoldenRule}</Text>
                <Text style={styles.goldenRuleDef}>{KABA_IR_INTRO.definitionSalaf}</Text>
              </View>

              {/* Filter Category Chips Al-Kabair */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
                {[
                  { id: 'semua', label: 'Semua Dosa' },
                  { id: 'haqqullah', label: '⚡ Hak Allah' },
                  { id: 'raga_kehormatan', label: '💔 Raga & Zina' },
                  { id: 'keluarga', label: '👨‍👩‍👧 Orang Tua' },
                  { id: 'harta', label: '💰 Riba & Harta' },
                  { id: 'lisan_sosial', label: '🗣️ Ghibah & Lisan' },
                ].map((chip) => {
                  const isActive = selectedSinCategory === chip.id;
                  return (
                    <TouchableOpacity
                      key={chip.id}
                      style={[styles.filterChip, isActive && styles.filterChipActive]}
                      onPress={() => {
                        triggerLightHaptic();
                        setSelectedSinCategory(chip.id);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                        {chip.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Sins Grid Cards */}
              <View style={styles.sinsList}>
                {filteredSins.map((sin) => (
                  <View key={sin.id} style={styles.sinCard}>
                    <TouchableOpacity
                      onPress={() => {
                        triggerLightHaptic();
                        setActiveSin(sin);
                      }}
                      activeOpacity={0.8}
                    >
                      <View style={styles.sinCardTop}>
                        <View style={styles.sinBadge}>
                          <Text style={styles.sinBadgeText}>DOSA BESAR KE-{sin.kabairNumber}</Text>
                        </View>
                        <Text style={styles.sinArabicSmall}>{sin.arabicTitle}</Text>
                      </View>

                      <Text style={styles.sinCardTitle}>{sin.title}</Text>
                      <Text style={styles.sinCardDesc} numberOfLines={2}>
                        {sin.definition}
                      </Text>
                    </TouchableOpacity>

                    {/* Footer Row (Termasuk Tombol Edit & Hapus jika Mode Pengelola Aktif) */}
                    <View style={styles.sinCardFooter}>
                      <Text style={styles.sinCategoryBadgeText}>{sin.categoryLabel}</Text>

                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        {userState.isOwnerMode ? (
                          <>
                            <TouchableOpacity
                              onPress={() => {
                                triggerLightHaptic();
                                setSinToEdit(sin);
                                setEditSinModalVisible(true);
                              }}
                              style={styles.miniEditBtn}
                            >
                              <Text style={styles.miniEditText}>✏️ Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => handleDeleteSin(sin.id, sin.title)}
                              style={styles.miniDeleteBtn}
                            >
                              <Text style={styles.miniDeleteText}>🗑️</Text>
                            </TouchableOpacity>
                          </>
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              triggerLightHaptic();
                              setActiveSin(sin);
                            }}
                          >
                            <Text style={styles.readMoreLink}>Buka Dalil & Bahaya ›</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>

            {/* ============================================================ */}
            {/* SEKSI: EKOSISTEM SATELIT KHUSUS (FIRAR NETWORK)              */}
            {/* ============================================================ */}
            <EcosystemNetworkSection />

            {/* ============================================================ */}
            {/* SEKSI: KHAZANAH ARTIKEL & BAHAYA MAKSIAT                    */}
            {/* ============================================================ */}
            <View style={styles.articlesSection}>
              <View style={styles.sectionHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionTitle}>📖 KHAZANAH RISALAH & BAHAYA MAKSIAT</Text>
                  <Text style={styles.sectionSubtitle}>
                    Edukasi syar'i & ilmiah agar akal sadar akan racun dosa
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  {/* Tombol Tulis Artikel Baru jika Mode Pengelola Aktif */}
                  {userState.isOwnerMode && (
                    <TouchableOpacity
                      style={styles.ownerAddBtn}
                      onPress={() => {
                        triggerLightHaptic();
                        setArticleToEdit(null);
                        setEditArticleModalVisible(true);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.ownerAddBtnText}>+ Artikel</Text>
                    </TouchableOpacity>
                  )}

                  {/* Tombol Tutup / Buka Kolom Artikel */}
                  <TouchableOpacity
                    style={styles.collapseHeaderPill}
                    onPress={() => {
                      triggerLightHaptic();
                      setIsArticlesCollapsed((prev) => !prev);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.collapseHeaderPillText}>
                      {isArticlesCollapsed ? 'Buka ↓' : 'Tutup ↑'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {!isArticlesCollapsed && (
                <>
                  {/* Filter Category Chips Artikel */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
                {[
                  { id: 'semua', label: 'Semua Risalah' },
                  { id: 'pandangan_zina', label: '👁️ Zina Mata' },
                  { id: 'rokok_khamr', label: '🚭 Rokok & Khamr' },
                  { id: 'shalat_terlambat', label: '⏳ Lalai Shalat' },
                  { id: 'medsos_ghibah', label: '📱 Medsos & Lisan' },
                ].map((chip) => {
                  const isActive = selectedCategoryFilter === chip.id;
                  return (
                    <TouchableOpacity
                      key={chip.id}
                      style={[styles.filterChip, isActive && styles.filterChipActive]}
                      onPress={() => {
                        triggerLightHaptic();
                        setSelectedCategoryFilter(chip.id);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                        {chip.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* List Artikel */}
              <View style={styles.articlesList}>
                {filteredArticles.map((article) => (
                  <View key={article.id} style={styles.articleCard}>
                    <TouchableOpacity
                      onPress={() => {
                        triggerLightHaptic();
                        setActiveArticle(article);
                      }}
                      activeOpacity={0.8}
                    >
                      <View style={styles.articleCardTop}>
                        <View style={styles.cardCatBadge}>
                          <Text style={styles.cardCatText}>{article.categoryLabel}</Text>
                        </View>
                        <Text style={styles.articleReadTime}>⏱️ {article.readTimeMinutes} Mnt Baca</Text>
                      </View>

                      <Text style={styles.articleCardTitle}>{article.title}</Text>
                      <Text style={styles.articleCardSummary} numberOfLines={2}>
                        {article.summary}
                      </Text>
                    </TouchableOpacity>

                    <View style={styles.articleCardFooter}>
                      <Text style={styles.articleAuthor}>✍️ {article.authorOrSource}</Text>

                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        {userState.isOwnerMode ? (
                          <>
                            <TouchableOpacity
                              onPress={() => {
                                triggerLightHaptic();
                                setArticleToEdit(article);
                                setEditArticleModalVisible(true);
                              }}
                              style={styles.miniEditBtn}
                            >
                              <Text style={styles.miniEditText}>✏️ Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => handleDeleteArticle(article.id, article.title)}
                              style={styles.miniDeleteBtn}
                            >
                              <Text style={styles.miniDeleteText}>🗑️</Text>
                            </TouchableOpacity>
                          </>
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              triggerLightHaptic();
                              setActiveArticle(article);
                            }}
                          >
                            <Text style={styles.readMoreLink}>Baca Risalah ›</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>

            {/* Cohort Funnel Banner */}
            <CohortInviteBanner />

            {/* Bottom spacing for floating button & bottom bar */}
            <View style={{ height: 140 }} />
          </ScrollView>
        ) : (
          /* ================================================================ */
          /* TAB 2: PORTAL HALAQAH & SAHABAT SHALIH (MEMBER AREA)           */
          /* ================================================================ */
          <HalaqahPortal userState={userState} onStateUpdate={onStateUpdate} />
        )}

        {/* Floating As-Sakinah (Pause) Button (Hanya Muncul di Tab Beranda) */}
        {activeMainTab === 'beranda' && (
          <View style={styles.floatingButtonContainer}>
            <TouchableOpacity
              style={styles.pauseButton}
              onPress={handleOpenPause}
              activeOpacity={0.85}
            >
              <View style={styles.pauseIconCircle}>
                <Text style={styles.pauseIconText}>🌿</Text>
              </View>
              <View style={styles.pauseTextContainer}>
                <Text style={styles.pauseButtonTitle}>JEDA SEJENAK (AS-SAKINAH)</Text>
                <Text style={styles.pauseButtonSubtitle}>
                  Sentuh jika merasakan bisikan syahwat atau kegelisahan hati
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* ================================================================ */}
        {/* BOTTOM NAVIGATION BAR                                            */}
        {/* ================================================================ */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={[styles.navTabItem, activeMainTab === 'beranda' && styles.navTabItemActive]}
            onPress={() => {
              triggerLightHaptic();
              setActiveMainTab('beranda');
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.navTabIcon, activeMainTab === 'beranda' && styles.textGold]}>
              🏠
            </Text>
            <Text style={[styles.navTabLabel, activeMainTab === 'beranda' && styles.textGold]}>
              Beranda Publik
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navTabItem, activeMainTab === 'halaqah' && styles.navTabItemActive]}
            onPress={() => {
              triggerLightHaptic();
              setActiveMainTab('halaqah');
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.navTabIcon, activeMainTab === 'halaqah' && styles.textGold]}>
              🎓
            </Text>
            <Text style={[styles.navTabLabel, activeMainTab === 'halaqah' && styles.textGold]}>
              Portal Halaqah {userState.memberProfile ? '✓' : ''}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Modals Standar */}
        <PauseModal
          visible={pauseModalVisible}
          onClose={() => setPauseModalVisible(false)}
          onRelapse={handleRelapseRecord}
          onSuccessResist={handlePauseSuccess}
        />

        <PrivacySettingsModal
          visible={privacyModalVisible}
          userState={userState}
          onClose={() => setPrivacyModalVisible(false)}
          onWipeData={onResetToOnboarding}
          onResetDiagnosis={onResetToOnboarding}
        />

        <TasbihModal
          visible={tasbihModalVisible}
          onClose={() => setTasbihModalVisible(false)}
        />

        <RoadmapModal
          visible={roadmapModalVisible}
          currentDay={selectedDayNumber}
          completedDays={userState.completedCurriculumDays}
          onSelectDay={(day) => setSelectedDayNumber(day)}
          onClose={() => setRoadmapModalVisible(false)}
        />

        <ArticleReaderModal
          article={activeArticle}
          visible={!!activeArticle}
          onClose={() => setActiveArticle(null)}
        />

        <SinDetailModal
          sin={activeSin}
          visible={!!activeSin}
          onClose={() => setActiveSin(null)}
        />

        {/* Owner CMS Modals */}
        <OwnerAuthModal
          visible={ownerAuthModalVisible}
          isOwnerModeActive={!!userState.isOwnerMode}
          onStateUpdate={onStateUpdate}
          onClose={() => setOwnerAuthModalVisible(false)}
        />

        <EditSinModal
          visible={editSinModalVisible}
          sinToEdit={sinToEdit}
          onSave={handleSaveSin}
          onClose={() => {
            setSinToEdit(null);
            setEditSinModalVisible(false);
          }}
        />

        <EditArticleModal
          visible={editArticleModalVisible}
          articleToEdit={articleToEdit}
          onSave={handleSaveArticle}
          onClose={() => {
            setArticleToEdit(null);
            setEditArticleModalVisible(false);
          }}
        />
      </View>
    </SafeAreaView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
    backgroundColor: THEME.colors.surface,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.colors.gold,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ownerBadge: {
    backgroundColor: THEME.colors.surfaceLighter,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: THEME.borderRadius.pill,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  ownerBadgeActive: {
    borderColor: THEME.colors.gold,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
  },
  ownerBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
  },
  iconBtn: {
    backgroundColor: THEME.colors.surfaceLighter,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  iconBtnText: {
    fontSize: 14,
  },
  privacyBadge: {
    backgroundColor: THEME.colors.surfaceLighter,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.borderLight,
  },
  privacyBadgeText: {
    fontSize: 13,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: THEME.spacing.md,
  },
  ownerActiveBanner: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: THEME.colors.gold,
    marginBottom: THEME.spacing.sm,
  },
  ownerActiveBannerTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.gold,
    textAlign: 'center',
  },
  commitmentBanner: {
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: THEME.colors.gold,
    marginBottom: THEME.spacing.md,
  },
  commitmentLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.gold,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  commitmentText: {
    fontSize: 12,
    color: THEME.colors.textPrimary,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  mementoPill: {
    backgroundColor: THEME.colors.surfaceLighter,
    borderRadius: THEME.borderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderLeftWidth: 3,
    borderLeftColor: THEME.colors.goldMuted,
    marginBottom: THEME.spacing.md,
  },
  mementoPillText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    lineHeight: 17,
    fontStyle: 'italic',
  },

  // Kabair Section Styles
  kabairSection: {
    marginVertical: THEME.spacing.md,
    backgroundColor: THEME.colors.surface,
    borderColor: THEME.colors.border,
    borderWidth: 1,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.gold,
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  ownerAddBtn: {
    backgroundColor: THEME.colors.gold,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.borderRadius.sm,
  },
  ownerAddBtnText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '700',
  },
  goldenRuleCard: {
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: THEME.colors.gold,
    marginBottom: THEME.spacing.sm,
  },
  goldenRuleQuote: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.gold,
    lineHeight: 18,
    marginBottom: 4,
  },
  goldenRuleDef: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  sinsList: {
    marginTop: THEME.spacing.sm,
    gap: 10,
  },
  sinCard: {
    backgroundColor: THEME.colors.surfaceLighter,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  sinCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sinBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: THEME.borderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  sinBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: THEME.colors.crimson,
  },
  sinArabicSmall: {
    fontSize: 12,
    color: THEME.colors.gold,
    fontWeight: '600',
  },
  sinCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    lineHeight: 19,
    marginBottom: 3,
  },
  sinCardDesc: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    lineHeight: 16,
    marginBottom: 8,
  },
  sinCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.04)',
    paddingTop: 6,
  },
  sinCategoryBadgeText: {
    fontSize: 10,
    color: THEME.colors.textTertiary,
    fontWeight: '600',
  },
  miniEditBtn: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.goldMuted,
  },
  miniEditText: {
    fontSize: 10,
    color: THEME.colors.gold,
    fontWeight: '700',
  },
  miniDeleteBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  miniDeleteText: {
    fontSize: 10,
    color: THEME.colors.crimson,
  },

  // Articles Section
  articlesSection: {
    marginVertical: THEME.spacing.md,
    backgroundColor: THEME.colors.surface,
    borderColor: THEME.colors.border,
    borderWidth: 1,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
  },
  chipsScroll: {
    marginVertical: THEME.spacing.xs,
  },
  filterChip: {
    backgroundColor: THEME.colors.surfaceLighter,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.pill,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginRight: 8,
  },
  filterChipActive: {
    borderColor: THEME.colors.gold,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
  },
  filterChipText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
  },
  filterChipTextActive: {
    color: THEME.colors.gold,
    fontWeight: '700',
  },
  articlesList: {
    marginTop: THEME.spacing.sm,
    gap: 10,
  },
  articleCard: {
    backgroundColor: THEME.colors.surfaceLighter,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  articleCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardCatBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: THEME.borderRadius.pill,
  },
  cardCatText: {
    fontSize: 9,
    fontWeight: '700',
    color: THEME.colors.gold,
  },
  articleReadTime: {
    fontSize: 10,
    color: THEME.colors.textTertiary,
  },
  articleCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    lineHeight: 20,
    marginBottom: 4,
  },
  articleCardSummary: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    lineHeight: 16,
    marginBottom: 8,
  },
  articleCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.04)',
    paddingTop: 6,
  },
  articleAuthor: {
    fontSize: 10,
    color: THEME.colors.textTertiary,
    fontStyle: 'italic',
  },
  readMoreLink: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.gold,
  },

  // Floating Button
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 68,
    left: THEME.spacing.md,
    right: THEME.spacing.md,
  },
  pauseButton: {
    backgroundColor: THEME.colors.surfaceLighter,
    borderRadius: THEME.borderRadius.lg,
    paddingVertical: 11,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: THEME.colors.goldMuted,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  pauseIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: THEME.spacing.sm,
  },
  pauseIconText: {
    fontSize: 18,
  },
  pauseTextContainer: {
    flex: 1,
  },
  pauseButtonTitle: {
    color: THEME.colors.gold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  pauseButtonSubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    marginTop: 1,
  },

  // Bottom Navigation Bar
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surface,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    paddingVertical: 8,
    paddingHorizontal: THEME.spacing.md,
  },
  navTabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  navTabItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: THEME.colors.gold,
  },
  navTabIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  navTabLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
  },
  textGold: {
    color: THEME.colors.gold,
  },
  collapseHeaderPill: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderColor: 'rgba(212, 175, 55, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.pill,
  },
  collapseHeaderPillText: {
    color: THEME.colors.gold,
    fontSize: 10,
    fontWeight: '700',
  },
});
