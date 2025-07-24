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
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-green-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="card max-w-md w-full relative z-10">
          <div className="text-center mb-6">
            <h2 className="heading-font text-3xl mb-2 game-title">🎮 Create Room</h2>
            <p className="text-gray-300 subheading-font">Set up your meme battle arena!</p>
          </div>
          
          <form onSubmit={handleCreateRoom} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300 subheading-font">Your Name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="input-field w-full"
                placeholder="Enter your epic name"
                maxLength={20}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300 subheading-font">Choose Avatar</label>
              <div className="avatar-grid">
                {avatarOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setAvatar(emoji)}
                    className={`avatar-button ${avatar === emoji ? 'selected' : ''}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300 subheading-font">Players</label>
                <select
                  value={settings.maxPlayers}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxPlayers: parseInt(e.target.value) }))}
                  className="input-field w-full"
                >
                  {[...Array(19)].map((_, i) => (
                    <option key={i + 2} value={i + 2}>{i + 2}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300 subheading-font">Rounds</label>
                <select
                  value={settings.rounds}
                  onChange={(e) => setSettings(prev => ({ ...prev, rounds: parseInt(e.target.value) }))}
                  className="input-field w-full"
                >
                  {[...Array(20)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300 subheading-font">Timer</label>
                <select
                  value={settings.captionTimer}
                  onChange={(e) => setSettings(prev => ({ ...prev, captionTimer: parseInt(e.target.value) }))}
                  className="input-field w-full"
                >
                  {[15, 30, 45, 60, 90, 120].map((seconds) => (
                    <option key={seconds} value={seconds}>{seconds}s</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn-outline flex-1"
              >
                <span className="mr-2">👈</span>
                Back
              </button>
              <button type="submit" className="btn-primary flex-1">
                <span className="mr-2">🚀</span>
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (showJoinForm) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-32 h-32 bg-green-500/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-20 left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="card max-w-md w-full relative z-10">
          <div className="text-center mb-6">
            <h2 className="heading-font text-3xl mb-2 game-title">🚪 Join Battle</h2>
            <p className="text-gray-300 subheading-font">Ready to show your meme skills?</p>
          </div>
          
          <form onSubmit={handleJoinRoom} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300 subheading-font">Your Name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="input-field w-full"
                placeholder="Enter your warrior name"
                maxLength={20}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300 subheading-font">Choose Avatar</label>
              <div className="avatar-grid">
                {avatarOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setAvatar(emoji)}
                    className={`avatar-button ${avatar === emoji ? 'selected' : ''}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowJoinForm(false)}
                className="btn-outline flex-1"
              >
                <span className="mr-2">👈</span>
                Back
              </button>
              <button type="submit" className="btn-secondary flex-1">
                <span className="mr-2">⚔️</span>
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-game-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-game-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-game-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="text-center max-w-4xl relative z-10">
        {/* Enhanced Game Title */}
        <div className="mb-8">
          <h1 className="heading-font text-7xl md:text-8xl lg:text-9xl mb-6 game-title animate-float">
            🎭 Memelord
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-green-500 mx-auto rounded-full animate-color-shift"></div>
        </div>
        
        {/* Game Description */}
        <div className="mb-12 space-y-4">
          <p className="text-2xl md:text-3xl text-gray-300 subheading-font animate-float" style={{ animationDelay: '0.5s' }}>
            The Ultimate Meme Caption Battle Arena
          </p>
          <p className="text-lg text-gray-400 body-font max-w-2xl mx-auto leading-relaxed animate-float" style={{ animationDelay: '1s' }}>
            Put your humor to the test by captioning popular memes with your friends. 
            Vote for the funniest captions and crown the ultimate Memelord! 
            <span className="fun-font text-purple-400">Ready to make everyone laugh?</span>
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12 animate-float" style={{ animationDelay: '1.5s' }}>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary text-xl px-8 py-4 group"
          >
            <span className="mr-3 text-2xl group-hover:animate-bounce">🎮</span>
            Create Room
          </button>
          <button
            onClick={() => setShowJoinForm(true)}
            className="btn-secondary text-xl px-8 py-4 group"
          >
            <span className="mr-3 text-2xl group-hover:animate-bounce">⚔️</span>
            Join Battle
          </button>
        </div>

        {/* Game Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8 animate-float" style={{ animationDelay: '2s' }}>
          <div className="game-room-card text-center group">
            <div className="text-4xl mb-4 group-hover:animate-bounce">🎯</div>
            <h3 className="subheading-font text-xl mb-2 text-purple-400">Caption Memes</h3>
            <p className="text-gray-400 body-font">Write hilarious captions for popular meme templates</p>
          </div>
          <div className="game-room-card text-center group">
            <div className="text-4xl mb-4 group-hover:animate-bounce">🗳️</div>
            <h3 className="subheading-font text-xl mb-2 text-pink-400">Vote & Laugh</h3>
            <p className="text-gray-400 body-font">Vote for the funniest captions from your friends</p>
          </div>
          <div className="game-room-card text-center group">
            <div className="text-4xl mb-4 group-hover:animate-bounce">🏆</div>
            <h3 className="subheading-font text-xl mb-2 text-green-400">Win Glory</h3>
            <p className="text-gray-400 body-font">Become the ultimate Memelord champion</p>
          </div>
        </div>

        {/* Fun Footer */}
        <div className="text-center space-y-2 animate-float" style={{ animationDelay: '2.5s' }}>
          <p className="fun-font text-lg text-purple-400">🎪 Join millions of memers worldwide! 🎪</p>
          <p className="text-sm text-gray-500 body-font">
            Ready to prove you're something of a Memelord yourself?
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;