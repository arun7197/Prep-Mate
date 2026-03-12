import React from 'react';
import { Monitor, Smartphone } from 'lucide-react';

const MobileRestriction = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white p-6 text-center md:hidden">
      <div className="mb-6 rounded-full bg-blue-50 p-6">
        <Monitor className="h-12 w-12 text-blue-600" />
      </div>
      
      <h2 className="mb-3 text-2xl font-bold text-gray-900">
        Best Experienced on Desktop
      </h2>
      
      <p className="max-w-xs text-gray-600 leading-relaxed">
        To provide you with the most realistic mock interview experience, including full camera and microphone integration, PrepMate is currently optimized for larger screens.
      </p>
      
      <div className="mt-8 flex items-center gap-2 text-sm font-medium text-blue-600">
        <Smartphone className="h-4 w-4" />
        <span>Please switch to a laptop or PC</span>
      </div>
      
      <div className="mt-12 text-xs text-gray-400">
        See you on the big screen!
      </div>
    </div>
  );
};

export default MobileRestriction;