# C++ Learning App with CodeForge

A comprehensive mobile application for learning C++ programming, featuring interactive lessons, assessments, and a LeetCode-style coding challenge platform called "CodeForge".

## 🚀 Features

### 📚 **Interactive Learning System**

- **Structured Curriculum**: 12 lessons across 4 sections (Basics, Control Structures, Functions, OOP)
- **Dual Assessment**: Pre-tests and post-tests for each lesson to measure learning progress
- **Progress Tracking**: Visual progress indicators and completion statistics
- **Rich Content**: Detailed lessons with code examples and explanations

### 💻 **CodeForge Coding Platform**

- **Progressive Challenges**: 12 C++ coding challenges from basic to intermediate level
- **Mobile Code Editor**: Responsive code editor optimized for mobile devices
- **Code Validation**: Simulated execution with test case verification
- **Gamification**: Points system, achievements, and sequential unlocking
- **Learning Support**: Hints, solutions, and detailed explanations

### 👤 **User Management**

- **Authentication**: Login/signup system with demo account
- **Profile Management**: User statistics and achievement tracking
- **Offline Support**: Local data persistence with AsyncStorage
- **Cross-platform**: iOS and Android compatibility

## 🛠 Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Zustand with persistence
- **Navigation**: Expo Router
- **Storage**: AsyncStorage
- **Icons**: Lucide React Native
- **Build**: EAS Build for APK generation

## 📁 File Structure and Documentation

### **Root Configuration Files**

```
├── package.json              # Project dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── metro.config.js          # Metro bundler configuration
├── app.json                 # Expo app configuration
├── eas.json                 # EAS Build configuration for APK generation
├── .prettierrc              # Code formatting rules
└── .npmrc                   # NPM configuration
```

### **App Directory Structure**

```
app/
├── _layout.tsx              # Root layout with navigation stack
├── +not-found.tsx           # 404 error page
│
├── (auth)/                  # Authentication flow
│   ├── _layout.tsx          # Auth layout with redirect logic
│   ├── login.tsx            # Login screen with demo credentials
│   └── signup.tsx           # User registration screen
│
├── (tabs)/                  # Main app tabs navigation
│   ├── _layout.tsx          # Tab navigation configuration
│   ├── index.tsx            # Home screen with progress overview
│   ├── lessons.tsx          # Lessons list with filtering
│   ├── codeforge.tsx        # CodeForge challenges dashboard
│   ├── progress.tsx         # Detailed progress analytics
│   └── profile.tsx          # User profile and settings
│
├── lesson/
│   └── [id].tsx             # Dynamic lesson detail screen
│
├── test/
│   └── [id].tsx             # Test taking interface (pre/post tests)
│
└── challenge/
    └── [id].tsx             # CodeForge challenge editor
```

**Purpose of Each Screen:**

#### **Authentication Screens**

- **`(auth)/login.tsx`**: User authentication with email/password and demo account
- **`(auth)/signup.tsx`**: New user registration with validation
- **`(auth)/_layout.tsx`**: Handles authentication state and redirects

#### **Main App Screens**

- **`(tabs)/index.tsx`**: Dashboard showing overall progress, quick stats, and course sections
- **`(tabs)/lessons.tsx`**: Complete lessons list with section filtering and progress indicators
- **`(tabs)/codeforge.tsx`**: Coding challenges platform with difficulty filtering and progress tracking
- **`(tabs)/progress.tsx`**: Detailed analytics including section progress, achievements, and learning insights
- **`(tabs)/profile.tsx`**: User profile, statistics, settings, and app information

#### **Dynamic Screens**

- **`lesson/[id].tsx`**: Individual lesson content with tabbed interface (Overview/Content) and learning path
- **`test/[id].tsx`**: Test interface for pre/post assessments with question navigation and results
- **`challenge/[id].tsx`**: Code editor for solving programming challenges with validation and feedback

### **Data Layer**

```
data/
├── mockData.ts              # Core curriculum data structure
└── codingChallenges.ts      # CodeForge challenges data
```

**Data Structure Purpose:**

- **`mockData.ts`**: Contains all lesson content, sections, questions, and user data structures
- **`codingChallenges.ts`**: Defines coding challenges with test cases, hints, and solutions

