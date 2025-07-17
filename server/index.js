const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? "*" : "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/memes', express.static(path.join(__dirname, 'assets/memes')));



// In-memory storage
const rooms = new Map();
const players = new Map();

// Meme manifest
const memes = require('./assets/memes/manifest.json');

// Profanity filter (simple word list)
const profanityWords = ['damn', 'hell', 'crap', 'stupid', 'idiot']; // Add more as needed

function filterProfanity(text) {
  let filtered = text;
  profanityWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filtered = filtered.replace(regex, '*'.repeat(word.length));
  });
  return filtered;
}

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function createRoom(settings = {}) {
  const roomId = uuidv4();
  const roomCode = generateRoomCode();
  
  const room = {
    id: roomId,
    code: roomCode,
    players: [],
    settings: {
      maxPlayers: settings.maxPlayers || 8,
      rounds: settings.rounds || 10,
      captionTimer: settings.captionTimer || 45
    },
    gameState: {
      phase: 'waiting', // waiting, caption, vote, results, ended
      currentRound: 0,
      currentMeme: null,
      captions: [],
      votes: {},
      scores: {},
      timer: 0,
      usedMemes: [] // Track which memes have been used in this game
    },
    createdAt: Date.now(),
    lastActivity: Date.now()
  };
  
  rooms.set(roomId, room);
  return room;
}

function getRandomMeme(room) {
  // Get available memes (not used yet)
  const availableMemes = memes.filter(meme => !room.gameState.usedMemes.includes(meme.id));
  
  // If all memes have been used, reset the used memes list
  if (availableMemes.length === 0) {
    room.gameState.usedMemes = [];
    return memes[Math.floor(Math.random() * memes.length)];
  }
  
  // Pick a random meme from available ones
  return availableMemes[Math.floor(Math.random() * availableMemes.length)];
}

function startNewRound(room) {
  room.gameState.currentRound++;
  room.gameState.phase = 'caption';
  room.gameState.currentMeme = getRandomMeme(room);
  
  // Track this meme as used
  if (room.gameState.currentMeme) {
    room.gameState.usedMemes.push(room.gameState.currentMeme.id);
  }
  
  room.gameState.captions = [];
  room.gameState.votes = {};
  room.gameState.timer = room.settings.captionTimer;
  
  console.log(`Starting round ${room.gameState.currentRound} for room ${room.code} with ${room.players.length} players`);
  console.log('Players:', room.players.map(p => p.name));
  console.log(`Selected meme: ${room.gameState.currentMeme?.title} (${room.gameState.usedMemes.length}/${memes.length} memes used)`);
  
  // Broadcast new round
  io.to(room.id).emit('round_start', {
    round: room.gameState.currentRound,
    meme: room.gameState.currentMeme,
    timer: room.gameState.timer
  });
  
  // Start timer
  startTimer(room);
}

function startTimer(room) {
  // Clear any existing timer first
  if (room.timerInterval) {
    clearInterval(room.timerInterval);
    room.timerInterval = null;
  }
  
  room.timerInterval = setInterval(() => {
    room.gameState.timer--;
    io.to(room.id).emit('timer_tick', { secondsLeft: room.gameState.timer });
    
    if (room.gameState.timer <= 0) {
      clearInterval(room.timerInterval);
      room.timerInterval = null;
      
      if (room.gameState.phase === 'caption') {
        // Switch to voting phase
        room.gameState.phase = 'vote';
        room.gameState.timer = 20; // 20 seconds for voting
        io.to(room.id).emit('vote_phase_start', { 
          captions: room.gameState.captions,
          timer: room.gameState.timer
        });
        startTimer(room);
      } else if (room.gameState.phase === 'vote') {
        // End round
        endRound(room);
      }
    }
  }, 1000);
}

function endRound(room) {
  // Calculate scores for this round
  const roundScores = {};
  room.gameState.captions.forEach(caption => {
    const votes = Object.values(room.gameState.votes).filter(vote => vote.captionId === caption.id).length;
    roundScores[caption.playerId] = votes;
    
    // Add to total scores
    const currentScore = room.gameState.scores[caption.playerId] || 0;
    room.gameState.scores[caption.playerId] = currentScore + votes;
  });
  
  room.gameState.phase = 'results';
  
  io.to(room.id).emit('round_end', {
    roundScores: roundScores,
    totalScores: room.gameState.scores,
    captions: room.gameState.captions
  });
  
  // Check if game is over
  if (room.gameState.currentRound >= room.settings.rounds) {
    setTimeout(() => endGame(room), 5000);
  } else {
    setTimeout(() => startNewRound(room), 5000);
  }
}

