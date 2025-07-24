import React, { useEffect, useState } from 'react';

const Timer = ({ seconds, onTick, className = '' }) => {
  const [displaySeconds, setDisplaySeconds] = useState(seconds);
  const [isUrgent, setIsUrgent] = useState(false);
  const [prevSeconds, setPrevSeconds] = useState(seconds);

  useEffect(() => {
    setDisplaySeconds(seconds);
    setIsUrgent(seconds <= 10 && seconds > 0);
    
    // Trigger tick callback when seconds change
    if (onTick && seconds !== prevSeconds) {
      onTick(seconds);
    }
    setPrevSeconds(seconds);
  }, [seconds, onTick, prevSeconds]);

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : secs.toString();
  };

  const getTimerColor = () => {
    if (displaySeconds <= 5) return 'text-red-400';
    if (displaySeconds <= 10) return 'text-orange-400';
    return 'text-white';
  };

  const getProgressPercentage = (total = 45) => {
    return Math.max(0, Math.min(100, (displaySeconds / total) * 100));
  };

  return (
    <div className={`timer-container ${isUrgent ? 'urgent' : ''} ${className}`}>
      {/* Circular Progress Ring */}
      <svg 
        className="absolute inset-0 w-full h-full -rotate-90" 
        viewBox="0 0 100 100"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="4"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={isUrgent ? 'var(--secondary-pink)' : 'var(--primary-purple)'}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 40}`}
          strokeDashoffset={`${2 * Math.PI * 40 * (1 - getProgressPercentage() / 100)}`}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      {/* Timer Text */}
      <div className="timer-text">
        {formatTime(displaySeconds)}
      </div>
      
      {/* Urgency indicators */}
      {isUrgent && displaySeconds <= 5 && (
        <div className="absolute -top-1 -right-1 text-red-400 animate-bounce text-xs">
          ⚠️
        </div>
      )}
    </div>
  );
};

export default Timer;