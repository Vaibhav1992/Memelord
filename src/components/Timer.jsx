import React from 'react';

const Timer = ({ seconds }) => {
  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getColorClass = () => {
    if (seconds <= 10) return 'text-red-400';
    if (seconds <= 30) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className={`text-2xl font-mono font-bold ${getColorClass()}`}>
      {formatTime(seconds)}
    </div>
  );
};

export default Timer;