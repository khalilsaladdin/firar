import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserState, HabitId, MemberProfile, SinItem, ArticleItem } from '../types';
import { KABA_IR_SINS } from '../constants/kabairData';
import { ARTICLES_DATA } from '../constants/articlesData';

const STORAGE_KEY = '@firar_user_state_v1';

export const INITIAL_USER_STATE: UserState = {
  hasCompletedOnboarding: false,
  selectedHabits: [],
  userAge: 25,
  todayCommitment: 'Hari ini saya akan menunaikan shalat tepat waktu dan menjaga hati.',
  startDate: new Date().toISOString(),
  cleanStreakDays: 1,
  longestStreakDays: 1,
  relapseCount: 0,
  currentCurriculumDay: 1,
  completedCurriculumDays: [],
  dailyReflections: {},
  isStealthMode: false,
  memberProfile: null,
  completedLessonIds: [],
  isOwnerMode: false,
  customSins: KABA_IR_SINS,
  customArticles: ARTICLES_DATA,
};

export const StorageService = {
  async getUserState(): Promise<UserState> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (!data) return INITIAL_USER_STATE;
      const parsed = JSON.parse(data);
      return {
        ...INITIAL_USER_STATE,
        ...parsed,
        dailyReflections: parsed.dailyReflections || {},
        completedLessonIds: parsed.completedLessonIds || [],
        customSins: parsed.customSins && parsed.customSins.length > 0 ? parsed.customSins : KABA_IR_SINS,
        customArticles: parsed.customArticles && parsed.customArticles.length > 0 ? parsed.customArticles : ARTICLES_DATA,
      };
    } catch (error) {
      console.error('Error reading UserState from storage:', error);
      return INITIAL_USER_STATE;
    }
  },

  async saveUserState(state: UserState): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving UserState to storage:', error);
    }
  },

  async completeOnboarding(
    selectedHabits: HabitId[],
    userAge: number,
    todayCommitment?: string
  ): Promise<UserState> {
    const current = await this.getUserState();
    const newState: UserState = {
      ...current,
      hasCompletedOnboarding: true,
      selectedHabits,
      userAge,
      todayCommitment: todayCommitment || INITIAL_USER_STATE.todayCommitment,
      startDate: new Date().toISOString(),
      cleanStreakDays: 1,
      longestStreakDays: 1,
      relapseCount: 0,
      currentCurriculumDay: 1,
      completedCurriculumDays: [],
    };
    await this.saveUserState(newState);
    return newState;
  },

  async recordRelapse(): Promise<UserState> {
    const current = await this.getUserState();
    const updated: UserState = {
      ...current,
      relapseCount: current.relapseCount + 1,
      cleanStreakDays: 0,
      startDate: new Date().toISOString(),
    };
    await this.saveUserState(updated);
    return updated;
  },

  async incrementStreak(): Promise<UserState> {
    const current = await this.getUserState();
    const newStreak = current.cleanStreakDays + 1;
    const updated: UserState = {
      ...current,
      cleanStreakDays: newStreak,
      longestStreakDays: Math.max(newStreak, current.longestStreakDays),
    };
    await this.saveUserState(updated);
    return updated;
  },

  async markDayCompleted(day: number): Promise<UserState> {
    const current = await this.getUserState();
    const completedSet = new Set(current.completedCurriculumDays);
    completedSet.add(day);

    const updated: UserState = {
      ...current,
      completedCurriculumDays: Array.from(completedSet),
      currentCurriculumDay: Math.min(30, Math.max(current.currentCurriculumDay, day + 1)),
    };
    await this.saveUserState(updated);
    return updated;
  },

  async saveDailyReflection(day: number, note: string): Promise<UserState> {
    const current = await this.getUserState();
    const reflections = { ...(current.dailyReflections || {}) };
    reflections[day] = note;

    const updated: UserState = {
      ...current,
      dailyReflections: reflections,
    };
    await this.saveUserState(updated);
    return updated;
  },

  async setMemberProfile(profile: MemberProfile | null): Promise<UserState> {
    const current = await this.getUserState();
    const updated: UserState = {
      ...current,
      memberProfile: profile,
    };
    await this.saveUserState(updated);
    return updated;
  },

  async toggleLessonCompleted(lessonId: string): Promise<UserState> {
    const current = await this.getUserState();
    const currentIds = new Set(current.completedLessonIds || []);
    if (currentIds.has(lessonId)) {
      currentIds.delete(lessonId);
    } else {
      currentIds.add(lessonId);
    }

    const updated: UserState = {
      ...current,
      completedLessonIds: Array.from(currentIds),
    };
    await this.saveUserState(updated);
    return updated;
  },

  async toggleOwnerMode(pinInput: string): Promise<{ success: boolean; updatedState?: UserState; message?: string }> {
    const current = await this.getUserState();
    if (current.isOwnerMode) {
      // Matikan Owner Mode
      const updated: UserState = { ...current, isOwnerMode: false };
      await this.saveUserState(updated);
      return { success: true, updatedState: updated, message: 'Mode Pengelola Dinonaktifkan.' };
    }

    // Default PIN: 2026
    if (pinInput === '2026') {
      const updated: UserState = { ...current, isOwnerMode: true };
      await this.saveUserState(updated);
      return { success: true, updatedState: updated, message: 'Mode Pengelola Berhasil Diaktifkan!' };
    }

    return { success: false, message: 'PIN Pengelola Salah. (Gunakan PIN default: 2026)' };
  },

  async saveCustomSins(sins: SinItem[]): Promise<UserState> {
    const current = await this.getUserState();
    const updated: UserState = {
      ...current,
      customSins: sins,
    };
    await this.saveUserState(updated);
    return updated;
  },

  async saveCustomArticles(articles: ArticleItem[]): Promise<UserState> {
    const current = await this.getUserState();
    const updated: UserState = {
      ...current,
      customArticles: articles,
    };
    await this.saveUserState(updated);
    return updated;
  },

  async resetContentToDefault(): Promise<UserState> {
    const current = await this.getUserState();
    const updated: UserState = {
      ...current,
      customSins: KABA_IR_SINS,
      customArticles: ARTICLES_DATA,
    };
    await this.saveUserState(updated);
    return updated;
  },

  async resetAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error resetting storage:', error);
    }
  },
};
