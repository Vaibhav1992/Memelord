import React, { useState, useRef, useEffect } from 'react';

const CaptionInput = ({ onSubmit, disabled, timer, maxLength = 200 }) => {
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const inputRef = useRef(null);
  const submitButtonRef = useRef(null);

  useEffect(() => {
    // Focus input when component mounts
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  useEffect(() => {
    // Count words
    const words = caption.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [caption]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim() || disabled || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      await onSubmit(caption.trim());
      setShowSuccess(true);
      setCaption('');
      
      // Hide success message after 2 seconds
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Error submitting caption:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const getCharacterColor = () => {
    const remaining = maxLength - caption.length;
    if (remaining < 20) return 'text-red-400';
    if (remaining < 50) return 'text-orange-400';
    return 'text-gray-400';
  };

  const getProgressPercentage = () => {
    return (caption.length / maxLength) * 100;
  };

  if (disabled) {
    return (
      <div className="card animate-fade-in">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce">✅</div>
          <h3 className="heading-font text-xl text-gradient-success mb-2">
            Caption Submitted!
          </h3>
          <p className="body-font text-neutral-gray-300 mb-3">
            Waiting for other players to finish...
          </p>
          
          {/* Enhanced timer display */}
          <div className="badge badge-primary mx-auto">
            <span className="text-lg">⏰</span>
            <span className="font-medium">{timer}s remaining</span>
          </div>
          
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card animate-fadeIn">
      <div className="text-center mb-2">
        <h3 className="heading-font text-lg text-white mb-1">
          💭 Write Your Caption
        </h3>
        <p className="body-font text-gray-300 text-sm">
          Make it funny, make it memorable!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Input Container */}
        <div className="relative">
          <textarea
            ref={inputRef}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your hilarious caption here..."
            maxLength={maxLength}
            disabled={isSubmitting}
            className="input-field w-full h-16 resize-none pr-16 text-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          />
          
          {/* Character counter bubble */}
          <div className="absolute bottom-1 right-1 bg-gray-800/80 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs">
            <span className={getCharacterColor()}>
              {caption.length}/{maxLength}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-1 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-green-500 transition-all duration-300 ease-out"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>

        {/* Compact Stats Row */}
        <div className="flex justify-between items-center text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span>📝</span>
              <span>{wordCount} words</span>
            </div>
            <div className="flex items-center gap-1">
              <span>⏰</span>
              <span>{timer}s left</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span>🎯</span>
            <span>Be creative!</span>
          </div>
        </div>

        {/* Compact Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !caption.trim()}
          className={`group relative w-full py-2 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
            isSubmitting || !caption.trim()
              ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-green-600 text-white hover:from-purple-500 hover:to-green-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 active:scale-95'
          }`}
        >
          <div className="relative z-10 flex items-center justify-center gap-2">
            {isSubmitting ? (
              <>
                <span className="animate-spin text-lg">🔄</span>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span className="text-lg group-hover:scale-110 transition-transform duration-300">📤</span>
                <span>Submit Caption</span>
              </>
            )}
          </div>
          {!isSubmitting && caption.trim() && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-green-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
          )}
        </button>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-celebration">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎉</span>
                <span className="subheading-font">Caption submitted successfully!</span>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CaptionInput;