"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { useUser } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import InterviewItemCard from './InterviewItemCard';

export default function InterviewList() {

    const{user} = useUser();
    const[interviewList,setInterviewList] = useState([]);

    useEffect(()=>{
        if (user) {
            GetInterviewList();
        }
    },[user])
    
    const GetInterviewList=async()=>{
        const result = await db.select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress || ''))
        .orderBy(desc(MockInterview.id))

        //console.log("The result is :",result)
        setInterviewList(result)
    }
  return (
    <div>
        <h2 className="mt-12 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">Previous Interviews</h2>
        <div className='grid grid-col-1 md:grid-cols-3 my-5 gap-4'>
            {interviewList && interviewList.map((interviewData,index)=>(
                <InterviewItemCard key={index} interviewData={interviewData} />
            ))}
        </div>
    </div>
  )
}
