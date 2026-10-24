import { Platform } from 'react-native';

// Tema Gelap Minimalis & Ramping (Terinspirasi dari Instagram & Threads Dark Mode)
export const THEME = {
  colors: {
    // True Black & Subtle Surfaces (IG / FB Dark Mode)
    background: '#000000',
    surface: '#121212',
    surfaceLighter: '#1C1C1E',
    border: '#262626',
    borderLight: '#363636',
    
    // Minimalist Accents (No heavy saturated neon gold)
    accent: '#0095F6', // IG Blue
    accentSubtle: 'rgba(0, 149, 246, 0.1)',
    emerald: '#10B981',
    emeraldGlow: 'rgba(16, 185, 129, 0.08)',
    crimson: '#ED4956',
    crimsonGlow: 'rgba(237, 73, 86, 0.08)',
    
    // Sleek Platinum / Neutral (Menggantikan warna emas mencolok)
    gold: '#F5F5F7',
    goldMuted: '#8E8E93',
    goldGlow: 'rgba(255, 255, 255, 0.04)',
    
    // Typography (Seramping & sebersih Instagram)
    textPrimary: '#F5F5F7',
    textSecondary: '#8E8E93',
    textTertiary: '#636366',
    textGold: '#F5F5F7',
  },
  fontFamily: Platform.select({
    web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    default: 'System',
  }),
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    pill: 9999,
  },
};
