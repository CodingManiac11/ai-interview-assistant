import { Question, Answer } from '../types';

// Mock AI service - In a real application, you would integrate with OpenAI, Claude, or another AI service
export class AIService {
  private static questions: Question[] = [
    // Easy questions
    {
      id: '1',
      text: 'What is the difference between let, const, and var in JavaScript?',
      difficulty: 'easy',
      timeLimit: 20,
      category: 'JavaScript Fundamentals'
    },
    {
      id: '2',
      text: 'Explain what React components are and the difference between functional and class components.',
      difficulty: 'easy',
      timeLimit: 20,
      category: 'React Basics'
    },
    // Medium questions
    {
      id: '3',
      text: 'How would you implement state management in a React application? Compare useState, useContext, and Redux.',
      difficulty: 'medium',
      timeLimit: 60,
      category: 'State Management'
    },
    {
      id: '4',
      text: 'Explain how you would handle asynchronous operations in Node.js. Discuss callbacks, promises, and async/await.',
      difficulty: 'medium',
      timeLimit: 60,
      category: 'Node.js Async'
    },
    // Hard questions
    {
      id: '5',
      text: 'Design a scalable real-time chat application using React and Node.js. Discuss the architecture, database design, and how you would handle websockets.',
      difficulty: 'hard',
      timeLimit: 120,
      category: 'System Design'
    },
    {
      id: '6',
      text: 'How would you optimize the performance of a React application that handles large datasets? Discuss virtual scrolling, memoization, code splitting, and other techniques.',
      difficulty: 'hard',
      timeLimit: 120,
      category: 'Performance Optimization'
    }
  ];

  static async generateQuestions(resumeContent?: string): Promise<Question[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let questions: Question[] = [];
    
    if (resumeContent) {
      // Analyze resume content to generate personalized questions
      const skills = this.extractSkills(resumeContent);
      const experience = this.extractExperience(resumeContent);
      
      questions = this.generatePersonalizedQuestions(skills, experience);
    } else {
      // Fall back to generic questions
      questions = this.getGenericQuestions();
    }
    
    // Ensure we have exactly 6 questions: 2 easy, 2 medium, 2 hard
    const easyQuestions = questions.filter(q => q.difficulty === 'easy').slice(0, 2);
    const mediumQuestions = questions.filter(q => q.difficulty === 'medium').slice(0, 2);
    const hardQuestions = questions.filter(q => q.difficulty === 'hard').slice(0, 2);
    
    // Fill in gaps if needed
    const allQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];
    const genericQuestions = this.getGenericQuestions();
    
    while (allQuestions.length < 6) {
      const needed = 6 - allQuestions.length;
      const difficulty = allQuestions.length < 2 ? 'easy' : allQuestions.length < 4 ? 'medium' : 'hard';
      const generic = genericQuestions.find(q => q.difficulty === difficulty && !allQuestions.find(aq => aq.id === q.id));
      if (generic) allQuestions.push(generic);
      else break;
    }
    
