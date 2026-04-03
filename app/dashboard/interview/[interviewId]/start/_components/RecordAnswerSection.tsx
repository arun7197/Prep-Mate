"use client";
/// <reference types="dom-speech-recognition" />

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Webcam from 'react-webcam';
import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import moment from 'moment';
import { useUser } from '@clerk/nextjs';

// Speech API Types
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// Types
interface Question {
  id: number;
  text: string;
  answer: string;
}

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

interface QuestionsSectionProps {
  interviewQuestion: Question[];
  activeIndex: number;
  interviewData: InterviewData;
  onLoadingChange?: (loading: boolean) => void;
}

type AIResponse = {
  rating: number;
  feedback: string;
};

const RecordAnswerSection = ({
  interviewQuestion,
  activeIndex,
  interviewData,
  onLoadingChange,
}: QuestionsSectionProps) => {
  const { user } = useUser();

  const [userAnswer, setUserAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUserRecording, setIsUserRecording] = useState(false);

  const isUserRecordingRef = useRef(false);
  const userAnswerRef = useRef('');
  const isSavingRef = useRef(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const setRecordingState = (val: boolean) => {
    isUserRecordingRef.current = val;
    setIsUserRecording(val);
  };

  useEffect(() => {
    userAnswerRef.current = userAnswer;
  }, [userAnswer]);

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  const resetAnswer = () => {
    setUserAnswer('');
    userAnswerRef.current = '';
  };

  const startRecording = () => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      toast.error('Speech recognition is not supported on this browser.');
      return;
    }

    const recognition = new SpeechRecognitionAPI();

    recognition.continuous = true; // 🔥 FIX
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript + ' ';
        }
      }

      if (transcript) {
        setUserAnswer((prev) => prev + transcript);
        userAnswerRef.current += transcript;
      }

      console.log("User speaking...");
    };

    // 🔥 FIX: Auto-restart instead of stopping
    recognition.onend = () => {
      if (isUserRecordingRef.current) {
        try {
          recognition.start();
        } catch (err) {
          console.log("Restart error:", err);
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'no-speech') return;

      console.error('Speech recognition error:', event.error);
      toast.error('Recording error. Please try again.');

      setRecordingState(false);
      resetAnswer();
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleRecordingToggle = () => {
    if (isUserRecordingRef.current) {
      // STOP
      setRecordingState(false);
      recognitionRef.current?.stop();

      const answer = userAnswerRef.current.trim();

      if (answer.length < 10) {
        toast('Answer is too short. Please try again.');
        resetAnswer();
        return;
      }

      saveUserAnswer(answer);
    } else {
      // START
      isSavingRef.current = false;
      resetAnswer();
      setRecordingState(true);
      startRecording();
    }
  };

  const generateFeedbackPrompt = (answer: string) => {
    return `Question: ${interviewQuestion[activeIndex]?.text}, User Answer: ${answer}. Based on this, provide a rating out of 5 and short feedback (3-5 lines) for improvement in JSON format with fields 'rating' and 'feedback'.`;
  };

  const saveUserAnswer = async (answer: string) => {
    if (isSavingRef.current) return;

    isSavingRef.current = true;
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(
        process.env.NEXT_PUBLIC_GEMINI_API_KEY as string
      );

      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
      });

      const result = await model.generateContent(
        generateFeedbackPrompt(answer)
      );

      const rawText = await result.response.text();
      const cleanJson = rawText.replace(/```json\n?|```/g, '').trim();

      const parsed: AIResponse = JSON.parse(cleanJson);

      if (!parsed.rating || !parsed.feedback) {
        throw new Error('Invalid AI response');
      }

      const response = await db.insert(UserAnswer).values({
  mockIdRef: String(interviewData.mockId), // ✅ ensure string
  question: interviewQuestion[activeIndex]?.text ?? '',
  correctAns: interviewQuestion[activeIndex]?.answer ?? '',
  userAns: answer,
  feedback: parsed.feedback,
  rating: String(parsed.rating), // 🔥 FIX HERE
  createdAt: moment().format('DD-MM-yyyy'),
  userEmail: user?.primaryEmailAddress?.emailAddress ?? '',
});

      if (response) {
        toast.success('Answer saved successfully.');
        resetAnswer();
      }
    } catch (error) {
      console.error('Error saving answer:', error);
      toast.error('Failed to save answer.');
    } finally {
      setIsLoading(false);
      isSavingRef.current = false;
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col justify-center items-center my-20 rounded-lg p-5 relative">
        <Image
          src="/webcam.jpg"
          alt="webcam logo"
          width={200}
          height={200}
          className="absolute"
        />
        <Webcam mirrored style={{ height: 300, width: '100%', zIndex: 10 }} />
      </div>

      <Button
        disabled={isLoading}
        onClick={handleRecordingToggle}
        className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
          isUserRecording
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-primary hover:bg-primary/90'
        }`}
      >
        <Mic className={`h-5 w-5 ${isUserRecording ? 'animate-pulse' : ''}`} />
        {isLoading
          ? 'Saving...'
          : isUserRecording
          ? 'Stop Recording'
          : 'Record Answer'}
      </Button>
    </div>
  );
};

export default RecordAnswerSection;