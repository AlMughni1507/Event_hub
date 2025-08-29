import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState('Initializing...');

  const loadingSteps = [
    { text: 'Initializing...', duration: 800 },
    { text: 'Loading components...', duration: 600 },
    { text: 'Connecting to server...', duration: 700 },
    { text: 'Preparing your experience...', duration: 500 },
    { text: 'Almost ready...', duration: 400 }
  ];

  useEffect(() => {
    let currentStep = 0;
    let currentProgress = 0;
    
    const updateProgress = () => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];
        setCurrentText(step.text);
        
        const stepProgress = 100 / loadingSteps.length;
        const targetProgress = (currentStep + 1) * stepProgress;
        
        const progressInterval = setInterval(() => {
          currentProgress += 2;
          setProgress(Math.min(currentProgress, targetProgress));
          
          if (currentProgress >= targetProgress) {
            clearInterval(progressInterval);
            currentStep++;
            
            if (currentStep < loadingSteps.length) {
              setTimeout(updateProgress, 100);
            } else {
              setTimeout(() => {
                onComplete();
              }, 500);
            }
          }
        }, step.duration / (stepProgress / 2));
      }
    };

    updateProgress();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-space flex items-center justify-center z-50">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '3s'}}></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent-violet/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-teal/8 rounded-full blur-3xl animate-spin" style={{animationDuration: '20s'}}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
      <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-accent-cyan/60 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
      <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-accent-violet/50 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-accent-teal/60 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>

      {/* Main loading content */}
      <div className="relative z-10 text-center max-w-md mx-auto px-8">
        {/* Logo */}
        <div className="mb-8 animate-pulse">
          <div className="w-20 h-20 mx-auto bg-gradient-nebula rounded-2xl flex items-center justify-center mb-4 animate-spin" style={{animationDuration: '3s'}}>
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">EventHub</h1>
          <p className="text-cyan-200 text-sm">Your Gateway to Amazing Events</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-white/10 rounded-full h-2 backdrop-blur-sm border border-white/20">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-violet-400 h-2 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-cyan-200 mt-2">
            <span>0%</span>
            <span className="font-medium">{Math.round(progress)}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <p className="text-white text-lg font-medium mb-2 animate-pulse">
            {currentText}
          </p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>

        {/* Cosmic elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 border border-cyan-400/20 rounded-full animate-spin" style={{animationDuration: '8s'}}></div>
        <div className="absolute -bottom-10 -right-10 w-16 h-16 border border-violet-400/20 rounded-full animate-spin" style={{animationDuration: '6s', animationDirection: 'reverse'}}></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
