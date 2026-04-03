"use client";

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Webcam from 'react-webcam';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import moment from 'moment';
import { useUser } from '@clerk/nextjs';

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

const RecordAnswerSection = ({ interviewQuestion, activeIndex, interviewData, onLoadingChange }: QuestionsSectionProps) => {
  const { user } = useUser();
  const [userAnswer, setUserAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastProcessedIndex, setLastProcessedIndex] = useState(0);

  // Tracks whether the USER intends to be recording (vs browser auto-stopping)
  const isUserRecordingRef = useRef(false);
  // Stable ref to userAnswer so async effects always see latest value
  const userAnswerRef = useRef('');

  useEffect(() => {
    userAnswerRef.current = userAnswer;
  }, [userAnswer]);

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  const {
    isRecording,
    results,
    setResults,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  // Accumulate transcript results
  useEffect(() => {
    if (results.length > lastProcessedIndex) {
      const newResults = results.slice(lastProcessedIndex);
      newResults.forEach((result) => {
        if (typeof result !== 'string') {
          setUserAnswer((prev) => prev + result.transcript + ' ');
        }
      });
      setLastProcessedIndex(results.length);
    }
  }, [results, lastProcessedIndex]);

  // Core fix: detect when browser auto-stops (isRecording flips false while user still intended to record)
  useEffect(() => {
    if (!isRecording && isUserRecordingRef.current) {
      // Mobile browser killed the session — restart it automatically
      // Small delay to let the browser reset its internal state
      const timer = setTimeout(() => {
        if (isUserRecordingRef.current) {
          startSpeechToText();
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isRecording]);

  const handleRecordingToggle = () => {
    if (isUserRecordingRef.current) {
      // User manually stopping
      isUserRecordingRef.current = false;
      stopSpeechToText();

      // Use ref to get latest answer since state may lag
      const currentAnswer = userAnswerRef.current.trim();
      if (currentAnswer.length < 10) {
        toast('Answer is too short. Please try again.');
        setUserAnswer('');
        setResults([]);
        setLastProcessedIndex(0);
        return;
      }
      saveUserAnswer(currentAnswer);
    } else {
      // User starting
      isUserRecordingRef.current = true;
      setUserAnswer('');
      userAnswerRef.current = '';
      setResults([]);
      setLastProcessedIndex(0);
      startSpeechToText();
    }
  };

  const generateFeedbackPrompt = (answer: string) => {
    return `Question: ${interviewQuestion[activeIndex]?.text}, User Answer: ${answer}. Based on this, provide a rating out of 5 and short feedback (3-5 lines) for improvement in JSON format with fields 'rating' and 'feedback'.`;
  };

  // Now accepts answer as a parameter — no longer relies on stale state
  const saveUserAnswer = async (answer: string) => {
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const result = await model.generateContent(generateFeedbackPrompt(answer));
      const rawText = await result.response.text();
      const cleanJson = rawText.replace(/```json\n?|```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      const response = await db.insert(UserAnswer).values({
        mockIdRef: interviewData.mockId,
        question: interviewQuestion[activeIndex]?.text,
        correctAns: interviewQuestion[activeIndex]?.answer,
        userAns: answer,
        feedback: parsed.feedback,
        rating: parsed.rating,
        createdAt: moment().format('DD-MM-yyyy'),
        userEmail: user?.primaryEmailAddress?.emailAddress ?? '',
      });

      if (response) {
        toast.success('Answer saved successfully.');
        setUserAnswer('');
        userAnswerRef.current = '';
        setResults([]);
        setLastProcessedIndex(0);
      }
    } catch (error) {
      console.error('Error saving answer:', error);
      toast.error('Failed to save answer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Derive display state from ref + isRecording
  const showAsRecording = isUserRecordingRef.current;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col justify-center items-center my-20 rounded-lg p-5 relative">
        <Image src="/webcam.jpg" alt="webcam logo" width={200} height={200} className="absolute" />
        <Webcam mirrored style={{ height: 300, width: '100%', zIndex: 10 }} />
      </div>

      <Button
        disabled={isLoading}
        onClick={handleRecordingToggle}
        className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
          showAsRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'
        }`}
      >
        <Mic className={`h-5 w-5 ${showAsRecording ? 'animate-pulse' : ''}`} />
        {isLoading ? 'Saving...' : showAsRecording ? 'Stop Recording' : 'Record Answer'}
      </Button>

      {userAnswer && showAsRecording && (
        <p className="mt-3 text-sm text-muted-foreground text-center px-4">
          {userAnswer}
        </p>
      )}
    </div>
  );
};

export default RecordAnswerSection;