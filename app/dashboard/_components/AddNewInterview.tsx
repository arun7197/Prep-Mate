"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { GoogleGenerativeAI } from '@google/generative-ai';
import { LoaderCircle } from 'lucide-react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs'
import moment from 'moment';
import { useRouter } from 'next/navigation'





function AddNewInterview() {
    const [openDialog, setOpenDialog] = useState(false)
    const [jobPosition, setJobPosition] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [experience, setExperience] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    // const [jsonResp,setJsonResp] =useState([])
    const { user } = useUser()
    const router = useRouter()

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const currentMockId = uuidv4();

    try {
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);
        const model = genAI.getGenerativeModel(
            { model: "gemini-2.5-flash" },
            { apiVersion: "v1" }
        );

        const InputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDescription}, Years of Experience: ${experience}. 
Give me 5 Interview questions with Answers in JSON format. 
Return ONLY the JSON array. No preamble, no "Here is your JSON", no markdown. 
Format: [{"question": "...", "answer": "..."}]`;

        const result = await model.generateContent(InputPrompt);
        const response = await result.response;
        const text = response.text();
        const cleanJson = text.replace(/```json\n?|```/g, '').trim();

        if (cleanJson) {
            const resp = await db.insert(MockInterview)
                .values({
                    mockId: currentMockId,
                    jsonMockResp: cleanJson,
                    jobDesc: jobDescription,
                    jobPosition: jobPosition,
                    jobExperience: experience.toString(),
                    createdBy: user?.primaryEmailAddress?.emailAddress ?? "",
                    createdAt: moment().format('DD-MM-yyyy')
                }).returning({ mockId: MockInterview.mockId });

            setOpenDialog(false);
            router.push('/dashboard/interview/' + resp[0]?.mockId);
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
    } finally {
        setIsLoading(false);
    }
};
    return (
        <div>
            <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow cursor-pointer transition-all'>
                <h2 className=' text-lg text-center' onClick={() => setOpenDialog(true)}>
                    + Add New
                </h2>
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog} >
                <DialogContent className='max-w-2xl'>
                    <DialogHeader>
                        <DialogTitle>Tell us more about your job interview</DialogTitle>
                        <DialogDescription>
                            Fill in the details below to start your interview preparation
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={onSubmit}>
                        <div className='mt-7 my-1'>
                            <h2 className='font-medium mb-2'>Job Role/Job Position</h2>
                            <Input placeholder='Ex: Software Engineer' required value={jobPosition} onChange={(event) => setJobPosition(event.target.value)} />
                        </div>
                        <div className='mt-7 my-1 '>
                            <h2 className='font-medium mb-2'>Job Description/ Tech Stack</h2>
                            <Textarea placeholder='Ex. React, NodeJs, etc' required value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} />
                        </div>
                        <div className='mt-7 my-1'>
                            <h2 className='font-medium mb-2'>Experiance</h2>
                            <Input placeholder='Ex. 5' type='number' required value={experience} onChange={(event) => setExperience(Number(event.target.value))} />
                        </div>
                        <div className='flex gap-5 justify-end'>
                            <Button variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ?
                                    <>
                                        <LoaderCircle className='animate-spin' />Generating from AI
                                    </>
                                    :
                                    "Start Interview"
                                }

                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddNewInterview
