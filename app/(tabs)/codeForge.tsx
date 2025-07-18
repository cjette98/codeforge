import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useAppStore } from '@/store/useAppStore';
import { router } from 'expo-router';
import { Code, Trophy, Clock, Lock, CircleCheck as CheckCircle, Star, Zap, Target, Award } from 'lucide-react-native';

export default function CodeForgeScreen() {
  const { 
    codingChallenges, 
    getChallengeProgress, 
    isChallengeUnlocked,
    getCompletedChallenges,
    getTotalPoints
  } = useAppStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleChallengePress = (challengeId: string) => {
    if (isChallengeUnlocked(challengeId)) {
      router.push(`/challenge/${challengeId}`);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'Hard': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const filteredChallenges = selectedDifficulty 
    ? codingChallenges.filter(c => c.difficulty === selectedDifficulty)
    : codingChallenges;

  const sortedChallenges = filteredChallenges.sort((a, b) => a.order - b.order);

  const completedCount = getCompletedChallenges();
  const totalPoints = getTotalPoints();
  const totalChallenges = codingChallenges.length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CodeForge</Text>
        <View style={styles.headerStats}>
          <View style={styles.statItem}>
            <Trophy size={16} color="#F59E0B" />
            <Text style={styles.statText}>{totalPoints}</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Overview */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Code size={24} color="#3B82F6" />
            <Text style={styles.progressTitle}>Your Progress</Text>
          </View>
          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <Text style={styles.progressNumber}>{completedCount}</Text>
              <Text style={styles.progressLabel}>Solved</Text>
            </View>
            <View style={styles.progressDivider} />
            <View style={styles.progressStat}>
              <Text style={styles.progressNumber}>{totalChallenges}</Text>
              <Text style={styles.progressLabel}>Total</Text>
            </View>
            <View style={styles.progressDivider} />
            <View style={styles.progressStat}>
              <Text style={styles.progressNumber}>{totalPoints}</Text>
              <Text style={styles.progressLabel}>Points</Text>
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${totalChallenges > 0 ? (completedCount / totalChallenges) * 100 : 0}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {totalChallenges > 0 ? Math.round((completedCount / totalChallenges) * 100) : 0}% Complete
            </Text>
          </View>
        </View>

        {/* Difficulty Filter */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Filter by Difficulty</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterChip,
                !selectedDifficulty && styles.filterChipActive
              ]}
              onPress={() => setSelectedDifficulty(null)}
            >
              <Text style={[
                styles.filterText,
                !selectedDifficulty && styles.filterTextActive
              ]}>
                All
              </Text>
            </TouchableOpacity>
            {['Easy', 'Medium', 'Hard'].map((difficulty) => (
              <TouchableOpacity
                key={difficulty}
                style={[
                  styles.filterChip,
                  selectedDifficulty === difficulty && styles.filterChipActive,
                  { borderColor: getDifficultyColor(difficulty) }
                ]}
                onPress={() => setSelectedDifficulty(difficulty)}
              >
                <Text style={[
                  styles.filterText,
                  selectedDifficulty === difficulty && styles.filterTextActive,
                  { color: getDifficultyColor(difficulty) }
                ]}>
                  {difficulty}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Challenges List */}
        <View style={styles.challengesContainer}>
          <Text style={styles.sectionTitle}>Challenges</Text>
          {sortedChallenges.map((challenge) => {
            const progress = getChallengeProgress(challenge.id);
            const isUnlocked = isChallengeUnlocked(challenge.id);
            
            return (
              <TouchableOpacity
                key={challenge.id}
                style={[
                  styles.challengeCard,
                  !isUnlocked && styles.challengeCardLocked,
                  progress.isCompleted && styles.challengeCardCompleted
                ]}
                onPress={() => handleChallengePress(challenge.id)}
                disabled={!isUnlocked}
              >
                <View style={styles.challengeHeader}>
                  <View style={styles.challengeInfo}>
                    <View style={styles.challengeTitleRow}>
                      <Text style={[
                        styles.challengeTitle,
                        !isUnlocked && styles.challengeTitleLocked
                      ]}>
                        {challenge.title}
                      </Text>
                      <View style={styles.challengeStatus}>
                        {!isUnlocked ? (
                          <Lock size={20} color="#9CA3AF" />
                        ) : progress.isCompleted ? (
                          <CheckCircle size={20} color="#10B981" />
                        ) : (
                          <Code size={20} color="#3B82F6" />
                        )}
                      </View>
                    </View>
                    <Text style={[
                      styles.challengeDescription,
                      !isUnlocked && styles.challengeDescriptionLocked
                    ]}>
                      {challenge.description}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.challengeMeta}>
                  <View style={styles.challengeMetaLeft}>
                    <View style={[
                      styles.difficultyBadge,
                      { backgroundColor: getDifficultyColor(challenge.difficulty) + '20' }
                    ]}>
                      <Text style={[
                        styles.difficultyText,
                        { color: getDifficultyColor(challenge.difficulty) }
                      ]}>
                        {challenge.difficulty}
                      </Text>
                    </View>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{challenge.category}</Text>
                    </View>
                  </View>
                  <View style={styles.challengeMetaRight}>
                    <View style={styles.metaItem}>
                      <Star size={14} color="#F59E0B" />
                      <Text style={styles.metaText}>{challenge.points}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Clock size={14} color="#6B7280" />
                      <Text style={styles.metaText}>{challenge.timeLimit}m</Text>
                    </View>
                  </View>
                </View>

                {progress.isCompleted && (
                  <View style={styles.completionInfo}>
                    <View style={styles.completionStat}>
                      <Target size={14} color="#10B981" />
                      <Text style={styles.completionText}>
                        Solved in {progress.attempts} attempt{progress.attempts !== 1 ? 's' : ''}
                      </Text>
                    </View>
                    {progress.bestTime && (
                      <View style={styles.completionStat}>
                        <Zap size={14} color="#3B82F6" />
                        <Text style={styles.completionText}>
                          Best: {Math.round(progress.bestTime)}s
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {!isUnlocked && (
                  <View style={styles.lockedInfo}>
                    <Text style={styles.lockedText}>
                      Complete previous challenges to unlock
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Achievement Section */}
        <View style={styles.achievementContainer}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementCard}>
            <Award size={24} color="#F59E0B" />
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>Problem Solver</Text>
              <Text style={styles.achievementDescription}>
                {completedCount > 0 
                  ? `Great job! You've solved ${completedCount} challenge${completedCount !== 1 ? 's' : ''}.`
                  : 'Start solving challenges to earn your first achievement!'
                }
              </Text>
            </View>
          </View>
          
          {totalPoints >= 100 && (
            <View style={styles.achievementCard}>
              <Trophy size={24} color="#8B5CF6" />
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>Point Master</Text>
                <Text style={styles.achievementDescription}>
                  Excellent! You've earned {totalPoints} points. Keep coding!
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
  headerStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
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
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  progressStat: {
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  progressLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  progressDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
  },
  progressBarContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  progressFill: {
    height: 8,
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  challengesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  challengeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  challengeCardLocked: {
    opacity: 0.6,
  },
  challengeCardCompleted: {
    borderWidth: 1,
    borderColor: '#10B981',
  },
  challengeHeader: {
    marginBottom: 12,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  challengeTitleLocked: {
    color: '#9CA3AF',
  },
  challengeStatus: {
    marginLeft: 12,
  },
  challengeDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  challengeDescriptionLocked: {
    color: '#D1D5DB',
  },
  challengeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  challengeMetaLeft: {
    flexDirection: 'row',
    gap: 8,
  },
  challengeMetaRight: {
    flexDirection: 'row',
    gap: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  categoryText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  completionInfo: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  completionStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  completionText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  lockedInfo: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  lockedText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  achievementContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  achievementCard: {
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
  achievementContent: {
    flex: 1,
    marginLeft: 16,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});