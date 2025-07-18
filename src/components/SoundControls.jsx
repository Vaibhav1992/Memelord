import React, { useState } from 'react';

const SoundControls = ({ onVolumeChange, onToggleMute, isMuted, volume }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Sound Control Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-outline p-3 rounded-full hover:scale-105 active:scale-95 transition-all duration-200"
        title="Sound Settings"
      >
        <span className="text-xl">
          {isMuted ? '🔇' : volume > 0.5 ? '🔊' : volume > 0.2 ? '🔉' : '🔈'}
        </span>
      </button>

      {/* Sound Control Panel */}
      {isOpen && (
        <div className="absolute top-12 right-0 card min-w-64 animate-fadeIn">
          <h3 className="heading-font text-lg text-white mb-4 flex items-center gap-2">
            <span>🎵</span>
            Sound Settings
          </h3>
          
          <div className="space-y-4">
            {/* Mute Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-gray-300 text-sm">Sound Effects</label>
              <button
                onClick={onToggleMute}
                className={`p-2 rounded-lg transition-colors ${
                  isMuted 
                    ? 'bg-red-500/20 border border-red-500/50' 
                    : 'bg-green-500/20 border border-green-500/50'
                }`}
              >
                <span className="text-lg">
                  {isMuted ? '🔇' : '🔊'}
                </span>
              </button>
            </div>

            {/* Volume Slider */}
            <div className="space-y-2">
              <label className="text-gray-300 text-sm">Ambient Music Volume</label>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  disabled={isMuted}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0%</span>
                  <span>{Math.round(volume * 100)}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* Sound Info */}
            <div className="text-xs text-gray-400 bg-gray-800/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span>💡</span>
                <span className="font-medium">Sound Features:</span>
              </div>
              <ul className="space-y-1">
                <li>• Ambient background music</li>
                <li>• Phase transition sounds</li>
                <li>• Vote confirmation sounds</li>
                <li>• Timer countdown alerts</li>
                <li>• Victory celebration sounds</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default SoundControls; 