import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import { CalendarDays, Briefcase, Clock } from 'lucide-react';

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

function InterviewItemCard({interviewData}:{interviewData:InterviewData}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 col-span-1 md:col-span-1 lg:col-span-1">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {interviewData?.jobPosition}
          </h3>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center">
              <Briefcase className="w-4 h-4 mr-2" />
              <span>{interviewData.jobExperience} Years Experience</span>
            </div>
            
            <div className="flex items-center">
              <CalendarDays className="w-4 h-4 mr-2" />
              <span>{interviewData?.createdAt}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`} className="flex-1 min-w-[100px]">
            <Button 
              variant="outline"
              size="sm"
              className="w-full hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
            >
              Feedback
            </Button>
          </Link>
          
          <Link href={`/dashboard/interview/${interviewData?.mockId}/`} className="flex-1 min-w-[120px]">
            <Button 
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
            >
              Start Interview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default InterviewItemCard;
