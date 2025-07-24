import React, { useEffect, useRef, useState } from 'react';

const SoundSystem = ({ 
  playVoteSound, 
  playWinSound, 
  playTimerTick, 
  playTransition, 
  playHurrySound,
  timerSeconds,
  gamePhase,
  volume = 0.1,
  isMuted = false,
  onVolumeChange,
  onToggleMute
}) => {
  const audioContext = useRef(null);
  const gainNode = useRef(null);
  const lastTimerSound = useRef(0);
  // Removed ambient music - only keeping game sound effects

  const initializeAudio = () => {
    if (!audioContext.current) {
      try {
        audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
        gainNode.current = audioContext.current.createGain();
        gainNode.current.connect(audioContext.current.destination);
        gainNode.current.gain.value = 0.4; // Set volume to 40%
        
        // Resume audio context if suspended
        if (audioContext.current.state === 'suspended') {
          audioContext.current.resume();
        }
      } catch (error) {
        console.warn('Web Audio API not supported:', error);
      }
    }
  };

  // Removed ambient music initialization

  useEffect(() => {
    // Initialize on first user interaction
    const handleUserInteraction = () => {
      initializeAudio();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
    
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  // Create different sound frequencies and patterns
  const createSound = (frequency, duration, type = 'sine', volume = 0.3) => {
    initializeAudio();
    
    if (!audioContext.current) return;
    
    // Resume audio context if suspended
    if (audioContext.current.state === 'suspended') {
      audioContext.current.resume();
    }
    
    try {
      const oscillator = audioContext.current.createOscillator();
      const gain = audioContext.current.createGain();
      
      oscillator.connect(gain);
      gain.connect(audioContext.current.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gain.gain.setValueAtTime(0, audioContext.current.currentTime);
      gain.gain.linearRampToValueAtTime(volume, audioContext.current.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + duration);
      
      oscillator.start(audioContext.current.currentTime);
      oscillator.stop(audioContext.current.currentTime + duration);
    } catch (error) {
      console.warn('Error creating sound:', error);
    }
  };

  const createComplexSound = (notes, duration = 0.2) => {
    if (!audioContext.current) return;
    
    notes.forEach((note, index) => {
      setTimeout(() => {
        createSound(note.frequency, note.duration || duration, note.type || 'sine', note.volume || 0.3);
      }, index * (duration * 1000 / notes.length));
    });
  };

  // Vote sound effect - satisfying pop/click
  useEffect(() => {
    if (playVoteSound && !isMuted) {
      createComplexSound([
        { frequency: 800, duration: 0.1, type: 'sine', volume: 0.4 },
        { frequency: 1000, duration: 0.1, type: 'sine', volume: 0.3 }
      ]);
    }
  }, [playVoteSound, isMuted]);

  // Win sound effect - cheerful melodic flourish
  useEffect(() => {
    if (playWinSound && !isMuted) {
      createComplexSound([
        { frequency: 523, duration: 0.2, type: 'sine', volume: 0.4 }, // C5
        { frequency: 659, duration: 0.2, type: 'sine', volume: 0.4 }, // E5
        { frequency: 784, duration: 0.2, type: 'sine', volume: 0.4 }, // G5
        { frequency: 1047, duration: 0.4, type: 'sine', volume: 0.5 } // C6
      ], 0.15);
    }
  }, [playWinSound, isMuted]);

  // Timer tick sound - increases intensity as time runs out (reduced volume)
  useEffect(() => {
    if (playTimerTick && timerSeconds !== lastTimerSound.current && !isMuted) {
      lastTimerSound.current = timerSeconds;
      
      if (timerSeconds <= 10 && timerSeconds > 0) {
        // Urgent ticking for last 10 seconds
        const urgency = (11 - timerSeconds) / 10; // 0.1 to 1.0
        createSound(
          1200 + (urgency * 400), // Higher frequency as time runs out
          0.1,
          'square',
          0.1 + (urgency * 0.2) // Reduced volume: 0.1 to 0.3 (was 0.2 to 0.5)
        );
      } else if (timerSeconds > 10) {
        // Normal ticking - reduced volume
        createSound(800, 0.05, 'sine', 0.08); // Reduced from 0.15 to 0.08
      }
    }
  }, [playTimerTick, timerSeconds, isMuted]);

  // Improved transition sound - fun and engaging
  useEffect(() => {
    if (playTransition && !isMuted) {
      // Create a fun transition sound based on the game phase
      if (!audioContext.current) return;
      
      let transitionNotes = [];
      
      // Different transition sounds for different phases
      if (gamePhase === 'caption') {
        // Exciting "let's caption!" sound
        transitionNotes = [
          { frequency: 440, duration: 0.15, type: 'sine', volume: 0.3 }, // A4
          { frequency: 554, duration: 0.15, type: 'sine', volume: 0.3 }, // C#5
          { frequency: 659, duration: 0.3, type: 'sine', volume: 0.4 }   // E5
        ];
      } else if (gamePhase === 'vote') {
        // Fun voting sound
        transitionNotes = [
          { frequency: 523, duration: 0.1, type: 'sine', volume: 0.3 },  // C5
          { frequency: 659, duration: 0.1, type: 'sine', volume: 0.3 },  // E5
          { frequency: 784, duration: 0.1, type: 'sine', volume: 0.3 },  // G5
          { frequency: 1047, duration: 0.2, type: 'sine', volume: 0.4 }  // C6
        ];
      } else if (gamePhase === 'results') {
        // Triumphant results sound
        transitionNotes = [
          { frequency: 659, duration: 0.2, type: 'sine', volume: 0.4 },  // E5
          { frequency: 784, duration: 0.2, type: 'sine', volume: 0.4 },  // G5
          { frequency: 988, duration: 0.4, type: 'sine', volume: 0.5 }   // B5
        ];
      } else {
        // Default fun transition
        transitionNotes = [
          { frequency: 330, duration: 0.1, type: 'sine', volume: 0.3 },  // E4
          { frequency: 440, duration: 0.1, type: 'sine', volume: 0.3 },  // A4
          { frequency: 554, duration: 0.2, type: 'sine', volume: 0.4 }   // C#5
        ];
      }
      
      createComplexSound(transitionNotes, 0.1);
    }
  }, [playTransition, gamePhase, isMuted]);

  // Hurray sound effect - celebratory sound for displaying winners
  useEffect(() => {
    if (playHurrySound && !isMuted) {
      // Create a celebratory "hurray!" sound with joyful ascending notes
      createComplexSound([
        { frequency: 523, duration: 0.2, type: 'sine', volume: 0.4 },    // C5
        { frequency: 659, duration: 0.2, type: 'sine', volume: 0.4 },    // E5
        { frequency: 784, duration: 0.2, type: 'sine', volume: 0.4 },    // G5
        { frequency: 1047, duration: 0.3, type: 'sine', volume: 0.5 },   // C6
        { frequency: 1319, duration: 0.4, type: 'sine', volume: 0.6 }    // E6
      ], 0.15);
    }
  }, [playHurrySound, isMuted]);

  return null; // This component doesn't render anything
};

export default SoundSystem; 