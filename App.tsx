import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { UserState, HabitId } from './src/types';
import { StorageService, INITIAL_USER_STATE } from './src/services/storage';
import { THEME } from './src/constants/theme';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';

// Inject clean system font for Web
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const styleId = 'firar-global-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      * {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      body, html {
        background-color: #090B0E !important;
        margin: 0;
        padding: 0;
      }
    `;
    document.head.appendChild(style);
  }
}

export default function App() {
  const [userState, setUserState] = useState<UserState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await StorageService.getUserState();
      setUserState(data);
    } catch (e) {
      console.error('Failed to load state', e);
      setUserState(INITIAL_USER_STATE);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOnboarding = async (
    habits: HabitId[],
    age: number,
    commitment?: string
  ) => {
    const updated = await StorageService.completeOnboarding(habits, age, commitment);
    setUserState(updated);
  };

  const handleResetToOnboarding = async () => {
    await StorageService.resetAll();
    setUserState(INITIAL_USER_STATE);
  };

  if (loading || !userState) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME.colors.gold} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <View style={styles.appContainer}>
      <StatusBar style="light" />
      {!userState.hasCompletedOnboarding ? (
        <OnboardingScreen onComplete={handleCompleteOnboarding} />
      ) : (
        <DashboardScreen
          userState={userState}
          onStateUpdate={setUserState}
          onResetToOnboarding={handleResetToOnboarding}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: THEME.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appContainer: {
    flex: 1,
    minHeight: '100%',
    width: '100%',
    maxWidth: 500,
    marginHorizontal: 'auto',
    backgroundColor: THEME.colors.background,
  },
});
