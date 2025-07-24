"use client"
import { Button } from '@/components/ui/button';
import { UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function Home() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="backdrop-blur-md bg-white/70 dark:bg-slate-900/70 sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href={"/"}>
            <Image src="/logo.svg" alt="PrepMate Logo" width={140} height={40} className="w-auto h-8" />
            </Link>
            
            <nav className="flex items-center space-x-4">
              <Link href="/" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition">Home</Link>
              <Link href="/dashboard">
                <Button variant="ghost" className="hover:bg-slate-100 dark:hover:bg-slate-800">Dashboard</Button>
              </Link>
              {isSignedIn ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <Link href="/sign-up">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Sign Up</Button>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
              Prepare for Your Next Interview with <span className="text-blue-600">PrepMate</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
              Practice mock interviews, get AI feedback, and land your dream job.
            </p>
            {isSignedIn ?
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                Get Started Free
              </Button>
            </Link>
            :
            <Link href="/sign-up">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                Get Started Free
              </Button>
            </Link>
            }
            
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Why Choose PrepMate?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Mock Interviews</h3>
              <p className="text-slate-600 dark:text-slate-300">Simulate real interviews with AI-generated questions tailored to your industry.</p>
            </div>
            <div className="group p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">AI Feedback</h3>
              <p className="text-slate-600 dark:text-slate-300">Receive instant, detailed feedback to improve your interview performance.</p>
            </div>
            <div className="group p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Progress Tracking</h3>
              <p className="text-slate-600 dark:text-slate-300">Monitor your growth with comprehensive analytics and insights.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2023 PrepMate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;