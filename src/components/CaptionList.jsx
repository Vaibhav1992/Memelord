import React, { useState, useEffect } from 'react';
import Timer from './Timer';

const CaptionList = ({ captions, votes, players, currentPlayer, phase, onVote, onHurrySound, timer, onTimerTick }) => {
  const [selectedCaption, setSelectedCaption] = useState(null);
  const [showVoteConfirmation, setShowVoteConfirmation] = useState(false);
  const [winnerRevealed, setWinnerRevealed] = useState(false);

  useEffect(() => {
    // Reset selection when phase changes
    if (phase !== 'vote') {
      setSelectedCaption(null);
    }
  }, [phase]);

  useEffect(() => {
    // Reveal winner with delay in results phase
    if (phase === 'results' && !winnerRevealed) {
      setTimeout(() => {
        setWinnerRevealed(true);
        // Trigger hurray sound when winners are revealed
        if (onHurrySound) {
          onHurrySound();
        }
      }, 1000);
    }
  }, [phase, winnerRevealed, onHurrySound]);

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

  const canPlayerVote = (caption) => {
    return phase === 'vote' && caption.playerId !== currentPlayer.id;
  };

  const handleVote = (captionId) => {
    const caption = captions.find(c => c.id === captionId);
    if (!canPlayerVote(caption)) return;
    
    setSelectedCaption(captionId);
    setShowVoteConfirmation(true);
    
    try {
      onVote(captionId);
      setTimeout(() => setShowVoteConfirmation(false), 2000);
    } catch (error) {
      console.error('Error voting:', error);
      setShowVoteConfirmation(false);
    }
  };

  const getWinnerCaptions = () => {
    if (phase !== 'results') return [];
    const maxVotes = Math.max(...captions.map(c => getVoteCount(c.id)));
    return captions.filter(c => getVoteCount(c.id) === maxVotes && maxVotes > 0);
  };

  const sortedCaptions = [...captions].sort((a, b) => {
    if (phase === 'results') {
      return getVoteCount(b.id) - getVoteCount(a.id);
    }
    return a.submittedAt - b.submittedAt;
  });

  const winnerCaptions = getWinnerCaptions();

  if (captions.length === 0) {
    return (
      <div className="card animate-fadeIn">
        <div className="text-center text-gray-400">
          <div className="text-2xl mb-2">📝</div>
          <p className="heading-font text-base">No captions yet...</p>
          <p className="body-font text-xs">Be the first to submit a caption!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="caption-list-container animate-fadeIn">
      {/* Compact Header */}
      <div className="text-center mb-3">
        <h2 className="heading-font text-lg text-white mb-2">
          {phase === 'caption' ? '📝 Captions Submitted' : '🗳️ Vote for Your Favorite!'}
        </h2>
        
        {/* Timer for voting phase */}
        {phase === 'vote' && timer && (
          <div className="flex justify-center items-center gap-2 mb-2">
            <Timer 
              seconds={timer} 
              onTick={onTimerTick}
              className="w-6 h-6" 
            />
            <span className="body-font text-xs text-white font-medium">seconds remaining</span>
          </div>
        )}
        
        <div className="flex items-center justify-center gap-3 text-xs text-gray-300">
          <div className="flex items-center gap-1">
            <span>📊</span>
            <span>{captions.length} captions</span>
          </div>
          {phase === 'vote' && (
            <div className="flex items-center gap-1">
              <span>🗳️</span>
              <span>{Object.keys(votes || {}).length} votes</span>
            </div>
          )}
        </div>
      </div>

      {/* Caption List - Compact Single Column */}
      <div className="space-y-3">
        {captions.map((caption, index) => {
          const player = players.find(p => p.id === caption.playerId);
          const voteCount = Object.values(votes || {}).filter(vote => vote.captionId === caption.id).length;
          const hasVoted = votes && votes[currentPlayer.id]?.captionId === caption.id;
          const isOwnCaption = caption.playerId === currentPlayer.id;
          const canVote = canPlayerVote(caption);
          


          return (
            <div
              key={caption.id}
              className={`group overflow-hidden rounded-xl transition-all duration-300 animate-slideIn ${
                hasVoted && phase === 'vote'
                  ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-purple-400/50 shadow-lg shadow-purple-500/25'
                  : isOwnCaption
                  ? 'bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30'
                  : 'bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Single Row Layout */}
              <div className="p-4 flex items-center gap-4">
                {/* Player Info - Left Side - Made smaller and muted */}
                <div className="flex items-center gap-2 flex-shrink-0 player-info-muted">
                  <div className="text-xs">{player?.avatar || '😀'}</div>
                  <div className={`text-xs ${
                    isOwnCaption ? 'text-green-300' : 'text-gray-400'
                  }`}>
                    {isOwnCaption ? 'Your caption' : player?.name || 'Unknown'}
                  </div>
                </div>

                {/* Caption Text - Left aligned and more prominent */}
                <div className="flex-1 text-left">
                  <p className={`text-lg leading-relaxed caption-text-fun ${
                    hasVoted ? 'text-white' : 'text-white'
                  }`}>
                    {caption.text}
                  </p>
                </div>

                {/* Vote Button - Right Side */}
                <div className="flex-shrink-0">
                  {canVote && (
                    <button
                      onClick={() => handleVote(caption.id)}
                      className="group/btn bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-medium py-2 px-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ring-1 ring-white/20 hover:ring-white/40"
                      style={{ zIndex: 10, position: 'relative' }}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm group-hover/btn:scale-110 transition-transform duration-300">👍</span>
                        <span className="text-sm font-semibold">VOTE</span>
                      </div>
                    </button>
                  )}



                  {/* Vote Count Badge */}
                  {phase === 'vote' && voteCount > 0 && !canVote && !hasVoted && (
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-2 px-3 rounded-full shadow-lg ring-1 ring-white/20">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">👍</span>
                        <span className="text-sm font-semibold">{voteCount}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Hover Effect - Only for non-votable cards */}
              {!canVote && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Vote Confirmation Modal */}
      {showVoteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-celebration">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎉</span>
              <span className="subheading-font">Vote submitted!</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaptionList;