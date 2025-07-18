import React, { useState, useEffect } from 'react';

const GameEndModal = ({ winner, finalScores, players, onPlayAgain, onHurrySound }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebrationPhase, setCelebrationPhase] = useState('intro');

  useEffect(() => {
    // Celebration sequence - only run once when component mounts
    const sequence = [
      { phase: 'intro', delay: 0 },
      { phase: 'winner', delay: 1000 },
      { phase: 'confetti', delay: 2000 },
      { phase: 'complete', delay: 4000 }
    ];

    const timeouts = sequence.map(({ phase, delay }) => {
      return setTimeout(() => {
        setCelebrationPhase(phase);
        if (phase === 'winner' && onHurrySound) {
          // Trigger hurry sound when winner is displayed
          onHurrySound();
        }
        if (phase === 'confetti') {
          setShowConfetti(true);
        }
      }, delay);
    });

    // Cleanup timeouts on unmount
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []); // Empty dependency array - only run once

  const getSortedPlayers = () => {
    return [...players].sort((a, b) => (finalScores[b.id] || 0) - (finalScores[a.id] || 0));
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏅';
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-yellow-600';
      case 2: return 'from-gray-300 to-gray-500';
      case 3: return 'from-orange-400 to-orange-600';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  const sortedPlayers = getSortedPlayers();
  const topThree = sortedPlayers.slice(0, 3);

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-2xl relative overflow-hidden">
        {/* Confetti Animation */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              >
                {['🎉', '🎊', '✨', '🌟', '🎈', '🎁'][Math.floor(Math.random() * 6)]}
              </div>
            ))}
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className={`text-6xl mb-4 ${celebrationPhase === 'intro' ? 'animate-bounce' : ''}`}>
            🏆
          </div>
          <h1 className="heading-font text-4xl text-white mb-2">
            Game Over!
          </h1>
          <p className="subheading-font text-xl text-gray-300">
            The battle has ended, champions have risen!
          </p>
        </div>

        {/* Winner Spotlight */}
        {winner && celebrationPhase !== 'intro' && (
                  <div className={`text-center mb-6 ${celebrationPhase === 'winner' ? 'animate-celebration' : ''}`}>
          <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-2 border-yellow-400/50 rounded-lg p-4 mb-4">
              <div className="text-6xl mb-3">{winner.avatar}</div>
              <h2 className="heading-font text-3xl text-yellow-400 mb-2">
                👑 {winner.name} 👑
              </h2>
              <p className="subheading-font text-lg text-white mb-3">
                The Ultimate Memelord!
              </p>
              <div className="text-4xl font-bold text-yellow-400">
                {finalScores[winner.id] || 0} points
              </div>
            </div>
          </div>
        )}

        {/* Podium */}
        {topThree.length >= 3 && celebrationPhase !== 'intro' && (
                  <div className="mb-6">
          <h3 className="heading-font text-2xl text-white text-center mb-3">
              🏆 Top 3 Champions
            </h3>
            <div className="flex items-end justify-center gap-3 mb-4">
              {/* Second Place */}
              <div className="text-center">
                <div className="bg-gradient-to-r from-gray-300 to-gray-500 w-20 h-16 rounded-t-lg flex items-center justify-center text-black font-bold mb-2">
                  2nd
                </div>
                <div className="text-3xl mb-1">{topThree[1]?.avatar || '😀'}</div>
                <div className="text-sm text-gray-300">{topThree[1]?.name}</div>
                <div className="text-lg font-bold text-gray-300">
                  {finalScores[topThree[1]?.id] || 0}
                </div>
              </div>

              {/* First Place */}
              <div className="text-center">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 w-24 h-20 rounded-t-lg flex items-center justify-center text-black font-bold mb-2 animate-pulse-custom">
                  1st
                </div>
                <div className="text-4xl mb-1">{topThree[0]?.avatar || '😀'}</div>
                <div className="text-sm text-yellow-400 font-semibold">{topThree[0]?.name}</div>
                <div className="text-xl font-bold text-yellow-400">
                  {finalScores[topThree[0]?.id] || 0}
                </div>
              </div>

              {/* Third Place */}
              <div className="text-center">
                <div className="bg-gradient-to-r from-orange-400 to-orange-600 w-18 h-12 rounded-t-lg flex items-center justify-center text-black font-bold mb-2">
                  3rd
                </div>
                <div className="text-3xl mb-1">{topThree[2]?.avatar || '😀'}</div>
                <div className="text-sm text-gray-300">{topThree[2]?.name}</div>
                <div className="text-lg font-bold text-orange-400">
                  {finalScores[topThree[2]?.id] || 0}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Results */}
        {celebrationPhase === 'complete' && (
                  <div className="mb-6 animate-fadeIn">
          <h3 className="heading-font text-xl text-white text-center mb-3">
              📊 Final Results
            </h3>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {sortedPlayers.map((player, index) => {
                const rank = index + 1;
                const score = finalScores[player.id] || 0;
                
                return (
                  <div
                    key={player.id}
                    className={`leaderboard-item relative ${
                      rank === 1 ? 'winner' : ''
                    }`}
                  >
                    {/* Rank Badge */}
                    <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getRankColor(rank)} flex items-center justify-center text-xs font-bold ${
                        rank <= 3 ? 'text-black' : 'text-white'
                      }`}>
                        {rank}
                      </div>
                    </div>

                    {/* Player Info */}
                    <div className="flex items-center justify-between pl-16 pr-4 py-2 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="text-xl">{player.avatar}</div>
                        <div>
                          <div className="text-white font-medium">{player.name}</div>
                          <div className="text-xs text-gray-400">
                            {getRankIcon(rank)} {rank === 1 ? 'Champion' : `${rank}${rank === 2 ? 'nd' : rank === 3 ? 'rd' : 'th'} Place`}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          rank === 1 ? 'text-yellow-400' : 'text-white'
                        }`}>
                          {score}
                        </div>
                        <div className="text-xs text-gray-400">
                          {score === 1 ? 'point' : 'points'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => window.location.href = '/'}
            className="btn-outline flex-1 hover:scale-105 active:scale-95"
          >
            <span className="mr-2">🏠</span>
            Back to Home
          </button>
          <button
            onClick={onPlayAgain}
            className="btn-primary flex-1 hover:scale-105 active:scale-95"
          >
            <span className="mr-2">🎮</span>
            Play Again
          </button>
        </div>

        {/* Fun Stats */}
        <div className="mt-8 p-4 bg-gradient-to-r from-purple-500/10 to-green-500/10 rounded-lg border border-purple-500/20">
          <h4 className="subheading-font text-lg text-white mb-3 text-center">
            🎊 Game Stats
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl mb-1">👥</div>
              <div className="text-white font-bold">{players.length}</div>
              <div className="text-xs text-gray-400">Players</div>
            </div>
            <div>
              <div className="text-2xl mb-1">🎯</div>
              <div className="text-white font-bold">
                {Object.values(finalScores).reduce((a, b) => a + b, 0)}
              </div>
              <div className="text-xs text-gray-400">Total Points</div>
            </div>
            <div>
              <div className="text-2xl mb-1">🏆</div>
              <div className="text-white font-bold">
                {Math.max(...Object.values(finalScores), 0)}
              </div>
              <div className="text-xs text-gray-400">High Score</div>
            </div>
            <div>
              <div className="text-2xl mb-1">💯</div>
              <div className="text-white font-bold">
                {(Object.values(finalScores).reduce((a, b) => a + b, 0) / players.length).toFixed(1)}
              </div>
              <div className="text-xs text-gray-400">Avg Score</div>
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="text-center mt-6">
          <p className="body-font text-gray-400 text-sm">
            Thanks for playing! You&apos;ve all proven to be legendary Memelords! 🎉
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameEndModal;