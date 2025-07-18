import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Chrome as Home, BookOpen, TrendingUp, User, Code } from 'lucide-react-native';

export default function TabLayout() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated) {
        router.replace('/(auth)/login');
      }
    }, [isAuthenticated])
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="lessons"
        options={{
          title: 'Lessons',
          tabBarIcon: ({ size, color }) => (
            <BookOpen size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="codeforge"
        options={{
          title: 'CodeForge',
          tabBarIcon: ({ size, color }) => (
            <Code size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ size, color }) => (
            <TrendingUp size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}