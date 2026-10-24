import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { THEME } from '../constants/theme';
import { UserState, MemberProfile, LessonModule, CommunityPost } from '../types';
import { LESSONS_DATA } from '../constants/lessonsData';
import { INITIAL_COMMUNITY_POSTS } from '../constants/communityData';
import { LessonPlayerModal } from './LessonPlayerModal';
import { StorageService } from '../services/storage';

interface HalaqahPortalProps {
  userState: UserState;
  onStateUpdate: (updated: UserState) => void;
}

export const HalaqahPortal: React.FC<HalaqahPortalProps> = ({
  userState,
  onStateUpdate,
}) => {
  // Auth Form State
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [aliasInput, setAliasInput] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [genderInput, setGenderInput] = useState<'ikhwan' | 'akhwat'>('ikhwan');

  // Member Dashboard State
  const [portalSubTab, setPortalSubTab] = useState<'lessons' | 'community'>('lessons');
  const [activeLesson, setActiveLesson] = useState<LessonModule | null>(null);

  // Community Posts State
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);
  const [newPostText, setNewPostText] = useState<string>('');
  const [showNewPostForm, setShowNewPostForm] = useState<boolean>(false);

  const triggerHaptic = (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(style);
    }
  };

  const handleLogin = async (asGuest?: 'ikhwan' | 'akhwat') => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);

    let profile: MemberProfile;
    if (asGuest) {
      profile = {
        id: `guest-${Date.now()}`,
        aliasName: asGuest === 'ikhwan' ? 'Abu Fulan (Tamu)' : 'Ummu Fulanah (Tamu)',
        email: 'tamu@firar.app',
        gender: asGuest,
        joinedDate: 'Hari ini',
        cohortBadge: 'Angkatan 1 (Halaqah Pembuka)',
      };
    } else {
      if (!aliasInput.trim()) {
        Alert.alert('Perhatian', 'Harap isi nama samaran / kunyah Anda.');
        return;
      }
      profile = {
        id: `user-${Date.now()}`,
        aliasName: aliasInput.trim(),
        email: emailInput.trim() || 'santri@firar.app',
        gender: genderInput,
        joinedDate: 'Hari ini',
        cohortBadge: 'Angkatan 1 (Halaqah Pembuka)',
      };
    }

    const updated = await StorageService.setMemberProfile(profile);
    onStateUpdate(updated);
  };

  const handleLogout = async () => {
    triggerHaptic();
    Alert.alert('Konfirmasi Keluar', 'Apakah Anda ingin keluar dari akun Halaqah Firar?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          const updated = await StorageService.setMemberProfile(null);
          onStateUpdate(updated);
        },
      },
    ]);
  };

  const handleToggleLesson = async (lessonId: string) => {
    const updated = await StorageService.toggleLessonCompleted(lessonId);
    onStateUpdate(updated);
  };

  const handleAamiin = (postId: string) => {
    triggerHaptic();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const hasAamiined = p.hasAamiined;
          return {
            ...p,
            hasAamiined: !hasAamiined,
            aamiinCount: hasAamiined ? p.aamiinCount - 1 : p.aamiinCount + 1,
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = () => {
    if (!newPostText.trim()) return;
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorAlias: userState.memberProfile?.aliasName || 'Hamba Allah',
      gender: userState.memberProfile?.gender || 'ikhwan',
      timeAgo: 'Baru saja',
      content: newPostText.trim(),
      aamiinCount: 1,
      hasAamiined: true,
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
    setShowNewPostForm(false);
    Alert.alert('Alhamdulillah', 'Nasehat/penguat Anda telah dikirimkan ke ruang ukhuwah.');
  };

  const member = userState.memberProfile;

  // =========================================================================
  // TAMPILAN 1: AUTH / LOGIN JIKA BELUM MASUK
  // =========================================================================
  if (!member) {
    return (
      <ScrollView contentContainerStyle={styles.authScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.authCard}>
          <View style={styles.authBadgeWrap}>
            <Text style={styles.authBadge}>PORTAL KELAS & HALAQAH FIRAR</Text>
          </View>

          <Text style={styles.authTitle}>
            {isRegisterMode ? 'Daftar Akun Halaqah Baru' : 'Masuk ke Ruang Belajar'}
          </Text>
          <Text style={styles.authSubtitle}>
            Akses rekaman kajian bertahap, bimbingan asatidzah, dan saling menguatkan bersama teman seperjuangan.
          </Text>

          {/* Form Fields */}
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>NAMA SAMARAN / KUNYAH (KERAHASIAAN AIB 100%):</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Contoh: Abu Hamzah / Hamba Allah #120"
              placeholderTextColor={THEME.colors.textTertiary}
              value={aliasInput}
              onChangeText={setAliasInput}
            />
            <Text style={styles.fieldNote}>
              *Gunakan nama samaran agar identitas dan aib masa lalu tetap tertutup rapat.
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>PILIHAN RUANG UKHUWAH (TERPISAH SECARA SYAR'I):</Text>
            <View style={styles.genderRow}>
              <TouchableOpacity
                style={[styles.genderBtn, genderInput === 'ikhwan' && styles.genderBtnActive]}
                onPress={() => {
                  triggerHaptic();
                  setGenderInput('ikhwan');
                }}
              >
                <Text style={[styles.genderText, genderInput === 'ikhwan' && styles.textGold]}>
                  👳‍♂️ Ruang Ikhwan
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.genderBtn, genderInput === 'akhwat' && styles.genderBtnActive]}
                onPress={() => {
                  triggerHaptic();
                  setGenderInput('akhwat');
                }}
              >
                <Text style={[styles.genderText, genderInput === 'akhwat' && styles.textGold]}>
                  🧕 Ruang Akhwat
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>EMAIL (OPSIONAL UNTUK PEMBERITAHUAN KAJIAN):</Text>
            <TextInput
              style={styles.textInput}
              placeholder="email@anda.com"
              placeholderTextColor={THEME.colors.textTertiary}
              value={emailInput}
              onChangeText={setEmailInput}
              keyboardType="email-address"
            />
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={() => handleLogin()} activeOpacity={0.8}>
            <Text style={styles.submitBtnText}>
              {isRegisterMode ? 'Bismillah, Daftar Akun Halaqah' : 'Bismillah, Masuk Ruang Belajar'}
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ATAU MASUK CEPAT (UJI COBA DEMO)</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.guestRow}>
            <TouchableOpacity
              style={styles.guestBtn}
              onPress={() => handleLogin('ikhwan')}
              activeOpacity={0.8}
            >
              <Text style={styles.guestBtnText}>Coba Masuk (Tamu Ikhwan)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.guestBtn}
              onPress={() => handleLogin('akhwat')}
              activeOpacity={0.8}
            >
              <Text style={styles.guestBtnText}>Coba Masuk (Tamu Akhwat)</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.toggleModeBtn}
            onPress={() => setIsRegisterMode(!isRegisterMode)}
          >
            <Text style={styles.toggleModeText}>
              {isRegisterMode
                ? 'Sudah punya akun? Masuk di sini'
                : 'Belum punya akun? Daftar santri baru di sini'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    );
  }

  // =========================================================================
  // TAMPILAN 2: MEMBER AREA (SETELAH LOGIN)
  // =========================================================================
  const completedCount = userState.completedLessonIds?.length || 0;
  const filteredPosts = posts.filter((p) => p.gender === member.gender);

  return (
    <ScrollView style={styles.memberContainer} showsVerticalScrollIndicator={false}>
      {/* Profil Header Kartu */}
      <View style={styles.profileCard}>
        <View style={styles.profileLeft}>
          <View style={styles.avatarCircle}>
            <Text style={{ fontSize: 22 }}>{member.gender === 'ikhwan' ? '👳‍♂️' : '🧕'}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.aliasName}>{member.aliasName}</Text>
            <Text style={styles.badgeLabel}>
              {member.cohortBadge} • {member.gender === 'ikhwan' ? 'Ikhwan' : 'Akhwat'}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn} activeOpacity={0.7}>
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Kurikulum Halaqah */}
      <View style={styles.progressSummaryCard}>
        <View style={styles.progressTopRow}>
          <Text style={styles.progressLabel}>PROGRESS MODUL REKAMAN KELAS:</Text>
          <Text style={styles.progressCount}>{completedCount} / 8 MODUL TUNTAS</Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min(100, (completedCount / 8) * 100)}%` },
            ]}
          />
        </View>
      </View>

      {/* Sub Tabs: Rekaman vs Sahabat Shalih */}
      <View style={styles.subTabRow}>
        <TouchableOpacity
          style={[styles.subTabBtn, portalSubTab === 'lessons' && styles.subTabBtnActive]}
          onPress={() => {
            triggerHaptic();
            setPortalSubTab('lessons');
          }}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.subTabText,
              portalSubTab === 'lessons' && styles.subTabTextActive,
            ]}
          >
            🎧 Rekaman Pelajaran ({LESSONS_DATA.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.subTabBtn, portalSubTab === 'community' && styles.subTabBtnActive]}
          onPress={() => {
            triggerHaptic();
            setPortalSubTab('community');
          }}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.subTabText,
              portalSubTab === 'community' && styles.subTabTextActive,
            ]}
          >
            🤝 Sahabat Shalih ({filteredPosts.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* SUB-CONTENT 1: DAFTAR REKAMAN PELAJARAN BERTAHAP */}
      {portalSubTab === 'lessons' && (
        <View style={styles.lessonsSection}>
          <Text style={styles.tabHeading}>MODUL BIMBINGAN TAZKIYAH BERTAHAP</Text>
          <Text style={styles.tabSubheading}>
            Dengarkan kajian audio terbimbing berikut secara runtut dari Modul 1 hingga 8.
          </Text>

          <View style={styles.lessonsList}>
            {LESSONS_DATA.map((lesson) => {
              const isDone = userState.completedLessonIds?.includes(lesson.id);
              return (
                <TouchableOpacity
                  key={lesson.id}
                  style={[styles.lessonCard, isDone && styles.lessonCardDone]}
                  onPress={() => {
                    triggerHaptic();
                    setActiveLesson(lesson);
                  }}
                  activeOpacity={0.8}
                >
                  <View style={styles.lessonCardHeader}>
                    <View style={styles.lessonBadge}>
                      <Text style={styles.lessonBadgeText}>MODUL {lesson.lessonNumber}</Text>
                    </View>
                    <Text style={styles.lessonDuration}>⏱️ {lesson.durationMinutes} Mnt</Text>
                  </View>

                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <Text style={styles.lessonBook}>📖 {lesson.bookReference}</Text>
                  <Text style={styles.lessonDesc} numberOfLines={2}>
                    {lesson.description}
                  </Text>

                  <View style={styles.lessonCardFooter}>
                    <Text style={[styles.statusText, isDone && { color: THEME.colors.emerald }]}>
                      {isDone ? '✓ Sudah Tuntas Dipelajari' : 'Belum Selesai'}
                    </Text>
                    <Text style={styles.playLink}>Putar Audio ›</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* SUB-CONTENT 2: RUANG SAHABAT SHALIH (UKHUWAH FEED) */}
      {portalSubTab === 'community' && (
        <View style={styles.communitySection}>
          <View style={styles.communityHeaderRow}>
            <View>
              <Text style={styles.tabHeading}>
                RUANG UKHUWAH ({member.gender === 'ikhwan' ? 'IKHWAN' : 'AKHWAT'})
              </Text>
              <Text style={styles.tabSubheading}>
                Saling mendoakan & menyemangati tanpa membuka rincian aib.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.newPostToggleBtn}
              onPress={() => {
                triggerHaptic();
                setShowNewPostForm(!showNewPostForm);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.newPostToggleText}>
                {showNewPostForm ? 'Tutup' : '+ Tulis Penguat'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Kirim Nasehat / Doa Baru */}
          {showNewPostForm && (
            <View style={styles.newPostCard}>
              <Text style={styles.newPostLabel}>TULIS PESAN PENGUAT / NASEHAT HARI INI:</Text>
              <TextInput
                style={styles.newPostInput}
                multiline
                placeholder="Tuliskan kata-kata penguat atau doa bagi saudara seperjuangan... (Dilarang menceritakan detail maksiat masa lalu)"
                placeholderTextColor={THEME.colors.textTertiary}
                value={newPostText}
                onChangeText={setNewPostText}
              />
              <View style={styles.newPostActionRow}>
                <TouchableOpacity
                  style={styles.postSubmitBtn}
                  onPress={handleCreatePost}
                  activeOpacity={0.8}
                >
                  <Text style={styles.postSubmitBtnText}>Kirim ke Ruang Ukhuwah</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Posts Feed */}
          <View style={styles.postsList}>
            {filteredPosts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postTopRow}>
                  <Text style={styles.postAuthor}>{post.authorAlias}</Text>
                  <Text style={styles.postTime}>{post.timeAgo}</Text>
                </View>

                <Text style={styles.postContent}>{post.content}</Text>

                <View style={styles.postFooter}>
                  <TouchableOpacity
                    style={[styles.aamiinBtn, post.hasAamiined && styles.aamiinBtnActive]}
                    onPress={() => handleAamiin(post.id)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.aamiinBtnText,
                        post.hasAamiined && styles.aamiinBtnTextActive,
                      ]}
                    >
                      🤲 Aamiin ({post.aamiinCount})
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Lesson Player Modal */}
      <LessonPlayerModal
        lesson={activeLesson}
        visible={!!activeLesson}
        isCompleted={
          activeLesson ? !!userState.completedLessonIds?.includes(activeLesson.id) : false
        }
        onToggleCompleted={handleToggleLesson}
        onClose={() => setActiveLesson(null)}
      />

      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  authScroll: {
    padding: THEME.spacing.md,
  },
  authCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.goldMuted,
  },
  authBadgeWrap: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.pill,
    marginBottom: THEME.spacing.sm,
  },
  authBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: THEME.colors.gold,
    letterSpacing: 1,
  },
  authTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    marginBottom: 4,
  },
  authSubtitle: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
    marginBottom: THEME.spacing.md,
  },
  formGroup: {
    marginBottom: THEME.spacing.md,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.gold,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: THEME.colors.surfaceLighter,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: THEME.spacing.md,
    color: THEME.colors.textPrimary,
    fontSize: 13,
  },
  fieldNote: {
    fontSize: 10,
    color: THEME.colors.textTertiary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
  },
  genderBtn: {
    flex: 1,
    backgroundColor: THEME.colors.surfaceLighter,
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
  },
  genderBtnActive: {
    borderColor: THEME.colors.gold,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  genderText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
  },
  textGold: {
    color: THEME.colors.gold,
  },
  submitBtn: {
    backgroundColor: THEME.colors.gold,
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    marginTop: THEME.spacing.xs,
  },
  submitBtnText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: THEME.spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: THEME.colors.border,
  },
  dividerText: {
    fontSize: 9,
    fontWeight: '700',
    color: THEME.colors.textTertiary,
    marginHorizontal: 8,
    letterSpacing: 0.5,
  },
  guestRow: {
    flexDirection: 'row',
    gap: 8,
  },
  guestBtn: {
    flex: 1,
    backgroundColor: THEME.colors.surfaceLighter,
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
  },
  guestBtnText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    fontWeight: '600',
  },
  toggleModeBtn: {
    marginTop: THEME.spacing.md,
    alignItems: 'center',
  },
  toggleModeText: {
    fontSize: 11,
    color: THEME.colors.gold,
    textDecorationLine: 'underline',
  },

  // Member Dashboard Styles
  memberContainer: {
    padding: THEME.spacing.md,
  },
  profileCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.sm,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.colors.surfaceLighter,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.goldMuted,
  },
  aliasName: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  badgeLabel: {
    fontSize: 10,
    color: THEME.colors.gold,
    marginTop: 2,
    fontWeight: '600',
  },
  logoutBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  logoutText: {
    fontSize: 11,
    color: THEME.colors.textTertiary,
    textDecorationLine: 'underline',
  },
  progressSummaryCard: {
    backgroundColor: THEME.colors.surfaceLighter,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
  },
  progressTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.gold,
    letterSpacing: 0.5,
  },
  progressCount: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.emerald,
  },
  progressTrack: {
    height: 6,
    backgroundColor: THEME.colors.surface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.emerald,
    borderRadius: 3,
  },
  subTabRow: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 4,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
  },
  subTabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: THEME.borderRadius.sm,
  },
  subTabBtnActive: {
    backgroundColor: THEME.colors.gold,
  },
  subTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
  },
  subTabTextActive: {
    color: '#000',
    fontWeight: '800',
  },
  tabHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.gold,
    letterSpacing: 0.5,
  },
  tabSubheading: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
    marginBottom: THEME.spacing.md,
  },
  lessonsSection: {
    marginBottom: THEME.spacing.md,
  },
  lessonsList: {
    gap: 10,
  },
  lessonCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  lessonCardDone: {
    borderColor: THEME.colors.emerald,
  },
  lessonCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  lessonBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: THEME.borderRadius.pill,
  },
  lessonBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: THEME.colors.gold,
  },
  lessonDuration: {
    fontSize: 10,
    color: THEME.colors.textTertiary,
  },
  lessonTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    lineHeight: 18,
    marginBottom: 2,
  },
  lessonBook: {
    fontSize: 10,
    color: THEME.colors.gold,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  lessonDesc: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    lineHeight: 15,
    marginBottom: 8,
  },
  lessonCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.04)',
    paddingTop: 6,
  },
  statusText: {
    fontSize: 10,
    color: THEME.colors.textTertiary,
    fontWeight: '600',
  },
  playLink: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.colors.gold,
  },

  // Community Styles
  communitySection: {
    marginBottom: THEME.spacing.md,
  },
  communityHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.spacing.sm,
  },
  newPostToggleBtn: {
    backgroundColor: THEME.colors.surfaceLighter,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  newPostToggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.gold,
  },
  newPostCard: {
    backgroundColor: THEME.colors.surfaceLighter,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.borderLight,
    marginBottom: THEME.spacing.md,
  },
  newPostLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.gold,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  newPostInput: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: THEME.spacing.sm,
    color: THEME.colors.textPrimary,
    fontSize: 12,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  newPostActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  postSubmitBtn: {
    backgroundColor: THEME.colors.gold,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: THEME.borderRadius.sm,
  },
  postSubmitBtnText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '800',
  },
  postsList: {
    gap: 10,
  },
  postCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  postTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  postAuthor: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.gold,
  },
  postTime: {
    fontSize: 10,
    color: THEME.colors.textTertiary,
  },
  postContent: {
    fontSize: 12,
    color: THEME.colors.textPrimary,
    lineHeight: 18,
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.04)',
    paddingTop: 6,
  },
  aamiinBtn: {
    backgroundColor: THEME.colors.surfaceLighter,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: THEME.borderRadius.pill,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  aamiinBtnActive: {
    backgroundColor: THEME.colors.emeraldGlow,
    borderColor: THEME.colors.emerald,
  },
  aamiinBtnText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    fontWeight: '600',
  },
  aamiinBtnTextActive: {
    color: THEME.colors.emerald,
    fontWeight: '800',
  },
});
