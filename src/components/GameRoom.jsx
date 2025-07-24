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
      <div className="min-h-screen relative overflow-hidden">
        {/* Consistent background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-game-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-game-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-game-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <div className="relative inline-block">
              <h1 className="heading-font text-5xl md:text-7xl mb-6 game-title animate-float">
                🎭 Memelord
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-green-500 mx-auto rounded-full animate-color-shift"></div>
            </div>
            <div className="flex items-center justify-center gap-6 text-lg text-gray-300 mt-6">
              <div className="game-room-card px-4 py-2">
                <span className="text-2xl mr-2">🏠</span>
                <span className="subheading-font font-bold text-white">Room: {room.code}</span>
              </div>
              <div className="game-room-card px-4 py-2">
                <span className="text-2xl mr-2">👥</span>
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
                <div className="card">
                  <h2 className="heading-font text-3xl text-center mb-8 game-title">
                    ⚙️ Game Settings
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="game-room-card text-center group">
                      <div className="text-4xl mb-4 group-hover:animate-bounce">🎯</div>
                      <div className="text-gray-300 text-sm font-medium mb-2 subheading-font">Rounds</div>
                      <div className="text-white font-bold text-3xl game-title">{room.settings.rounds}</div>
                    </div>
                    <div className="game-room-card text-center group">
                      <div className="text-4xl mb-4 group-hover:animate-bounce">⏱️</div>
                      <div className="text-gray-300 text-sm font-medium mb-2 subheading-font">Caption Timer</div>
                      <div className="text-white font-bold text-3xl game-title">{room.settings.captionTimer}s</div>
                    </div>
                    <div className="game-room-card text-center group">
                      <div className="text-4xl mb-4 group-hover:animate-bounce">👥</div>
                      <div className="text-gray-300 text-sm font-medium mb-2 subheading-font">Max Players</div>
                      <div className="text-white font-bold text-3xl game-title">{room.settings.maxPlayers}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Action Buttons - HOST */}
              <div className="text-center space-y-6 mb-12">
                <button
                  onClick={handleStartGame}
                  disabled={players.length < 2}
                  className={`text-xl px-8 py-4 group ${
                    players.length < 2 
                      ? 'opacity-50 cursor-not-allowed btn-outline' 
                      : 'btn-primary'
                  }`}
                >
                  <div className="flex items-center justify-center gap-3">
                    {players.length < 2 ? (
                      <>
                        <span className="text-2xl animate-spin">⏳</span>
                        <span>Need at least 2 players to start</span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl group-hover:animate-bounce">🚀</span>
                        <span>Start Epic Battle</span>
                      </>
                    )}
                  </div>
                </button>
                
                <button
                  onClick={onLeaveRoom}
                  className="btn-outline group mx-auto"
                >
                  <span className="text-xl mr-2 group-hover:animate-bounce">👋</span>
                  <span>Leave Room</span>
                </button>
              </div>
            </>
          ) : (
            // PLAYER VIEW - Show waiting message
            <div className="max-w-4xl mx-auto mb-12">
              <div className="card text-center">
                <div className="text-6xl mb-6 animate-bounce">⏳</div>
                <h2 className="heading-font text-3xl mb-4 game-title">
                  Waiting for Host
                </h2>
                <p className="text-gray-300 text-lg mb-6 subheading-font">
                  The host will start the game when everyone is ready!
                </p>
                <div className="game-room-card inline-flex items-center gap-2 text-gray-300 mb-8">
                  <span className="text-2xl">👑</span>
                  <span className="subheading-font">Host: {players.find(p => p.id === room.hostId)?.name || 'Unknown'}</span>
                </div>
                
                <button
                  onClick={onLeaveRoom}
                  className="btn-outline group mx-auto"
                >
                  <span className="text-xl mr-2 group-hover:animate-bounce">👋</span>
                  <span>Leave Room</span>
                </button>
              </div>
            </div>
          )}

          {/* Enhanced Players List */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="card">
              <h2 className="heading-font text-3xl text-center mb-8 game-title">
                👥 Battle Warriors
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {players.map((p, index) => (
                  <div 
                    key={p.id} 
                    className={`game-room-card group animate-float ${
                      p.id === player.id 
                        ? 'border-purple-400 bg-purple-500/20' 
                        : ''
                    }`}
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl group-hover:animate-bounce">{p.avatar}</div>
                      <div className="flex-1">
                        <div className={`subheading-font font-bold text-lg ${
                          p.id === player.id ? 'text-white' : 'text-gray-200'
                        }`}>
                          {p.id === player.id ? 'You' : p.name}
                        </div>
                        <div className={`text-sm body-font ${
                          p.id === player.id ? 'text-purple-300' : 'text-gray-400'
                        }`}>
                          {p.id === room.hostId ? '👑 Host' : '🎮 Player'}
                        </div>
                      </div>
                    </div>
                    {p.id === player.id && (
                      <div className="absolute top-2 right-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-game-pulse"></div>
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Consistent background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-game-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-game-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-game-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-2 py-2 relative z-10">
        {/* Compact Game Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2 lg:mb-0">
            <h1 className="heading-font text-2xl md:text-3xl game-title">
              🎭 Memelord
            </h1>
            <div className="game-room-card px-3 py-1 text-sm">
              <span className="mr-2">🏠</span>
              <span className="subheading-font font-bold text-white">Room: {room.code}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="game-room-card px-3 py-1 text-sm">
              <span className="mr-2">🎯</span>
              <span className="subheading-font font-bold text-white">Round {gameState.currentRound}/{room.settings.rounds}</span>
            </div>
            <button
              onClick={onLeaveRoom}
              className="btn-outline text-sm px-3 py-1 group"
            >
              <span className="text-sm mr-1 group-hover:animate-bounce">👋</span>
              <span>Leave</span>
            </button>
          </div>
        </div>

        {/* Compact Game Content */}
        <div className="grid lg:grid-cols-4 gap-4">
          {/* Main Game Area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Compact Meme Display */}
            {gameState.currentMeme && (
              <div className="card p-4">
                <MemeDisplay meme={gameState.currentMeme} />
              </div>
            )}

            {/* Compact Caption Input */}
            {gameState.phase === 'caption' && (
              <div className="card p-4">
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
                <div className="phase-indicator">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg animate-spin">📊</span>
                    <span className="text-sm font-bold">Round Results! Next round starting soon...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Compact Captions */}
            {(gameState.captions?.length > 0) && (
              <div className="card p-4">
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
            <div className="card p-4 sticky top-4">
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
          <div className="game-room-card p-2">
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