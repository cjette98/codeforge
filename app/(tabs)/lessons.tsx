import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useAppStore } from '@/store/useAppStore';
import { router, useLocalSearchParams } from 'expo-router';
import { BookOpen, CircleCheck as CheckCircle, Clock, Play, Lock, Filter, ChevronDown, ChevronRight } from 'lucide-react-native';
import { Section, Lesson } from '@/data/mockData';

export default function LessonsScreen() {
  const { 
    sections, 
    lessons, 
    getLessonProgress, 
    getSectionProgress 
  } = useAppStore();
  
  const params = useLocalSearchParams();
  const [selectedSection, setSelectedSection] = useState<string | null>(
    params.section as string || null
  );
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleSectionSelect = (sectionId: string) => {
    setSelectedSection(selectedSection === sectionId ? null : sectionId);
  };

  const handleLessonPress = (lesson: Lesson) => {
    router.push(`/lesson/${lesson.id}`);
  };

  const isLessonUnlocked = (lesson: Lesson) => {
    // First lesson of each section is always unlocked
    const sectionLessons = lessons.filter(l => l.sectionId === lesson.sectionId)
      .sort((a, b) => a.order - b.order);
    
    if (sectionLessons[0].id === lesson.id) return true;
    
    // For other lessons, check if previous lesson is completed
    const currentIndex = sectionLessons.findIndex(l => l.id === lesson.id);
    if (currentIndex > 0) {
      const previousLesson = sectionLessons[currentIndex - 1];
      const previousProgress = getLessonProgress(previousLesson.id);
      return previousProgress.isCompleted;
    }
    
    return false;
  };

  const filteredLessons = selectedSection 
    ? lessons.filter(lesson => lesson.sectionId === selectedSection)
    : lessons;

  const sortedLessons = filteredLessons.sort((a, b) => {
    const sectionA = sections.find(s => s.id === a.sectionId);
    const sectionB = sections.find(s => s.id === b.sectionId);
    
    if (sectionA?.order !== sectionB?.order) {
      return (sectionA?.order || 0) - (sectionB?.order || 0);
    }
    
    return a.order - b.order;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lessons</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Section Filter */}
        <View style={styles.sectionFilters}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.sectionFilterChip,
                !selectedSection && styles.sectionFilterChipActive
              ]}
              onPress={() => setSelectedSection(null)}
            >
              <Text style={[
                styles.sectionFilterText,
                !selectedSection && styles.sectionFilterTextActive
              ]}>
                All Sections
              </Text>
            </TouchableOpacity>
            {sections.map((section) => (
              <TouchableOpacity
                key={section.id}
                style={[
                  styles.sectionFilterChip,
                  selectedSection === section.id && styles.sectionFilterChipActive
                ]}
                onPress={() => setSelectedSection(section.id)}
              >
                <Text style={[
                  styles.sectionFilterText,
                  selectedSection === section.id && styles.sectionFilterTextActive
                ]}>
                  {section.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Section Overview (when a section is selected) */}
        {selectedSection && (
          <View style={styles.sectionOverview}>
            {(() => {
              const section = sections.find(s => s.id === selectedSection);
              const progress = getSectionProgress(selectedSection);
              const percentage = progress.total > 0 
                ? Math.round((progress.completed / progress.total) * 100) 
                : 0;
              
              return (
                <View style={[styles.sectionCard, { borderLeftColor: section?.color }]}>
                  <Text style={styles.sectionTitle}>{section?.title}</Text>
                  <Text style={styles.sectionDescription}>{section?.description}</Text>
                  <View style={styles.sectionProgressContainer}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            width: `${percentage}%`,
                            backgroundColor: section?.color 
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {progress.completed}/{progress.total} completed ({percentage}%)
                    </Text>
                  </View>
                </View>
              );
            })()}
          </View>
        )}

        {/* Lessons List */}
        <View style={styles.lessonsContainer}>
          {sortedLessons.map((lesson, index) => {
            const progress = getLessonProgress(lesson.id);
            const section = sections.find(s => s.id === lesson.sectionId);
            const isUnlocked = isLessonUnlocked(lesson);
            
            return (
              <View key={lesson.id}>
                {/* Section Header (show when not filtered) */}
                {!selectedSection && (
                  index === 0 || 
                  sortedLessons[index - 1].sectionId !== lesson.sectionId
                ) && (
                  <TouchableOpacity
                    style={styles.sectionHeader}
                    onPress={() => handleSectionSelect(lesson.sectionId)}
                  >
                    <View style={styles.sectionHeaderContent}>
                      <View style={[styles.sectionDot, { backgroundColor: section?.color }]} />
                      <Text style={styles.sectionHeaderTitle}>{section?.title}</Text>
                    </View>
                    {selectedSection === lesson.sectionId ? (
                      <ChevronDown size={20} color="#6B7280" />
                    ) : (
                      <ChevronRight size={20} color="#6B7280" />
                    )}
                  </TouchableOpacity>
                )}

                {/* Lesson Card */}
                <TouchableOpacity
                  style={[
                    styles.lessonCard,
                    !isUnlocked && styles.lessonCardLocked,
                    progress.isCompleted && styles.lessonCardCompleted
                  ]}
                  onPress={() => isUnlocked && handleLessonPress(lesson)}
                  disabled={!isUnlocked}
                >
                  <View style={styles.lessonContent}>
                    <View style={styles.lessonHeader}>
                      <View style={styles.lessonInfo}>
                        <Text style={[
                          styles.lessonTitle,
                          !isUnlocked && styles.lessonTitleLocked
                        ]}>
                          {lesson.title}
                        </Text>
                        <Text style={[
                          styles.lessonDescription,
                          !isUnlocked && styles.lessonDescriptionLocked
                        ]}>
                          {lesson.description}
                        </Text>
                      </View>
                      <View style={styles.lessonStatus}>
                        {!isUnlocked ? (
                          <Lock size={24} color="#9CA3AF" />
                        ) : progress.isCompleted ? (
                          <CheckCircle size={24} color="#10B981" />
                        ) : (
                          <Play size={24} color="#3B82F6" />
                        )}
                      </View>
                    </View>
                    
                    <View style={styles.lessonMeta}>
                      <View style={styles.lessonMetaItem}>
                        <Clock size={16} color="#6B7280" />
                        <Text style={styles.lessonMetaText}>
                          {lesson.estimatedTime} min
                        </Text>
                      </View>
                      <View style={styles.lessonMetaItem}>
                        <BookOpen size={16} color="#6B7280" />
                        <Text style={styles.lessonMetaText}>
                          Lesson {lesson.order}
                        </Text>
                      </View>
                    </View>

                    {/* Progress Indicators */}
                    {isUnlocked && (
                      <View style={styles.testProgress}>
                        <View style={[
                          styles.testIndicator,
                          progress.preTestCompleted && styles.testIndicatorCompleted
                        ]}>
                          <Text style={[
                            styles.testIndicatorText,
                            progress.preTestCompleted && styles.testIndicatorTextCompleted
                          ]}>
                            Pre-Test
                          </Text>
                        </View>
                        <View style={[
                          styles.testIndicator,
                          progress.postTestCompleted && styles.testIndicatorCompleted
                        ]}>
                          <Text style={[
                            styles.testIndicatorText,
                            progress.postTestCompleted && styles.testIndicatorTextCompleted
                          ]}>
                            Post-Test
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
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
  filterButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  sectionFilters: {
    paddingVertical: 16,
    paddingLeft: 20,
  },
  sectionFilterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionFilterChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  sectionFilterText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  sectionFilterTextActive: {
    color: '#FFFFFF',
  },
  sectionOverview: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  sectionProgressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
  },
  lessonsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 16,
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  lessonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  lessonCardLocked: {
    opacity: 0.6,
  },
  lessonCardCompleted: {
    borderWidth: 1,
    borderColor: '#10B981',
  },
  lessonContent: {
    padding: 16,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  lessonInfo: {
    flex: 1,
    marginRight: 12,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  lessonTitleLocked: {
    color: '#9CA3AF',
  },
  lessonDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  lessonDescriptionLocked: {
    color: '#D1D5DB',
  },
  lessonStatus: {
    marginLeft: 12,
  },
  lessonMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  lessonMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lessonMetaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  testProgress: {
    flexDirection: 'row',
    gap: 8,
  },
  testIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  testIndicatorCompleted: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  testIndicatorText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  testIndicatorTextCompleted: {
    color: '#059669',
  },
});