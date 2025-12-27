import { ThemeType, ThemeConfig } from '../types';

export const getThemeForDate = (date: Date = new Date()): ThemeType => {
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  // Holidays
  if (month === 12 && day >= 20 && day <= 26) return 'CHRISTMAS';
  if (month === 2 && day >= 13 && day <= 15) return 'VALENTINE';
  if (month === 9 && day === 2) return 'NATIONAL_DAY';

  // Seasons (Northern Hemisphere/Vietnam approximation)
  if (month >= 2 && month <= 4) return 'SPRING';
  if (month >= 5 && month <= 7) return 'SUMMER';
  if (month >= 8 && month <= 10) return 'AUTUMN';
  if (month >= 11 || month <= 1) return 'WINTER';

  return 'DEFAULT';
};

export const THEMES: Record<ThemeType, ThemeConfig> = {
  DEFAULT: {
    name: 'Mặc định',
    bgGradient: 'from-rose-50 to-pink-100',
    primaryColor: 'text-rose-500',
    decorations: ['❤️', '✨'],
    overlayColor: 'bg-white/40'
  },
  SPRING: {
    name: 'Mùa Xuân',
    bgGradient: 'from-pink-100 via-rose-100 to-green-100',
    primaryColor: 'text-pink-500',
    decorations: ['🌸', '🌱', '🦋', '🌷'],
    overlayColor: 'bg-white/50'
  },
  SUMMER: {
    name: 'Mùa Hè',
    bgGradient: 'from-blue-100 via-yellow-100 to-orange-50',
    primaryColor: 'text-orange-500',
    decorations: ['☀️', '🏖️', '🍦', '🌊'],
    overlayColor: 'bg-white/40'
  },
  AUTUMN: {
    name: 'Mùa Thu',
    bgGradient: 'from-orange-100 via-amber-100 to-brown-100',
    primaryColor: 'text-amber-600',
    decorations: ['🍁', '🍂', '☕', '📙'],
    overlayColor: 'bg-amber-50/50'
  },
  WINTER: {
    name: 'Mùa Đông',
    bgGradient: 'from-slate-100 via-blue-50 to-white',
    primaryColor: 'text-blue-500',
    decorations: ['❄️', '⛄', '🧣', '🧤'],
    overlayColor: 'bg-blue-50/30'
  },
  CHRISTMAS: {
    name: 'Giáng Sinh',
    bgGradient: 'from-red-100 via-green-100 to-emerald-100',
    primaryColor: 'text-red-600',
    decorations: ['🎄', '🎅', '🎁', '🔔', '❄️'],
    overlayColor: 'bg-white/60'
  },
  VALENTINE: {
    name: 'Valentine',
    bgGradient: 'from-pink-200 via-rose-200 to-red-100',
    primaryColor: 'text-rose-600',
    decorations: ['💘', '💝', '🌹', '🍫'],
    overlayColor: 'bg-pink-50/50'
  },
  NATIONAL_DAY: {
    name: 'Quốc Khánh',
    bgGradient: 'from-red-100 via-yellow-100 to-red-50',
    primaryColor: 'text-red-600',
    decorations: ['🇻🇳', '⭐️', '🎈', '🎆'],
    overlayColor: 'bg-yellow-50/30'
  }
};