function endGame(room) {
  room.gameState.phase = 'ended';
  
  // Clear any running timer
  if (room.timerInterval) {
    clearInterval(room.timerInterval);
    room.timerInterval = null;
  }
  
  // Find winner
  let winner = null;
  let highestScore = -1;
  
  for (const [playerId, score] of Object.entries(room.gameState.scores)) {
    if (score > highestScore) {
      highestScore = score;
      winner = room.players.find(p => p.id === playerId);
    }
  }
  
  io.to(room.id).emit('game_end', {
    winner,
    finalScores: room.gameState.scores,
    players: room.players
  });
}

// API Routes
app.post('/api/rooms', (req, res) => {
  const { settings } = req.body;
  const room = createRoom(settings);
  
  res.json({
    roomId: room.id,
    roomCode: room.code,
    wsUrl: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001'
  });
});

app.post('/api/rooms/:id/join', (req, res) => {
  const { id } = req.params;
  const { playerName, avatar } = req.body;
  
  const room = rooms.get(id);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  if (room.players.length >= room.settings.maxPlayers) {
    return res.status(400).json({ error: 'Room is full' });
  }
  
  if (room.gameState.phase !== 'waiting') {
    return res.status(400).json({ error: 'Game already in progress' });
  }
  
  const playerId = uuidv4();
  const player = {
    id: playerId,
    name: playerName,
    avatar: avatar || '😀',
    joinedAt: Date.now()
  };
  
  room.players.push(player);
  room.gameState.scores[playerId] = 0;
  players.set(playerId, { roomId: id, ...player });
  
  res.json({
    playerId,
    roomState: {
      room: {
        id: room.id,
        code: room.code,
        settings: room.settings
      },
      players: room.players,
      gameState: room.gameState
    }
  });
});

app.get('/api/rooms/:code/info', (req, res) => {
  const { code } = req.params;
  const room = Array.from(rooms.values()).find(r => r.code === code.toUpperCase());
  
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  res.json({
    roomId: room.id,
    code: room.code,
    playerCount: room.players.length,
    maxPlayers: room.settings.maxPlayers,
    gamePhase: room.gameState.phase
  });
});

// Test route to verify server is working
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is working!',
    nodeEnv: process.env.NODE_ENV,
    serverDir: __dirname,
    distPath: path.resolve(__dirname, '../dist'),
    distExists: require('fs').existsSync(path.resolve(__dirname, '../dist'))
  });
});

// Serve frontend files in production (must be after API routes)
// Always serve static files in production or when dist folder exists
const distPath = path.resolve(__dirname, '../dist');
const distExists = require('fs').existsSync(distPath);

console.log('Server directory:', __dirname);
console.log('Dist path:', distPath);
console.log('Dist exists:', distExists);
console.log('NODE_ENV:', process.env.NODE_ENV);

if (distExists) {
  console.log('Dist contents:', require('fs').readdirSync(distPath));
  app.use(express.static(distPath));
  
  // Serve index.html for all routes (SPA)
  app.get('*', (req, res) => {
    console.log('Serving SPA route:', req.path);
    const indexPath = path.join(distPath, 'index.html');
    console.log('Index path:', indexPath);
    console.log('Index exists:', require('fs').existsSync(indexPath));
    res.sendFile(indexPath);
  });
} else {
  console.log('Dist folder not found - not serving static files');
}

