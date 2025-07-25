import React, { useState, useEffect, useCallback } from 'react';
import Timer from './Timer';
import MemeDisplay from './MemeDisplay';
import CaptionInput from './CaptionInput';
import CaptionList from './CaptionList';
import Leaderboard from './Leaderboard';
import GameEndModal from './GameEndModal';
import SoundSystem from './SoundSystem';
import SoundControls from './SoundControls';

const GameRoom = ({ socket, gameState, player, room, onLeaveRoom }) => {
  const [soundTriggers, setSoundTriggers] = useState({
    playVoteSound: 0,
    playWinSound: 0,
    playTimerTick: 0,
    playTransition: 0,
    playHurrySound: 0
  });
  const [previousPhase, setPreviousPhase] = useState(null);
  const [previousTimer, setPreviousTimer] = useState(null);
  const [soundVolume, setSoundVolume] = useState(0.1);
  const [isSoundMuted, setIsSoundMuted] = useState(false);

  // Use players from gameState instead of local state
  const players = gameState.players || [];

  // Memoize the hurry sound function to prevent recreation on every render
  const handleHurrySound = useCallback(() => {
    setSoundTriggers(prev => ({ ...prev, playHurrySound: prev.playHurrySound + 1 }));
  }, []);

  // Handle sound triggers
  useEffect(() => {
    // Phase transition sound
    if (previousPhase && previousPhase !== gameState.phase) {
      setSoundTriggers(prev => ({ ...prev, playTransition: prev.playTransition + 1 }));
    }
    setPreviousPhase(gameState.phase);
  }, [gameState.phase, previousPhase]);

  useEffect(() => {
    // Timer tick sound
    if (previousTimer && previousTimer !== gameState.timer) {
      setSoundTriggers(prev => ({ ...prev, playTimerTick: prev.playTimerTick + 1 }));
    }
    setPreviousTimer(gameState.timer);
  }, [gameState.timer, previousTimer]);

  // Handle game end with winner sound
  useEffect(() => {
    if (gameState.phase === 'ended' && gameState.winner) {
      setSoundTriggers(prev => ({ ...prev, playWinSound: prev.playWinSound + 1 }));
    }
  }, [gameState.phase, gameState.winner]);

  const handleStartGame = () => {
    socket.emit('start_game');
  };

  const handleSubmitCaption = (text) => {
    socket.emit('submit_caption', { text });
  };

  const handleVote = (captionId) => {
    socket.emit('submit_vote', { captionId });
    // Trigger vote sound
    setSoundTriggers(prev => ({ ...prev, playVoteSound: prev.playVoteSound + 1 }));
  };

  const handleTimerTick = (seconds) => {
    // Timer tick is handled by useEffect above
  };

  if (gameState.phase === 'waiting') {
    const isHost = player.id === room.hostId;
    
    return (
      <div className="min-h-screen bg-gradient-background animate-fade-in relative overflow-hidden">
        {/* Enhanced animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-purple/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-green/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary-blue/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-20 right-1/4 w-32 h-32 bg-accent-orange/15 rounded-full blur-2xl animate-pulse-slow"></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <div className="relative inline-block">
              <h1 className="heading-font text-5xl md:text-7xl text-white mb-6 drop-shadow-2xl">
                🎭 <span className="text-gradient-primary animate-pulse">Memelord</span>
              </h1>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-primary rounded-full opacity-50"></div>
            </div>
            <div className="flex items-center justify-center gap-6 text-lg text-neutral-gray-300 mt-6">
              <div className="badge badge-primary text-base">
                <span className="text-xl">🏠</span>
                <span className="subheading-font font-bold">Room: {room.code}</span>
              </div>
              <div className="badge badge-success text-base">
                <span className="text-2xl">👥</span>
                <span className="subheading-font font-bold text-white">{players.length}/{room.settings.maxPlayers} players</span>
              </div>
            </div>
          </div>

          {/* Show different content based on host status */}
          {isHost ? (
            // HOST VIEW - Show game settings and start button
            <>
              {/* Enhanced Game Settings */}
              <div className="max-w-4xl mx-auto mb-12">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                  <h2 className="heading-font text-3xl text-white mb-8 text-center flex items-center justify-center gap-3">
                    <span className="text-4xl">⚙️</span>
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Game Settings</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="group text-center p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🎯</div>
                      <div className="text-gray-300 text-sm font-medium mb-2">Rounds</div>
                      <div className="text-white font-bold text-3xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{room.settings.rounds}</div>
                    </div>
                    <div className="group text-center p-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/30 hover:border-indigo-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">⏱️</div>
                      <div className="text-gray-300 text-sm font-medium mb-2">Caption Timer</div>
                      <div className="text-white font-bold text-3xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{room.settings.captionTimer}s</div>
                    </div>
                    <div className="group text-center p-6 bg-gradient-to-br from-pink-500/20 to-green-500/20 rounded-xl border border-pink-500/30 hover:border-pink-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">👥</div>
                      <div className="text-gray-300 text-sm font-medium mb-2">Max Players</div>
                      <div className="text-white font-bold text-3xl bg-gradient-to-r from-pink-400 to-green-400 bg-clip-text text-transparent">{room.settings.maxPlayers}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Action Buttons - HOST */}
              <div className="text-center space-y-6 mb-12">
                <button
                  onClick={handleStartGame}
                  disabled={players.length < 2}
                  className={`group relative overflow-hidden px-12 py-6 rounded-2xl text-2xl font-bold transition-all duration-300 ${
                    players.length < 2 
                      ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 active:scale-95'
                  }`}
                >
                  <div className="relative z-10 flex items-center justify-center gap-4">
                    {players.length < 2 ? (
                      <>
                        <span className="text-3xl animate-spin">⏳</span>
                        <span>Need at least 2 players to start</span>
                      </>
                    ) : (
                      <>
                        <span className="text-3xl group-hover:scale-110 transition-transform duration-300">🚀</span>
                        <span>Start Game</span>
                      </>
                    )}
                  </div>
                  {players.length >= 2 && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  )}
                </button>
                
                <button
                  onClick={onLeaveRoom}
                  className="group px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-300">👋</span>
                  <span className="font-medium">Leave Room</span>
                </button>
              </div>
            </>
          ) : (
            // PLAYER VIEW - Show waiting message
            <div className="max-w-4xl mx-auto mb-12">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl text-center">
                <div className="text-6xl mb-6 animate-bounce">⏳</div>
                <h2 className="heading-font text-3xl text-white mb-4">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Waiting for Host</span>
                </h2>
                <p className="text-gray-300 text-lg mb-6">
                  The host will start the game when everyone is ready!
                </p>
                <div className="flex items-center justify-center gap-2 text-gray-400 mb-8">
                  <span className="text-2xl">👑</span>
                  <span>Host: {players.find(p => p.id === room.hostId)?.name || 'Unknown'}</span>
                </div>
                
                <button
                  onClick={onLeaveRoom}
                  className="group px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-300">👋</span>
                  <span className="font-medium">Leave Room</span>
                </button>
              </div>
            </div>
          )}

          {/* Enhanced Players List */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
              <h2 className="heading-font text-3xl text-white mb-8 text-center flex items-center justify-center gap-3">
                <span className="text-4xl">👥</span>
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Players in Room</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {players.map((p, index) => (
                  <div 
                    key={p.id} 
                    className={`group relative overflow-hidden rounded-xl p-4 transition-all duration-300 animate-slideIn hover:scale-105 ${
                      p.id === player.id 
                        ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-purple-400/50 shadow-lg shadow-purple-500/25' 
                        : 'bg-white/10 border border-white/20 hover:bg-white/20'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl group-hover:scale-110 transition-transform duration-300">{p.avatar}</div>
                      <div className="flex-1">
                        <div className={`body-font font-bold text-lg ${
                          p.id === player.id ? 'text-white' : 'text-gray-200'
                        }`}>
                          {p.id === player.id ? 'You' : p.name}
                        </div>
                        <div className={`text-sm ${
                          p.id === player.id ? 'text-purple-300' : 'text-gray-400'
                        }`}>
                          {p.id === room.hostId ? '👑 Host' : '🎮 Player'}
                        </div>
                      </div>
                    </div>
                    {p.id === player.id && (
                      <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background animate-fade-in relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-purple/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-green/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary-blue/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-2 py-2 relative z-10">
        {/* Compact Game Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-2">
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2 lg:mb-0">
            <h1 className="heading-font text-2xl md:text-3xl text-white drop-shadow-2xl">
              🎭 <span className="text-gradient-primary">Memelord</span>
            </h1>
            <div className="flex items-center gap-1 px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-sm">🏠</span>
              <span className="subheading-font font-bold text-white text-xs">Room: {room.code}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-sm">🎯</span>
              <span className="subheading-font font-bold text-white text-xs">Round {gameState.currentRound}/{room.settings.rounds}</span>
            </div>
            <button
              onClick={onLeaveRoom}
              className="group px-2 py-1 bg-white/10 backdrop-blur-sm text-white rounded-xl border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 flex items-center gap-1"
            >
              <span className="text-xs group-hover:scale-110 transition-transform duration-300">👋</span>
              <span className="font-medium text-xs">Leave</span>
            </button>
          </div>
        </div>

        {/* Compact Game Content */}
        <div className="grid lg:grid-cols-4 gap-2">
          {/* Main Game Area */}
          <div className="lg:col-span-3 space-y-2">
            {/* Compact Meme Display */}
            {gameState.currentMeme && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-2 border border-white/20 shadow-2xl">
                <MemeDisplay meme={gameState.currentMeme} />
              </div>
            )}

            {/* Compact Caption Input */}
            {gameState.phase === 'caption' && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-2 border border-white/20 shadow-2xl">
                <CaptionInput
                  onSubmit={handleSubmitCaption}
                  disabled={gameState.captions?.some(c => c.playerId === player.id)}
                  timer={gameState.timer}
                />
              </div>
            )}



            {/* Compact Results Phase Status */}
            {gameState.phase === 'results' && (
              <div className="text-center">
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-lg rounded-xl p-2 border border-green-500/30 shadow-2xl">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg animate-spin">📊</span>
                    <span className="text-sm font-bold text-white">Round Results! Next round starting soon...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Compact Captions */}
            {(gameState.captions?.length > 0) && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-3 border border-white/20 shadow-2xl">
                <CaptionList
                  captions={gameState.captions}
                  votes={gameState.votes}
                  players={players}
                  currentPlayer={player}
                  phase={gameState.phase}
                  onVote={handleVote}
                  onHurrySound={handleHurrySound}
                  timer={gameState.timer}
                  onTimerTick={handleTimerTick}
                />
              </div>
            )}
          </div>

          {/* Compact Leaderboard */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-2 border border-white/20 shadow-2xl sticky top-2">
              <Leaderboard
                players={players}
                scores={gameState.scores}
                currentRound={gameState.currentRound}
                currentPlayer={player}
              />
            </div>
          </div>
        </div>

        {/* Game End Modal */}
        {gameState.phase === 'ended' && (
          <GameEndModal
            winner={gameState.winner}
            finalScores={gameState.finalScores}
            players={gameState.allPlayers || players}
            onPlayAgain={() => window.location.reload()}
            onHurrySound={handleHurrySound}
          />
        )}

        {/* Sound System */}
        <SoundSystem
          playVoteSound={soundTriggers.playVoteSound}
          playWinSound={soundTriggers.playWinSound}
          playTimerTick={soundTriggers.playTimerTick}
          playTransition={soundTriggers.playTransition}
          playHurrySound={soundTriggers.playHurrySound}
          timerSeconds={gameState.timer}
          gamePhase={gameState.phase}
          volume={soundVolume}
          isMuted={isSoundMuted}
        />

        {/* Compact Sound Controls */}
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-2 border border-white/20 shadow-2xl">
            <SoundControls
              volume={soundVolume}
              isMuted={isSoundMuted}
              onVolumeChange={setSoundVolume}
              onToggleMute={() => setIsSoundMuted(!isSoundMuted)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameRoom;