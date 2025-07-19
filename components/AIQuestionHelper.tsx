import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { MessageCircle, Send, Lightbulb, Sparkles, BookOpen, ExternalLink } from 'lucide-react-native';
import { answerLessonQuestion, generateSuggestedQuestions } from '@/services/geminiService';

interface AIQuestionHelperProps {
  lessonTitle: string;
  lessonContent: string;
  visible: boolean;
  onClose: () => void;
}

interface AIResponse {
  answer: string;
  relatedConcepts: string[];
  additionalResources: string[];
}

export default function AIQuestionHelper({ 
  lessonTitle, 
  lessonContent, 
  visible, 
  onClose 
}: AIQuestionHelperProps) {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    if (visible && suggestedQuestions.length === 0) {
      loadSuggestedQuestions();
    }
  }, [visible]);

  const loadSuggestedQuestions = async () => {
    setLoadingSuggestions(true);
    try {
      const result = await generateSuggestedQuestions(lessonTitle, lessonContent);
      setSuggestedQuestions(result.questions);
    } catch (error) {
      console.error('Error loading suggested questions:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      Alert.alert('Error', 'Please enter a question first.');
      return;
    }

    setLoading(true);
    try {
      const result = await answerLessonQuestion(lessonTitle, lessonContent, question);
      setResponse(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to get answer. Please check your internet connection and try again.');
      console.error('Error asking question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedQuestion = (suggestedQ: string) => {
    setQuestion(suggestedQ);
    setResponse(null);
  };

  const clearConversation = () => {
    setQuestion('');
    setResponse(null);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Sparkles size={24} color="#3B82F6" />
            <Text style={styles.headerTitle}>AI Tutor</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Done</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Introduction */}
          <View style={styles.introCard}>
            <MessageCircle size={20} color="#3B82F6" />
            <Text style={styles.introText}>
              Ask me anything about "{lessonTitle}" and I'll help clarify concepts for better understanding!
            </Text>
          </View>

          {/* Suggested Questions */}
          {!loadingSuggestions && suggestedQuestions.length > 0 && !response && (
            <View style={styles.suggestionsContainer}>
              <View style={styles.suggestionsHeader}>
                <Lightbulb size={18} color="#F59E0B" />
                <Text style={styles.suggestionsTitle}>Suggested Questions</Text>
              </View>
              {suggestedQuestions.map((suggestedQ, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionCard}
                  onPress={() => handleSuggestedQuestion(suggestedQ)}
                >
                  <Text style={styles.suggestionText}>{suggestedQ}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {loadingSuggestions && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#3B82F6" />
              <Text style={styles.loadingText}>Loading suggested questions...</Text>
            </View>
          )}

          {/* Question Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Your Question</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={question}
                onChangeText={setQuestion}
                placeholder="Ask anything about this lesson..."
                placeholderTextColor="#9CA3AF"
                multiline
                textAlignVertical="top"
              />
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.askButton, loading && styles.askButtonDisabled]}
                onPress={handleAskQuestion}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Send size={16} color="#FFFFFF" />
                )}
                <Text style={styles.askButtonText}>
                  {loading ? 'Getting Answer...' : 'Ask AI Tutor'}
                </Text>
              </TouchableOpacity>
              {response && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={clearConversation}
                >
                  <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* AI Response */}
          {response && (
            <View style={styles.responseContainer}>
              <View style={styles.responseHeader}>
                <Sparkles size={18} color="#10B981" />
                <Text style={styles.responseTitle}>AI Tutor Response</Text>
              </View>
              
              <View style={styles.answerCard}>
                <Text style={styles.answerText}>{response.answer}</Text>
              </View>

              {/* Related Concepts */}
              {response.relatedConcepts.length > 0 && (
                <View style={styles.conceptsContainer}>
                  <View style={styles.conceptsHeader}>
                    <BookOpen size={16} color="#8B5CF6" />
                    <Text style={styles.conceptsTitle}>Related Concepts</Text>
                  </View>
                  <View style={styles.conceptsList}>
                    {response.relatedConcepts.map((concept, index) => (
                      <View key={index} style={styles.conceptItem}>
                        <Text style={styles.conceptText}>• {concept}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Additional Resources */}
              {response.additionalResources.length > 0 && (
                <View style={styles.resourcesContainer}>
                  <View style={styles.resourcesHeader}>
                    <ExternalLink size={16} color="#F59E0B" />
                    <Text style={styles.resourcesTitle}>Study Suggestions</Text>
                  </View>
                  <View style={styles.resourcesList}>
                    {response.additionalResources.map((resource, index) => (
                      <View key={index} style={styles.resourceItem}>
                        <Text style={styles.resourceText}>• {resource}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
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
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  closeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  introCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF8FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  introText: {
    flex: 1,
    fontSize: 14,
    color: '#1E40AF',
    marginLeft: 12,
    lineHeight: 20,
  },
  suggestionsContainer: {
    marginBottom: 20,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  suggestionCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  suggestionText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  inputContainer: {
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
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 16,
  },
  textInput: {
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  askButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  askButtonDisabled: {
    opacity: 0.6,
  },
  askButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  clearButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
  responseContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F0FDF4',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  responseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginLeft: 8,
  },
  answerCard: {
    padding: 20,
  },
  answerText: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
  },
  conceptsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  conceptsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  conceptsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
    marginLeft: 8,
  },
  conceptsList: {
    gap: 8,
  },
  conceptItem: {
    paddingLeft: 8,
  },
  conceptText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  resourcesContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  resourcesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resourcesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D97706',
    marginLeft: 8,
  },
  resourcesList: {
    gap: 8,
  },
  resourceItem: {
    paddingLeft: 8,
  },
  resourceText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});