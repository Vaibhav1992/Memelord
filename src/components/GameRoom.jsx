import React, { useState, useEffect } from 'react';
import Timer from './Timer';
import MemeDisplay from './MemeDisplay';
import CaptionInput from './CaptionInput';
import CaptionList from './CaptionList';
import Leaderboard from './Leaderboard';
import GameEndModal from './GameEndModal';

const GameRoom = ({ socket, gameState, player, room, onLeaveRoom }) => {
  // Use players from gameState instead of local state
  const players = gameState.players || [];

  const handleStartGame = () => {
    socket.emit('start_game');
  };

  const handleSubmitCaption = (text) => {
    socket.emit('submit_caption', { text });
  };

  const handleVote = (captionId) => {
    socket.emit('submit_vote', { captionId });
  };

  if (gameState.phase === 'waiting') {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-purple-400">Memelord</h1>
              <p className="text-gray-400">Room: {room.code}</p>
            </div>
            <button onClick={onLeaveRoom} className="btn-secondary">
              Leave Room
            </button>
          </div>

          {/* Waiting Room */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Players ({players.length}/{room.settings.maxPlayers})</h2>
              <div className="space-y-2">
                {players.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-2 bg-gray-700 rounded">
                    <span className="text-2xl">{p.avatar}</span>
                    <span className="font-medium">{p.name}</span>
                    {p.id === player.id && <span className="text-purple-400 text-sm">(You)</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Game Settings</h2>
              <div className="space-y-2 text-gray-300">
                <p>Rounds: {room.settings.rounds}</p>
                <p>Caption Timer: {room.settings.captionTimer}s</p>
                <p>Max Players: {room.settings.maxPlayers}</p>
              </div>
              
              {players.length >= 2 && (
                <button
                  onClick={handleStartGame}
                  className="btn-primary w-full mt-6"
                >
                  Start Game
                </button>
              )}
              
              {players.length < 2 && (
                <p className="text-yellow-400 mt-4 text-center">
                  Need at least 2 players to start
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-2xl font-bold text-purple-400">Memelord</h1>
              <p className="text-gray-400">Room: {room.code}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">Round {gameState.currentRound}/{room.settings.rounds}</p>
              <Timer seconds={gameState.timer} />
            </div>
          </div>
          <button onClick={onLeaveRoom} className="btn-secondary">
            Leave Room
          </button>
        </div>

        {/* Game Content */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Meme Display */}
            {gameState.currentMeme && (
              <MemeDisplay meme={gameState.currentMeme} />
            )}

            {/* Caption Input */}
            {gameState.phase === 'caption' && (
              <CaptionInput
                onSubmit={handleSubmitCaption}
                disabled={gameState.captions?.some(c => c.playerId === player.id)}
                timer={gameState.timer}
              />
            )}

            {/* Phase Status */}
            <div className="text-center">
              {gameState.phase === 'caption' && (
                <div className="text-lg text-yellow-400">
                  <p>💭 Caption this meme!</p>
                  <div className="flex justify-center items-center gap-2 mt-2">
                    <Timer seconds={gameState.timer} />
                    <span>remaining</span>
                  </div>
                </div>
              )}
              {gameState.phase === 'vote' && (
                <div className="text-lg text-blue-400">
                  <p>🗳️ Vote for your favorite caption!</p>
                  <div className="flex justify-center items-center gap-2 mt-2">
                    <Timer seconds={gameState.timer} />
                    <span>remaining</span>
                  </div>
                </div>
              )}
              {gameState.phase === 'results' && (
                <p className="text-lg text-green-400">
                  📊 Round Results! Next round starting soon...
                </p>
              )}
            </div>

            {/* Captions */}
            {(gameState.captions?.length > 0) && (
              <CaptionList
                captions={gameState.captions}
                votes={gameState.votes}
                players={players}
                currentPlayer={player}
                phase={gameState.phase}
                onVote={handleVote}
              />
            )}
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-1">
            <Leaderboard
              players={players}
              scores={gameState.scores}
              currentRound={gameState.currentRound}
            />
          </div>
        </div>

        {/* Game End Modal */}
        {gameState.phase === 'ended' && (
          <GameEndModal
            winner={gameState.winner}
            finalScores={gameState.finalScores}
            players={gameState.allPlayers || players}
            onPlayAgain={() => window.location.reload()}
          />
        )}
      </div>
    </div>
  );
};

export default GameRoom;