import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function AuthLayout() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      }
    }, [isAuthenticated])
  );

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}