import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import HomePage from './components/HomePage';
import GameRoom from './components/GameRoom';
import JoinRoom from './components/JoinRoom';

function App() {
  const [currentView, setCurrentView] = useState('home'); // home, join, game
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [player, setPlayer] = useState(null);
  const [room, setRoom] = useState(null);
  const [playerInfo, setPlayerInfo] = useState({ name: '', avatar: '😀' });
  const [ambientVolume, setAmbientVolume] = useState(0.05); // Very low volume for app-wide ambient
  const [isAmbientMuted, setIsAmbientMuted] = useState(false);
  const ambientAudioContext = useRef(null);
  const ambientOscillators = useRef([]);

  // Initialize ambient music for the entire app
  const initializeAmbientMusic = () => {
    if (!ambientAudioContext.current) {
      try {
        ambientAudioContext.current = new (window.AudioContext || window.webkitAudioContext)();
        
        // Resume audio context if suspended
        if (ambientAudioContext.current.state === 'suspended') {
          ambientAudioContext.current.resume();
        }
      } catch (error) {
        console.warn('Web Audio API not supported for ambient music:', error);
      }
    }
  };

    const startAmbientMusic = () => {
    if (!ambientAudioContext.current || isAmbientMuted) return;
    
    try {
      // Stop existing oscillators
      stopAmbientMusic();
      
      const ambientGain = ambientAudioContext.current.createGain();
      ambientGain.gain.value = ambientVolume;
      ambientGain.connect(ambientAudioContext.current.destination);
      
      // Create multiple oscillators for rich ambient sound
      const frequencies = [110, 220, 330, 440]; // A2, A3, E4, A4
      const volumes = [0.02, 0.015, 0.01, 0.008]; // Very low volumes
      
      frequencies.forEach((freq, index) => {
        const osc = ambientAudioContext.current.createOscillator();
        const gain = ambientAudioContext.current.createGain();
        
        osc.connect(gain);
        gain.connect(ambientGain);
        
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.value = volumes[index];
        
        // Add very subtle frequency modulation for movement
        const lfo = ambientAudioContext.current.createOscillator();
        const lfoGain = ambientAudioContext.current.createGain();
        
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        
        lfo.frequency.value = 0.05; // Very slow modulation
        lfoGain.gain.value = 1; // Small frequency change
        
        lfo.start();
        osc.start();
        
        ambientOscillators.current.push({ osc, gain, lfo });
      });
      
      // Loop the ambient sound
      setTimeout(() => {
        if (!isAmbientMuted) {
          startAmbientMusic();
        }
      }, 12000); // 12 second loop
    } catch (error) {
      console.warn('Error starting ambient music:', error);
    }
  };

  const stopAmbientMusic = () => {
    ambientOscillators.current.forEach(({ osc, gain, lfo }) => {
      try {
        osc.stop();
        lfo.stop();
      } catch (error) {
        // Oscillator might already be stopped
      }
    });
    ambientOscillators.current = [];
  };

  // Initialize ambient music on first user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      initializeAmbientMusic();
      if (!isAmbientMuted) {
        startAmbientMusic();
      }
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
    
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [isAmbientMuted]);

  // Update ambient music when mute state changes
  useEffect(() => {
    if (isAmbientMuted) {
      stopAmbientMusic();
    } else if (ambientAudioContext.current) {
      startAmbientMusic();
    }
  }, [isAmbientMuted]);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
      stopAmbientMusic();
      if (ambientAudioContext.current) {
        ambientAudioContext.current.close();
      }
    };
  }, [socket]);

  const createRoom = async (settings) => {
    try {
      console.log('Environment check:', {
        DEV: import.meta.env.DEV,
        VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
        NODE_ENV: import.meta.env.NODE_ENV
      });
      
      // Use relative URL in production, localhost in development
      const backendUrl = import.meta.env.DEV ? 'http://localhost:3001' : '';
      console.log('Using backend URL:', backendUrl);
      
      const response = await fetch(`${backendUrl}/api/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  };

  const joinRoom = async (roomId, playerName, avatar) => {
    try {
      // Use relative URL in production, localhost in development
      const backendUrl = import.meta.env.DEV ? 'http://localhost:3001' : '';
      const response = await fetch(`${backendUrl}/api/rooms/${roomId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerName, avatar }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  };

  const connectToRoom = (roomId, playerId) => {
    // Use relative URL in production, localhost in development
    const socketUrl = import.meta.env.DEV ? 'http://localhost:3001' : '';
    const newSocket = io(socketUrl);
    
    newSocket.on('connect', () => {
      console.log('Connected to server');
      newSocket.emit('join_room', { roomId, playerId });
    });

    newSocket.on('room_state', (state) => {
      setRoom(state.room);
      setGameState({
        ...state.gameState,
        players: state.players // Ensure players are included in gameState
      });
      setPlayer(state.players.find(p => p.id === playerId));
    });

    newSocket.on('player_joined', (newPlayer) => {
      setGameState(prev => ({
        ...prev,
        players: [...(prev.players || []), newPlayer]
      }));
    });

    newSocket.on('player_left', ({ playerId: leftPlayerId }) => {
      setGameState(prev => ({
        ...prev,
        players: (prev.players || []).filter(p => p.id !== leftPlayerId)
      }));
    });

    newSocket.on('round_start', (data) => {
      setGameState(prev => ({
        ...prev,
        phase: 'caption',
        currentRound: data.round,
        currentMeme: data.meme,
        timer: data.timer,
        captions: [],
        votes: {}, // Use plain object instead of Map
        players: prev.players // Preserve the players array
      }));
    });

    newSocket.on('timer_tick', ({ secondsLeft }) => {
      setGameState(prev => ({
        ...prev,
        timer: secondsLeft,
        players: prev.players // Preserve the players array
      }));
    });

    newSocket.on('caption_submitted', (caption) => {
      setGameState(prev => ({
        ...prev,
        captions: [...(prev.captions || []), caption],
        players: prev.players // Preserve the players array
      }));
    });

    newSocket.on('vote_phase_start', ({ captions, timer }) => {
      setGameState(prev => ({
        ...prev,
        phase: 'vote',
        captions,
        timer,
        currentMeme: prev.currentMeme, // Preserve the meme from caption phase
        players: prev.players // Preserve the players array
      }));
    });

      newSocket.on('vote_submitted', ({ captionId, voterId }) => {
      setGameState(prev => {
        const newVotes = { ...(prev.votes || {}) };
        newVotes[voterId] = { captionId, voterId };
        return {
          ...prev,
          votes: newVotes,
          players: prev.players // Preserve the players array
        };
      });
    });

    newSocket.on('round_end', ({ roundScores, totalScores, captions }) => {
      setGameState(prev => ({
        ...prev,
        phase: 'results',
        roundScores,
        scores: totalScores, // Use plain object instead of Map
        captions,
        players: prev.players // Preserve the players array
      }));
    });

    newSocket.on('game_end', ({ winner, finalScores, players }) => {
      setGameState(prev => ({
        ...prev,
        phase: 'ended',
        winner,
        finalScores,
        allPlayers: players,
        players: prev.players // Preserve the players array
      }));
    });

    newSocket.on('error', ({ message }) => {
      console.error('Socket error:', message);
      alert(`Connection error: ${message}`);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      alert('Failed to connect to server. Please try again.');
    });

    setSocket(newSocket);
  };

  const handleCreateRoom = async (settings, playerName, avatar) => {
    try {
      const roomData = await createRoom(settings);
      const joinData = await joinRoom(roomData.roomId, playerName, avatar);
      
      connectToRoom(roomData.roomId, joinData.playerId);
      setCurrentView('game');
    } catch (error) {
      console.error('Error creating room:', error);
      alert(`Failed to create room: ${error.message}`);
    }
  };

  const handleJoinRoom = async (roomCode) => {
    try {
      // First get room info by code to get the actual room ID
      const backendUrl = import.meta.env.DEV ? 'http://localhost:3001' : '';
      const roomInfoResponse = await fetch(`${backendUrl}/api/rooms/${roomCode.toUpperCase()}/info`);
      
      if (!roomInfoResponse.ok) {
        throw new Error('Room not found');
      }
      
      const roomInfo = await roomInfoResponse.json();
      const joinData = await joinRoom(roomInfo.roomId, playerInfo.name, playerInfo.avatar);
      
      connectToRoom(roomInfo.roomId, joinData.playerId);
      setCurrentView('game');
    } catch (error) {
      console.error('Error joining room:', error);
      alert(`Failed to join room: ${error.message}`);
    }
  };

  const handleLeaveRoom = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setGameState(null);
    setPlayer(null);
    setRoom(null);
    setCurrentView('home');
  };

  if (currentView === 'home') {
    return (
      <>
        <HomePage
          onCreateRoom={handleCreateRoom}
          onJoinRoom={(name, avatar) => {
            setPlayerInfo({ name, avatar });
            setCurrentView('join');
          }}
        />
        {/* App-wide ambient music control */}
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setIsAmbientMuted(!isAmbientMuted)}
            className="btn-outline p-3 rounded-full hover:scale-105 active:scale-95 transition-all duration-200"
            title={isAmbientMuted ? "Enable Ambient Music" : "Disable Ambient Music"}
          >
            <span className="text-xl">
              {isAmbientMuted ? '🔇' : '🎵'}
            </span>
          </button>
        </div>
      </>
    );
  }

  if (currentView === 'join') {
    return (
      <>
        <JoinRoom
          onJoinRoom={handleJoinRoom}
          onBack={() => setCurrentView('home')}
          playerName={playerInfo.name}
          avatar={playerInfo.avatar}
        />
        {/* App-wide ambient music control */}
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setIsAmbientMuted(!isAmbientMuted)}
            className="btn-outline p-3 rounded-full hover:scale-105 active:scale-95 transition-all duration-200"
            title={isAmbientMuted ? "Enable Ambient Music" : "Disable Ambient Music"}
          >
            <span className="text-xl">
              {isAmbientMuted ? '🔇' : '🎵'}
            </span>
          </button>
        </div>
      </>
    );
  }

  if (currentView === 'game' && socket && gameState && player && room) {
    return (
      <GameRoom
        socket={socket}
        gameState={gameState}
        player={player}
        room={room}
        onLeaveRoom={handleLeaveRoom}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
        <p className="mt-4 text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

export default App;