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
      <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4 animate-fade-in">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-purple/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-green/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary-blue/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="card max-w-md w-full relative z-10">
          <div className="text-center mb-6">
            <h2 className="heading-font text-3xl text-white mb-2">
              🎮 <span className="text-gradient-primary">Create Room</span>
            </h2>
            <p className="subheading-font text-neutral-gray-300">
              Set up your game and invite friends to join the fun!
            </p>
          </div>
          
          <form onSubmit={handleCreateRoom} className="space-y-5">
            <div className="form-group">
              <label className="block text-sm font-medium mb-2">Your Name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="input-field"
                placeholder="Enter your name"
                maxLength={20}
                required
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-2">Choose Your Avatar</label>
              <div className="grid grid-cols-5 gap-3">
                {avatarOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setAvatar(emoji)}
                    className={`p-3 text-2xl rounded-xl border-2 transition-all duration-300 interactive-feedback ${
                      avatar === emoji
                        ? 'border-primary-purple bg-primary-purple/20 shadow-glow-purple transform scale-110'
                        : 'border-neutral-gray-600 hover:border-neutral-gray-500 hover:bg-white/5 hover:scale-105'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-2">Max Players</label>
              <select
                value={settings.maxPlayers}
                onChange={(e) => setSettings(prev => ({ ...prev, maxPlayers: parseInt(e.target.value) }))}
                className="input-field"
              >
                {[...Array(19)].map((_, i) => (
                  <option key={i + 2} value={i + 2}>{i + 2} players</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-2">Number of Rounds</label>
              <select
                value={settings.rounds}
                onChange={(e) => setSettings(prev => ({ ...prev, rounds: parseInt(e.target.value) }))}
                className="input-field"
              >
                {[...Array(20)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1} rounds</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-2">Caption Timer (seconds)</label>
              <select
                value={settings.captionTimer}
                onChange={(e) => setSettings(prev => ({ ...prev, captionTimer: parseInt(e.target.value) }))}
                className="input-field"
              >
                {[15, 30, 45, 60, 90, 120].map((seconds) => (
                  <option key={seconds} value={seconds}>{seconds} seconds</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn-outline flex-1"
              >
                ← Back
              </button>
              <button type="submit" className="btn-primary flex-1">
                🚀 Create Room
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (showJoinForm) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4 animate-fade-in">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-green/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-purple/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary-blue/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.5s' }}></div>
        </div>

        <div className="card max-w-md w-full relative z-10">
          <div className="text-center mb-6">
            <h2 className="heading-font text-3xl text-white mb-2">
              🚪 <span className="text-gradient-success">Join Room</span>
            </h2>
            <p className="subheading-font text-neutral-gray-300">
              Enter your details to join the meme battle!
            </p>
          </div>
          
          <form onSubmit={handleJoinRoom} className="space-y-5">
            <div className="form-group">
              <label className="block text-sm font-medium mb-2">Your Name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="input-field"
                placeholder="Enter your name"
                maxLength={20}
                required
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-2">Choose Your Avatar</label>
              <div className="grid grid-cols-5 gap-3">
                {avatarOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setAvatar(emoji)}
                    className={`p-3 text-2xl rounded-xl border-2 transition-all duration-300 interactive-feedback ${
                      avatar === emoji
                        ? 'border-accent-green bg-accent-green/20 shadow-glow-green transform scale-110'
                        : 'border-neutral-gray-600 hover:border-neutral-gray-500 hover:bg-white/5 hover:scale-105'
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
                onClick={() => setShowJoinForm(false)}
                className="btn-outline flex-1"
              >
                ← Back
              </button>
              <button type="submit" className="btn-secondary flex-1">
                🎯 Continue to Join
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4 animate-fade-in">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-purple/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-green/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary-blue/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-20 left-20 w-40 h-40 bg-accent-orange/15 rounded-full blur-2xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-primary-purple/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="text-center max-w-4xl relative z-10">
        {/* Enhanced main title */}
        <div className="mb-8">
          <h1 className="heading-font text-6xl md:text-8xl font-bold mb-4 relative">
            <span className="text-white drop-shadow-2xl">🎭</span>
            <span className="text-gradient-primary ml-4 drop-shadow-lg">Memelord</span>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-primary rounded-full opacity-50"></div>
          </h1>
          <p className="subheading-font text-xl md:text-2xl text-neutral-gray-300 mb-2 leading-relaxed">
            Put your humor to the test by captioning popular memes with your team
          </p>
          <p className="body-font text-lg text-accent-green font-medium">
            Jokes no bar! So, are you something of a <span className="text-gradient-success font-bold">Memelord</span> yourself?
          </p>
        </div>
        
        {/* Enhanced action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary btn-xl group"
          >
            🚀 <span>Create Room</span>
            <div className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</div>
          </button>
          <button
            onClick={() => setShowJoinForm(true)}
            className="btn-secondary btn-xl group"
          >
            🎯 <span>Join Room</span>
            <div className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</div>
          </button>
        </div>

        {/* Enhanced feature highlights */}
        <div className="card card-compact max-w-2xl mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-6 text-neutral-gray-300">
            <div className="flex items-center gap-2 badge badge-primary">
              <span className="text-lg">🎯</span>
              <span className="font-medium">Caption Memes</span>
            </div>
            <div className="flex items-center gap-2 badge badge-success">
              <span className="text-lg">🗳️</span>
              <span className="font-medium">Vote for Favorites</span>
            </div>
            <div className="flex items-center gap-2 badge badge-warning">
              <span className="text-lg">🏆</span>
              <span className="font-medium">Become the Memelord</span>
            </div>
          </div>
        </div>

        {/* Game stats preview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="card card-compact text-center">
            <div className="text-2xl mb-2">👥</div>
            <div className="heading-font text-lg text-white">Multiplayer</div>
            <div className="body-font text-sm text-neutral-gray-400">Up to 20 players</div>
          </div>
          <div className="card card-compact text-center">
            <div className="text-2xl mb-2">⚡</div>
            <div className="heading-font text-lg text-white">Real-time</div>
            <div className="body-font text-sm text-neutral-gray-400">Live voting & updates</div>
          </div>
          <div className="card card-compact text-center">
            <div className="text-2xl mb-2">🎨</div>
            <div className="heading-font text-lg text-white">Creative</div>
            <div className="body-font text-sm text-neutral-gray-400">Unlimited humor</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;