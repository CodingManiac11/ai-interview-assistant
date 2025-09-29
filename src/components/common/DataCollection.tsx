import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Steps, Typography } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { ResumeData } from '../../types';

const { Title, Text } = Typography;

interface DataCollectionProps {
  initialData: Partial<ResumeData>;
  onDataComplete: (data: { name: string; email: string; phone: string }) => void;
  loading?: boolean;
}

export const DataCollection: React.FC<DataCollectionProps> = ({
  initialData,
  onDataComplete,
  loading = false
}) => {
  const [form] = Form.useForm();
  const [missingFields, setMissingFields] = useState<string[]>([]);

  useEffect(() => {
    const missing: string[] = [];
    if (!initialData.name?.trim()) missing.push('name');
    if (!initialData.email?.trim()) missing.push('email');
    if (!initialData.phone?.trim()) missing.push('phone');
    
    setMissingFields(missing);
    
    // Set initial form values
    form.setFieldsValue({
      name: initialData.name || '',
      email: initialData.email || '',
      phone: initialData.phone || '',
    });
  }, [initialData, form]);

  const handleSubmit = (values: any) => {
    onDataComplete({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
    });
  };

  const getMissingFieldsMessage = () => {
    if (missingFields.length === 0) {
      return "Great! We have all your information. Let's start the interview!";
    }
    
    const fieldNames = missingFields.map(field => {
      switch (field) {
        case 'name': return 'Name';
        case 'email': return 'Email';
        case 'phone': return 'Phone Number';
        default: return field;
      }
    });
    
    if (missingFields.length === 1) {
      return `We couldn't find your ${fieldNames[0]} in your resume. Please provide it below:`;
    } else if (missingFields.length === 2) {
      return `We couldn't find your ${fieldNames[0]} and ${fieldNames[1]} in your resume. Please provide them below:`;
    } else {
      return `We couldn't find your ${fieldNames.slice(0, -1).join(', ')}, and ${fieldNames[fieldNames.length - 1]} in your resume. Please provide them below:`;
    }
  };

  const steps = [
    {
      title: 'Resume Uploaded',
      icon: <UserOutlined />,
      description: 'Resume parsed successfully'
    },
    {
      title: 'Complete Profile',
      icon: <MailOutlined />,
      description: 'Fill in missing information'
    },
    {
      title: 'Ready to Start',
      icon: <PhoneOutlined />,
      description: 'Begin your interview'
    }
  ];

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
      <Steps current={missingFields.length > 0 ? 1 : 2} items={steps} style={{ marginBottom: '30px' }} />
      
      <Card>
        <Title level={3} style={{ textAlign: 'center', marginBottom: '20px' }}>
          Complete Your Profile
        </Title>
        
        <Text style={{ display: 'block', marginBottom: '20px', textAlign: 'center' }}>
          {getMissingFieldsMessage()}
        </Text>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              { required: true, message: 'Please enter your full name' },
              { min: 2, message: 'Name must be at least 2 characters' }
            ]}
            hasFeedback={missingFields.includes('name')}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="e.g., John Doe"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter your email address' },
              { type: 'email', message: 'Please enter a valid email address' }
            ]}
            hasFeedback={missingFields.includes('email')}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="e.g., john.doe@email.com"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              { required: true, message: 'Please enter your phone number' },
              { 
                pattern: /^[+]?[1-9][\d]{0,15}$/, 
                message: 'Please enter a valid phone number' 
              }
            ]}
            hasFeedback={missingFields.includes('phone')}
          >
            <Input 
              prefix={<PhoneOutlined />} 
              placeholder="e.g., (555) 123-4567"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: '30px' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              size="large"
              loading={loading}
            >
              {missingFields.length > 0 ? 'Continue to Interview' : 'Start Interview'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};