import React, { useState, useEffect } from 'react';

const Leaderboard = ({ players, scores, currentRound, currentPlayer }) => {
  const [animateScores, setAnimateScores] = useState(false);
  const [previousScores, setPreviousScores] = useState({});

  useEffect(() => {
    // Animate score changes
    if (JSON.stringify(scores) !== JSON.stringify(previousScores)) {
      setAnimateScores(true);
      setTimeout(() => setAnimateScores(false), 1000);
      setPreviousScores(scores);
    }
  }, [scores, previousScores]);

  const getPlayerRank = (playerId) => {
    const sortedPlayers = [...players].sort((a, b) => 
      (scores[b.id] || 0) - (scores[a.id] || 0)
    );
    return sortedPlayers.findIndex(p => p.id === playerId) + 1;
  };

  const getTopPlayers = () => {
    return [...players]
      .sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0))
      .slice(0, 10); // Show top 10 players
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

  const getScoreChangeAnimation = (playerId) => {
    const currentScore = scores[playerId] || 0;
    const previousScore = previousScores[playerId] || 0;
    
    if (currentScore > previousScore) {
      return 'animate-bounce text-green-400';
    } else if (currentScore < previousScore) {
      return 'animate-pulse text-red-400';
    }
    return '';
  };

  const topPlayers = getTopPlayers();
  const maxScore = Math.max(...Object.values(scores || {}), 0);

  return (
    <div className="leaderboard-container animate-fadeIn">
      <div className="text-center mb-2">
        <h2 className="heading-font text-sm text-white mb-0.5">
          🏆 Leaderboard
        </h2>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-300">
          <div className="flex items-center gap-1">
            <span>🎯</span>
            <span>Round {currentRound}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>👥</span>
            <span>{players.length} players</span>
          </div>
        </div>
      </div>

      {/* Compact Players List */}
      <div className="space-y-1">
        {topPlayers.map((player, index) => {
          const isCurrentPlayer = player.id === currentPlayer?.id;
          const isTopThree = index < 3;
          const score = scores[player.id] || 0;

          return (
            <div
              key={player.id}
              className={`group relative overflow-hidden rounded-lg transition-all duration-300 animate-slideIn ${
                isCurrentPlayer
                  ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-2 border-purple-400/50 shadow-lg'
                  : isTopThree
                  ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30'
                  : 'bg-white/10 border border-white/20 hover:bg-white/20'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-1 p-1.5">
                {/* Rank */}
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' :
                  index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-black' :
                  index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-black' :
                  'bg-gray-600 text-white'
                }`}>
                  {index + 1}
                </div>

                {/* Avatar */}
                <div className="text-sm group-hover:scale-110 transition-transform duration-300">
                  {player.avatar}
                </div>

                {/* Player Info */}
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-medium truncate ${
                    isCurrentPlayer ? 'text-white' : 'text-gray-200'
                  }`}>
                    {isCurrentPlayer ? 'You' : player.name}
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className={`text-xs font-bold ${
                    isCurrentPlayer ? 'text-white' : 'text-gray-200'
                  }`}>
                    {score}
                  </div>
                </div>

                {/* Crown for Winner */}
                {index === 0 && (
                  <div className="absolute -top-0.5 -right-0.5 text-xs animate-bounce">
                    👑
                  </div>
                )}
              </div>

              {/* Current Player Indicator */}
              {isCurrentPlayer && (
                <div className="absolute top-0.5 right-0.5">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Leaderboard;