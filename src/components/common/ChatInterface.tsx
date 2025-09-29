import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, Avatar, Typography, Space, Divider, Tag, Alert } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined, ClockCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { ChatMessage } from '../../types';
import { formatDistanceToNow } from 'date-fns';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  currentQuestion?: string;
  timeLeft?: number;
  isQuestionActive?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  currentQuestion,
  timeLeft,
  isQuestionActive = false,
  loading = false,
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim() && !disabled && !loading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMessageIcon = (type: ChatMessage['type']) => {
    switch (type) {
      case 'system':
        return <RobotOutlined style={{ color: '#1890ff' }} />;
      case 'question':
        return <RobotOutlined style={{ color: '#52c41a' }} />;
      case 'user':
      case 'answer':
        return <UserOutlined style={{ color: '#722ed1' }} />;
      default:
        return <RobotOutlined />;
    }
  };

  const getMessageStyle = (type: ChatMessage['type']) => {
    const baseStyle = {
      maxWidth: isMobile ? '100%' : '80%',
      marginBottom: '8px',
    };

    switch (type) {
      case 'user':
      case 'answer':
        return {
          ...baseStyle,
          backgroundColor: '#f0f0f0',
          marginLeft: isMobile ? '0' : '20%',
          borderRadius: '18px 18px 4px 18px',
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: '#e6f7ff',
          marginRight: isMobile ? '0' : '20%',
          borderRadius: '18px 18px 18px 4px',
        };
    }
  };

  const isTimeRunningOut = timeLeft && timeLeft < 30;
  const isTimeCritical = timeLeft && timeLeft < 10;

  return (
    <div className="chat-container">
      {/* Timer and Question Status */}
      {isQuestionActive && (
        <Alert
          message={
            <div className="flex-between">
              <Space>
                <ClockCircleOutlined style={{ 
                  color: isTimeCritical ? '#ff4d4f' : isTimeRunningOut ? '#faad14' : '#1890ff' 
                }} />
                <Text strong style={{ 
                  color: isTimeCritical ? '#ff4d4f' : isTimeRunningOut ? '#faad14' : undefined 
                }}>
                  Time Remaining: {timeLeft ? formatTime(timeLeft) : '0:00'}
                </Text>
              </Space>
              {currentQuestion && (
                <Tag color="processing">Question in Progress</Tag>
              )}
            </div>
          }
          type={isTimeCritical ? "error" : isTimeRunningOut ? "warning" : "info"}
          showIcon={false}
          style={{ marginBottom: '16px' }}
        />
      )}

      {/* Messages Area */}
      <Card 
        className="chat-messages"
        bodyStyle={{ 
          padding: isMobile ? '12px' : '16px',
          height: '100%', 
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {messages.length === 0 ? (
            <div className="text-center" style={{ padding: '40px 20px', color: '#8c8c8c' }}>
              <RobotOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
              <Text>No messages yet. Start the conversation!</Text>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={message.id || index} style={{ marginBottom: '16px' }}>
                <div style={{ ...getMessageStyle(message.type), padding: isMobile ? '8px 12px' : '12px 16px' }}>
                  <Space align="start" style={{ width: '100%' }} size={isMobile ? 'small' : 'middle'}>
                    <Avatar 
                      icon={getMessageIcon(message.type)} 
                      size={isMobile ? "small" : "default"}
                      style={{ flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ marginBottom: '4px' }}>
                        <Text type="secondary" style={{ fontSize: isMobile ? '11px' : '12px' }}>
                          {message.type === 'user' || message.type === 'answer' ? 'You' : 'AI Assistant'} •{' '}
                          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                        </Text>
                        {message.questionIndex !== undefined && (
                          <Tag 
                            style={{ 
                              marginLeft: '8px', 
                              fontSize: isMobile ? '10px' : '12px',
                              padding: isMobile ? '0 4px' : undefined 
                            }}
                          >
                            Q{message.questionIndex + 1}
                          </Tag>
                        )}
                      </div>
                      <Paragraph 
                        style={{ 
                          margin: 0, 
                          whiteSpace: 'pre-wrap',
                          fontSize: isMobile ? '14px' : '15px',
                          lineHeight: isMobile ? '1.4' : '1.5'
                        }}
                        copyable={message.type === 'question' && !isMobile}
                      >
                        {message.content}
                      </Paragraph>
                    </div>
                  </Space>
                </div>
                {index < messages.length - 1 && message.type !== 'system' && (
                  <Divider style={{ margin: isMobile ? '4px 0' : '8px 0' }} />
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </Card>

      {/* Input Area */}
      <Card size="small" className="chat-input">
        {disabled && (
          <Alert
            message="Interview completed"
            type="success"
            showIcon
            icon={<WarningOutlined />}
            style={{ marginBottom: '12px' }}
          />
        )}
        
        <Space.Compact style={{ width: '100%' }} direction={isMobile ? 'vertical' : 'horizontal'}>
          <TextArea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              disabled 
                ? "Interview completed" 
                : isQuestionActive 
                ? "Type your answer here..." 
                : "Type your response..."
            }
            disabled={disabled || loading}
            autoSize={{ minRows: isMobile ? 2 : 1, maxRows: isMobile ? 4 : 4 }}
            style={{ 
              resize: 'none',
              marginBottom: isMobile ? '8px' : '0'
            }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={!inputValue.trim() || disabled || loading}
            loading={loading}
            style={{ 
              height: 'auto',
              width: isMobile ? '100%' : 'auto',
              minHeight: '40px'
            }}
            size={isMobile ? 'large' : 'middle'}
          >
            {isMobile ? 'Send Answer' : 'Send'}
          </Button>
        </Space.Compact>
        
        {isQuestionActive && (
          <Text 
            type="secondary" 
            style={{ 
              fontSize: isMobile ? '11px' : '12px', 
              marginTop: '8px', 
              display: 'block',
              textAlign: isMobile ? 'center' : 'left'
            }}
          >
            {isMobile ? 'Tap Send when ready' : 'Press Enter to send • Shift+Enter for new line'}
          </Text>
        )}
      </Card>
    </div>
  );
};