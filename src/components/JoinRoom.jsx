import React, { useState } from 'react';

const JoinRoom = ({ onJoinRoom, onBack }) => {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [avatar, setAvatar] = useState('😀');
  const [loading, setLoading] = useState(false);

  const avatarOptions = ['😀', '😎', '🤓', '😂', '🤔', '😴', '🤖', '👻', '🔥', '💯'];

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    
    if (!roomCode.trim() || !playerName.trim()) {
      alert('Please enter both room code and your name');
      return;
    }

    setLoading(true);
    
    try {
      // First get room info to get the actual room ID
      const response = await fetch(`/api/rooms/${roomCode.toUpperCase()}/info`);
      if (!response.ok) {
        throw new Error('Room not found');
      }
      
      const roomInfo = await response.json();
      await onJoinRoom(roomInfo.roomId, playerName.trim(), avatar);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-400">Join Room</h2>
        
        <form onSubmit={handleJoinRoom} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Room Code</label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="input w-full text-center text-2xl font-mono tracking-wider"
              placeholder="ABC123"
              maxLength={6}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Your Name</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="input w-full"
              placeholder="Enter your name"
              maxLength={20}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Avatar</label>
            <div className="grid grid-cols-5 gap-2">
              {avatarOptions.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setAvatar(emoji)}
                  className={`p-2 text-2xl rounded-lg border-2 transition-colors ${
                    avatar === emoji
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Back
            </button>
            <button 
              type="submit" 
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading ? 'Joining...' : 'Join Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinRoom;