import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useAppStore } from '@/store/useAppStore';
import { router } from 'expo-router';
import { BookOpen, Trophy, Clock, ChevronRight, Star, TrendingUp } from 'lucide-react-native';

export default function HomeScreen() {
  const { currentUser, sections, getOverallProgress, getSectionProgress } = useAppStore();
  const overallProgress = getOverallProgress();

  const progressPercentage = overallProgress.total > 0 
    ? Math.round((overallProgress.completed / overallProgress.total) * 100) 
    : 0;

  const handleSectionPress = (sectionId: string) => {
    router.push(`/(tabs)/lessons?section=${sectionId}`);
  };

  const handleContinueLearning = () => {
    router.push('/(tabs)/lessons');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{currentUser?.name || 'Learner'}!</Text>
          </View>
          <Image 
            source={{ 
              uri: currentUser?.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100' 
            }}
            style={styles.avatar}
          />
        </View>
      </View>

      {/* Progress Card */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Trophy size={24} color="#F59E0B" />
          <Text style={styles.progressTitle}>Learning Progress</Text>
        </View>
        <View style={styles.progressContent}>
          <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
          <Text style={styles.progressText}>
            {overallProgress.completed} of {overallProgress.total} lessons completed
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[styles.progressFill, { width: `${progressPercentage}%` }]} 
          />
        </View>
        {progressPercentage > 0 && (
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinueLearning}
          >
            <Text style={styles.continueButtonText}>Continue Learning</Text>
            <ChevronRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <BookOpen size={24} color="#3B82F6" />
          <Text style={styles.statNumber}>{overallProgress.total}</Text>
          <Text style={styles.statLabel}>Total Lessons</Text>
        </View>
        <View style={styles.statCard}>
          <Star size={24} color="#10B981" />
          <Text style={styles.statNumber}>{overallProgress.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <TrendingUp size={24} color="#8B5CF6" />
          <Text style={styles.statNumber}>{sections.length}</Text>
          <Text style={styles.statLabel}>Sections</Text>
        </View>
      </View>

      {/* Course Sections */}
      <View style={styles.sectionsContainer}>
        <Text style={styles.sectionTitle}>Course Sections</Text>
        {sections.map((section) => {
          const sectionProgress = getSectionProgress(section.id);
          const sectionPercentage = sectionProgress.total > 0 
            ? Math.round((sectionProgress.completed / sectionProgress.total) * 100) 
            : 0;

          return (
            <TouchableOpacity
              key={section.id}
              style={styles.sectionCard}
              onPress={() => handleSectionPress(section.id)}
            >
              <View style={[styles.sectionColor, { backgroundColor: section.color }]} />
              <View style={styles.sectionContent}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionName}>{section.title}</Text>
                  <ChevronRight size={20} color="#6B7280" />
                </View>
                <Text style={styles.sectionDescription}>{section.description}</Text>
                <View style={styles.sectionProgress}>
                  <View style={styles.sectionProgressBar}>
                    <View 
                      style={[
                        styles.sectionProgressFill, 
                        { 
                          width: `${sectionPercentage}%`,
                          backgroundColor: section.color 
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.sectionProgressText}>
                    {sectionProgress.completed}/{sectionProgress.total} lessons
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Feature Highlights */}
      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>Why Learn C++?</Text>
        <View style={styles.featureCard}>
          <Clock size={24} color="#3B82F6" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Interactive Learning</Text>
            <Text style={styles.featureDescription}>
              Pre-tests and post-tests to track your progress and understanding
            </Text>
          </View>
        </View>
        <View style={styles.featureCard}>
          <Trophy size={24} color="#F59E0B" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Structured Curriculum</Text>
            <Text style={styles.featureDescription}>
              From basics to advanced OOP concepts, learn step by step
            </Text>
          </View>
        </View>
        <View style={styles.featureCard}>
          <TrendingUp size={24} color="#10B981" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Track Progress</Text>
            <Text style={styles.featureDescription}>
              Monitor your learning journey with detailed progress tracking
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: '#DBEAFE',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  progressContent: {
    marginBottom: 12,
  },
  progressPercentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 16,
  },
  progressFill: {
    height: 8,
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  sectionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionColor: {
    width: 4,
  },
  sectionContent: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  sectionProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginRight: 12,
  },
  sectionProgressFill: {
    height: 4,
    borderRadius: 2,
  },
  sectionProgressText: {
    fontSize: 12,
    color: '#6B7280',
    minWidth: 60,
  },
  featuresContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureContent: {
    flex: 1,
    marginLeft: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});