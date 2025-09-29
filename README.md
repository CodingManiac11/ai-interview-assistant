# 🤖 AI-Powered Interview Assistant# AI-Powered Interview Assistant



A modern, responsive React application that automates technical interviews using AI. Built for the Swipe Internship Assignment, this application provides a complete interview management system with dual interfaces for both candidates and interviewers.A comprehensive React application for conducting AI-powered technical interviews with real-time evaluation and candidate management.



## ✨ Features## 🚀 Features



### 👨‍💼 Interviewee Experience### Interviewee Experience

- **📄 Smart Resume Upload**: Support for PDF and DOCX files with intelligent parsing- **Resume Upload**: Support for PDF and DOCX files with automatic parsing

- **🔍 Automatic Data Extraction**: Extracts name, email, phone number from resumes- **Smart Data Collection**: Extracts name, email, phone from resume; prompts for missing info

- **💬 AI-Powered Chat**: Interactive interview conversation with context-aware questions- **Timed Interview**: 6 questions with difficulty progression (2 Easy → 2 Medium → 2 Hard)

- **⏱️ Timed Interview**: 20-minute interview with visual countdown timer- **Real-time Timer**: Visual countdown with urgency indicators

- **📊 Progress Tracking**: Real-time progress indicator (questions answered/total)- **Chat Interface**: Intuitive conversation flow with the AI assistant

- **💾 Session Persistence**: Resume interrupted interviews with welcome back modal- **Session Persistence**: Resume interrupted sessions with "Welcome Back" modal

- **🔄 Fresh Interview Option**: Start new interviews or continue existing ones

### Interviewer Dashboard

### 👩‍💼 Interviewer Dashboard- **Candidate Management**: View all candidates with filtering and sorting

- **📋 Candidate Management**: Comprehensive candidate list with search and filters- **Performance Analytics**: Detailed scoring breakdown by difficulty level

- **📈 Scoring System**: Automatic scoring (0-100) based on answer quality- **AI Summaries**: Comprehensive evaluation reports for each candidate

- **📱 Mobile Responsive**: Card view for mobile, table view for desktop- **Search & Filter**: Find candidates by name, email, status, or score

- **🔍 Advanced Filtering**: Filter by status, search by name/email, sort by various criteria- **Detailed Views**: Complete interview history with questions and answers

- **📊 Detailed Analytics**: View complete interview transcripts and scores

- **📋 Status Tracking**: Monitor candidates through interview stages## 🛠️ Setup Instructions



### 🎨 UI/UX Features### Prerequisites

- **🎯 Ant Design Components**: Professional, consistent design system- Node.js 16+ and npm

- **📱 Fully Responsive**: Mobile-first design with adaptive layouts

- **⚡ Real-time Updates**: Live progress and status updates### Installation

- **🚨 Error Handling**: Comprehensive validation and user feedback

- **🔄 Loading States**: Visual feedback for all operations1. **Install dependencies**

- **♿ Accessibility**: WCAG compliant interface elements   ```bash

   npm install

## 🏗️ Technical Architecture   ```



### Frontend Stack2. **Start the development server**

- **React 18** with TypeScript for type safety

- **Redux Toolkit** for state management with persistence### `npm run eject`

- **Ant Design** for UI components and styling

- **React Router** for navigation (if needed)**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

- **Custom Hooks** for timer and interview logic

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

### File Processing

- **pdf-js-dist** for PDF parsing in browserInstead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

- **mammoth.js** for DOCX document processing

- **Enhanced regex patterns** for contact extractionYou don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

- **File validation** with size and type checking

## Learn More

### State Management

- **Redux Persist** for localStorage integrationYou can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

- **Candidate slice** for interview data

