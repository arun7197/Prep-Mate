"use client"
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { Lightbulb, PlayCircle, WebcamIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import Webcam from "react-webcam";

// Define the type for interview data
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
function Interview({params}: {params: {interviewId: string}}) {
    const [webCamEnable,setWebCamEnable] = useState(false)
    const [interviewData, setInterviewData] = useState<InterviewData | null>(null);
    

   //Used to get interview details by mockid-interview id

   const GetInterviewDetails = useCallback(async () => {
     try {
       const data = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId))
       //console.log(data)
       if (data.length > 0) {
         setInterviewData(data[0]);
       }
     } catch (error) {
       console.error('Error fetching interview details:', error);
     }
   }, [params.interviewId]);

   useEffect(() => {
     console.log(params)
     GetInterviewDetails();
   }, [params, GetInterviewDetails])
   
  return (
    <div className='container mx-auto px-4 py-12 max-w-6xl'>
        <h2 className='text-3xl font-bold text-center mb-10 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent'>
            Let&apos;s Get Started
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-200/20 hover:border-purple-500/30 transition-all">
                <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <h3 className='text-lg font-semibold text-gray-700'>Job Role</h3>
                        <p className='text-gray-600'>{interviewData?.jobPosition}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className='text-lg font-semibold text-gray-700'>Job Description</h3>
                        <p className='text-gray-600'>{interviewData?.jobDesc}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className='text-lg font-semibold text-gray-700'>Experience Required</h3>
                        <p className='text-gray-600'>{interviewData?.jobExperience}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <div className="bg-amber-50 p-6 rounded-2xl shadow-sm border border-amber-200">
                    <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="h-5 w-5 text-amber-500" />
                        <h3 className="font-semibold text-amber-900">Important Note</h3>
                    </div>
                    <p className="text-amber-800 text-sm leading-relaxed">
                        Please enable your webcam and microphone for an optimal interview experience. We prioritize your privacy and do not record or store any audio/video data.
                    </p>
                </div>

                <div className="flex flex-col items-center">
                    {webCamEnable ? (
                        <div className="flex flex-col items-center">
                            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-purple-200">
                                <Webcam
                                    onUserMedia={() => setWebCamEnable(true)}
                                    onUserMediaError={() => setWebCamEnable(false)}
                                    mirrored={true}
                                    className="w-full h-[300px] object-cover"
                                />
                            </div>
                            <div className="mt-6">
                                <Button  variant="secondary"
                                    onClick={() => setWebCamEnable(false)}
                                    className="font-medium px-6 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                    Disable Webcam and Microphone
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="bg-gray-50 rounded-2xl p-8 mb-4">
                                <WebcamIcon className="h-32 w-32 mx-auto text-gray-400" />
                            </div>
                            
                            <Button  variant="secondary"
                                onClick={() => setWebCamEnable(true)}
                                className="font-medium px-6 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                Enable Webcam and Microphone
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
        <div className="mt-12 flex justify-center">
            <Link href={'/dashboard/interview/' + params.interviewId + '/start/'}>
            <Button 
                className="  "
            >
                <PlayCircle className="h-5 w-5" />
                Start Interview
            </Button>
            </Link>
            
        </div>
    </div>
  )
}

export default Interview