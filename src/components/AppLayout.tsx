import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Tabs, Typography } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import { RootState } from '../store';
import { setActiveTab, setShowWelcomeBackModal } from '../store/slices/uiSlice';
import { IntervieweeTab } from './interviewee/IntervieweeTab';
import { InterviewerTab } from './interviewer/InterviewerTab';

const { Header, Content } = Layout;
const { Title } = Typography;

export const AppLayout: React.FC = () => {
  const dispatch = useDispatch();
  const { activeTab } = useSelector((state: RootState) => state.ui);
  const { candidates, currentCandidate } = useSelector((state: RootState) => state.candidate);

  useEffect(() => {
    // Check for unfinished sessions on app load
    const unfinishedCandidates = candidates.filter(
      c => c.interviewStarted && !c.interviewCompleted
    );
    
    if (unfinishedCandidates.length > 0 && !currentCandidate) {
      // Show welcome back modal for the most recent unfinished session
      const mostRecent = unfinishedCandidates
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
      
      if (mostRecent) {
        dispatch(setShowWelcomeBackModal(true));
      }
    }
  }, [candidates, currentCandidate, dispatch]);

  const handleTabChange = (key: string) => {
    dispatch(setActiveTab(key as 'interviewee' | 'interviewer'));
  };

  const tabItems = [
    {
      key: 'interviewee',
      label: (
        <span>
          <UserOutlined />
          Interviewee
        </span>
      ),
      children: <IntervieweeTab />,
    },
    {
      key: 'interviewer',
      label: (
        <span>
          <TeamOutlined />
          Interviewer
        </span>
      ),
      children: <InterviewerTab />,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#001529', 
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            🤖 AI Interview Assistant
          </Title>
        </div>
        
        <div style={{ color: 'white', fontSize: '14px' }}>
          {candidates.length > 0 && (
            <span>{candidates.length} candidate{candidates.length !== 1 ? 's' : ''}</span>
          )}
        </div>
      </Header>
      
      <Content style={{ height: 'calc(100vh - 64px)' }}>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabItems}
          style={{ height: '100%' }}
          tabBarStyle={{ 
            margin: 0, 
            padding: '0 24px',
            background: '#fafafa',
            borderBottom: '1px solid #d9d9d9'
          }}
        />
      </Content>
    </Layout>
  );
};