import React, { useEffect, useState } from 'react';
import Confetti from './Confetti';

const GameEndModal = ({ winner, finalScores, players, onPlayAgain }) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const sortedPlayers = [...players].sort((a, b) => {
    const scoreA = finalScores[a.id] || 0;
    const scoreB = finalScores[b.id] || 0;
    return scoreB - scoreA;
  });



  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <Confetti isActive={showConfetti} />
      
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-yellow-400 mb-2">
            🎉 Game Over! 🎉
          </h2>
          
          {winner && (
            <div className="mb-4">
              <div className="text-6xl mb-2">{winner.avatar}</div>
              <h3 className="text-2xl font-bold text-purple-400">
                {winner.name} Wins!
              </h3>
              <p className="text-gray-300">
                {finalScores[winner.id]} points
              </p>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3 text-center">Final Scores</h4>
          <div className="space-y-2">
            {sortedPlayers.map((player, index) => {
              const score = finalScores[player.id] || 0;
              const isWinner = index === 0;
              
              return (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    isWinner
                      ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30'
                      : 'bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold w-8">
                      {isWinner ? '👑' : `#${index + 1}`}
                    </span>
                    <span className="text-2xl">{player.avatar}</span>
                    <span className="font-medium">{player.name}</span>
                  </div>
                  
                  <div className={`font-bold text-lg ${
                    isWinner ? 'text-yellow-400' : 'text-white'
                  }`}>
                    {score} pts
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onPlayAgain}
            className="btn-primary flex-1"
          >
            Play Again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="btn-secondary flex-1"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameEndModal;