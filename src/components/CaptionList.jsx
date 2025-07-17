import React from 'react';

const CaptionList = ({ captions, votes, players, currentPlayer, phase, onVote }) => {
  const getVoteCount = (captionId) => {
    if (!votes) return 0;
    return Object.values(votes).filter(vote => vote.captionId === captionId).length;
  };

  const hasVoted = (captionId) => {
    if (!votes) return false;
    return votes[currentPlayer.id]?.captionId === captionId;
  };

  const getCurrentVote = () => {
    if (!votes) return null;
    return votes[currentPlayer.id]?.captionId;
  };

  const getPlayerName = (playerId) => {
    const player = players.find(p => p.id === playerId);
    return player ? player.name : 'Unknown';
  };

  const getPlayerAvatar = (playerId) => {
    const player = players.find(p => p.id === playerId);
    return player ? player.avatar : '😀';
  };

  const canVote = (caption) => {
    return phase === 'vote' && caption.playerId !== currentPlayer.id;
  };

  const sortedCaptions = [...captions].sort((a, b) => {
    if (phase === 'results') {
      return getVoteCount(b.id) - getVoteCount(a.id);
    }
    return a.submittedAt - b.submittedAt;
  });

  return (
    <div className="space-y-3">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">
          {phase === 'vote' && '🗳️ Vote for your favorite caption!'}
          {phase === 'results' && '🏆 Round Results'}
          {phase === 'caption' && '📝 Submitted Captions'}
        </h3>
        <p className="text-gray-400">
          {phase === 'vote' && `${captions.length} caption${captions.length !== 1 ? 's' : ''} to choose from`}
          {phase === 'results' && 'Here are the results for this round'}
          {phase === 'caption' && `${captions.length} caption${captions.length !== 1 ? 's' : ''} submitted`}
        </p>
      </div>
      
      <div className="grid gap-3">
        {sortedCaptions.map((caption, index) => (
          <div
            key={caption.id}
            className={`relative bg-gradient-to-r rounded-lg p-4 border-2 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
              caption.playerId === currentPlayer.id
                ? 'from-purple-900/50 to-purple-800/50 border-purple-400 shadow-purple-500/20'
                : hasVoted(caption.id) && phase === 'vote'
                ? 'from-green-900/50 to-green-800/50 border-green-400 shadow-green-500/20'
                : 'from-gray-800/50 to-gray-700/50 border-gray-600 hover:border-gray-500'
            }`}
          >
            {/* Position indicator for results */}
            {phase === 'results' && (
              <div className="absolute -top-1 -right-1 bg-yellow-500 text-black font-bold text-xs px-2 py-1 rounded-full">
                #{index + 1}
              </div>
            )}

            {/* Caption Text - Main Focus */}
            <div className="text-center mb-3">
              <blockquote className="text-base md:text-lg font-medium text-white leading-relaxed italic">
                "{caption.text}"
              </blockquote>
            </div>

            {/* Compact bottom section */}
            <div className="flex items-center justify-between">
              {/* Player Info - Very small and muted */}
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span className="text-sm">{getPlayerAvatar(caption.playerId)}</span>
                <span className="text-xs opacity-70">{getPlayerName(caption.playerId)}</span>
                {caption.playerId === currentPlayer.id && (
                  <span className="text-purple-400 text-xs opacity-80">(You)</span>
                )}
              </div>

              {/* Vote section */}
              <div className="flex items-center gap-3">
                {/* Vote Count */}
                <div className="flex items-center gap-1">
                  <span className="text-lg">👍</span>
                  <span className="font-bold text-white bg-gray-700 px-2 py-1 rounded-full text-sm">
                    {getVoteCount(caption.id)}
                  </span>
                </div>

                {/* Vote Button */}
                {phase === 'vote' && canVote(caption) && (
                  <button
                    onClick={() => onVote(caption.id)}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 transform hover:scale-105 hover:shadow-md ${
                      hasVoted(caption.id)
                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-green-500/30'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-blue-500/30'
                    }`}
                  >
                    {hasVoted(caption.id) ? (
                      <>
                        <span className="mr-1">🎉</span>
                        Voted!
                      </>
                    ) : (
                      <>
                        <span className="mr-1">😂</span>
                        Vote
                      </>
                    )}
                  </button>
                )}

                {/* Cannot vote indicator */}
                {phase === 'vote' && caption.playerId === currentPlayer.id && (
                  <div className="px-3 py-2 bg-gray-600 text-gray-300 rounded-lg text-sm">
                    Your caption
                  </div>
                )}
              </div>
            </div>

            {/* Vote status indicator */}
            {phase === 'vote' && getCurrentVote() === caption.id && (
              <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                ✓
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty state */}
      {captions.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p className="text-lg">No captions submitted yet...</p>
          <p>Be the first to submit a caption!</p>
        </div>
      )}
    </div>
  );
};

export default CaptionList;