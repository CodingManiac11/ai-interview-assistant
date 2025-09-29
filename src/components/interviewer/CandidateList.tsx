import React, { useState, useMemo } from 'react';
import { 
  Table, 
  Card, 
  Input, 
  Select, 
  Space, 
  Tag, 
  Button, 
  Typography, 
  Avatar, 
  Tooltip,
  Empty
} from 'antd';
import { 
  SearchOutlined, 
  UserOutlined, 
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  MailOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { Candidate } from '../../types';
import { formatDistanceToNow } from 'date-fns';

const { Title } = Typography;
const { Option } = Select;

interface CandidateListProps {
  candidates: Candidate[];
  onViewCandidate: (candidate: Candidate) => void;
}

export const CandidateList: React.FC<CandidateListProps> = ({ 
  candidates, 
  onViewCandidate 
}) => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('updatedAt');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredAndSortedCandidates = useMemo(() => {
    let filtered = candidates.filter(candidate => {
      const matchesSearch = 
        candidate.name.toLowerCase().includes(searchText.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchText.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'completed' && candidate.interviewCompleted) ||
        (statusFilter === 'in-progress' && candidate.interviewStarted && !candidate.interviewCompleted) ||
        (statusFilter === 'not-started' && !candidate.interviewStarted);
      
      return matchesSearch && matchesStatus;
    });

    // Sort candidates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return (b.score || 0) - (a.score || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updatedAt':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    return filtered;
  }, [candidates, searchText, statusFilter, sortBy]);

  const getStatusTag = (candidate: Candidate) => {
    if (candidate.interviewCompleted) {
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Completed
        </Tag>
      );
    } else if (candidate.interviewStarted) {
      return (
        <Tag icon={<ClockCircleOutlined />} color="processing">
          In Progress
        </Tag>
      );
    } else {
      return (
        <Tag icon={<ExclamationCircleOutlined />} color="default">
          Not Started
        </Tag>
      );
    }
  };

  const getScoreTag = (score?: number) => {
    if (score === undefined) return <Tag color="default">N/A</Tag>;
    
    let color = 'error';
    if (score >= 7) color = 'success';
    else if (score >= 5) color = 'warning';
    
    return <Tag color={color}>{score.toFixed(1)}/10</Tag>;
  };

  const CandidateCard: React.FC<{ candidate: Candidate }> = ({ candidate }) => (
    <Card 
      className="candidate-card" 
      style={{ marginBottom: 16 }}
      actions={[
        <Button 
          type="primary" 
          onClick={() => onViewCandidate(candidate)}
          icon={<EyeOutlined />}
          size="small"
          block
        >
          View Details
        </Button>
      ]}
    >
      <Card.Meta
        avatar={<Avatar icon={<UserOutlined />} />}
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 'bold' }}>{candidate.name}</span>
            {getStatusTag(candidate)}
          </div>
        }
        description={
          <div>
            <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
              <MailOutlined style={{ marginRight: 8, color: '#666' }} />
              <span style={{ fontSize: '14px' }}>{candidate.email}</span>
            </div>
            {candidate.phone && (
              <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
                <PhoneOutlined style={{ marginRight: 8, color: '#666' }} />
                <span style={{ fontSize: '14px' }}>{candidate.phone}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <strong>Score:</strong> {getScoreTag(candidate.score)}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Progress: {candidate.answers.length}/6
              </div>
            </div>
            <div style={{ marginTop: 8, fontSize: '12px', color: '#999' }}>
              {formatDistanceToNow(new Date(candidate.updatedAt), { addSuffix: true })}
            </div>
          </div>
        }
      />
    </Card>
  );

  const columns = [
    {
      title: 'Candidate',
      key: 'candidate',
      render: (record: Candidate) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Status',
      key: 'status',
      render: (record: Candidate) => getStatusTag(record),
    },
    {
      title: 'Score',
      key: 'score',
      render: (record: Candidate) => getScoreTag(record.score),
      sorter: (a: Candidate, b: Candidate) => (a.score || 0) - (b.score || 0),
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (record: Candidate) => (
        <div style={{ minWidth: '80px' }}>
          {record.answers.length}/6 questions
        </div>
      ),
    },
    {
      title: 'Last Activity',
      key: 'lastActivity',
      render: (record: Candidate) => (
        <Tooltip title={new Date(record.updatedAt).toLocaleString()}>
          {formatDistanceToNow(new Date(record.updatedAt), { addSuffix: true })}
        </Tooltip>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Candidate) => (
        <Button 
          type="primary" 
          icon={<EyeOutlined />}
          onClick={() => onViewCandidate(record)}
          size="small"
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ marginBottom: '16px' }}>
        <Title level={3} style={{ margin: 0 }}>
          Candidates ({filteredAndSortedCandidates.length})
        </Title>
      </div>

      <Space style={{ 
        marginBottom: '16px', 
        width: '100%', 
        justifyContent: 'space-between',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center'
      }}>
        <Space style={{ width: isMobile ? '100%' : 'auto', marginBottom: isMobile ? '8px' : '0' }}>
          <Input
            placeholder="Search by name or email..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: isMobile ? '100%' : 250 }}
          />
          
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: isMobile ? '100%' : 150, minWidth: 120 }}
          >
            <Option value="all">All Status</Option>
            <Option value="completed">Completed</Option>
            <Option value="in-progress">In Progress</Option>
            <Option value="not-started">Not Started</Option>
          </Select>
        </Space>

        <Select
          value={sortBy}
          onChange={setSortBy}
          style={{ width: isMobile ? '100%' : 150, minWidth: 120 }}
        >
          <Option value="updatedAt">Latest Activity</Option>
          <Option value="score">Highest Score</Option>
          <Option value="name">Name</Option>
          <Option value="createdAt">Registration</Option>
        </Select>
      </Space>

      {filteredAndSortedCandidates.length === 0 ? (
        <Empty 
          description={
            candidates.length === 0 
              ? "No candidates yet" 
              : "No candidates match your filters"
          }
        />
      ) : isMobile ? (
        <div>
          {filteredAndSortedCandidates.map(candidate => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredAndSortedCandidates}
          rowKey="id"
          scroll={{ x: 800 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} candidates`,
          }}
        />
      )}
    </Card>
  );
};