- **UI slice** for application stateTo learn React, check out the [React documentation](https://reactjs.org/).

- **Session restoration** for interrupted interviews

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-interview-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── common/          # Shared components
│   ├── interviewee/     # Candidate-facing components
│   └── interviewer/     # Interviewer dashboard components
├── store/               # Redux store configuration
│   └── slices/          # Redux slices
├── services/            # API and business logic
├── utils/               # Utility functions
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
└── index.css            # Global styles and responsive design
```

### Key Components

- **App.tsx** - Main application with tab switching
- **ResumeUpload.tsx** - File upload with parsing
- **ChatInterface.tsx** - AI interview chat
- **InterviewFlow.tsx** - Interview orchestration
- **CandidateList.tsx** - Interviewer dashboard
- **WelcomeBackModal.tsx** - Session restoration

## 🔧 Core Functionality

### Resume Processing
- Supports PDF and DOCX formats
- Extracts contact information using advanced regex
- Handles missing data with user prompts
- File size and type validation

### AI Interview System
- Generates 6 questions based on resume content
- Adapts difficulty and topics to candidate background
- Provides scoring based on answer quality
- Maintains conversation context

### Scoring Algorithm
- Evaluates technical accuracy
- Assesses communication clarity
- Considers problem-solving approach
- Generates 0-100 score with breakdown

### Data Persistence
- Saves interview progress to localStorage
- Restores sessions on page reload
- Maintains candidate data across sessions
- Handles interview completion state

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px (Card layouts, stacked forms)
- **Tablet**: 768px - 1024px (Hybrid layouts)
- **Desktop**: > 1024px (Full table views)

### Mobile Optimizations
- Touch-friendly interactions
- Simplified navigation
- Optimized typography
- Swipe gestures support

## 🎯 Interview Flow

1. **Resume Upload**: Candidate uploads resume file
2. **Data Extraction**: System extracts contact information
3. **Information Completion**: User fills missing details
4. **Interview Start**: 20-minute timer begins
5. **AI Interaction**: 6 questions with chat interface
6. **Automatic Scoring**: System evaluates responses
7. **Completion**: Results saved to dashboard

## 🔐 Data Management

### Local Storage
- Interview sessions
- Candidate profiles
- Application settings
- Progress tracking

### State Structure
```typescript
{
  candidates: Candidate[],
  currentCandidate: Candidate | null,
  ui: {
    currentTab: 'interviewee' | 'interviewer',
    loading: boolean,
    errors: string[]
  }
}
```

## 🚨 Error Handling

- File upload validation
- Resume parsing errors
- Network connectivity issues
- Session timeout handling
- Invalid input validation

## 🎨 Styling

- **CSS-in-JS**: Emotion for dynamic styling
- **Ant Design**: Pre-built component library
- **Responsive CSS**: Mobile-first approach
- **Custom CSS**: Enhanced mobile responsiveness

## 🧪 Testing

Run the test suite:
```bash
npm test
```

For coverage report:
```bash
npm test -- --coverage
```

## 🚀 Production Build

Create optimized production build:
```bash
npm run build
```

The build folder will contain the optimized files ready for deployment.

## 📝 Assignment Requirements ✅

- ✅ **Dual Tab Interface**: Interviewee and Interviewer views
- ✅ **Resume Upload & Parsing**: PDF/DOCX support with data extraction
- ✅ **AI Interview Chat**: Context-aware question generation
- ✅ **Timer Implementation**: 20-minute countdown with visual indicators
- ✅ **Scoring System**: Automatic evaluation (0-100 scale)
- ✅ **Data Persistence**: localStorage integration
- ✅ **Responsive Design**: Mobile-first approach with Ant Design
- ✅ **Clean UI**: Professional interface with error handling

## 🔍 Key Features Deep Dive

### Resume Parser
The resume parser uses a combination of PDF.js and Mammoth.js to extract text from uploaded files, then applies advanced regex patterns to identify:
- Names (various formats and cultural patterns)
- Email addresses (multiple email validation patterns)
- Phone numbers (international and domestic formats)
- Professional experience indicators

### AI Question Generation
The AI service analyzes the parsed resume content to generate relevant technical questions:
- Identifies technologies and skills mentioned
- Adapts question difficulty based on experience level
- Ensures diverse question types (theoretical, practical, problem-solving)
- Maintains conversation context throughout the interview

### Responsive Interview Interface
- **Desktop**: Full-featured chat interface with sidebar information
- **Tablet**: Optimized layout with collapsible panels
- **Mobile**: Stack-based interface with touch-optimized controls

### Scoring Methodology
The scoring system evaluates multiple factors:
- **Technical Accuracy** (40%): Correctness of technical concepts
- **Communication** (30%): Clarity and structure of responses
- **Problem Solving** (30%): Approach and reasoning demonstrated

## 🛠️ Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint configuration for consistency
- Prettier for code formatting
- Component-based architecture

### Performance Optimizations
- React.memo for component optimization
- useMemo and useCallback for expensive operations
- Lazy loading for non-critical components
- Optimized bundle splitting

### Accessibility Features
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management for modals

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup
```bash
# Clone the repo
git clone <repository-url>
cd ai-interview-assistant

# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

## 📄 License

This project is created for the Swipe Internship Assignment.

## 🙏 Acknowledgments

- **Ant Design** for the excellent component library
- **React Team** for the amazing framework
- **Redux Toolkit** for simplified state management
- **Swipe** for the interesting technical challenge

## 📞 Support

For any questions or issues, please refer to the codebase documentation or create an issue in the repository.

---

**Built with ❤️ for Swipe Internship Assignment**