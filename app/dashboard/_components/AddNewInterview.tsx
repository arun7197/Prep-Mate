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


const myuuid = uuidv4();
console.log(myuuid);



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
        setIsLoading(true);
        e.preventDefault();
        //console.log(jobDescription, jobPosition)

        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

        const InputPrompt = `Job Position: ${jobPosition}, Job Description:${jobDescription} , Years of Experience: ${experience}, Depends on this information please give me 5 Interview question with Answer in Json Format, Give Question and Answer as field in JSON`
        try {
            const result = await model.generateContent(InputPrompt);
            const response = await result.response;
            const text = response.text();
            // Remove any markdown code block syntax and clean the response
            const cleanJson = text.replace(/```json\n?|```/g, '').trim();
            //  const parsedResponse = JSON.parse(cleanJson);

            //  setJsonResp(parsedResponse)

            if (cleanJson) {
                const resp = await db.insert(MockInterview)
                    .values({
                        mockId: myuuid,
                        jsonMockResp: cleanJson,
                        jobDesc: jobDescription,
                        jobPosition: jobPosition,
                        jobExperience: experience.toString(),
                        createdBy: user?.primaryEmailAddress?.emailAddress ?? "",
                        createdAt: moment().format('DD-MM-yyyy')
                    }).returning({ mockId: MockInterview.mockId })
                //console.log("inserted Id", resp);

                setOpenDialog(false);
                router.push('/dashboard/interview/' + resp[0]?.mockId)
            }
            
            else {
                console.log("Error");
            }

            
        } catch (error) {
            console.error("Error calling Gemini API:", error);
        }
        setIsLoading(false)
    }
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