// Cleanup inactive rooms every 5 minutes
setInterval(() => {
  const now = Date.now();
  const inactiveThreshold = 15 * 60 * 1000; // 15 minutes
  
  for (const [roomId, room] of rooms.entries()) {
    if (now - room.lastActivity > inactiveThreshold) {
      console.log(`Cleaning up inactive room: ${room.code}`);
      
      // Clear any running timer
      if (room.timerInterval) {
        clearInterval(room.timerInterval);
        room.timerInterval = null;
      }
      
      // Remove players from memory
      room.players.forEach(player => {
        players.delete(player.id);
      });
      
      rooms.delete(roomId);
    }
  }
}, 5 * 60 * 1000); // Run every 5 minutes

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join_room', ({ roomId, playerId }) => {
    const room = rooms.get(roomId);
    const player = players.get(playerId);
    
    if (!room || !player) {
      socket.emit('error', { message: 'Invalid room or player' });
      return;
    }
    
    socket.join(roomId);
    socket.playerId = playerId;
    socket.roomId = roomId;
    
    // Update room activity
    room.lastActivity = Date.now();
    
    console.log(`Player ${player.name} joined room ${room.code} (${room.players.length} players total)`);
    
    // Send current room state
    socket.emit('room_state', {
      room: {
        id: room.id,
        code: room.code,
        settings: room.settings
      },
      players: room.players,
      gameState: room.gameState
    });
    
    // Notify others
    socket.to(roomId).emit('player_joined', player);
  });
  
  socket.on('start_game', () => {
    const room = rooms.get(socket.roomId);
    if (!room || room.gameState.phase !== 'waiting') return;
    
    if (room.players.length < 2) {
      socket.emit('error', { message: 'Need at least 2 players to start' });
      return;
    }
    
    console.log(`Game started by player ${players.get(socket.playerId)?.name} in room ${room.code}`);
    startNewRound(room);
  });
  
  socket.on('submit_caption', ({ text }) => {
    const room = rooms.get(socket.roomId);
    if (!room || room.gameState.phase !== 'caption') return;
    
    // Update room activity
    room.lastActivity = Date.now();
    
    // Check if player already submitted
    const existingCaption = room.gameState.captions.find(c => c.playerId === socket.playerId);
    if (existingCaption) return;
    
    const filteredText = filterProfanity(text.trim());
    if (!filteredText) return;
    
    const caption = {
      id: uuidv4(),
      playerId: socket.playerId,
      playerName: players.get(socket.playerId).name,
      text: filteredText,
      submittedAt: Date.now()
    };
    
    room.gameState.captions.push(caption);
    
    // Broadcast new caption
    io.to(socket.roomId).emit('caption_submitted', caption);
    
    // Check if all players have submitted captions
    if (room.gameState.captions.length === room.players.length) {
      // All players submitted, move to voting phase immediately
      // Clear existing timer first to prevent race conditions
      if (room.timerInterval) {
        clearInterval(room.timerInterval);
        room.timerInterval = null;
      }
      
      room.gameState.phase = 'vote';
      room.gameState.timer = 20; // 20 seconds for voting
      io.to(socket.roomId).emit('vote_phase_start', { 
        captions: room.gameState.captions,
        timer: room.gameState.timer
      });
      startTimer(room);
    }
  });
  
  socket.on('submit_vote', ({ captionId }) => {
    const room = rooms.get(socket.roomId);
    if (!room || room.gameState.phase !== 'vote') return;
    
    // Update room activity
    room.lastActivity = Date.now();
    
    // Check if voting for own caption
    const caption = room.gameState.captions.find(c => c.id === captionId);
    if (!caption || caption.playerId === socket.playerId) return;
    
    // Allow changing votes or voting multiple times
    room.gameState.votes[socket.playerId] = {
      captionId,
      voterId: socket.playerId,
      votedAt: Date.now()
    };
    
    // Broadcast vote
    io.to(socket.roomId).emit('vote_submitted', {
      captionId,
      voterId: socket.playerId
    });
    
    // Check if all eligible voters have voted (excluding caption authors)
    const captionAuthors = room.gameState.captions.map(c => c.playerId);
    const eligibleVoters = room.players.filter(p => !captionAuthors.includes(p.id));
    const votedCount = Object.keys(room.gameState.votes).length;
    
    if (votedCount === eligibleVoters.length) {
      // All eligible voters have voted, end round immediately
      // Clear existing timer first to prevent race conditions
      if (room.timerInterval) {
        clearInterval(room.timerInterval);
        room.timerInterval = null;
      }
      
      endRound(room);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    if (socket.roomId && socket.playerId) {
      const room = rooms.get(socket.roomId);
      if (room) {
        // Remove player from room
        room.players = room.players.filter(p => p.id !== socket.playerId);
        
        // Notify others
        socket.to(socket.roomId).emit('player_left', { playerId: socket.playerId });
        
        // Clean up empty rooms
        if (room.players.length === 0) {
          // Clear any running timer
          if (room.timerInterval) {
            clearInterval(room.timerInterval);
            room.timerInterval = null;
          }
          rooms.delete(socket.roomId);
        }
      }
      
      players.delete(socket.playerId);
    }
  });
});

// Clean up inactive rooms
setInterval(() => {
  const now = Date.now();
  const FIFTEEN_MINUTES = 15 * 60 * 1000;
  
  for (const [roomId, room] of rooms) {
    if (now - room.lastActivity > FIFTEEN_MINUTES) {
      rooms.delete(roomId);
      console.log(`Cleaned up inactive room: ${roomId}`);
    }
  }
}, 60000); // Check every minute

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});