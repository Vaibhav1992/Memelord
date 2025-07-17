import React, { useEffect, useState } from 'react';

const Confetti = ({ isActive }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'][Math.floor(Math.random() * 6)],
        size: Math.random() * 10 + 5,
        speed: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5
      }));
      setParticles(newParticles);
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive || particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          y: particle.y + particle.speed,
          rotation: particle.rotation + particle.rotationSpeed
        })).filter(particle => particle.y < window.innerHeight + 100)
      );
    }, 50);

    return () => clearInterval(interval);
  }, [isActive, particles]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            width: particle.size,
            height: particle.size,
            transform: `rotate(${particle.rotation}deg)`,
            transition: 'all 0.05s linear'
          }}
        />
      ))}
    </div>
  );
};

export default Confetti; 