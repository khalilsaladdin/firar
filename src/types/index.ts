export type HabitId = 
  | 'pandangan_zina' 
  | 'rokok_khamr' 
  | 'medsos_ghibah' 
  | 'shalat_terlambat' 
  | 'dosa_rahasia' 
  | 'not_sure';

export interface HabitOption {
  id: HabitId;
  label: string;
  arabicLabel: string;
  description: string;
  icon: string;
}

export interface UserState {
  hasCompletedOnboarding: boolean;
  selectedHabits: HabitId[];
  userAge: number;
  todayCommitment?: string;
  startDate: string; // ISO String
  cleanStreakDays: number;
  longestStreakDays: number;
  relapseCount: number;
  currentCurriculumDay: number; // 1 - 30
  completedCurriculumDays: number[];
  dailyReflections?: { [day: number]: string };
  isStealthMode?: boolean;
  // Member Area State
  memberProfile?: MemberProfile | null;
  completedLessonIds?: string[];
  // Owner CMS State
  isOwnerMode?: boolean;
  customSins?: SinItem[];
  customArticles?: ArticleItem[];
}

export interface MemberProfile {
  id: string;
  aliasName: string; // Nama samaran / kunyah (e.g., Abu Fulan)
  email: string;
  gender: 'ikhwan' | 'akhwat';
  joinedDate: string;
  cohortBadge: string;
}

export interface LessonModule {
  id: string;
  phaseNumber: 1 | 2 | 3 | 4;
  phaseTitle: string;
  lessonNumber: number;
  title: string;
  arabicTitle?: string;
  speaker: string;
  durationMinutes: number;
  bookReference: string;
  description: string;
  keyPoints: string[];
  audioUrl?: string;
}

export interface CommunityPost {
  id: string;
  authorAlias: string;
  gender: 'ikhwan' | 'akhwat';
  timeAgo: string;
  content: string;
  aamiinCount: number;
  hasAamiined?: boolean;
}

export interface CurriculumDay {
  day: number;
  phase: 'Tashfiyah' | 'Al-Wiqayah' | 'At-Tarbiyah' | 'At-Tatsbit';
  phaseTitle: string;
  title: string;
  arabicTitle: string;
  verseOrHadith: {
    arabic: string;
    translation: string;
    reference: string;
  };
  salafQuote?: {
    text: string;
    scholar: string;
    book: string;
  };
  summary: string;
  actionItem: string;
}

export interface ArticleItem {
  id: string;
  category: HabitId | 'umum' | 'memento_mori';
  categoryLabel: string;
  title: string;
  arabicTitle?: string;
  authorOrSource: string;
  readTimeMinutes: number;
  summary: string;
  dalilQuote?: {
    arabic: string;
    translation: string;
    reference: string;
  };
  paragraphs: string[];
  takeaway: string;
  publishedDate: string;
}

export interface SinItem {
  id: string;
  kabairNumber: number; // Urutan di Kitab Al-Kaba'ir karya Imam Adz-Dzahabi
  category: 'haqqullah' | 'raga_kehormatan' | 'lisan_sosial' | 'harta' | 'keluarga';
  categoryLabel: string;
  title: string;
  arabicTitle: string;
  definition: string;
  dangerAndConsequence: string;
  dalil: {
    arabic: string;
    translation: string;
    reference: string;
  };
  salafWarning: {
    scholar: string;
    quote: string;
    book: string;
  };
  taubatGuidance: string;
}
