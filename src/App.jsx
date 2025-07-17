import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
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
      
      const backendUrl = import.meta.env.DEV ? '' : import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
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
      const backendUrl = import.meta.env.DEV ? '' : import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
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
    const newSocket = io(import.meta.env.DEV ? 'http://localhost:3001' : import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001');
    
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
      alert(message);
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
      alert(error.message);
    }
  };

  const handleJoinRoom = async (roomId, playerName, avatar) => {
    try {
      const joinData = await joinRoom(roomId, playerName, avatar);
      
      connectToRoom(roomId, joinData.playerId);
      setCurrentView('game');
    } catch (error) {
      alert(error.message);
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
      <HomePage
        onCreateRoom={handleCreateRoom}
        onJoinRoom={() => setCurrentView('join')}
      />
    );
  }

  if (currentView === 'join') {
    return (
      <JoinRoom
        onJoinRoom={handleJoinRoom}
        onBack={() => setCurrentView('home')}
      />
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