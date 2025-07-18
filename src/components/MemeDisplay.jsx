import React, { useState, useEffect } from 'react';

const MemeDisplay = ({ meme, className = '' }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [detailsAnimation, setDetailsAnimation] = useState('');

  useEffect(() => {
    // Reset states when meme changes
    setImageLoaded(false);
    setImageError(false);
    setShowDetails(false);
  }, [meme]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const openDetails = () => {
    setShowDetails(true);
    setDetailsAnimation('animate-fadeIn');
  };

  const closeDetails = () => {
    setDetailsAnimation('animate-fadeOut');
    setTimeout(() => {
      setShowDetails(false);
      setDetailsAnimation('');
    }, 300);
  };

  // Fun meme stats generator
  const generateMemeStats = () => {
    const funnyLevel = Math.floor(Math.random() * 100) + 1;
    const viralPotential = Math.floor(Math.random() * 100) + 1;
    const memeness = Math.floor(Math.random() * 100) + 1;
    const randomViews = Math.floor(Math.random() * 999999) + 1000;
    const randomLikes = Math.floor(Math.random() * 99999) + 100;
    
    return {
      funnyLevel,
      viralPotential,
      memeness,
      views: randomViews.toLocaleString(),
      likes: randomLikes.toLocaleString(),
      shareability: Math.floor((funnyLevel + viralPotential + memeness) / 3)
    };
  };

  const memeStats = generateMemeStats();

  // Fun random meme facts
  const getRandomMemeFact = () => {
    const facts = [
      "This meme was born in the digital wilderness of the internet! 🌐",
      "Scientists say this meme can increase happiness by 42%! 🧬",
      "This meme has traveled through 7 dimensions of comedy! 🌌",
      "Legend says this meme was crafted by ancient meme lords! 👑",
      "This meme contains 99.9% pure comedy essence! ⚗️",
      "NASA uses this meme to communicate with aliens! 🛸",
      "This meme is certified organic and gluten-free! 🌱",
      "Warning: May cause uncontrollable laughter! ⚠️"
    ];
    return facts[Math.floor(Math.random() * facts.length)];
  };

  if (!meme) {
    return (
      <div className={`meme-container animate-fadeIn ${className}`}>
        <div className="flex items-center justify-center h-32 text-gray-400">
          <div className="text-center">
            <div className="text-2xl mb-1">🎭</div>
            <p className="heading-font text-sm">Waiting for meme...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`meme-container animate-fadeIn ${className}`}>
      <div className="text-center">
        {/* Compact Meme Title */}
        <div className="mb-1">
          <h2 className="heading-font text-lg md:text-xl text-white mb-0.5">
            {meme.title}
          </h2>
          {meme.description && (
            <p className="body-font text-gray-400 text-xs">
              {meme.description}
            </p>
          )}
        </div>

        {/* Compact Image Container */}
        <div className="relative inline-block">
          {/* Loading State */}
          {!imageLoaded && !imageError && (
            <div className="flex items-center justify-center w-full h-32 bg-gray-800 rounded-lg animate-pulse">
              <div className="text-center">
                <div className="text-2xl mb-1">🖼️</div>
                <p className="text-gray-400 text-xs">Loading meme...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {imageError && (
            <div className="flex items-center justify-center w-full h-32 bg-red-900/20 border-2 border-red-400 rounded-lg">
              <div className="text-center">
                <div className="text-2xl mb-1">❌</div>
                <p className="text-red-400 text-xs">Failed to load meme</p>
                <p className="text-gray-400 text-xs mt-1">{meme.filename}</p>
              </div>
            </div>
          )}

          {/* Compact Meme Image */}
          <img
            src={`/memes/${meme.filename}`}
            alt={meme.title}
            className={`meme-image max-w-full max-h-[20vh] mx-auto transition-all duration-500 rounded-lg ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{ 
              objectFit: 'contain',
              filter: imageLoaded ? 'none' : 'blur(4px)'
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />

          {/* Compact Floating Animation Elements */}
          {imageLoaded && (
            <>
              {/* Smaller sparkle effects */}
              <div className="absolute -top-1 -right-1 text-sm animate-bounce delay-75">
                ✨
              </div>
              <div className="absolute -bottom-1 -left-1 text-sm animate-bounce delay-150">
                ✨
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 via-transparent to-green-500/20 animate-pulse pointer-events-none"></div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default MemeDisplay;