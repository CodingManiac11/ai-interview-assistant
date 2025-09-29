import React from 'react';
import { Card, Progress, Typography, Space, Tag } from 'antd';
import { ClockCircleOutlined, FireOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface TimerDisplayProps {
  timeLeft: number;
  totalTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isRunning: boolean;
  isPaused: boolean;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeLeft,
  totalTime,
  difficulty,
  isRunning,
  isPaused
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercent = () => {
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const getProgressColor = () => {
    const percent = (timeLeft / totalTime) * 100;
    if (percent > 50) return '#52c41a';
    if (percent > 25) return '#faad14';
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

  const getDifficultyIcon = () => {
    switch (difficulty) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <Card 
      size="small" 
      style={{ 
        backgroundColor: isPaused ? '#fff7e6' : timeLeft < 30 ? '#fff1f0' : '#f6ffed',
        border: `2px solid ${getProgressColor()}`,
        borderRadius: '8px'
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <span style={{ fontSize: '16px' }}>{getDifficultyIcon()}</span>
            <Tag color={getDifficultyColor()}>
              {difficulty.toUpperCase()}
            </Tag>
          </Space>
          
          <Space>
            {isPaused && <Tag color="orange">PAUSED</Tag>}
            {timeLeft < 30 && isRunning && !isPaused && (
              <Tag color="red" icon={<FireOutlined />}>
                HURRY UP!
              </Tag>
            )}
          </Space>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Title 
            level={2} 
            style={{ 
              margin: 0, 
              color: getProgressColor(),
              fontFamily: 'monospace'
            }}
          >
            <ClockCircleOutlined /> {formatTime(timeLeft)}
          </Title>
        </div>

        <Progress
          percent={getProgressPercent()}
          strokeColor={getProgressColor()}
          showInfo={false}
          size="small"
        />

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Total time: {formatTime(totalTime)}
          </Text>
        </div>
      </Space>
    </Card>
  );
};