    return allQuestions.slice(0, 6);
  }

  private static extractSkills(resumeContent: string): string[] {
    const skills: string[] = [];
    const text = resumeContent.toLowerCase();
    
    // Common tech skills to look for
    const techSkills = [
      'react', 'angular', 'vue', 'javascript', 'typescript', 'node.js', 'express',
      'python', 'java', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
      'html', 'css', 'sass', 'less', 'bootstrap', 'tailwind',
      'mongodb', 'mysql', 'postgresql', 'redis', 'elasticsearch',
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins',
      'git', 'github', 'gitlab', 'jira', 'agile', 'scrum',
      'redux', 'mobx', 'graphql', 'rest', 'api', 'microservices'
    ];
    
    techSkills.forEach(skill => {
      if (text.includes(skill)) {
        skills.push(skill);
      }
    });
    
    return skills;
  }

  private static extractExperience(resumeContent: string): string {
    const text = resumeContent.toLowerCase();
    
    if (text.includes('senior') || text.includes('lead') || text.includes('architect')) {
      return 'senior';
    } else if (text.includes('junior') || text.includes('entry') || text.includes('intern')) {
      return 'junior';
    } else {
      return 'mid';
    }
  }

  private static generatePersonalizedQuestions(skills: string[], experience: string): Question[] {
    const questions: Question[] = [];
    
    // Generate questions based on skills found in resume
    if (skills.includes('react')) {
      questions.push({
        id: 'react-1',
        text: `I see you have React experience. Can you explain the difference between functional and class components, and when you would use each?`,
        difficulty: 'easy',
        timeLimit: 20,
        category: 'React'
      });
      
      questions.push({
        id: 'react-2',
        text: `Based on your React experience, how would you optimize a React application that's experiencing performance issues? Discuss specific techniques you've used.`,
        difficulty: 'medium',
        timeLimit: 60,
        category: 'React Performance'
      });
    }
    
    if (skills.includes('node.js') || skills.includes('express')) {
      questions.push({
        id: 'node-1',
        text: `I notice you have Node.js experience. How do you handle asynchronous operations in Node.js? Compare callbacks, promises, and async/await.`,
        difficulty: 'medium',
        timeLimit: 60,
        category: 'Node.js'
      });
    }
    
    if (skills.includes('javascript') || skills.includes('typescript')) {
      questions.push({
        id: 'js-1',
        text: `What are closures in JavaScript and can you provide a practical example of when you'd use them?`,
        difficulty: 'easy',
        timeLimit: 20,
        category: 'JavaScript'
      });
    }
    
    if (skills.includes('mongodb') || skills.includes('mysql') || skills.includes('postgresql')) {
      questions.push({
        id: 'db-1',
        text: `I see you have database experience. How would you design a database schema for a social media application? Consider scalability and performance.`,
        difficulty: 'hard',
        timeLimit: 120,
        category: 'Database Design'
      });
    }
    
    if (skills.includes('aws') || skills.includes('azure') || skills.includes('docker')) {
      questions.push({
        id: 'cloud-1',
        text: `Based on your cloud/DevOps experience, how would you deploy a full-stack application to ensure high availability and scalability?`,
        difficulty: 'hard',
        timeLimit: 120,
        category: 'DevOps'
      });
    }
    
    // Add experience-based questions
    if (experience === 'senior') {
      questions.push({
        id: 'senior-1',
        text: `As an experienced developer, how do you approach technical debt in a large codebase? What strategies do you use for refactoring?`,
        difficulty: 'medium',
        timeLimit: 60,
        category: 'Architecture'
      });
    }
    
    return questions;
  }

  private static getGenericQuestions(): Question[] {
    return this.questions;
  }

  static async evaluateAnswer(question: Question, answer: string, timeSpent: number): Promise<{ score: number; feedback: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock evaluation logic - In a real app, this would use AI
    let score = 0;
    let feedback = '';
    
    const answerLength = answer.trim().length;
    const timeRatio = timeSpent / question.timeLimit;
    
    if (answerLength === 0) {
      score = 0;
      feedback = 'No answer provided.';
    } else if (answerLength < 20) {
      score = Math.min(3, Math.floor(answerLength / 10) + 1);
      feedback = 'Answer is too brief. Consider providing more detail and examples.';
    } else {
      // Base score based on answer length and time efficiency
      let baseScore = Math.min(8, Math.floor(answerLength / 50) + 3);
      
      // Adjust based on time spent
      if (timeRatio < 0.3) {
        baseScore = Math.max(1, baseScore - 2);
        feedback = 'Good efficiency, but consider taking more time to provide comprehensive answers.';
      } else if (timeRatio > 0.9) {
        baseScore = Math.max(1, baseScore - 1);
        feedback = 'Time management could be improved. Try to be more concise.';
      } else {
        feedback = 'Good balance of detail and time management.';
      }
      
      // Add some randomness to simulate AI variation
      score = Math.max(1, Math.min(10, baseScore + (Math.random() > 0.5 ? 1 : -1)));
      
      if (score >= 8) {
        feedback = 'Excellent answer! Shows strong understanding of the concept.';
      } else if (score >= 6) {
        feedback = 'Good answer with room for improvement. Consider adding more specific examples.';
      } else if (score >= 4) {
        feedback = 'Adequate answer but lacks depth. Try to explain the reasoning behind your approach.';
      }
    }
    
    return { score, feedback };
  }

  static async generateFinalSummary(answers: Answer[]): Promise<{ score: number; summary: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Debug logging
    console.log('Final Summary - Number of answers:', answers.length);
    console.log('Final Summary - Answers:', answers);
    
    if (answers.length === 0) {
      return {
        score: 0,
        summary: 'No answers were provided during the interview.'
      };
    }
    
    const totalScore = answers.reduce((sum, answer) => {
      console.log(`Answer score: ${answer.score}, Answer text: "${answer.answer}"`);
      return sum + (answer.score || 0);
    }, 0);
    console.log('Total score:', totalScore);
    const averageScore = Math.round((totalScore / answers.length) * 10) / 10;
    console.log('Average score:', averageScore);
    
    let summary = '';
    
    if (averageScore >= 8) {
      summary = 'Excellent performance! The candidate demonstrated strong technical knowledge across all areas. They showed good problem-solving skills and provided comprehensive answers within the time limits. Highly recommended for the full-stack developer position.';
    } else if (averageScore >= 6) {
      summary = 'Good performance overall. The candidate has a solid foundation in full-stack development concepts. Some areas could use improvement, but they show promise and would benefit from mentoring. Recommended for the position with additional training.';
    } else if (averageScore >= 4) {
      summary = 'Average performance. The candidate has basic knowledge but lacks depth in several areas. Would need significant training and mentoring to be effective in the role. Consider for junior positions or with extended onboarding.';
    } else {
      summary = 'Below expectations. The candidate struggled with fundamental concepts and time management. Would not recommend for the current position. Consider recommending additional study and reapplication in the future.';
    }
    
    // Add specific strengths and weaknesses
    const easyAnswers = answers.filter(a => a.difficulty === 'easy');
    const mediumAnswers = answers.filter(a => a.difficulty === 'medium');
    const hardAnswers = answers.filter(a => a.difficulty === 'hard');
    
    const easyAvg = easyAnswers.reduce((sum, a) => sum + (a.score || 0), 0) / easyAnswers.length;
    const mediumAvg = mediumAnswers.reduce((sum, a) => sum + (a.score || 0), 0) / mediumAnswers.length;
    const hardAvg = hardAnswers.reduce((sum, a) => sum + (a.score || 0), 0) / hardAnswers.length;
    
    summary += '\n\nDetailed Analysis:\n';
    summary += `- Basic Concepts (Easy): ${easyAvg.toFixed(1)}/10\n`;
    summary += `- Intermediate Skills (Medium): ${mediumAvg.toFixed(1)}/10\n`;
    summary += `- Advanced Knowledge (Hard): ${hardAvg.toFixed(1)}/10\n`;
    
    const avgTimeSpent = answers.reduce((sum, a) => sum + a.timeSpent, 0) / answers.length;
    summary += `- Average Time Management: ${avgTimeSpent.toFixed(0)} seconds per question`;
    
    return {
      score: averageScore,
      summary
    };
  }
}