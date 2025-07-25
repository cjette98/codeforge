import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Lesson, Section, Question, lessons, sections, mockUsers } from '@/data/mockData';
import { CodingChallenge, ChallengeProgress, codingChallenges } from '@/data/codingChallenges';

export interface TestResult {
  lessonId: string;
  type: 'pre' | 'post';
  score: number;
  totalQuestions: number;
  answers: number[];
  completedAt: Date;
}

export interface LessonProgress {
  lessonId: string;
  preTestCompleted: boolean;
  postTestCompleted: boolean;
  preTestScore?: number;
  postTestScore?: number;
  isCompleted: boolean;
  startedAt?: Date;
  completedAt?: Date;
}

interface AppState {
  // Authentication
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // Lessons and Progress
  lessons: Lesson[];
  sections: Section[];
  lessonProgress: Record<string, LessonProgress>;
  
  // Current test state
  currentTest: {
    lessonId: string;
    type: 'pre' | 'post';
    questions: Question[];
    currentQuestionIndex: number;
    answers: number[];
    startTime: Date;
  } | null;
  
  // Coding challenges
  codingChallenges: CodingChallenge[];
  challengeProgress: Record<string, ChallengeProgress>;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  
  // Lesson actions
  startLesson: (lessonId: string) => void;
  startTest: (lessonId: string, type: 'pre' | 'post') => void;
  answerQuestion: (answerIndex: number) => void;
  submitTest: () => TestResult | null;
  completeLesson: (lessonId: string) => boolean;
  
  // Progress actions
  getLessonProgress: (lessonId: string) => LessonProgress;
  getSectionProgress: (sectionId: string) => { completed: number; total: number };
  getOverallProgress: () => { completed: number; total: number };
  
  // Challenge actions
  getChallengeProgress: (challengeId: string) => ChallengeProgress;
  isChallengeUnlocked: (challengeId: string) => boolean;
  submitChallenge: (challengeId: string, code: string, timeTaken: number) => boolean;
  getCompletedChallenges: () => number;
  getTotalPoints: () => number;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      isAuthenticated: false,
      lessons,
      sections,
      lessonProgress: {},
      currentTest: null,
      codingChallenges,
      challengeProgress: {},

