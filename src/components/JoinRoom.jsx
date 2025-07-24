import React, { useState } from 'react';

const JoinRoom = ({ onJoinRoom, onBack, playerName, avatar }) => {
  const [roomCode, setRoomCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    
    const trimmedCode = roomCode.trim();
    if (!trimmedCode) {
      setError('Please enter a room code');
      return;
    }

    if (trimmedCode.length !== 6) {
      setError('Room code must be exactly 6 characters');
      return;
    }

    setIsJoining(true);
    setError('');
    
    try {
      await onJoinRoom(trimmedCode.toUpperCase());
    } catch (error) {
      setError(error.message || 'Failed to join room. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleRoomCodeChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 6) {
      setRoomCode(value);
      setError('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 left-1/2 w-32 h-32 bg-green-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-lg mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="heading-font text-5xl md:text-6xl mb-4 game-title animate-float">
            🚪 Join Room
          </h1>
          <p className="subheading-font text-xl text-gray-300 mb-2 animate-float" style={{ animationDelay: '0.5s' }}>
            Enter the battle arena!
          </p>
          <p className="body-font text-gray-400 animate-float" style={{ animationDelay: '1s' }}>
            Get the 6-digit room code from your host and let's get started
          </p>
        </div>

        {/* Join Form */}
        <form onSubmit={handleJoinRoom} className="card space-y-6">
          <div className="text-center mb-4">
            <h2 className="heading-font text-2xl mb-2 game-title">
              🎮 Ready to Battle?
            </h2>
          </div>

          {/* Room Code Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 subheading-font">
              Room Code
            </label>
            <div className="relative">
              <input
                type="text"
                value={roomCode}
                onChange={handleRoomCodeChange}
                className="input-field w-full text-center text-2xl tracking-widest font-mono uppercase"
                placeholder="ABC123"
                maxLength={6}
                autoComplete="off"
                style={{
                  letterSpacing: '0.3em',
                }}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <span className="text-sm">{roomCode.length}/6</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center">
              Enter the 6-digit room code (letters and numbers only)
            </p>
          </div>

          {/* Player Info Display */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 subheading-font">
              Playing as
            </label>
            <div className="game-room-card">
              <div className="flex items-center gap-4 justify-center">
                <div className="text-3xl">{avatar}</div>
                <div className="text-white font-semibold subheading-font text-xl">{playerName}</div>
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <div className="game-room-card text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="text-4xl animate-bounce">{avatar}</div>
              <div className="space-y-1">
                <div className="text-white font-semibold subheading-font">
                  {playerName || 'Your Name'}
                </div>
                <div className="text-gray-400 body-font">
                  {roomCode ? `Joining room: ${roomCode}` : 'Enter room code above'}
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border-2 border-red-500/50 rounded-lg p-4 animate-float">
              <div className="flex items-center gap-3">
                <span className="text-red-400 text-2xl">⚠️</span>
                <span className="text-red-400 font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="btn-outline flex-1 group"
            >
              <span className="mr-2 group-hover:animate-bounce">👈</span>
              Back to Home
            </button>
            <button
              type="submit"
              disabled={!roomCode.trim() || isJoining}
              className={`btn-primary flex-1 group ${
                !roomCode.trim() || isJoining
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              {isJoining ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="game-spinner"></div>
                  <span>Joining...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span className="group-hover:animate-bounce">🚀</span>
                  <span>Join Battle</span>
                </div>
              )}
            </button>
          </div>
        </form>

        {/* Help Section */}
        <div className="mt-8 game-room-card">
          <h3 className="subheading-font text-lg text-white mb-3 text-center">
            💡 Need Help?
          </h3>
          <ul className="body-font text-sm text-gray-300 space-y-2">
            <li className="flex items-start gap-3">
              <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
              <span>Ask your host for the 6-digit room code</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
              <span>Room codes contain letters and numbers only</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
              <span>Make sure your name and avatar represent your epic personality</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
              <span>Get ready to unleash your meme mastery</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="fun-font text-gray-400">
            Ready to show off your meme skills? Let's join the battle! 🎉
          </p>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;