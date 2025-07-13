import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { ArrowLeft, Clock, CircleCheck as CheckCircle, Circle as XCircle, ArrowRight, Award, Eye } from 'lucide-react-native';

export default function TestScreen() {
  const { id } = useLocalSearchParams();
  const type = useLocalSearchParams().type as 'pre' | 'post';
  
  const { 
    currentTest, 
    answerQuestion, 
    submitTest, 
    lessons,
    getLessonProgress
  } = useAppStore();
  
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [isViewingCompletedTest, setIsViewingCompletedTest] = useState(false);

  const lesson = lessons.find(l => l.id === id);
  const lessonProgress = lesson ? getLessonProgress(lesson.id) : null;

  useEffect(() => {
    // Check if user is trying to view a completed test
    if (lessonProgress && 
        ((type === 'pre' && lessonProgress.preTestCompleted) || 
         (type === 'post' && lessonProgress.postTestCompleted))) {
      setIsViewingCompletedTest(true);
      setShowResults(true);
      // Create a mock result for display
      const score = type === 'pre' ? lessonProgress.preTestScore : lessonProgress.postTestScore;
      const questions = type === 'pre' ? lesson?.preTest : lesson?.postTest;
      setTestResult({
        lessonId: id,
        type,
        score: score || 0,
        totalQuestions: questions?.length || 0,
        answers: [], // We don't store individual answers, so show empty
        completedAt: new Date()
      });
      return;
    }

    if (!currentTest || currentTest.lessonId !== id || currentTest.type !== type) {
      router.back();
      return;
    }

    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentTest, id, type, lessonProgress]);

  if (!currentTest || !lesson || !currentTest.questions || currentTest.questions.length === 0) {
    // If viewing completed test, show the results
    if (isViewingCompletedTest && showResults && testResult) {
      return renderResults();
    }
    return null;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = currentTest.questions[currentTest.currentQuestionIndex];
  
  if (!currentQuestion) {
    return null;
  }
  
  const isLastQuestion = currentTest.currentQuestionIndex === currentTest.questions.length - 1;
  const progress = ((currentTest.currentQuestionIndex + 1) / currentTest.questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    // Just store the answer without advancing to next question
    const newAnswers = [...currentTest.answers];
    newAnswers[currentTest.currentQuestionIndex] = answerIndex;
    
    // Update the current test state without advancing
    // We need to update the store manually since we're not using answerQuestion
    const { currentTest: test } = useAppStore.getState();
    if (test) {
      useAppStore.setState(state => ({
        currentTest: {
          ...state.currentTest!,
          answers: newAnswers
        }
      }));
    }
  };

  const handleNext = () => {
    // Advance to next question or submit test
    if (isLastQuestion) {
      handleSubmitTest();
    } else {
      // Advance to next question
      useAppStore.setState(state => ({
        currentTest: state.currentTest ? {
          ...state.currentTest,
          currentQuestionIndex: Math.min(
            state.currentTest.currentQuestionIndex + 1,
            state.currentTest.questions.length - 1
          )
        } : null
      }));
    }
  };

  const handleSubmitTest = () => {
    Alert.alert(
      'Submit Test',
      'Are you sure you want to submit your test? You cannot change your answers after submission.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Submit', 
          onPress: () => {
            const result = submitTest();
            setTestResult(result);
            setShowResults(true);
          }
        }
      ]
    );
  };

  const handleBack = () => {
    if (isViewingCompletedTest) {
      router.push(`/lesson/${id}`);
    } else {
      Alert.alert(
        'Exit Test',
        'Are you sure you want to exit? Your progress will be lost.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', onPress: () => router.back() }
        ]
      );
    }
  };


  function renderResults() {
     const handleBack = () => {
    if (isViewingCompletedTest) {
      router.replace(`/lesson/${id}`);
    } else {
      Alert.alert(
        'Exit Test',
        'Are you sure you want to exit? Your progress will be lost.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', onPress: () => router.back() }
        ]
      );
    }
  };
      const handleFinish = () => {
    router.replace(`/lesson/${id}`);
  };

    return (
      <View style={styles.container}>
        {/* Header for completed test view */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              {type === 'pre' ? 'Pre-Test' : 'Post-Test'} Results
            </Text>
            <Text style={styles.headerSubtitle}>{lesson?.title}</Text>
          </View>
          <View style={styles.viewModeIndicator}>
            <Eye size={20} color="#6B7280" />
          </View>
        </View>

        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Award size={48} color={testResult.score >= 70 ? "#10B981" : "#F59E0B"} />
            <Text style={styles.resultsTitle}>
              {type === 'pre' ? 'Pre-Test' : 'Post-Test'} Complete!
            </Text>
            <Text style={styles.resultsScore}>{testResult.score}%</Text>
            <Text style={styles.resultsDescription}>
              You scored {testResult.score}% ({Math.round((testResult.score / 100) * testResult.totalQuestions)} out of {testResult.totalQuestions} correct)
            </Text>
            {isViewingCompletedTest && (
              <Text style={styles.viewOnlyNotice}>
                This test has been completed. You are viewing the results only.
              </Text>
            )}
          </View>

          {!isViewingCompletedTest && (
            <ScrollView style={styles.resultsDetails}>
              <Text style={styles.resultsSubtitle}>Question Review</Text>
              {currentTest?.questions.map((question, index) => {
                const userAnswer = testResult.answers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <View key={question.id} style={styles.questionReview}>
                    <View style={styles.questionHeader}>
                      <Text style={styles.questionNumber}>Question {index + 1}</Text>
                      {isCorrect ? (
                        <CheckCircle size={20} color="#10B981" />
                      ) : (
                        <XCircle size={20} color="#EF4444" />
                      )}
                    </View>
                    <Text style={styles.questionText}>{question.question}</Text>
                    
                    <View style={styles.answersReview}>
                      {question.options.map((option, optionIndex) => (
                        <View
                          key={optionIndex}
                          style={[
                            styles.answerOption,
                            optionIndex === question.correctAnswer && styles.correctAnswer,
                            optionIndex === userAnswer && optionIndex !== question.correctAnswer && styles.wrongAnswer,
                            optionIndex === userAnswer && optionIndex === question.correctAnswer && styles.correctUserAnswer
                          ]}
                        >
                          <Text style={[
                            styles.answerText,
                            optionIndex === question.correctAnswer && styles.correctAnswerText,
                            optionIndex === userAnswer && optionIndex !== question.correctAnswer && styles.wrongAnswerText
                          ]}>
                            {option}
                          </Text>
                        </View>
                      ))}
                    </View>
                    
                    {question.explanation && (
                      <View style={styles.explanation}>
                        <Text style={styles.explanationTitle}>Explanation:</Text>
                        <Text style={styles.explanationText}>{question.explanation}</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          )}

          {isViewingCompletedTest && (
            <ScrollView style={styles.resultsDetails}>
              <Text style={styles.resultsSubtitle}>Questions and Correct Answers</Text>
              {(type === 'pre' ? lesson?.preTest : lesson?.postTest)?.map((question, index) => (
                <View key={question.id} style={styles.questionReview}>
                  <View style={styles.questionHeader}>
                    <Text style={styles.questionNumber}>Question {index + 1}</Text>
                    <CheckCircle size={20} color="#10B981" />
                  </View>
                  <Text style={styles.questionText}>{question.question}</Text>
                  
                  <View style={styles.answersReview}>
                    {question.options.map((option, optionIndex) => (
                      <View
                        key={optionIndex}
                        style={[
                          styles.answerOption,
                          optionIndex === question.correctAnswer && styles.correctAnswer
                        ]}
                      >
                        <Text style={[
                          styles.answerText,
                          optionIndex === question.correctAnswer && styles.correctAnswerText
                        ]}>
                          {option}
                        </Text>
                      </View>
                    ))}
                  </View>
                  
                  {question.explanation && (
                    <View style={styles.explanation}>
                      <Text style={styles.explanationTitle}>Explanation:</Text>
                      <Text style={styles.explanationText}>{question.explanation}</Text>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          )}

          <TouchableOpacity style={styles.finishButton} onPress={isViewingCompletedTest ? handleBack : handleFinish}>
            <Text style={styles.finishButtonText}>
              Back to Lesson
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (showResults && testResult) {
    return renderResults();
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {type === 'pre' ? 'Pre-Test' : 'Post-Test'}
          </Text>
          <Text style={styles.headerSubtitle}>{lesson.title}</Text>
        </View>
        <View style={styles.timerContainer}>
          <Clock size={16} color="#6B7280" />
          <Text style={styles.timerText}>{formatTime(timeElapsed)}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((currentTest.currentQuestionIndex + 1) / currentTest.questions.length) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {currentTest.currentQuestionIndex + 1} of {currentTest.questions.length}
        </Text>
      </View>

      {/* Question */}
      <ScrollView style={styles.questionContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.questionNumber}>
          Question {currentTest.currentQuestionIndex + 1}
        </Text>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                currentTest.answers[currentTest.currentQuestionIndex] === index && styles.optionSelected
              ]}
              onPress={() => handleAnswerSelect(index)}
            >
              <View style={[
                styles.optionIndicator,
                currentTest.answers[currentTest.currentQuestionIndex] === index && styles.optionIndicatorSelected
              ]}>
                <Text style={[
                  styles.optionLetter,
                  currentTest.answers[currentTest.currentQuestionIndex] === index && styles.optionLetterSelected
                ]}>
                  {String.fromCharCode(65 + index)}
                </Text>
              </View>
              <Text style={[
                styles.optionText,
                currentTest.answers[currentTest.currentQuestionIndex] === index && styles.optionTextSelected
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            currentTest.answers[currentTest.currentQuestionIndex] === undefined && styles.nextButtonDisabled
          ]}
          onPress={handleNext}
          disabled={currentTest.answers[currentTest.currentQuestionIndex] === undefined}
        >
          <Text style={[
            styles.nextButtonText,
            currentTest.answers[currentTest.currentQuestionIndex] === undefined && styles.nextButtonTextDisabled
          ]}>
            {isLastQuestion ? 'Submit Test' : 'Next Question'}
          </Text>
          {!isLastQuestion && (
            <ArrowRight size={20} color={
              currentTest.answers[currentTest.currentQuestionIndex] === undefined ? "#9CA3AF" : "#FFFFFF"
            } />
          )}
        </TouchableOpacity>
      </View>
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
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timerText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  viewModeIndicator: {
    padding: 8,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
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
  questionContainer: {
    flex: 1,
    padding: 20,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 12,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    lineHeight: 28,
    marginBottom: 32,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  optionSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EBF8FF',
  },
  optionIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionIndicatorSelected: {
    backgroundColor: '#3B82F6',
  },
  optionLetter: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  optionLetterSelected: {
    color: '#FFFFFF',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 22,
  },
  optionTextSelected: {
    color: '#1F2937',
    fontWeight: '500',
  },
  navigation: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  nextButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  nextButtonTextDisabled: {
    color: '#9CA3AF',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  resultsHeader: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#F8FAFC',
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  resultsScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 8,
  },
  resultsDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  viewOnlyNotice: {
    fontSize: 14,
    color: '#F59E0B',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  resultsDetails: {
    flex: 1,
    padding: 20,
  },
  resultsSubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  questionReview: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  answersReview: {
    marginTop: 12,
    gap: 8,
  },
  answerOption: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  correctAnswer: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  wrongAnswer: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  correctUserAnswer: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  answerText: {
    fontSize: 14,
    color: '#1F2937',
  },
  correctAnswerText: {
    color: '#065F46',
    fontWeight: '500',
  },
  wrongAnswerText: {
    color: '#991B1B',
  },
  explanation: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#EBF8FF',
    borderRadius: 8,
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 4,
  },
  explanationText: {
    fontSize: 14,
    color: '#1E3A8A',
    lineHeight: 20,
  },
  finishButton: {
    margin: 20,
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});