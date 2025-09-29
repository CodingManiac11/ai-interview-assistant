import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Typography, Row, Col, Statistic, Empty, Space } from 'antd';
import { 
  UserOutlined, 
  TrophyOutlined, 
  ClockCircleOutlined,
  CheckCircleOutlined 
} from '@ant-design/icons';
import { RootState } from '../../store';
import { Candidate } from '../../types';
import { CandidateList } from './CandidateList';
import { CandidateDetailModal } from './CandidateDetailModal';

const { Title, Text } = Typography;

export const InterviewerTab: React.FC = () => {
  const { candidates } = useSelector((state: RootState) => state.candidate);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  
  const completedCandidates = candidates.filter(c => c.interviewCompleted);
  const inProgressCandidates = candidates.filter(c => c.interviewStarted && !c.interviewCompleted);
  const notStartedCandidates = candidates.filter(c => !c.interviewStarted);
  
  const averageScore = completedCandidates.length > 0 
    ? completedCandidates.reduce((sum, c) => sum + (c.score || 0), 0) / completedCandidates.length 
    : 0;

  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleCloseModal = () => {
    setSelectedCandidate(null);
  };

  if (candidates.length === 0) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '20px'
      }}>
        <Card style={{ textAlign: 'center', maxWidth: '400px' }}>
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Space direction="vertical">
                <Title level={3}>No Candidates Yet</Title>
                <Text type="secondary">
                  Candidates who take interviews will appear here. 
                  Share the interview link to get started!
                </Text>
              </Space>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', height: '100vh', overflow: 'auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>
          Interview Dashboard
        </Title>
        <Text type="secondary">
          Manage and review candidate interviews
        </Text>
      </div>

      {/* Statistics Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Candidates"
              value={candidates.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Completed"
              value={completedCandidates.length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="In Progress"
              value={inProgressCandidates.length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Average Score"
              value={averageScore.toFixed(1)}
              suffix="/10"
              prefix={<TrophyOutlined />}
              valueStyle={{ 
                color: averageScore >= 7 ? '#52c41a' : averageScore >= 5 ? '#faad14' : '#ff4d4f' 
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Candidate List */}
      <CandidateList 
        candidates={candidates} 
        onViewCandidate={handleViewCandidate}
      />

      {/* Candidate Detail Modal */}
      <CandidateDetailModal
        candidate={selectedCandidate}
        visible={!!selectedCandidate}
        onClose={handleCloseModal}
      />
    </div>
  );
};