import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useAppStore } from '@/store/useAppStore';
import { router } from 'expo-router';
import { User, Settings, BookOpen, Trophy, Clock, LogOut, CreditCard as Edit3, Bell, CircleHelp as HelpCircle, Star, Download, Shield } from 'lucide-react-native';

export default function ProfileScreen() {
  const { 
    currentUser, 
    logout, 
    getOverallProgress,
    lessonProgress 
  } = useAppStore();
  
  const overallProgress = getOverallProgress();
  
  const completedLessons = Object.values(lessonProgress)
    .filter(progress => progress.isCompleted);
  
  const totalStudyTime = completedLessons.reduce((total, progress) => {
    // Estimate study time based on completed lessons
    return total + 30; // Assume 30 minutes per completed lesson
  }, 0);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Coming Soon', 'Profile editing will be available in a future update.');
  };

  const handleSettingsPress = (setting: string) => {
    Alert.alert('Coming Soon', `${setting} settings will be available in a future update.`);
  };

  const progressPercentage = overallProgress.total > 0 
    ? Math.round((overallProgress.completed / overallProgress.total) * 100) 
    : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
          <Edit3 size={20} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image 
            source={{ 
              uri: currentUser?.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150' 
            }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{currentUser?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{currentUser?.email || 'user@example.com'}</Text>
          
          {/* Progress Summary */}
          <View style={styles.progressSummary}>
            <View style={styles.progressItem}>
              <Text style={styles.progressNumber}>{progressPercentage}%</Text>
              <Text style={styles.progressLabel}>Complete</Text>
            </View>
            <View style={styles.progressDivider} />
            <View style={styles.progressItem}>
              <Text style={styles.progressNumber}>{completedLessons.length}</Text>
              <Text style={styles.progressLabel}>Lessons</Text>
            </View>
            <View style={styles.progressDivider} />
            <View style={styles.progressItem}>
              <Text style={styles.progressNumber}>{Math.round(totalStudyTime / 60)}h</Text>
              <Text style={styles.progressLabel}>Studied</Text>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <BookOpen size={24} color="#3B82F6" />
            <Text style={styles.statNumber}>{overallProgress.completed}</Text>
            <Text style={styles.statLabel}>Lessons Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Trophy size={24} color="#F59E0B" />
            <Text style={styles.statNumber}>{completedLessons.length}</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
          <View style={styles.statCard}>
            <Clock size={24} color="#10B981" />
            <Text style={styles.statNumber}>{totalStudyTime}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleSettingsPress('Notifications')}
          >
            <View style={styles.menuItemLeft}>
              <Bell size={20} color="#6B7280" />
              <Text style={styles.menuItemText}>Notifications</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleSettingsPress('Download')}
          >
            <View style={styles.menuItemLeft}>
              <Download size={20} color="#6B7280" />
              <Text style={styles.menuItemText}>Download Content</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleSettingsPress('Privacy')}
          >
            <View style={styles.menuItemLeft}>
              <Shield size={20} color="#6B7280" />
              <Text style={styles.menuItemText}>Privacy & Security</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleSettingsPress('Help')}
          >
            <View style={styles.menuItemLeft}>
              <HelpCircle size={20} color="#6B7280" />
              <Text style={styles.menuItemText}>Help & Support</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleSettingsPress('Rate')}
          >
            <View style={styles.menuItemLeft}>
              <Star size={20} color="#6B7280" />
              <Text style={styles.menuItemText}>Rate the App</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleSettingsPress('Settings')}
          >
            <View style={styles.menuItemLeft}>
              <Settings size={20} color="#6B7280" />
              <Text style={styles.menuItemText}>Settings</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfoContainer}>
          <Text style={styles.appInfoTitle}>C++ Learning App</Text>
          <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
          <Text style={styles.appInfoDescription}>
            Master C++ programming with our comprehensive course featuring interactive lessons, 
            pre and post tests, and progress tracking.
          </Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  editButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#3B82F6',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  progressSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-around',
  },
  progressItem: {
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 16,
  },
  appInfoContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  appInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  appInfoVersion: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  appInfoDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
    marginLeft: 8,
  },
});