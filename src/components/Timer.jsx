import React from 'react';

const Timer = ({ seconds }) => {
  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getColorClass = () => {
    if (seconds <= 10) return 'text-red-400 animate-pulse';
    if (seconds <= 30) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getEmoji = () => {
    if (seconds <= 5) return '🚨';
    if (seconds <= 10) return '⏰';
    if (seconds <= 30) return '⏳';
    return '⏱️';
  };

  return (
    <div className={`text-2xl font-mono font-bold ${getColorClass()} flex items-center gap-2`}>
      <span className="text-3xl">{getEmoji()}</span>
      <span>{formatTime(seconds)}</span>
    </div>
  );
};

export default Timer;