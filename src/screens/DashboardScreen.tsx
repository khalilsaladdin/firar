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
          <View>
            <Text style={styles.headerTitle}>FIRAR • فِرَار</Text>
            <Text style={styles.headerSubtitle}>
              {activeMainTab === 'beranda'
                ? 'Halaman Utama • Pulang Menuju Allah'
                : 'Portal Murid • Bimbingan & Ukhuwah'}
            </Text>
          </View>

          {/* Quick Action Badges */}
          <View style={styles.headerActions}>
            {/* Tombol Mode Pengelola Owner */}
            <TouchableOpacity
              onPress={() => {
                triggerLightHaptic();
                setOwnerAuthModalVisible(true);
              }}
              style={[
                styles.ownerBadge,
                userState.isOwnerMode && styles.ownerBadgeActive,
              ]}
              activeOpacity={0.7}
            >
              <Text style={[styles.ownerBadgeText, userState.isOwnerMode && styles.textGold]}>
                {userState.isOwnerMode ? '👑 Owner: AKTIF' : '👑 Pengelola'}
              </Text>
            </TouchableOpacity>

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
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
    backgroundColor: '#000000',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F5F5F7',
    letterSpacing: 0,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#8E8E93',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ownerBadge: {
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.pill,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  ownerBadgeActive: {
    borderColor: '#4A4A4A',
    backgroundColor: '#262626',
  },
  ownerBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#E4E6EB',
  },
  iconBtn: {
    backgroundColor: '#1C1C1E',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  iconBtnText: {
    fontSize: 13,
  },
  privacyBadge: {
    backgroundColor: '#1C1C1E',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  privacyBadgeText: {
    fontSize: 12,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
  },
  ownerActiveBanner: {
    backgroundColor: '#1C1C1E',
    borderRadius: THEME.borderRadius.sm,
    padding: 8,
    borderWidth: 1,
    borderColor: '#383838',
    marginBottom: 8,
  },
  ownerActiveBannerTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F5F5F7',
    textAlign: 'center',
  },
  commitmentBanner: {
    backgroundColor: '#121212',
    borderRadius: THEME.borderRadius.sm,
    padding: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#383838',
    marginBottom: 8,
  },
  commitmentLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8E8E93',
    letterSpacing: 0.2,
    marginBottom: 2,
  },
  commitmentText: {
    fontSize: 11,
    color: THEME.colors.textPrimary,
    fontStyle: 'normal',
    lineHeight: 16,
  },
  mementoPill: {
    backgroundColor: '#121212',
    borderRadius: THEME.borderRadius.sm,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#383838',
    marginBottom: 8,
  },
  mementoPillText: {
    fontSize: 11,
    color: '#8E8E93',
    lineHeight: 16,
    fontStyle: 'normal',
  },

  // Kabair Section Styles
  kabairSection: {
    marginVertical: 8,
    backgroundColor: THEME.colors.surface,
    borderColor: THEME.colors.border,
    borderWidth: 1,
    borderRadius: THEME.borderRadius.md,
    padding: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F5F5F7',
    letterSpacing: 0,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 1,
  },
  ownerAddBtn: {
    backgroundColor: '#F5F5F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ownerAddBtnText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '600',
  },
  goldenRuleCard: {
    backgroundColor: '#181818',
    borderRadius: THEME.borderRadius.sm,
    padding: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#383838',
    marginBottom: 8,
  },
  goldenRuleQuote: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E4E6EB',
    lineHeight: 16,
    marginBottom: 2,
  },
  goldenRuleDef: {
    fontSize: 10,
    color: '#8E8E93',
    lineHeight: 15,
    fontStyle: 'normal',
  },
  sinsList: {
    marginTop: 6,
    gap: 8,
  },
  sinCard: {
    backgroundColor: '#181818',
    borderRadius: THEME.borderRadius.sm,
    padding: 10,
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.borderRadius.pill,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  sinBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#8E8E93',
  },
  sinArabicSmall: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  sinCardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
    lineHeight: 18,
    marginBottom: 2,
  },
  sinCardDesc: {
    fontSize: 11,
    color: '#8E8E93',
    lineHeight: 15,
    marginBottom: 6,
  },
  sinCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    paddingTop: 6,
  },
  sinCategoryBadgeText: {
    fontSize: 10,
    color: '#636366',
    fontWeight: '500',
  },
  miniEditBtn: {
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  miniEditText: {
    fontSize: 10,
    color: '#E4E6EB',
    fontWeight: '600',
  },
  miniDeleteBtn: {
    backgroundColor: 'rgba(237, 73, 86, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(237, 73, 86, 0.2)',
  },
  miniDeleteText: {
    fontSize: 10,
    color: '#ED4956',
  },

  // Articles Section
  articlesSection: {
    marginVertical: 8,
    backgroundColor: THEME.colors.surface,
    borderColor: THEME.colors.border,
    borderWidth: 1,
    borderRadius: THEME.borderRadius.md,
    padding: 12,
  },
  chipsScroll: {
    marginVertical: 4,
  },
  filterChip: {
    backgroundColor: '#181818',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.borderRadius.pill,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginRight: 6,
  },
  filterChipActive: {
    borderColor: '#F5F5F7',
    backgroundColor: '#F5F5F7',
  },
  filterChipText: {
    fontSize: 11,
    color: '#8E8E93',
  },
  filterChipTextActive: {
    color: '#000000',
    fontWeight: '600',
  },
  articlesList: {
    marginTop: 6,
    gap: 8,
  },
  articleCard: {
    backgroundColor: '#181818',
    borderRadius: THEME.borderRadius.sm,
    padding: 10,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  articleCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardCatBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.borderRadius.pill,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  cardCatText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#8E8E93',
  },
  articleReadTime: {
    fontSize: 10,
    color: '#636366',
  },
  articleCardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
    lineHeight: 18,
    marginBottom: 2,
  },
  articleCardSummary: {
    fontSize: 11,
    color: '#8E8E93',
    lineHeight: 15,
    marginBottom: 6,
  },
  articleCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    paddingTop: 6,
  },
  articleAuthor: {
    fontSize: 10,
    color: '#636366',
    fontStyle: 'normal',
  },
  readMoreLink: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F5F5F7',
  },

  // Floating Button
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 60,
    left: 12,
    right: 12,
  },
  pauseButton: {
    backgroundColor: '#181818',
    borderRadius: THEME.borderRadius.md,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  pauseIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  pauseIconText: {
    fontSize: 14,
  },
  pauseTextContainer: {
    flex: 1,
  },
  pauseButtonTitle: {
    color: '#F5F5F7',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0,
  },
  pauseButtonSubtitle: {
    color: '#8E8E93',
    fontSize: 10,
    marginTop: 1,
  },

  // Bottom Navigation Bar
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  navTabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  navTabItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#F5F5F7',
  },
  navTabIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  navTabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8E8E93',
  },
  textGold: {
    color: '#F5F5F7',
  },
  collapseHeaderPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: THEME.colors.border,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.pill,
  },
  collapseHeaderPillText: {
    color: '#8E8E93',
    fontSize: 10,
    fontWeight: '600',
  },
});
