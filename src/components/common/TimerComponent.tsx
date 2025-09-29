import React from 'react';
import { Card, Progress, Typography, Tag, Space } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { Question } from '../../types';

const { Text } = Typography;

interface TimerComponentProps {
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  questionNumber: number;
}

export const TimerComponent: React.FC<TimerComponentProps> = ({
  timeLeft,
  totalTime,
  isRunning,
  difficulty,
  questionNumber
}) => {
  const percentage = Math.round((timeLeft / totalTime) * 100);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    if (percentage > 50) return '#52c41a';
    if (percentage > 20) return '#faad14';
    return '#ff4d4f';
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  return (
    <Card size="small" style={{ marginBottom: '16px' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <ClockCircleOutlined style={{ color: getStatusColor() }} />
            <Text strong>Question {questionNumber}/6</Text>
            <Tag color={getDifficultyColor()}>
              {difficulty.toUpperCase()}
            </Tag>
          </Space>
          <Text strong style={{ color: getStatusColor(), fontSize: '16px' }}>
            {formatTime(timeLeft)}
          </Text>
        </div>
        <Progress 
          percent={percentage} 
          strokeColor={getStatusColor()}
          showInfo={false}
          size="small"
        />
        {!isRunning && (
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Timer paused
          </Text>
        )}
      </Space>
    </Card>
  );
};