import * as pdfjsLib from 'pdfjs-dist';
import * as mammoth from 'mammoth';
import { ResumeData } from '../types';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export const parseResumeFile = async (file: File): Promise<ResumeData> => {
  let content = '';
  
  try {
    if (file.type === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      // Extract text from all pages
      const textContents: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        textContents.push(pageText);
      }
      content = textContents.join('\n');
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      content = result.value;
    } else {
      throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
    }

    // Extract basic information using regex patterns
    const extractedData = extractContactInfo(content);
    
    return {
      ...extractedData,
      content,
    };
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw new Error('Failed to parse resume. Please ensure the file is not corrupted.');
  }
};

const extractContactInfo = (text: string): Partial<ResumeData> => {
  const data: Partial<ResumeData> = {};
  
  // Clean text for better parsing
  const cleanText = text.replace(/\s+/g, ' ').trim();
  
  // Extract name - try multiple patterns
  let nameMatch = 
    // Pattern 1: First line with capital letters (most common)
    cleanText.match(/^([A-Z][a-zA-Z]+ [A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)?)/m) ||
    // Pattern 2: Look for "Name:" prefix
    cleanText.match(/(?:Name|Full Name):\s*([A-Z][a-zA-Z]+ [A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)?)/i) ||
    // Pattern 3: Any capitalized name pattern
    cleanText.match(/\b([A-Z][a-zA-Z]{1,15}\s+[A-Z][a-zA-Z]{1,15}(?:\s+[A-Z][a-zA-Z]{1,15})?)\b/) ||
    // Pattern 4: Look in first 200 characters for name pattern
    cleanText.substring(0, 200).match(/([A-Z][a-zA-Z]+ [A-Z][a-zA-Z]+)/);
  
  if (nameMatch) {
    data.name = nameMatch[1].trim();
  }
  
  // Extract email - improved pattern
  const emailMatch = cleanText.match(/([a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,})/);
  if (emailMatch) {
    data.email = emailMatch[1].toLowerCase();
  }
  
  // Extract phone number - multiple formats
  const phonePatterns = [
    // (123) 456-7890
    /\((\d{3})\)\s*(\d{3})-?(\d{4})/,
    // 123-456-7890
    /(\d{3})-(\d{3})-(\d{4})/,
    // 123.456.7890
    /(\d{3})\.(\d{3})\.(\d{4})/,
    // 123 456 7890
    /(\d{3})\s+(\d{3})\s+(\d{4})/,
    // +1 123 456 7890
    /\+?1\s*(\d{3})\s*(\d{3})\s*(\d{4})/,
    // 1234567890
    /(\d{10})/,
    // International formats
    /(?:\+\d{1,3}\s?)?(?:\(\d{1,4}\)\s?)?[\d\s\-\.]{10,}/
  ];
  
  for (const pattern of phonePatterns) {
    const phoneMatch = cleanText.match(pattern);
    if (phoneMatch) {
      let phone = phoneMatch[0].replace(/\D/g, '');
      // Remove country code if present
      if (phone.length === 11 && phone.startsWith('1')) {
        phone = phone.substring(1);
      }
      if (phone.length === 10) {
        data.phone = `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
        break;
      }
    }
  }
  
  return data;
};

export const validateFile = (file: File): string | null => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return 'Please upload a PDF or DOCX file only.';
  }
  
  // Max file size: 10MB
  if (file.size > 10 * 1024 * 1024) {
    return 'File size must be less than 10MB.';
  }
  
  return null;
};