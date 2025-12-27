export interface User {
  id: string;
  name: string;
  age: number;
  avatarUrl: string;
  gender: 'male' | 'female' | 'other';
}

export interface PairingSession {
  code: string;
  startDate: string; // ISO Date string
  users: User[];
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  imageUrl?: string;
  timestamp: number;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  timestamp: number;
}

export interface AlbumPhoto {
  id: string;
  userId: string;
  url: string;
  timestamp: number;
  albumName?: string; // Added for grouping
}

export interface Goal {
  id: string;
  title: string;
  progress: number; // 0-100
  targetDate?: string;
  isCompleted: boolean;
}

export interface AppState {
  currentUser: User | null;
  partner: User | null;
  session: PairingSession | null;
  posts: Post[];
  album: AlbumPhoto[];
  goals: Goal[];
}

export enum ViewState {
  ONBOARDING = 'ONBOARDING',
  HOME = 'HOME',
  MEMORIES = 'MEMORIES',
  ALBUM = 'ALBUM',
  GOALS = 'GOALS',
  SETTINGS = 'SETTINGS',
}

export type ThemeType = 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER' | 'CHRISTMAS' | 'VALENTINE' | 'NATIONAL_DAY' | 'DEFAULT';

export interface ThemeConfig {
  name: string;
  bgGradient: string;
  primaryColor: string;
  decorations: string[]; // Emojis or icons
  overlayColor: string;
}