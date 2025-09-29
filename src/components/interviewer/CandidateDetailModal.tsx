import React from 'react';
import { 
  Modal, 
  Card, 
  Typography, 
  Space, 
  Tag, 
  Divider, 
  Timeline, 
  Statistic, 
  Row, 
  Col,
  Avatar,
  Progress,
  Empty
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { Candidate } from '../../types';
import { formatDistanceToNow } from 'date-fns';

const { Title, Text, Paragraph } = Typography;

interface CandidateDetailModalProps {
  candidate: Candidate | null;
  visible: boolean;
  onClose: () => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  visible,
  onClose
}) => {
  if (!candidate) return null;

  const getScoreColor = (score?: number) => {
    if (!score) return '#d9d9d9';
    if (score >= 7) return '#52c41a';
    if (score >= 5) return '#faad14';
    return '#ff4d4f';
  };

  const getDifficultyStats = () => {
    const easy = candidate.answers.filter(a => a.difficulty === 'easy');
    const medium = candidate.answers.filter(a => a.difficulty === 'medium');
    const hard = candidate.answers.filter(a => a.difficulty === 'hard');
    
    const easyAvg = easy.length > 0 ? easy.reduce((sum, a) => sum + (a.score || 0), 0) / easy.length : 0;
    const mediumAvg = medium.length > 0 ? medium.reduce((sum, a) => sum + (a.score || 0), 0) / medium.length : 0;
    const hardAvg = hard.length > 0 ? hard.reduce((sum, a) => sum + (a.score || 0), 0) / hard.length : 0;
    
    return { easyAvg, mediumAvg, hardAvg };
  };

  const { easyAvg, mediumAvg, hardAvg } = getDifficultyStats();

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      style={{ top: 20 }}
    >
      <div style={{ padding: '20px 0' }}>
        {/* Header */}
        <Card style={{ marginBottom: '20px' }}>
          <Row gutter={[16, 16]}>
            <Col span={16}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Avatar size={64} icon={<UserOutlined />} />
                  <div>
                    <Title level={2} style={{ margin: 0 }}>
                      {candidate.name}
                    </Title>
                    <Space>
                      <Text type="secondary">
                        <MailOutlined /> {candidate.email}
                      </Text>
                      <Text type="secondary">
                        <PhoneOutlined /> {candidate.phone}
                      </Text>
                    </Space>
                  </div>
                </div>
                
                <Space>
                  {candidate.interviewCompleted ? (
                    <Tag icon={<CheckCircleOutlined />} color="success" style={{ fontSize: '14px', padding: '4px 12px' }}>
                      Interview Completed
                    </Tag>
                  ) : candidate.interviewStarted ? (
                    <Tag icon={<ClockCircleOutlined />} color="processing" style={{ fontSize: '14px', padding: '4px 12px' }}>
                      In Progress
                    </Tag>
                  ) : (
                    <Tag color="default" style={{ fontSize: '14px', padding: '4px 12px' }}>
                      Not Started
                    </Tag>
                  )}
                  
                  {candidate.resumeFileName && (
                    <Tag icon={<FileTextOutlined />} color="blue">
                      {candidate.resumeFileName}
                    </Tag>
                  )}
                </Space>
              </Space>
            </Col>
            
            <Col span={8}>
              <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
                <Statistic
                  title="Final Score"
                  value={candidate.score || 0}
                  suffix="/10"
                  valueStyle={{ color: getScoreColor(candidate.score), fontSize: '32px' }}
                  prefix={<TrophyOutlined />}
                />
                <div>
                  <Text type="secondary">
                    Last activity: {formatDistanceToNow(new Date(candidate.updatedAt), { addSuffix: true })}
                  </Text>
                </div>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Performance Overview */}
        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
          <Col span={12}>
            <Card title="Performance Breakdown" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Text>Easy Questions</Text>
                    <Text strong>{easyAvg.toFixed(1)}/10</Text>
                  </div>
                  <Progress 
                    percent={(easyAvg / 10) * 100} 
                    strokeColor="#52c41a" 
                    showInfo={false}
                    size="small"
                  />
                </div>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Text>Medium Questions</Text>
                    <Text strong>{mediumAvg.toFixed(1)}/10</Text>
                  </div>
                  <Progress 
                    percent={(mediumAvg / 10) * 100} 
                    strokeColor="#faad14" 
                    showInfo={false}
                    size="small"
                  />
                </div>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Text>Hard Questions</Text>
                    <Text strong>{hardAvg.toFixed(1)}/10</Text>
                  </div>
                  <Progress 
                    percent={(hardAvg / 10) * 100} 
                    strokeColor="#ff4d4f" 
                    showInfo={false}
                    size="small"
                  />
                </div>
              </Space>
            </Card>
          </Col>
          
          <Col span={12}>
            <Card title="Interview Statistics" size="small">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="Questions Answered"
                    value={candidate.answers.length}
                    suffix="/ 6"
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Avg. Time per Question"
                    value={candidate.answers.length > 0 ? 
                      Math.round(candidate.answers.reduce((sum, a) => sum + a.timeSpent, 0) / candidate.answers.length) : 0
                    }
                    suffix="sec"
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Started"
                    value={formatDistanceToNow(new Date(candidate.createdAt), { addSuffix: true })}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Completion Rate"
                    value={Math.round((candidate.answers.length / 6) * 100)}
                    suffix="%"
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* AI Summary */}
        {candidate.summary && (
          <Card title="AI Assessment Summary" style={{ marginBottom: '20px' }}>
            <Paragraph style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
              {candidate.summary}
            </Paragraph>
          </Card>
        )}

        {/* Questions and Answers */}
        <Card title={`Interview Questions & Answers (${candidate.answers.length}/6)`}>
          {candidate.answers.length === 0 ? (
            <Empty description="No answers recorded yet" />
          ) : (
            <Timeline>
              {candidate.answers.map((answer, index) => (
                <Timeline.Item 
                  key={index}
                  color={getScoreColor(answer.score)}
                  dot={<span style={{ 
                    backgroundColor: getScoreColor(answer.score),
                    color: 'white',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {answer.score || 0}
                  </span>}
                >
                  <Card size="small" style={{ marginBottom: '16px' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <Text strong>Question {index + 1}</Text>
                          <Tag 
                            color={
                              answer.difficulty === 'easy' ? 'green' : 
                              answer.difficulty === 'medium' ? 'orange' : 'red'
                            } 
                            style={{ marginLeft: '8px' }}
                          >
                            {answer.difficulty.toUpperCase()}
                          </Tag>
                        </div>
                        <Space>
                          <Text type="secondary">{answer.timeSpent}s</Text>
                          <Text strong style={{ color: getScoreColor(answer.score) }}>
                            {answer.score}/10
                          </Text>
                        </Space>
                      </div>
                      
                      <Paragraph strong style={{ margin: '8px 0' }}>
                        {answer.question}
                      </Paragraph>
                      
                      <div>
                        <Text type="secondary">Answer:</Text>
                        <Paragraph style={{ margin: '4px 0', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                          {answer.answer}
                        </Paragraph>
                      </div>
                      
                      {answer.feedback && (
                        <div>
                          <Text type="secondary">AI Feedback:</Text>
                          <Paragraph style={{ margin: '4px 0', fontStyle: 'italic' }}>
                            {answer.feedback}
                          </Paragraph>
                        </div>
                      )}
                    </Space>
                  </Card>
                </Timeline.Item>
              ))}
            </Timeline>
          )}
        </Card>
      </div>
    </Modal>
  );
};