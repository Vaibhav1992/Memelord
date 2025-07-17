import React from 'react';

const Leaderboard = ({ players, scores, currentRound }) => {
  const sortedPlayers = [...players].sort((a, b) => {
    const scoreA = scores?.get(a.id) || 0;
    const scoreB = scores?.get(b.id) || 0;
    return scoreB - scoreA;
  });

  return (
    <div className="card sticky top-4">
      <h3 className="text-xl font-semibold mb-4 text-center">
        🏆 Leaderboard
      </h3>
      
      <div className="space-y-2">
        {sortedPlayers.map((player, index) => {
          const score = scores?.get(player.id) || 0;
          const isFirst = index === 0 && score > 0;
          
          return (
            <div
              key={player.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                isFirst
                  ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30'
                  : 'bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold w-6">
                  {index === 0 && score > 0 ? '👑' : `#${index + 1}`}
                </span>
                <span className="text-lg">{player.avatar}</span>
                <span className="font-medium text-sm truncate max-w-20">
                  {player.name}
                </span>
              </div>
              
              <div className="text-right">
                <div className={`font-bold ${isFirst ? 'text-yellow-400' : 'text-white'}`}>
                  {score} pts
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {currentRound > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-600 text-center text-sm text-gray-400">
          Round {currentRound} • {players.length} players
        </div>
      )}
    </div>
  );
};

export default Leaderboard;