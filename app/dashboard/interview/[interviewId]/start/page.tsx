"use client";

import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useCallback, useEffect, useState } from 'react';
import QuestionsSection from './_components/QuestionsSection';
import { useParams } from 'next/navigation';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

// Type declarations
interface InterviewData {
  id: number;
  jsonMockResp: string;
  jobPosition: string;
  jobDesc: string;
  jobExperience: string;
  createdBy: string;
  createdAt: string | null;
  mockId: string;
}

interface Question {
  id: number;
  text: string;
  answer: string;
}

const StartInterview = () => {
const params = useParams();
const interviewId = params.interviewId!;

const [interviewData, setInterviewData] = useState<InterviewData | undefined>(undefined);
  const [interviewQuestion, setInterviewQuestion] = useState<Question[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isRecordLoading, setIsRecordLoading] = useState(false);

  const GetInterviewDetails = useCallback(async () => {
    try {
      if (!interviewId) return;
      const data = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));

      if (data.length > 0) {
        setInterviewData(data[0]);
        
        // --- SAFE PARSING START ---
        let rawContent = data[0].jsonMockResp;
        
        // Regular expression to find content between [ ] or { } 
        // This ignores "Here are your questions:" text.
        const jsonMatch = rawContent.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
        const cleanContent = jsonMatch ? jsonMatch[0] : rawContent;
        
        const jsonMockResp = JSON.parse(cleanContent);
        // --- SAFE PARSING END ---

        const formattedQuestions = jsonMockResp.map((q: any, index: number) => ({
          id: index + 1,
          text: q.Question || q.question || q.text || `Question ${index + 1}`,
          answer: q.Answer || q.answer || q.answered || "",
        }));

        setInterviewQuestion(formattedQuestions);
      }
    } catch (error) {
      console.error('Error fetching interview details:', error);
    }
  }, [interviewId]);


  useEffect(() => {
    if (interviewId) GetInterviewDetails();
  }, [interviewId, GetInterviewDetails]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <QuestionsSection
            interviewQuestion={interviewQuestion}
            activeIndex={activeIndex}
          />
        </Card>

        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <RecordAnswerSection
            interviewQuestion={interviewQuestion}
            activeIndex={activeIndex}
            interviewData={interviewData}
            onLoadingChange={setIsRecordLoading}
          />
        </Card>
      </div>

      <div className="flex justify-between mt-6">
        <Button 
          variant="outline"
          onClick={() => setActiveIndex(activeIndex - 1)}
          disabled={activeIndex <= 0 || isRecordLoading}
          className="hover:bg-slate-100"
        >
          Previous Question
        </Button>
        
        {activeIndex === interviewQuestion.length - 1 ? (
          <Link href={"/dashboard/interview/"+interviewData?.mockId+"/feedback"}>
          <Button 
            variant="default"
            disabled={isRecordLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            End Interview
          </Button>
          </Link>
        ) : (
          <Button 
            variant="default"
            onClick={() => setActiveIndex(activeIndex + 1)}
            disabled={activeIndex >= interviewQuestion.length - 1 || isRecordLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Next Question
          </Button>
        )}
      </div>
    </div>
  );
};

export default StartInterview;
