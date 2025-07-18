import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { ArrowLeft, Play, Clock, Trophy, CircleCheck as CheckCircle, Circle as XCircle, Lightbulb, Eye, Code } from 'lucide-react-native';

const { height: screenHeight } = Dimensions.get('window');

export default function ChallengeScreen() {
  const { id } = useLocalSearchParams();
  const {
    codingChallenges,
    getChallengeProgress,
    submitChallenge,
    isChallengeUnlocked
  } = useAppStore();

  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isCodeEditorFocused, setIsCodeEditorFocused] = useState(false);

  const challenge = codingChallenges.find(c => c.id === id);
  const progress = challenge ? getChallengeProgress(challenge.id) : null;
  const isUnlocked = challenge ? isChallengeUnlocked(challenge.id) : false;

  useEffect(() => {
    if (!challenge || !isUnlocked) {
      router.back();
      return;
    }

    setCode(challenge.starterCode);
    setStartTime(new Date());

    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [challenge, isUnlocked]);

  if (!challenge || !progress) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'Hard': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const handleRunCode = () => {
    if (!code.trim()) {
      Alert.alert('Error', 'Please write some code first!');
      return;
    }

    // Basic validation - check if code contains essential elements
    const hasInclude = code.includes('#include');
    const hasMain = code.includes('int main') || code.includes('main()');
    const hasCout = code.includes('cout') || code.includes('printf');

    if (!hasInclude || !hasMain) {
      Alert.alert('Error', 'Your code must include headers and a main function!');
      return;
    }

    setIsRunning(true);

    // Simulate code execution
    setTimeout(() => {
      // Simulate code execution with basic validation
      const results = challenge.testCases.map((testCase, index) => {
        // Basic code analysis for simple challenges
        let passed = false;
        let actualOutput = '';

        // Simple validation based on challenge type
        switch (challenge.id) {
          case 'hello-world':
            passed = code.includes('Hello, World!') && hasCout;
            actualOutput = passed ? 'Hello, World!' : 'No output or incorrect text';
            break;

          case 'add-two-numbers':
            passed = code.includes('cin') && code.includes('+') && hasCout;
            actualOutput = passed ? testCase.expectedOutput : 'Incorrect calculation';
            break;

          case 'even-odd':
            passed = code.includes('%') && code.includes('if') && (code.includes('Even') || code.includes('Odd'));
            actualOutput = passed ? testCase.expectedOutput : 'Missing modulus or conditional logic';
            break;

          case 'factorial':
            passed = code.includes('for') || code.includes('while');
            actualOutput = passed ? testCase.expectedOutput : 'Missing loop structure';
            break;

          case 'fibonacci':
            passed = (code.includes('for') || code.includes('while')) && code.includes('+');
            actualOutput = passed ? testCase.expectedOutput : 'Missing loop or addition';
            break;

          case 'prime-check':
            passed = code.includes('for') && code.includes('%') && code.includes('if');
            actualOutput = passed ? testCase.expectedOutput : 'Missing loop, modulus, or conditional';
            break;

          case 'array-sum':
            passed = code.includes('for') && code.includes('arr') && code.includes('+');
            actualOutput = passed ? testCase.expectedOutput : 'Missing array iteration or sum calculation';
            break;

          case 'find-maximum':
            passed = code.includes('for') && code.includes('arr') && code.includes('>');
            actualOutput = passed ? testCase.expectedOutput : 'Missing array iteration or comparison';
            break;

          case 'reverse-array':
            passed = code.includes('for') && code.includes('arr') && (code.includes('n-1') || code.includes('--'));
            actualOutput = passed ? testCase.expectedOutput : 'Missing reverse iteration logic';
            break;

          case 'palindrome-check':
            passed = code.includes('for') && code.includes('length') && code.includes('==');
            actualOutput = passed ? testCase.expectedOutput : 'Missing string comparison logic';
            break;

          case 'count-vowels':
            passed = code.includes('for') && (code.includes('a') || code.includes('e') || code.includes('i') || code.includes('o') || code.includes('u'));
            actualOutput = passed ? testCase.expectedOutput : 'Missing vowel checking logic';
            break;

          case 'bubble-sort':
            passed = code.includes('for') && code.includes('swap') || (code.includes('temp') && code.includes('>'));
            actualOutput = passed ? testCase.expectedOutput : 'Missing nested loops or swap logic';
            break;

          default:
            // For unknown challenges, do basic syntax check
            passed = hasInclude && hasMain && hasCout;
            actualOutput = passed ? testCase.expectedOutput : 'Basic syntax requirements not met';
        }

        return {
          testCase: index + 1,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput,
          passed,
          description: testCase.description
        };
      });

      setTestResults(results);
      setShowResults(true);
      setIsRunning(false);

      // Check if all tests passed
      const allPassed = results.every(r => r.passed);
      if (allPassed) {
        const timeTaken = startTime ? (new Date().getTime() - startTime.getTime()) / 1000 : 0;
        const success = submitChallenge(challenge.id, code, timeTaken);

        if (success) {
          Alert.alert(
            'Congratulations! 🎉',
            `You solved "${challenge.title}" successfully!\n\nPoints earned: ${challenge.points}\nTime taken: ${formatTime(Math.round(timeTaken))}`,
            [
              { text: 'Next Challenge', onPress: handleNextChallenge },
              { text: 'Back to List', onPress: () => router.back() }
            ]
          );
        }
      } else {
        Alert.alert(
          'Tests Failed',
          'Some test cases failed. Check your code and try again.',
          [{ text: 'OK' }]
        );
      }
    }, 2000);
  };

  const handleNextChallenge = () => {
    const sortedChallenges = codingChallenges.sort((a, b) => a.order - b.order);
    const currentIndex = sortedChallenges.findIndex(c => c.id === challenge.id);

    if (currentIndex < sortedChallenges.length - 1) {
      const nextChallenge = sortedChallenges[currentIndex + 1];
      if (isChallengeUnlocked(nextChallenge.id)) {
        router.replace(`/challenge/${nextChallenge.id}`);
      } else {
        router.back();
      }
    } else {
      router.back();
    }
  };

  const handleBack = () => {
    Alert.alert(
      'Leave Challenge',
      'Are you sure you want to leave? Your progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Leave', onPress: () => router.back() }
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{challenge.title}</Text>
          <Text style={styles.headerSubtitle}>{challenge.category}</Text>
        </View>
        <View style={styles.timerContainer}>
          <Clock size={16} color="#6B7280" />
          <Text style={styles.timerText}>{formatTime(timeElapsed)}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        {/* Challenge Info */}
        <View style={[styles.challengeInfo, isCodeEditorFocused && styles.challengeInfoCollapsed]}>
          <View style={styles.challengeHeader}>
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
            <View style={styles.pointsBadge}>
              <Trophy size={14} color="#F59E0B" />
              <Text style={styles.pointsText}>{challenge.points} points</Text>
            </View>
          </View>

          <Text style={styles.challengeDescription}>{challenge.description}</Text>

          {/* Test Cases Preview */}
          <View style={styles.testCasesPreview}>
            <Text style={styles.sectionTitle}>Example:</Text>
            {challenge.testCases.slice(0, 2).map((testCase, index) => (
              <View key={index} style={styles.testCaseExample}>
                <Text style={styles.testCaseLabel}>Input:</Text>
                <Text style={styles.testCaseValue}>{testCase.input || '(no input)'}</Text>
                <Text style={styles.testCaseLabel}>Output:</Text>
                <Text style={styles.testCaseValue}>{testCase.expectedOutput}</Text>
                {testCase.description && (
                  <Text style={styles.testCaseDescription}>{testCase.description}</Text>
                )}
              </View>
            ))}
          </View>

          {/* Constraints */}
          <View style={styles.constraints}>
            <Text style={styles.sectionTitle}>Constraints:</Text>
            <Text style={styles.constraintText}>• Time Limit: {challenge.timeLimit} minutes</Text>
            <Text style={styles.constraintText}>• Memory Limit: {challenge.memoryLimit}</Text>
          </View>
        </View>

        {/* Code Editor */}
        <View style={[
          styles.codeEditor,
          isCodeEditorFocused && styles.codeEditorExpanded
        ]}>
          <View style={styles.editorHeader}>
            <Text style={styles.editorTitle}>Code Editor</Text>
            <View style={styles.editorActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setShowHints(true)}
              >
                <Lightbulb size={16} color="#F59E0B" />
                <Text style={styles.actionButtonText}>Hints</Text>
              </TouchableOpacity>
              {progress.isCompleted && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => setShowSolution(true)}
                >
                  <Eye size={16} color="#6B7280" />
                  <Text style={styles.actionButtonText}>Solution</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <TextInput
            style={[
              styles.codeInput,
              isCodeEditorFocused && styles.codeInputExpanded
            ]}
            value={code}
            onChangeText={setCode}
            onFocus={() => setIsCodeEditorFocused(true)}
            onBlur={() => setIsCodeEditorFocused(false)}
            multiline
            placeholder="Write your C++ code here..."
            placeholderTextColor="#9CA3AF"
            textAlignVertical="top"
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            fontFamily="monospace"
            scrollEnabled={true}
            blurOnSubmit={false}
            returnKeyType="none"
          />
        </View>

        {/* Run Button */}
        <View style={[styles.runSection, isCodeEditorFocused && styles.runSectionHidden]}>
          <TouchableOpacity
            style={[styles.runButton, isRunning && styles.runButtonDisabled]}
            onPress={handleRunCode}
            disabled={isRunning}
          >
            <Play size={20} color="#FFFFFF" />
            <Text style={styles.runButtonText}>
              {isRunning ? 'Running...' : 'Run Code'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Test Results */}
        {showResults && !isCodeEditorFocused && (
          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>Test Results</Text>
            {testResults.map((result, index) => (
              <View key={index} style={[
                styles.testResult,
                result.passed ? styles.testResultPassed : styles.testResultFailed
              ]}>
                <View style={styles.testResultHeader}>
                  <Text style={styles.testResultTitle}>Test Case {result.testCase}</Text>
                  {result.passed ? (
                    <CheckCircle size={20} color="#10B981" />
                  ) : (
                    <XCircle size={20} color="#EF4444" />
                  )}
                </View>
                <Text style={styles.testResultDescription}>{result.description}</Text>
                <View style={styles.testResultDetails}>
                  <Text style={styles.testResultLabel}>Input: {result.input || '(no input)'}</Text>
                  <Text style={styles.testResultLabel}>Expected: {result.expectedOutput}</Text>
                  <Text style={styles.testResultLabel}>Your Output: {result.actualOutput}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Run Button when editor is focused */}
      {isCodeEditorFocused && (
        <View style={styles.floatingRunButton}>
          <TouchableOpacity
            style={[styles.runButton, isRunning && styles.runButtonDisabled]}
            onPress={handleRunCode}
            disabled={isRunning}
          >
            <Play size={20} color="#FFFFFF" />
            <Text style={styles.runButtonText}>
              {isRunning ? 'Running...' : 'Run Code'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Hints Modal */}
      <Modal
        visible={showHints}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Hints</Text>
            <TouchableOpacity onPress={() => setShowHints(false)}>
              <Text style={styles.modalClose}>Done</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {challenge.hints.map((hint, index) => (
              <View key={index} style={styles.hintItem}>
                <Text style={styles.hintNumber}>Hint {index + 1}:</Text>
                <Text style={styles.hintText}>{hint}</Text>
              </View>
            ))}
            <View style={styles.explanationSection}>
              <Text style={styles.explanationTitle}>Explanation:</Text>
              <Text style={styles.explanationText}>{challenge.explanation}</Text>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Solution Modal */}
      <Modal
        visible={showSolution}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Solution</Text>
            <TouchableOpacity onPress={() => setShowSolution(false)}>
              <Text style={styles.modalClose}>Done</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.solutionDescription}>
              Here's one possible solution to this problem:
            </Text>
            <View style={styles.solutionCode}>
              <Text style={styles.solutionCodeText}>{challenge.solution}</Text>
            </View>
            <View style={styles.explanationSection}>
              <Text style={styles.explanationTitle}>How it works:</Text>
              <Text style={styles.explanationText}>{challenge.explanation}</Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </KeyboardAvoidingView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  challengeInfo: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 12,
  },
  challengeInfoCollapsed: {
    display: 'none',
  },
  challengeHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
  },
  pointsText: {
    fontSize: 14,
    color: '#D97706',
    fontWeight: '600',
  },
  challengeDescription: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
    marginBottom: 20,
  },
  testCasesPreview: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  testCaseExample: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  testCaseLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  testCaseValue: {
    fontSize: 14,
    color: '#1F2937',
    fontFamily: 'monospace',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  testCaseDescription: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  constraints: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  constraintText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  codeEditor: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    flex: 1,
  },
  codeEditorExpanded: {
    flex: 1,
    marginBottom: 0,
  },
  editorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  editorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  editorActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  codeInput: {
    minHeight: 250,
    maxHeight: 400,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 14,
    color: '#1F2937',
    fontFamily: 'monospace',
    lineHeight: 20,
    backgroundColor: '#E5E4E2'
  },
  codeInputExpanded: {
    minHeight: screenHeight * 0.4,
    maxHeight: screenHeight * 0.6,
    fontSize: 16,
    lineHeight: 22,
  },
  runSectionHidden: {
    display: 'none',
  },
  floatingRunButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'transparent',
  },
  runSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  runButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  runButtonDisabled: {
    opacity: 0.6,
  },
  runButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  testResult: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  testResultPassed: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  testResultFailed: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  testResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  testResultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  testResultDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  testResultDetails: {
    gap: 4,
  },
  testResultLabel: {
    fontSize: 12,
    color: '#374151',
    fontFamily: 'monospace',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalClose: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  hintItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
  },
  hintNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D97706',
    marginBottom: 8,
  },
  hintText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  explanationSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#EBF8FF',
    borderRadius: 12,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#1E3A8A',
    lineHeight: 20,
  },
  solutionDescription: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 16,
  },
  solutionCode: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  solutionCodeText: {
    fontSize: 14,
    color: '#1F2937',
    fontFamily: 'monospace',
    lineHeight: 20,
  },
});