### **State Management**

```
store/
└── useAppStore.ts           # Zustand store with persistence
```

**Store Responsibilities:**

- User authentication state
- Lesson and challenge progress tracking
- Test results and scoring
- Local data persistence
- Progress calculations and analytics

### **Utilities and Hooks**

```
hooks/
└── useFrameworkReady.ts     # Framework initialization hook
```

**Hook Purpose:**

- Ensures proper framework initialization
- Required for Expo Router functionality

### **Assets**

```
assets/
└── images/
    ├── icon.png             # App icon
    └── favicon.png          # Web favicon
```

## 🏗 Architecture Overview

### **Navigation Structure**

```
Root Stack Navigator
├── (auth) - Authentication Stack
│   ├── login
│   └── signup
├── (tabs) - Main App Tabs
│   ├── Home
│   ├── Lessons
│   ├── CodeForge
│   ├── Progress
│   └── Profile
├── lesson/[id] - Dynamic Lesson
├── test/[id] - Dynamic Test
└── challenge/[id] - Dynamic Challenge
```

### **State Management Flow**

```
User Actions → Zustand Store → AsyncStorage → UI Updates
     ↑                                           ↓
     └── Component Re-renders ←── State Changes ←┘
```

### **Data Flow**

1. **Static Data**: Lessons and challenges loaded from data files
2. **User Progress**: Tracked in Zustand store and persisted locally
3. **Authentication**: Managed through store with automatic persistence
4. **Navigation**: Expo Router handles deep linking and state management

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Building APK

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Build APK
eas build --platform android --profile preview
```

## 📱 App Features in Detail

### **Learning System**

- **Progressive Curriculum**: 4 sections covering C++ fundamentals to OOP
- **Assessment Integration**: Pre-tests gauge prior knowledge, post-tests measure learning
- **Visual Progress**: Progress bars, completion indicators, and achievement tracking
- **Adaptive Content**: Lessons unlock based on completion of prerequisites

### **CodeForge Platform**

- **Challenge Progression**: 12 challenges from Hello World to Bubble Sort
- **Code Validation**: Pattern matching and syntax checking for C++ code
- **Mobile-Optimized Editor**: Responsive design with keyboard handling
- **Learning Support**: Hints system and solution viewing after completion

### **User Experience**

- **Offline First**: All content available without internet connection
- **Cross-Platform**: Consistent experience on iOS and Android
- **Responsive Design**: Optimized for various screen sizes
- **Intuitive Navigation**: Tab-based navigation with clear visual hierarchy

## 🎯 Educational Methodology

### **Learning Theories Applied**

- **Constructivism**: Hands-on coding practice
- **Scaffolding**: Progressive difficulty with support
- **Gamification**: Points, achievements, and unlocks
- **Assessment-Driven Learning**: Pre/post test methodology
- **Immediate Feedback**: Real-time code validation

### **Target Audience**

- Computer Science students learning C++
- Self-learners and coding bootcamp participants
- Educators seeking supplementary teaching tools

## 🔧 Development Guidelines

### **Code Organization**

- **Component-based Architecture**: Reusable UI components
- **Type Safety**: Full TypeScript implementation
- **State Management**: Centralized store with persistence
- **File Structure**: Feature-based organization

### **Styling Approach**

- **StyleSheet API**: React Native's built-in styling
- **Consistent Design**: Shared color palette and spacing
- **Responsive Design**: Flexible layouts for different screen sizes
- **Accessibility**: High contrast and touch-friendly interfaces

## 📊 Project Scope

### **Included Features**

✅ Complete C++ curriculum with assessments  
✅ Progressive coding challenges  
✅ Mobile-optimized code editor  
✅ Progress tracking and analytics  
✅ Offline functionality  
✅ Cross-platform support  

### **Future Enhancements**

🔄 Real C++ code compilation  
🔄 Backend integration and cloud sync  
🔄 Social features and leaderboards  
🔄 Advanced IDE features  
🔄 Multi-language support  
🔄 Video content integration  

## 📄 License

This project is developed as a capstone project for educational purposes.

## 👥 Contributing

This is a capstone project. For educational use and reference only.

---

**Built with ❤️ using React Native and Expo**
