import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Typography, Space, Spin } from 'antd';
import { RootState } from '../../store';
import { 
  createCandidate, 
  updateCandidate, 
  setCurrentCandidate,
  resetCandidateInterview,
  clearCurrentSession 
} from '../../store/slices/candidateSlice';
import { setShowWelcomeBackModal } from '../../store/slices/uiSlice';
import { ResumeUpload } from '../common/ResumeUpload';
import { DataCollection } from '../common/DataCollection';
import { InterviewFlow } from './InterviewFlow';
import { WelcomeBackModal } from '../common/WelcomeBackModal';
import { ResumeData } from '../../types';

const { Title, Paragraph } = Typography;

export const IntervieweeTab: React.FC = () => {
  const dispatch = useDispatch();
  const { currentCandidate, candidates } = useSelector((state: RootState) => state.candidate);
  const { showWelcomeBackModal, loading } = useSelector((state: RootState) => state.ui);
  
  const [step, setStep] = useState<'upload' | 'data-collection' | 'interview'>('upload');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  useEffect(() => {
    // Check if there's an existing session to restore
    if (candidates.length > 0 && !currentCandidate) {
      // Find the most recent candidate
      const recentCandidate = candidates
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
      
      if (recentCandidate) {
        dispatch(setCurrentCandidate(recentCandidate.id));
        dispatch(setShowWelcomeBackModal(true));
      }
    }
  }, [candidates, currentCandidate, dispatch]);

  useEffect(() => {
    // Determine current step based on candidate state
    if (currentCandidate) {
      if (currentCandidate.interviewStarted || currentCandidate.interviewCompleted) {
        setStep('interview');
      } else if (currentCandidate.name && currentCandidate.email && currentCandidate.phone) {
        setStep('interview');
      } else {
        setStep('data-collection');
      }
    } else {
      setStep('upload');
    }
  }, [currentCandidate]);

  const handleResumeUploaded = (data: ResumeData, fileName: string) => {
    setResumeData(data);
    
    // Create a new candidate
    dispatch(createCandidate({
      name: data.name,
      email: data.email,
      phone: data.phone,
      resumeContent: data.content,
      resumeFileName: fileName,
    }));
  };

  const handleDataComplete = (data: { name: string; email: string; phone: string }) => {
    if (currentCandidate) {
      dispatch(updateCandidate({
        id: currentCandidate.id,
        ...data,
      }));
    }
  };

  const handleContinueInterview = () => {
    dispatch(setShowWelcomeBackModal(false));
    setStep('interview');
  };

  const handleStartNewInterview = () => {
    if (currentCandidate) {
      // Reset the current candidate's interview data
      dispatch(resetCandidateInterview(currentCandidate.id));
    }
    dispatch(setShowWelcomeBackModal(false));
    setStep('interview');
  };

  const handleUploadNewResume = () => {
    dispatch(setShowWelcomeBackModal(false));
    dispatch(clearCurrentSession());
    dispatch(setCurrentCandidate(null));
    setStep('upload');
    setResumeData(null);
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 'upload':
        return (
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <Title level={1}>AI Interview Assistant</Title>
              <Paragraph style={{ fontSize: '18px', color: '#666' }}>
                Upload your resume to get started with your AI-powered technical interview.
                We'll extract your contact information and begin the assessment process.
              </Paragraph>
            </div>
            <ResumeUpload onResumeUploaded={handleResumeUploaded} loading={loading} />
          </div>
        );

      case 'data-collection':
        return (
          <div style={{ padding: '20px' }}>
            <DataCollection
              initialData={resumeData || {}}
              onDataComplete={handleDataComplete}
              loading={loading}
            />
          </div>
        );

      case 'interview':
        return (
          <div style={{ height: '100vh', padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <InterviewFlow />
          </div>
        );

      default:
        return null;
    }
  };

  if (loading && step === 'upload') {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      {renderCurrentStep()}
      
      <WelcomeBackModal
        visible={showWelcomeBackModal}
        candidate={currentCandidate}
        onContinue={handleContinueInterview}
        onStartNew={handleStartNewInterview}
        onUploadNew={handleUploadNewResume}
      />
    </>
  );
};