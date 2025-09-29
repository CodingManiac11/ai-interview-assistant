import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Steps, Typography, Space, Button, Progress, message } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { RootState } from '../../store';
import { 
  addAnswer, 
  addChatMessage, 
  nextQuestion, 
  completeInterview,
  startInterview,
  completeInterviewWithAnswers,
  resetCandidateInterview,
  clearCurrentSession,
  setCurrentCandidate 
} from '../../store/slices/candidateSlice';
import { setLoading } from '../../store/slices/uiSlice';
import { AIService } from '../../services/aiService';
import { useTimer } from '../../hooks/useTimer';
import { TimerDisplay } from '../common/TimerDisplay';
import { ChatInterface } from '../common/ChatInterface';
import { Answer, Question, QUESTION_DIFFICULTIES } from '../../types';
import { v4 as uuidv4 } from 'uuid';

const { Title, Text } = Typography;
const { Step } = Steps;

export const InterviewFlow: React.FC = () => {
  const dispatch = useDispatch();
  const { currentCandidate, currentSession, candidates } = useSelector((state: RootState) => state.candidate);
  const { loading } = useSelector((state: RootState) => state.ui);
  
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const currentQuestion = currentSession ? questions[currentSession.currentQuestionIndex] : null;
  const currentQuestionIndex = currentSession?.currentQuestionIndex || 0;

  const handleTimeUp = useCallback(async () => {
    if (!currentQuestion || !currentCandidate || !currentSession) return;

    // Auto-submit the current answer (even if empty)
    const timeSpent = currentQuestion.timeLimit;
    
    const answer: Answer = {
      questionId: currentQuestion.id,
      question: currentQuestion.text,
      answer: currentAnswer.trim() || '[No answer provided - time expired]',
      timeSpent,
      difficulty: currentQuestion.difficulty,
      submittedAt: new Date().toISOString(),
    };

    try {
      // Evaluate the answer
      const evaluation = await AIService.evaluateAnswer(currentQuestion, answer.answer, timeSpent);
      answer.score = evaluation.score;
      answer.feedback = evaluation.feedback;

      // Add to store
      dispatch(addAnswer(answer));

      // Add chat messages
      dispatch(addChatMessage({
        type: 'answer',
        content: answer.answer,
        questionIndex: currentQuestionIndex,
      }));

      dispatch(addChatMessage({
        type: 'system',
        content: `Time's up! Your answer has been automatically submitted.\n\nScore: ${evaluation.score}/10\nFeedback: ${evaluation.feedback}`,
      }));

      setCurrentAnswer('');
      setIsAnswering(false);

      // Move to next question or complete interview
      if (currentQuestionIndex < 5) {
        setTimeout(() => {
          dispatch(nextQuestion());
          const nextQ = questions[currentQuestionIndex + 1];
          if (nextQ) {
            dispatch(addChatMessage({
              type: 'question',
              content: nextQ.text,
              questionIndex: currentQuestionIndex + 1,
            }));
            setIsAnswering(true);
          }
        }, 2000);
      } else {
        // Complete interview
        setTimeout(async () => {
          await completeInterviewProcess();
        }, 2000);
      }
    } catch (error) {
      message.error('Failed to evaluate answer. Please try again.');
    }
  }, [currentQuestion, currentCandidate, currentSession, currentAnswer, currentQuestionIndex, questions, dispatch]);

  const timer = useTimer({
    initialTime: currentQuestion?.timeLimit || 0,
    onTimeUp: handleTimeUp,
    autoStart: false,
  });

  useEffect(() => {
    if (currentQuestion && isAnswering) {
      timer.reset(currentQuestion.timeLimit);
      timer.start();
    }
  }, [currentQuestion, isAnswering]);

  const startInterviewProcess = async () => {
    if (!currentCandidate) return;

    try {
      dispatch(setLoading(true));
      
      // Generate questions based on resume content
      const generatedQuestions = await AIService.generateQuestions(currentCandidate.resumeContent);
      setQuestions(generatedQuestions);
      
      // Start interview in store
      dispatch(startInterview({
        candidateId: currentCandidate.id,
        questions: generatedQuestions,
      }));

      // Add first question to chat
      const firstQuestion = generatedQuestions[0];
      dispatch(addChatMessage({
        type: 'question',
        content: firstQuestion.text,
        questionIndex: 0,
      }));

      setIsAnswering(true);
      message.success('Interview started! Good luck!');
    } catch (error) {
      message.error('Failed to start interview. Please try again.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSendAnswer = async (answer: string) => {
    if (!currentQuestion || !currentCandidate || !isAnswering) return;

    setCurrentAnswer(answer);
    timer.pause();
    setIsAnswering(false);

    const timeSpent = timer.getElapsedTime();
    
    const answerObj: Answer = {
      questionId: currentQuestion.id,
      question: currentQuestion.text,
      answer: answer.trim(),
      timeSpent,
      difficulty: currentQuestion.difficulty,
      submittedAt: new Date().toISOString(),
    };

    try {
      dispatch(setLoading(true));

      // Evaluate the answer
      const evaluation = await AIService.evaluateAnswer(currentQuestion, answer, timeSpent);
      answerObj.score = evaluation.score;
      answerObj.feedback = evaluation.feedback;

      console.log('Answer evaluation:', evaluation);
      console.log('Answer object:', answerObj);

      // Add to store
      dispatch(addAnswer(answerObj));

      // Add chat messages
      dispatch(addChatMessage({
        type: 'answer',
        content: answer,
        questionIndex: currentQuestionIndex,
      }));

      dispatch(addChatMessage({
        type: 'system',
        content: `Answer submitted! Score: ${evaluation.score}/10\nFeedback: ${evaluation.feedback}`,
      }));

      // Move to next question or complete interview
      if (currentQuestionIndex < 5) {
        setTimeout(() => {
          dispatch(nextQuestion());
          const nextQ = questions[currentQuestionIndex + 1];
          if (nextQ) {
            dispatch(addChatMessage({
              type: 'question',
              content: nextQ.text,
              questionIndex: currentQuestionIndex + 1,
            }));
            setIsAnswering(true);
          }
        }, 2000);
      } else {
        // Complete interview
        setTimeout(async () => {
          await completeInterviewProcess();
        }, 2000);
      }
    } catch (error) {
      message.error('Failed to evaluate answer. Please try again.');
      setIsAnswering(true);
      timer.resume();
    } finally {
      dispatch(setLoading(false));
    }
  };

  const completeInterviewProcess = async () => {
    if (!currentSession?.candidateId) return;

    try {
      dispatch(setLoading(true));
      
      // Get the latest candidate data from the Redux store by ID
      const latestCandidate = candidates.find((c: any) => c.id === currentSession.candidateId);
      
      if (!latestCandidate) {
        console.error('Candidate not found in store!');
        throw new Error('Candidate data not found');
      }
      
      console.log('Completing interview for candidate:', latestCandidate.name);
      console.log('Candidate answers:', latestCandidate.answers);
      console.log('Number of answers:', latestCandidate.answers.length);
      
      // Ensure we have the right number of answers
      if (latestCandidate.answers.length === 0) {
        console.error('No answers found in candidate data!');
        throw new Error('No answers were recorded. Please try again.');
      }
      
      const finalEvaluation = await AIService.generateFinalSummary(latestCandidate.answers);
      
      console.log('Final evaluation:', finalEvaluation);
      
      dispatch(completeInterview({
        score: finalEvaluation.score,
        summary: finalEvaluation.summary,
      }));

      dispatch(addChatMessage({
        type: 'system',
        content: `🎉 Interview Complete!\n\nFinal Score: ${finalEvaluation.score}/10\n\nSummary:\n${finalEvaluation.summary}`,
      }));

      message.success('Interview completed successfully!');
    } catch (error) {
      message.error('Failed to complete interview evaluation.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (!currentCandidate) {
    return (
      <Card style={{ textAlign: 'center', padding: '40px' }}>
        <Title level={3}>No candidate selected</Title>
        <Text>Please upload a resume to start the interview process.</Text>
      </Card>
    );
  }

  // Show completion screen if interview is done
  if (currentCandidate.interviewCompleted) {
    return (
      <Card style={{ textAlign: 'center', padding: '40px' }}>
        <Space direction="vertical" size="large">
          <Title level={2}>🎉 Interview Complete!</Title>
          <div>
            <Text strong style={{ fontSize: '18px' }}>
              Final Score: {currentCandidate.score}/10
            </Text>
          </div>
          {currentCandidate.summary && (
            <div style={{ maxWidth: '600px' }}>
              <Text style={{ fontSize: '16px', whiteSpace: 'pre-wrap' }}>
                {currentCandidate.summary}
              </Text>
            </div>
          )}
          <Space>
            <Button 
              type="primary" 
              size="large" 
              onClick={() => {
                dispatch(resetCandidateInterview(currentCandidate.id));
                window.location.reload(); // Simple refresh to reset state
              }}
            >
              Start Fresh Interview
            </Button>
            <Button 
              size="large" 
              onClick={() => {
                dispatch(clearCurrentSession());
                dispatch(setCurrentCandidate(null));
                window.location.reload();
              }}
            >
              Upload New Resume
            </Button>
          </Space>
        </Space>
      </Card>
    );
  }

  if (!currentSession) {
    return (
      <Card style={{ textAlign: 'center', padding: '40px' }}>
        <Space direction="vertical" size="large">
          <PlayCircleOutlined style={{ fontSize: '64px', color: '#1890ff' }} />
          <Title level={2}>Ready to Start Your Interview?</Title>
          <Text style={{ fontSize: '16px', maxWidth: '400px', display: 'block' }}>
            You'll be asked 6 questions total: 2 Easy (20s each), 2 Medium (60s each), and 2 Hard (120s each).
          </Text>
          <Button 
            type="primary" 
            size="large" 
            onClick={startInterviewProcess}
            loading={loading}
          >
            Start Interview
          </Button>
        </Space>
      </Card>
    );
  }

  // Progress steps
  const steps = questions.map((q, index) => ({
    title: `Question ${index + 1}`,
    description: `${q.difficulty} (${QUESTION_DIFFICULTIES[q.difficulty].timeLimit}s)`,
    status: (index < currentQuestionIndex ? 'finish' : index === currentQuestionIndex ? 'process' : 'wait') as 'finish' | 'process' | 'wait',
    icon: index < currentQuestionIndex ? <CheckCircleOutlined /> : <ClockCircleOutlined />,
  }));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Progress */}
      <Card size="small" style={{ marginBottom: '16px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong>Interview Progress</Text>
            <Text>{currentQuestionIndex + 1} of 6 questions</Text>
          </div>
          <Progress 
            percent={(currentQuestionIndex / 6) * 100} 
            showInfo={false}
            strokeColor="#1890ff"
          />
          <Steps 
            current={currentQuestionIndex} 
            size="small"
            items={steps}
          />
        </Space>
      </Card>

      {/* Timer */}
      {currentQuestion && isAnswering && (
        <div style={{ marginBottom: '16px' }}>
          <TimerDisplay
            timeLeft={timer.timeLeft}
            totalTime={currentQuestion.timeLimit}
            difficulty={currentQuestion.difficulty}
            isRunning={timer.isRunning}
            isPaused={timer.isPaused}
          />
        </div>
      )}

      {/* Chat Interface */}
      <div style={{ flex: 1 }}>
        <ChatInterface
          messages={currentSession.messages}
          onSendMessage={handleSendAnswer}
          currentQuestion={currentQuestion?.text}
          timeLeft={timer.timeLeft}
          isQuestionActive={isAnswering}
          loading={loading}
          disabled={!isAnswering || currentCandidate.interviewCompleted}
        />
      </div>
    </div>
  );
};