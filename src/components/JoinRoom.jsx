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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 animate-fadeIn">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="heading-font text-4xl md:text-6xl text-white mb-4">
            🚪 <span className="bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">Join Room</span>
          </h1>
          <p className="subheading-font text-xl text-gray-300 mb-2">
            Enter a room code to join the fun!
          </p>
          <p className="body-font text-gray-400">
            Get the 6-digit room code from your host and let&apos;s get started
          </p>
        </div>

        {/* Join Form */}
        <div className="max-w-lg mx-auto">
          <form onSubmit={handleJoinRoom} className="card space-y-6">
            <h2 className="heading-font text-2xl text-white text-center mb-4">
              🎮 Join the Battle
            </h2>

            {/* Room Code Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Room Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={roomCode}
                  onChange={handleRoomCodeChange}
                  className="input-field w-full text-center text-2xl tracking-widest font-mono"
                  placeholder="ABC123"
                  maxLength={6}
                  autoComplete="off"
                  style={{
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase'
                  }}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <span className="text-sm">{roomCode.length}/6</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Enter the 6-digit room code (letters and numbers only)
              </p>
            </div>

            {/* Player Info Display */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Playing as
              </label>
              <div className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="text-2xl">{avatar}</div>
                <div className="text-white font-medium">{playerName}</div>
              </div>
            </div>

            {/* Preview */}
            <div className="text-center p-4 bg-gradient-to-r from-purple-500/10 to-green-500/10 rounded-lg border border-purple-500/20">
              <div className="text-2xl mb-2">{avatar}</div>
              <div className="text-white font-medium">
                {playerName || 'Your Name'}
              </div>
              <div className="text-gray-400 text-sm">
                {roomCode ? `Joining room: ${roomCode}` : 'Enter room code above'}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <span className="text-red-400">⚠️</span>
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={onBack}
                className="btn-outline flex-1 hover:scale-105 active:scale-95"
              >
                <span className="mr-2">👈</span>
                Back
              </button>
              <button
                type="submit"
                disabled={!roomCode.trim() || isJoining}
                className={`btn-primary flex-1 ${
                  !roomCode.trim() || isJoining
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:scale-105 active:scale-95'
                }`}
              >
                {isJoining ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Joining...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>🚀</span>
                    <span>Join Room</span>
                  </div>
                )}
              </button>
            </div>
          </form>

          {/* Help Section */}
          <div className="mt-8 card bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <h3 className="subheading-font text-lg text-white mb-3">
              💡 Need help?
            </h3>
            <ul className="body-font text-sm text-gray-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Ask your host for the 6-digit room code</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Room codes contain letters and numbers only</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Choose a fun avatar that represents your personality</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Make sure your name is unique and memorable</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="body-font text-gray-400 text-sm">
            Ready to show off your meme skills? Let&apos;s join the battle! 🎉
          </p>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;