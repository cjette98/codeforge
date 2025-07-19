import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { ArrowLeft, Play, CircleCheck as CheckCircle, Clock, BookOpen, Target, Award, Video } from 'lucide-react-native';
import { MessageCircle } from 'lucide-react-native';
import VideoPlayer from '@/components/VideoPlayer';
import AIQuestionHelper from '@/components/AIQuestionHelper';

export default function LessonScreen() {
  const { id } = useLocalSearchParams();
  const { 
    lessons, 
    sections, 
    getLessonProgress, 
    startLesson, 
    startTest,
    currentTest
  } = useAppStore();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'content'>('overview');
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [showAIHelper, setShowAIHelper] = useState(false);
  
  const lesson = lessons.find(l => l.id === id);
  const section = lesson ? sections.find(s => s.id === lesson.sectionId) : null;
  const progress = lesson ? getLessonProgress(lesson.id) : null;

  useEffect(() => {
    if (lesson) {
      startLesson(lesson.id);
    }
  }, [lesson]);

  if (!lesson || !section || !progress) {
    return (
      <View style={styles.container}>
        <Text>Lesson not found</Text>
      </View>
    );
  }

  const handleStartTest = (type: 'pre' | 'post') => {
    if (type === 'post' && !progress.preTestCompleted) {
      Alert.alert(
        'Pre-test Required',
        'You must complete the pre-test before taking the post-test.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    startTest(lesson.id, type);
    router.push(`/test/${lesson.id}?type=${type}`);
  };

  const handleBack = () => {
    router.back();
  };

  const handleWatchVideo = () => {
    setShowVideoPlayer(true);
  };

  const handleAskAI = () => {
    setShowAIHelper(true);
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{lesson.title}</Text>
          <Text style={styles.headerSubtitle}>{section.title}</Text>
        </View>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressIndicator}>
        <View style={[styles.progressDot, progress.preTestCompleted && styles.progressDotCompleted]}>
          <Text style={styles.progressDotText}>1</Text>
        </View>
        <View style={[styles.progressLine, progress.preTestCompleted && styles.progressLineCompleted]} />
        <View style={[styles.progressDot, activeTab === 'content' && styles.progressDotActive]}>
          <Text style={styles.progressDotText}>2</Text>
        </View>
        <View style={[styles.progressLine, progress.postTestCompleted && styles.progressLineCompleted]} />
        <View style={[styles.progressDot, progress.postTestCompleted && styles.progressDotCompleted]}>
          <Text style={styles.progressDotText}>3</Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.tabActive]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'content' && styles.tabActive]}
          onPress={() => setActiveTab('content')}
        >
          <Text style={[styles.tabText, activeTab === 'content' && styles.tabTextActive]}>
            Content
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' ? (
          <View style={styles.overviewContainer}>
            {/* Lesson Info */}
            <View style={styles.lessonInfoCard}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <Text style={styles.lessonDescription}>{lesson.description}</Text>
              
              <View style={styles.lessonMeta}>
                <View style={styles.metaItem}>
                  <Clock size={16} color="#6B7280" />
                  <Text style={styles.metaText}>{lesson.estimatedTime} minutes</Text>
                </View>
                <View style={styles.metaItem}>
                  <BookOpen size={16} color="#6B7280" />
                  <Text style={styles.metaText}>Lesson {lesson.order}</Text>
                </View>
              </View>
            </View>

            {/* Learning Path */}
            <View style={styles.learningPathCard}>
              <Text style={styles.cardTitle}>Learning Path</Text>
              
              {/* Pre-test */}
              <TouchableOpacity
                style={[
                  styles.pathStep,
                  progress.preTestCompleted && styles.pathStepCompleted
                ]}
                onPress={() => handleStartTest('pre')}
                disabled={progress.preTestCompleted}
              >
                <View style={styles.pathStepLeft}>
                  <View style={[
                    styles.stepIcon,
                    progress.preTestCompleted && styles.stepIconCompleted
                  ]}>
                    {progress.preTestCompleted ? (
                      <CheckCircle size={20} color="#10B981" />
                    ) : (
                      <Target size={20} color="#6B7280" />
                    )}
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Pre-Test</Text>
                    <Text style={styles.stepDescription}>
                      Test your current knowledge
                    </Text>
                    {progress.preTestScore !== undefined && (
                      <Text style={styles.stepScore}>Score: {progress.preTestScore}%</Text>
                    )}
                  </View>
                </View>
                {!progress.preTestCompleted && (
                  <Play size={20} color="#3B82F6" />
                )}
              </TouchableOpacity>

              {/* Lesson Content */}
              <TouchableOpacity
                style={[
                  styles.pathStep,
                  progress.preTestCompleted && styles.pathStepEnabled
                ]}
                onPress={() => setActiveTab('content')}
                disabled={!progress.preTestCompleted}
              >
                <View style={styles.pathStepLeft}>
                  <View style={[
                    styles.stepIcon,
                    progress.preTestCompleted && styles.stepIconEnabled
                  ]}>
                    <BookOpen size={20} color={progress.preTestCompleted ? "#3B82F6" : "#9CA3AF"} />
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={[
                      styles.stepTitle,
                      !progress.preTestCompleted && styles.stepTitleDisabled
                    ]}>
                      Learn Content
                    </Text>
                    <Text style={[
                      styles.stepDescription,
                      !progress.preTestCompleted && styles.stepDescriptionDisabled
                    ]}>
                      Study the lesson material
                    </Text>
                  </View>
                </View>
                {progress.preTestCompleted && (
                  <Play size={20} color="#3B82F6" />
                )}
              </TouchableOpacity>

              {/* Post-test */}
              <TouchableOpacity
                style={[
                  styles.pathStep,
                  progress.postTestCompleted && styles.pathStepCompleted
                ]}
                onPress={() => handleStartTest('post')}
                disabled={!progress.preTestCompleted || progress.postTestCompleted}
              >
                <View style={styles.pathStepLeft}>
                  <View style={[
                    styles.stepIcon,
                    progress.postTestCompleted && styles.stepIconCompleted,
                    progress.preTestCompleted && !progress.postTestCompleted && styles.stepIconEnabled
                  ]}>
                    {progress.postTestCompleted ? (
                      <CheckCircle size={20} color="#10B981" />
                    ) : (
                      <Award size={20} color={progress.preTestCompleted ? "#3B82F6" : "#9CA3AF"} />
                    )}
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={[
                      styles.stepTitle,
                      !progress.preTestCompleted && styles.stepTitleDisabled
                    ]}>
                      Post-Test
                    </Text>
                    <Text style={[
                      styles.stepDescription,
                      !progress.preTestCompleted && styles.stepDescriptionDisabled
                    ]}>
                      Test your new knowledge
                    </Text>
                    {progress.postTestScore !== undefined && (
                      <Text style={styles.stepScore}>Score: {progress.postTestScore}%</Text>
                    )}
                  </View>
                </View>
                {progress.preTestCompleted && !progress.postTestCompleted && (
                  <Play size={20} color="#3B82F6" />
                )}
              </TouchableOpacity>
            </View>

            {/* Completion Status */}
            {progress.isCompleted && (
              <View style={styles.completionCard}>
                <CheckCircle size={24} color="#10B981" />
                <Text style={styles.completionTitle}>Lesson Completed!</Text>
                <Text style={styles.completionDescription}>
                  Great job! You've successfully completed this lesson.
                </Text>
                {progress.preTestScore !== undefined && progress.postTestScore !== undefined && (
                  <Text style={styles.improvementText}>
                    Improvement: {progress.postTestScore - progress.preTestScore > 0 ? '+' : ''}
                    {progress.postTestScore - progress.preTestScore}%
                  </Text>
                )}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.contentContainer}>
            {progress.preTestCompleted ? (
              <View style={styles.lessonContent}>
                {/* Video Section */}
                {lesson.videoUrl && (
                  <View style={styles.videoSection}>
                    <TouchableOpacity 
                      style={styles.videoButton}
                      onPress={handleWatchVideo}
                    >
                      <Video size={24} color="#FFFFFF" />
                      <Text style={styles.videoButtonText}>Watch Video Lesson</Text>
                    </TouchableOpacity>
                  </View>
                )}
                
                {/* Text Content */}
                <Text style={styles.contentText}>{lesson.content}</Text>
                
                {/* AI Question Helper Button */}
                <View style={styles.aiHelperSection}>
                  <TouchableOpacity 
                    style={styles.aiHelperButton}
                    onPress={handleAskAI}
                  >
                    <MessageCircle size={20} color="#FFFFFF" />
                    <Text style={styles.aiHelperButtonText}>Ask AI Tutor</Text>
                  </TouchableOpacity>
                  <Text style={styles.aiHelperDescription}>
                    Have questions about this lesson? Ask our AI tutor for clarification and examples!
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.lockedContent}>
                <Target size={48} color="#9CA3AF" />
                <Text style={styles.lockedTitle}>Complete Pre-Test First</Text>
                <Text style={styles.lockedDescription}>
                  You need to complete the pre-test before accessing the lesson content.
                </Text>
                <TouchableOpacity
                  style={styles.unlockButton}
                  onPress={() => handleStartTest('pre')}
                >
                  <Text style={styles.unlockButtonText}>Take Pre-Test</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>
      
      {/* Video Player Modal */}
      {lesson.videoUrl && (
        <VideoPlayer
          videoUrl={lesson.videoUrl}
          title={lesson.title}
          visible={showVideoPlayer}
          onClose={() => setShowVideoPlayer(false)}
        />
      )}
      
      {/* AI Question Helper Modal */}
      <AIQuestionHelper
        lessonTitle={lesson.title}
        lessonContent={lesson.content}
        visible={showAIHelper}
        onClose={() => setShowAIHelper(false)}
      />
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  progressIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDotActive: {
    backgroundColor: '#3B82F6',
  },
  progressDotCompleted: {
    backgroundColor: '#10B981',
  },
  progressDotText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  progressLineCompleted: {
    backgroundColor: '#10B981',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  overviewContainer: {
    padding: 20,
  },
  lessonInfoCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  lessonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  lessonDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 16,
  },
  lessonMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
  },
  learningPathCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  pathStep: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pathStepEnabled: {
    backgroundColor: '#EBF8FF',
    borderColor: '#3B82F6',
  },
  pathStepCompleted: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  pathStepLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepIconEnabled: {
    backgroundColor: '#DBEAFE',
  },
  stepIconCompleted: {
    backgroundColor: '#D1FAE5',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  stepTitleDisabled: {
    color: '#9CA3AF',
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  stepDescriptionDisabled: {
    color: '#D1D5DB',
  },
  stepScore: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 2,
  },
  completionCard: {
    backgroundColor: '#D1FAE5',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  completionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#065F46',
    marginTop: 8,
    marginBottom: 8,
  },
  completionDescription: {
    fontSize: 14,
    color: '#047857',
    textAlign: 'center',
    marginBottom: 8,
  },
  improvementText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#059669',
  },
  contentContainer: {
    padding: 20,
  },
  lessonContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  videoSection: {
    marginBottom: 20,
  },
  videoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  videoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1F2937',
  },
  lockedContent: {
    backgroundColor: '#FFFFFF',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  lockedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  lockedDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
  },
  unlockButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  unlockButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  aiHelperSection: {
    marginTop: 24,
    padding: 20,
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  aiHelperButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aiHelperButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  aiHelperDescription: {
    fontSize: 14,
    color: '#0369A1',
    textAlign: 'center',
    lineHeight: 20,
  },
});