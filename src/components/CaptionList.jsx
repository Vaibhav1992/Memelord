import React from 'react';

const CaptionList = ({ captions, votes, players, currentPlayer, phase, onVote }) => {
  const getVoteCount = (captionId) => {
    if (!votes) return 0;
    return Array.from(votes.values()).filter(vote => vote.captionId === captionId).length;
  };

  const hasVoted = (captionId) => {
    if (!votes) return false;
    return votes.has(currentPlayer.id);
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
    return phase === 'vote' && 
           caption.playerId !== currentPlayer.id && 
           !hasVoted(caption.id);
  };

  const sortedCaptions = [...captions].sort((a, b) => {
    if (phase === 'results') {
      return getVoteCount(b.id) - getVoteCount(a.id);
    }
    return a.submittedAt - b.submittedAt;
  });

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">
        Captions ({captions.length})
        {phase === 'vote' && ' - Vote for your favorite!'}
        {phase === 'results' && ' - Results'}
      </h3>
      
      <div className="space-y-3">
        {sortedCaptions.map((caption, index) => (
          <div
            key={caption.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              caption.playerId === currentPlayer.id
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-gray-600 bg-gray-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{getPlayerAvatar(caption.playerId)}</span>
                  <span className="font-medium text-sm">
                    {getPlayerName(caption.playerId)}
                    {caption.playerId === currentPlayer.id && ' (You)'}
                  </span>
                  {phase === 'results' && (
                    <span className="text-xs text-gray-400">
                      #{index + 1}
                    </span>
                  )}
                </div>
                <p className="text-white leading-relaxed">{caption.text}</p>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                {phase === 'vote' && canVote(caption) && (
                  <button
                    onClick={() => onVote(caption.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                  >
                    👍 Vote
                  </button>
                )}
                
                {(phase === 'vote' || phase === 'results') && (
                  <div className="flex items-center gap-1 text-sm">
                    <span>👍</span>
                    <span className="font-semibold">{getVoteCount(caption.id)}</span>
                  </div>
                )}
                
                {phase === 'vote' && hasVoted(caption.id) && (
                  <span className="text-green-400 text-sm">✓ Voted</span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {captions.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <p>No captions yet...</p>
            <p className="text-sm">Be the first to submit one!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaptionList;