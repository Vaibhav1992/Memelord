import React from 'react';

const MemeDisplay = ({ meme }) => {
  return (
    <div className="card">
      <div className="text-center">
        <img
          src={`/memes/${meme.filename}`}
          alt={meme.title}
          className="max-w-full max-h-[60vh] mx-auto rounded-lg shadow-lg"
          style={{ objectFit: 'contain' }}
        />
        <p className="mt-2 text-gray-400 text-sm">{meme.title}</p>
      </div>
    </div>
  );
};

export default MemeDisplay;