import React from 'react';
import { Modal, Typography, Space, Button, Card, Tag } from 'antd';
import { ClockCircleOutlined, UserOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Candidate } from '../../types';
import { formatDistanceToNow } from 'date-fns';

const { Title, Text, Paragraph } = Typography;

interface WelcomeBackModalProps {
  visible: boolean;
  candidate: Candidate | null;
  onContinue: () => void;
  onStartNew: () => void;
  onUploadNew: () => void;
}

export const WelcomeBackModal: React.FC<WelcomeBackModalProps> = ({
  visible,
  candidate,
  onContinue,
  onStartNew,
  onUploadNew
}) => {
  if (!candidate) return null;

  const getProgressStatus = () => {
    if (candidate.interviewCompleted) {
      return {
        status: 'completed',
        text: 'Interview Completed',
        color: 'success',
        icon: <CheckCircleOutlined />
      };
    } else if (candidate.interviewStarted) {
      return {
        status: 'in-progress',
        text: 'Interview In Progress',
        color: 'processing',
        icon: <ClockCircleOutlined />
      };
    } else {
      return {
        status: 'not-started',
        text: 'Ready to Start',
        color: 'default',
        icon: <UserOutlined />
      };
    }
  };

  const progress = getProgressStatus();
  const questionsAnswered = candidate.answers.length;
  const totalQuestions = 6;

  return (
    <Modal
      title={null}
      open={visible}
      footer={null}
      closable={false}
      centered
      width={500}
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <Title level={2} style={{ marginBottom: '8px' }}>
          Welcome Back, {candidate.name}! 👋
        </Title>
        
        <Text type="secondary" style={{ fontSize: '16px' }}>
          Last activity: {formatDistanceToNow(new Date(candidate.updatedAt), { addSuffix: true })}
        </Text>
      </div>

      <Card style={{ margin: '20px 0' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong>Interview Status:</Text>
            <Tag 
              color={progress.color} 
              icon={progress.icon}
              style={{ fontSize: '14px', padding: '4px 12px' }}
            >
              {progress.text}
            </Tag>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong>Progress:</Text>
            <Text>
              {questionsAnswered} of {totalQuestions} questions answered
            </Text>
          </div>

          {candidate.score !== undefined && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text strong>Final Score:</Text>
              <Tag color={candidate.score >= 7 ? 'success' : candidate.score >= 5 ? 'warning' : 'error'}>
                {candidate.score.toFixed(1)}/10
              </Tag>
            </div>
          )}
        </Space>
      </Card>

      {candidate.interviewCompleted ? (
        <div style={{ textAlign: 'center' }}>
          <Paragraph style={{ marginBottom: '20px', color: '#52c41a' }}>
            ✅ Your interview has been completed successfully!
          </Paragraph>
          <Space direction="vertical" size="middle">
            <Button type="primary" onClick={onStartNew} size="large" block>
              Start Fresh Interview
            </Button>
            <Button onClick={onUploadNew} size="large" block>
              Upload New Resume
            </Button>
          </Space>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <Paragraph style={{ marginBottom: '20px' }}>
            {candidate.interviewStarted 
              ? "You have an interview in progress. Would you like to continue where you left off?"
              : "You're all set to begin your interview. Ready to start?"
            }
          </Paragraph>
          
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Button 
              type="primary" 
              onClick={onContinue} 
              size="large"
              block
            >
              {candidate.interviewStarted ? 'Continue Interview' : 'Start Interview'}
            </Button>
            
            <Button 
              onClick={onStartNew} 
              size="large"
              block
            >
              Start Fresh Interview
            </Button>
            
            <Button 
              onClick={onUploadNew} 
              size="large"
              block
              type="dashed"
            >
              Upload New Resume
            </Button>
          </Space>
        </div>
      )}
    </Modal>
  );
};