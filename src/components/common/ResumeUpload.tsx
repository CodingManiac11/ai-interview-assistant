import React, { useState } from 'react';
import { Upload, message, Card, Spin, Alert, Progress } from 'antd';
import { InboxOutlined, FileTextOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { parseResumeFile, validateFile } from '../../utils/resumeParser';
import { ResumeData } from '../../types';

const { Dragger } = Upload;

interface ResumeUploadProps {
  onResumeUploaded: (data: ResumeData, fileName: string) => void;
  loading?: boolean;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ onResumeUploaded, loading = false }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    // Clear previous errors
    setError(null);
    
    // Validate file first
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      message.error(validationError);
      return false;
    }

    setUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const resumeData = await parseResumeFile(file);
      
      // Complete progress
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        onResumeUploaded(resumeData, file.name);
        message.success('Resume uploaded and parsed successfully!');
        setUploadProgress(0);
      }, 500);
      
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to parse resume';
      setError(errorMessage);
      message.error(errorMessage);
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
    
    return false; // Prevent default upload
  };

  return (
    <div className="container-sm">
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileTextOutlined />
            Upload Your Resume
          </div>
        }
        loading={loading}
        className="mb-16"
      >
        {error && (
          <Alert
            message="Upload Error"
            description={error}
            type="error"
            icon={<ExclamationCircleOutlined />}
            showIcon
            closable
            onClose={() => setError(null)}
            style={{ marginBottom: '16px' }}
          />
        )}
        
        <Spin spinning={uploading} tip="Processing your resume...">
          <div>
            <Dragger
              name="resume"
              multiple={false}
              accept=".pdf,.docx"
              beforeUpload={handleUpload}
              showUploadList={false}
              disabled={uploading || loading}
              style={{ 
                padding: '20px',
                background: error ? '#fff2f0' : undefined,
                borderColor: error ? '#ff4d4f' : undefined 
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ 
                  fontSize: '48px', 
                  color: error ? '#ff4d4f' : '#1890ff' 
                }} />
              </p>
              <p className="ant-upload-text" style={{ fontSize: '16px', fontWeight: 500 }}>
                Click or drag your resume to upload
              </p>
              <p className="ant-upload-hint" style={{ fontSize: '14px', color: '#666' }}>
                Supports PDF and DOCX files only. Maximum file size: 10MB.
                <br />
                We'll extract your contact information automatically.
              </p>
            </Dragger>
            
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div style={{ marginTop: '16px' }}>
                <Progress 
                  percent={uploadProgress} 
                  status={uploading ? "active" : "success"}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
              </div>
            )}
          </div>
        </Spin>
        
        <div style={{ marginTop: '16px', fontSize: '12px', color: '#8c8c8c' }}>
          <strong>Supported formats:</strong> PDF (.pdf), Microsoft Word (.docx)
          <br />
          <strong>What we extract:</strong> Name, Email, Phone Number, Skills, Experience
        </div>
      </Card>
    </div>
  );
};