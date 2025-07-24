import React, { useState } from 'react';

const HomePage = ({ onCreateRoom, onJoinRoom }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [avatar, setAvatar] = useState('😀');
  const [settings, setSettings] = useState({
    maxPlayers: 8,
    rounds: 10,
    captionTimer: 45
  });

  const avatarOptions = ['😀', '😎', '🤓', '😂', '🤔', '😴', '🤖', '👻', '🔥', '💯'];

  const handleCreateRoom = (e) => {
    e.preventDefault();
    const trimmedName = playerName.trim();
    if (!trimmedName) {
      alert('Please enter your name');
      return;
    }
    if (trimmedName.length < 2) {
      alert('Name must be at least 2 characters long');
      return;
    }
    onCreateRoom(settings, trimmedName, avatar);
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    const trimmedName = playerName.trim();
    if (!trimmedName) {
      alert('Please enter your name');
      return;
    }
    if (trimmedName.length < 2) {
      alert('Name must be at least 2 characters long');
      return;
    }
    onJoinRoom(trimmedName, avatar);
  };

  if (showCreateForm) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-center text-purple-400">Create Room</h2>
          
          <form onSubmit={handleCreateRoom} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2">Your Name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="input-field w-full"
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

            <div>
              <label className="block text-sm font-medium mb-2">Max Players</label>
              <select
                value={settings.maxPlayers}
                onChange={(e) => setSettings(prev => ({ ...prev, maxPlayers: parseInt(e.target.value) }))}
                className="input-field w-full"
              >
                {[...Array(19)].map((_, i) => (
                  <option key={i + 2} value={i + 2}>{i + 2} players</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Number of Rounds</label>
              <select
                value={settings.rounds}
                onChange={(e) => setSettings(prev => ({ ...prev, rounds: parseInt(e.target.value) }))}
                className="input-field w-full"
              >
                {[...Array(20)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1} rounds</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Caption Timer (seconds)</label>
              <select
                value={settings.captionTimer}
                onChange={(e) => setSettings(prev => ({ ...prev, captionTimer: parseInt(e.target.value) }))}
                className="input-field w-full"
              >
                {[15, 30, 45, 60, 90, 120].map((seconds) => (
                  <option key={seconds} value={seconds}>{seconds} seconds</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn-secondary flex-1"
              >
                Back
              </button>
              <button type="submit" className="btn-primary flex-1">
                Create Room
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (showJoinForm) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-center text-purple-400">Join Room</h2>
          
          <form onSubmit={handleJoinRoom} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2">Your Name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="input-field w-full"
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

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowJoinForm(false)}
                className="btn-secondary flex-1"
              >
                Back
              </button>
              <button type="submit" className="btn-primary flex-1">
                Continue to Join
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Memelord
        </h1>
        <p className="text-xl text-gray-300 mb-6">
          Put your humor to the test by captioning popular memes with your team. 
          Jokes no bar! So, are you something of a Memelord yourself?
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary text-lg px-6 py-2"
          >
            Create Room
          </button>
          <button
            onClick={() => setShowJoinForm(true)}
            className="btn-secondary text-lg px-6 py-2"
          >
            Join Room
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-400">
          <p>🎯 Caption memes • 🗳️ Vote for favorites • 🏆 Become the Memelord</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;