      // Authentication actions
      login: async (email: string, password: string) => {
        const user = mockUsers.find(u => u.email === email && u.password === password);
        if (user) {
          set({ currentUser: user, isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false, currentTest: null });
      },

      signup: async (email: string, password: string, name: string) => {
        // Check if user already exists
        if (mockUsers.find(u => u.email === email)) {
          return false;
        }
        
        const newUser: User = {
          id: Date.now().toString(),
          email,
          password,
          name,
        };
        
        mockUsers.push(newUser);
        set({ currentUser: newUser, isAuthenticated: true });
        return true;
      },

      // Lesson actions
      startLesson: (lessonId: string) => {
        const progress = get().lessonProgress[lessonId] || {
          lessonId,
          preTestCompleted: false,
          postTestCompleted: false,
          isCompleted: false,
        };
        
        if (!progress.startedAt) {
          progress.startedAt = new Date();
        }
        
        set(state => ({
          lessonProgress: {
            ...state.lessonProgress,
            [lessonId]: progress
          }
        }));
      },

      startTest: (lessonId: string, type: 'pre' | 'post') => {
        const lesson = get().lessons.find(l => l.id === lessonId);
        if (!lesson) return;
        
        const questions = type === 'pre' ? lesson.preTest : lesson.postTest;
        
        set({
          currentTest: {
            lessonId,
            type,
            questions,
            currentQuestionIndex: 0,
            answers: [],
            startTime: new Date()
          }
        });
      },

      answerQuestion: (answerIndex: number) => {
        const currentTest = get().currentTest;
        if (!currentTest) return;
        
        const newAnswers = [...currentTest.answers];
        newAnswers[currentTest.currentQuestionIndex] = answerIndex;
        
        set(state => ({
          currentTest: state.currentTest ? {
            ...state.currentTest,
            answers: newAnswers,
            currentQuestionIndex: Math.min(
              state.currentTest.currentQuestionIndex + 1,
              state.currentTest.questions.length
            )
          } : null
        }));
      },

      submitTest: () => {
        const currentTest = get().currentTest;
        if (!currentTest) return null;
        
        // Calculate score
        let correctAnswers = 0;
        currentTest.questions.forEach((question, index) => {
          if (currentTest.answers[index] === question.correctAnswer) {
            correctAnswers++;
          }
        });
        
        const score = Math.round((correctAnswers / currentTest.questions.length) * 100);
        
        const testResult: TestResult = {
          lessonId: currentTest.lessonId,
          type: currentTest.type,
          score,
          totalQuestions: currentTest.questions.length,
          answers: currentTest.answers,
          completedAt: new Date()
        };
        
        // Update lesson progress
        const progress = get().lessonProgress[currentTest.lessonId] || {
          lessonId: currentTest.lessonId,
          preTestCompleted: false,
          postTestCompleted: false,
          isCompleted: false,
        };
        
        if (currentTest.type === 'pre') {
          progress.preTestCompleted = true;
          progress.preTestScore = score;
        } else {
          progress.postTestCompleted = true;
          progress.postTestScore = score;
        }
        
        // Check if lesson is complete
        if (progress.preTestCompleted && progress.postTestCompleted) {
          progress.isCompleted = true;
          progress.completedAt = new Date();
        }
        
        set(state => ({
          lessonProgress: {
            ...state.lessonProgress,
            [currentTest.lessonId]: progress
          },
          currentTest: null
        }));
        
        return testResult;
      },

      completeLesson: (lessonId: string) => {
        const progress = get().lessonProgress[lessonId];
        if (!progress || !progress.preTestCompleted || !progress.postTestCompleted) {
          return false;
        }
        
        const updatedProgress = {
          ...progress,
          isCompleted: true,
          completedAt: new Date()
        };
        
        set(state => ({
          lessonProgress: {
            ...state.lessonProgress,
            [lessonId]: updatedProgress
          }
        }));
        
        return true;
      },

      // Progress getters
      getLessonProgress: (lessonId: string) => {
        return get().lessonProgress[lessonId] || {
          lessonId,
          preTestCompleted: false,
          postTestCompleted: false,
          isCompleted: false,
        };
      },

      getSectionProgress: (sectionId: string) => {
        const sectionLessons = get().lessons.filter(l => l.sectionId === sectionId);
        const completedCount = sectionLessons.filter(l => 
          get().lessonProgress[l.id]?.isCompleted
        ).length;
        
        return {
          completed: completedCount,
          total: sectionLessons.length
        };
      },

      getOverallProgress: () => {
        const allLessons = get().lessons;
        const completedCount = allLessons.filter(l => 
          get().lessonProgress[l.id]?.isCompleted
        ).length;
        
        return {
          completed: completedCount,
          total: allLessons.length
        };
      },
      
      // Challenge actions
      getChallengeProgress: (challengeId: string) => {
        return get().challengeProgress[challengeId] || {
          challengeId,
          isCompleted: false,
          attempts: 0,
        };
      },
      
      isChallengeUnlocked: (challengeId: string) => {
        const challenges = get().codingChallenges.sort((a, b) => a.order - b.order);
        const currentChallenge = challenges.find(c => c.id === challengeId);
        
        if (!currentChallenge) return false;
        
        // First challenge is always unlocked
        if (currentChallenge.order === 1) return true;
        
        // Check if previous challenge is completed
        const previousChallenge = challenges.find(c => c.order === currentChallenge.order - 1);
        if (previousChallenge) {
          const prevProgress = get().challengeProgress[previousChallenge.id];
          return prevProgress?.isCompleted || false;
        }
        
        return false;
      },
      
      submitChallenge: (challengeId: string, code: string, timeTaken: number) => {
        // In a real app, this would run the code against test cases
        // For now, we'll simulate a successful submission
        const challenge = get().codingChallenges.find(c => c.id === challengeId);
        if (!challenge) return false;
        
        const currentProgress = get().challengeProgress[challengeId] || {
          challengeId,
          isCompleted: false,
          attempts: 0,
        };
        
        const newProgress: ChallengeProgress = {
          ...currentProgress,
          isCompleted: true,
          attempts: currentProgress.attempts + 1,
          bestTime: currentProgress.bestTime ? Math.min(currentProgress.bestTime, timeTaken) : timeTaken,
          completedAt: new Date(),
          lastAttempt: new Date(),
          code,
        };
        
        set(state => ({
          challengeProgress: {
            ...state.challengeProgress,
            [challengeId]: newProgress
          }
        }));
        
        return true;
      },
      
      getCompletedChallenges: () => {
        return Object.values(get().challengeProgress).filter(p => p.isCompleted).length;
      },
      
      getTotalPoints: () => {
        const completedChallenges = Object.values(get().challengeProgress)
          .filter(p => p.isCompleted);
        
        return completedChallenges.reduce((total, progress) => {
          const challenge = get().codingChallenges.find(c => c.id === progress.challengeId);
          return total + (challenge?.points || 0);
        }, 0);
      },
    }),
    {
      name: 'udemy-clone-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        lessonProgress: state.lessonProgress,
        challengeProgress: state.challengeProgress,
      }),
    }
  )
);