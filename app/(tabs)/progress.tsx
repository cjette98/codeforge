import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useAppStore } from '@/store/useAppStore';
import { Trophy, TrendingUp, Clock, Target, BookOpen, CircleCheck as CheckCircle, Award, Calendar } from 'lucide-react-native';

export default function ProgressScreen() {
  const { 
    sections, 
    lessons, 
    lessonProgress, 
    getOverallProgress, 
    getSectionProgress 
  } = useAppStore();
  
  const [refreshing, setRefreshing] = React.useState(false);
  const overallProgress = getOverallProgress();

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const completedLessons = Object.values(lessonProgress)
    .filter(progress => progress.isCompleted)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());

  const averageScore = () => {
    const completedWithScores = Object.values(lessonProgress)
      .filter(p => p.isCompleted && p.preTestScore !== undefined && p.postTestScore !== undefined);
    
    if (completedWithScores.length === 0) return 0;
    
    const totalImprovement = completedWithScores.reduce((sum, p) => 
      sum + ((p.postTestScore! - p.preTestScore!) / p.preTestScore!) * 100, 0
    );
    
    return Math.round(totalImprovement / completedWithScores.length);
  };

  const totalStudyTime = () => {
    return completedLessons.reduce((total, progress) => {
      const lesson = lessons.find(l => l.id === progress.lessonId);
      return total + (lesson?.estimatedTime || 0);
    }, 0);
  };

  const getStreakCount = () => {
    // Simple streak calculation based on completion dates
    if (completedLessons.length === 0) return 0;
    
    let streak = 1;
    const sortedByDate = completedLessons.sort((a, b) => 
      new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime()
    );
    
    for (let i = 1; i < sortedByDate.length; i++) {
      const current = new Date(sortedByDate[i].completedAt!);
      const previous = new Date(sortedByDate[i - 1].completedAt!);
      const dayDiff = Math.abs((previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff <= 7) { // Within a week
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const progressPercentage = overallProgress.total > 0 
    ? Math.round((overallProgress.completed / overallProgress.total) * 100) 
    : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Progress</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Overall Progress Card */}
        <View style={styles.overallProgressCard}>
          <View style={styles.progressHeader}>
            <Trophy size={28} color="#F59E0B" />
            <Text style={styles.progressTitle}>Overall Progress</Text>
          </View>
          <View style={styles.progressContent}>
            <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
            <Text style={styles.progressSubtext}>Course Completion</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[styles.progressFill, { width: `${progressPercentage}%` }]} 
              />
            </View>
            <Text style={styles.progressText}>
              {overallProgress.completed} of {overallProgress.total} lessons completed
            </Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <TrendingUp size={24} color="#10B981" />
            <Text style={styles.statNumber}>{averageScore()}%</Text>
            <Text style={styles.statLabel}>Avg Improvement</Text>
          </View>
          <View style={styles.statCard}>
            <Clock size={24} color="#3B82F6" />
            <Text style={styles.statNumber}>{totalStudyTime()}</Text>
            <Text style={styles.statLabel}>Minutes Studied</Text>
          </View>
          <View style={styles.statCard}>
            <Target size={24} color="#8B5CF6" />
            <Text style={styles.statNumber}>{getStreakCount()}</Text>
            <Text style={styles.statLabel}>Learning Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Award size={24} color="#F59E0B" />
            <Text style={styles.statNumber}>{completedLessons.length}</Text>
            <Text style={styles.statLabel}>Lessons Done</Text>
          </View>
        </View>

        {/* Section Progress */}
        <View style={styles.sectionProgressContainer}>
          <Text style={styles.sectionTitle}>Section Progress</Text>
          {sections.map((section) => {
            const progress = getSectionProgress(section.id);
            const percentage = progress.total > 0 
              ? Math.round((progress.completed / progress.total) * 100) 
              : 0;

            return (
              <View key={section.id} style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionInfo}>
                    <View style={[styles.sectionDot, { backgroundColor: section.color }]} />
                    <Text style={styles.sectionName}>{section.title}</Text>
                  </View>
                  <Text style={styles.sectionPercentage}>{percentage}%</Text>
                </View>
                <View style={styles.sectionProgressBar}>
                  <View 
                    style={[
                      styles.sectionProgressFill, 
                      { 
                        width: `${percentage}%`,
                        backgroundColor: section.color 
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.sectionProgressText}>
                  {progress.completed} of {progress.total} lessons completed
                </Text>
              </View>
            );
          })}
        </View>

        {/* Recent Achievements */}
        {completedLessons.length > 0 && (
          <View style={styles.achievementsContainer}>
            <Text style={styles.sectionTitle}>Recent Achievements</Text>
            {completedLessons.slice(0, 5).map((progress) => {
              const lesson = lessons.find(l => l.id === progress.lessonId);
              const section = sections.find(s => s.id === lesson?.sectionId);
              
              if (!lesson) return null;

              const improvement = progress.preTestScore && progress.postTestScore
                ? Math.round(((progress.postTestScore - progress.preTestScore) / progress.preTestScore) * 100)
                : 0;

              return (
                <View key={progress.lessonId} style={styles.achievementCard}>
                  <View style={styles.achievementIcon}>
                    <CheckCircle size={20} color="#10B981" />
                  </View>
                  <View style={styles.achievementContent}>
                    <Text style={styles.achievementTitle}>{lesson.title}</Text>
                    <Text style={styles.achievementSubtitle}>{section?.title}</Text>
                    <View style={styles.achievementStats}>
                      {progress.preTestScore !== undefined && progress.postTestScore !== undefined && (
                        <Text style={styles.achievementStat}>
                          Improvement: {improvement > 0 ? '+' : ''}{improvement}%
                        </Text>
                      )}
                      <Text style={styles.achievementDate}>
                        {new Date(progress.completedAt!).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Learning Insights */}
        <View style={styles.insightsContainer}>
          <Text style={styles.sectionTitle}>Learning Insights</Text>
          <View style={styles.insightCard}>
            <BookOpen size={24} color="#3B82F6" />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Keep up the great work!</Text>
              <Text style={styles.insightDescription}>
                {progressPercentage < 25 
                  ? "You're just getting started. Every expert was once a beginner!"
                  : progressPercentage < 50
                  ? "You're making steady progress. Keep building those fundamentals!"
                  : progressPercentage < 75
                  ? "Great momentum! You're more than halfway through the course."
                  : progressPercentage < 100
                  ? "Almost there! You're in the final stretch."
                  : "Congratulations! You've completed the entire C++ course!"
                }
              </Text>
            </View>
          </View>

          {averageScore() > 0 && (
            <View style={styles.insightCard}>
              <TrendingUp size={24} color="#10B981" />
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Performance Analysis</Text>
                <Text style={styles.insightDescription}>
                  {averageScore() > 50
                    ? `Excellent! Your average improvement of ${averageScore()}% shows you're really learning and retaining the concepts.`
                    : averageScore() > 25
                    ? `Good progress! You're showing ${averageScore()}% improvement on average. Keep practicing!`
                    : `You're building your foundation. Focus on understanding concepts before moving to the next lesson.`
                  }
                </Text>
              </View>
            </View>
          )}

          {getStreakCount() > 1 && (
            <View style={styles.insightCard}>
              <Calendar size={24} color="#8B5CF6" />
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Learning Streak</Text>
                <Text style={styles.insightDescription}>
                  Amazing! You've completed {getStreakCount()} lessons in your current streak. 
                  Consistent learning leads to better retention and understanding.
                </Text>
              </View>
            </View>
          )}
        </View>
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
  scrollView: {
    flex: 1,
  },
  overallProgressCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 24,
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
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 12,
  },
  progressContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressPercentage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  progressSubtext: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  progressBarContainer: {
    gap: 8,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
  },
  progressFill: {
    height: 10,
    backgroundColor: '#3B82F6',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
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
    textAlign: 'center',
  },
  sectionProgressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  sectionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  sectionPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  sectionProgressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 8,
  },
  sectionProgressFill: {
    height: 6,
    borderRadius: 3,
  },
  sectionProgressText: {
    fontSize: 12,
    color: '#6B7280',
  },
  achievementsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementIcon: {
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  achievementSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  achievementStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  achievementStat: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  achievementDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  insightsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  insightContent: {
    flex: 1,
    marginLeft: 16,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  insightDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});