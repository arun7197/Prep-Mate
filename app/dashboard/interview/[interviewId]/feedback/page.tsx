"use client"
import React, { useEffect, useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ChevronDown, Star } from 'lucide-react'

interface UserAnswerData {
  id: number;
  mockIdRef: string;
  question: string;
  correctAns: string;
  userAns: string;
  rating: string;
  feedback: string;
  userEmail: string;
  createdAt: string | null;
}

const Feedback = ({params}: {params: Promise<{interviewId: string}>}) => {
  const { interviewId } = React.use(params);
  const [feedbackList, setFeedbackList] = useState<UserAnswerData[]>([]);
  
  useEffect(() => {
    getFeedback()
  }, [interviewId])

  const getFeedback = async () => {
    const result = await db.select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, interviewId))
      .orderBy(UserAnswer.id)
    setFeedbackList(result)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Congratulations!</h2>
          <p className="text-gray-600 text-lg">Your interview has been completed. Here's your detailed feedback.</p>
        </div>

        <div className="space-y-4">
          {feedbackList?.map((item, index) => (
            <Collapsible key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <CollapsibleTrigger className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-900">{item.question}</span>
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border-t border-gray-200">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="font-semibold">Rating:</span>
                    <span className="text-gray-700">{item.rating}</span>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Correct Answer:</h3>
                    <p className="text-gray-700 bg-green-50 p-3 rounded-md">{item.correctAns}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Your Answer:</h3>
                    <p className="text-gray-700 bg-blue-50 p-3 rounded-md">{item.userAns}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Feedback:</h3>
                    <p className="text-gray-700 italic">{item.feedback}</p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Feedback