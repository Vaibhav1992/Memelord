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
    if (displaySeconds <= 5) return 'text-accent-red';
    if (displaySeconds <= 10) return 'text-accent-orange';
    return 'text-neutral-white';
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
          r="45"
          fill="none"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="4"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={isUrgent ? '#EF4444' : '#8A2BE2'}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 45}`}
          strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgressPercentage() / 100)}`}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: isUrgent ? 'drop-shadow(0 0 8px #EF4444)' : 'drop-shadow(0 0 8px #8A2BE2)'
          }}
        />
      </svg>
      
      {/* Timer Text */}
      <div className={`relative z-10 font-bold text-lg ${getTimerColor()}`}>
        {formatTime(displaySeconds)}
      </div>
      
      {/* Urgency indicators */}
      {isUrgent && (
        <>
          {/* Pulsing glow effect */}
          <div className="absolute inset-0 rounded-full bg-red-500 opacity-20 animate-ping"></div>
          
          {/* Warning icon for last 5 seconds */}
          {displaySeconds <= 5 && (
            <div className="absolute -top-1 -right-1 text-red-400 animate-bounce text-sm">
              ⚠️
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Timer;