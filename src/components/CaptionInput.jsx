import React, { useState, useRef, useEffect } from 'react';

const CaptionInput = ({ onSubmit, disabled, timer }) => {
  const [caption, setCaption] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (caption.trim() && !disabled) {
      onSubmit(caption.trim());
      setCaption('');
    }
  };

  if (disabled) {
    return (
      <div className="card">
        <div className="text-center text-gray-400">
          <p className="text-lg">✅ Caption submitted!</p>
          <p>Waiting for other players...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Your Caption</label>
          <textarea
            ref={textareaRef}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="input w-full h-24 resize-none"
            placeholder="Write your hilarious caption here..."
            maxLength={200}
            disabled={timer <= 0}
          />
          <div className="flex justify-between text-sm text-gray-400 mt-1">
            <span>{caption.length}/200 characters</span>
            <span>{timer > 0 ? 'Type fast!' : 'Time\'s up!'}</span>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!caption.trim() || timer <= 0}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Caption
        </button>
      </form>
    </div>
  );
};

export default CaptionInput;