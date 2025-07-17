# Memelord Architecture Documentation

## Overview

Memelord is a real-time multiplayer web application built with a client-server architecture using WebSockets for real-time communication. The system is designed to handle multiple concurrent game rooms with low latency and high reliability.

## System Architecture

### High-Level Architecture

```
┌─────────────────┐    WebSocket    ┌─────────────────┐
│   React Client  │ ←──────────────→ │  Node.js Server │
│   (Frontend)    │                 │   (Backend)     │
└─────────────────┘                 └─────────────────┘
        │                                   │
        │ HTTP REST API                     │
        └───────────────────────────────────┘
```

### Component Architecture

#### Frontend (React)
- **App.jsx**: Main application orchestrator, handles routing and global state
- **HomePage**: Landing page with create/join room options
- **JoinRoom**: Room joining interface with code input
- **GameRoom**: Main game interface container
- **Game Components**: Specialized UI components for different game phases

#### Backend (Node.js + Express)
- **HTTP Server**: REST API for room management
- **WebSocket Server**: Real-time game state synchronization
- **Game Engine**: In-memory game state management
- **Asset Server**: Static meme image serving

## Data Flow

### Room Creation Flow
```
Client → POST /api/rooms → Server creates room → Returns room ID & code
```

### Room Joining Flow
```
Client → POST /api/rooms/:id/join → Server validates → Returns player ID & room state
Client → WebSocket connect → join_room event → Server adds to room → Broadcasts player_joined
```

### Game Loop Flow
```
1. Host starts game → start_game event
2. Server starts round → round_start broadcast
3. Players submit captions → caption_submitted broadcasts
4. Timer expires → vote_phase_start broadcast
5. Players vote → vote_submitted broadcasts
6. Timer expires → round_end broadcast
7. Repeat or game_end broadcast
```

## Real-Time Communication

### WebSocket Events

#### Client → Server Events
- `join_room`: Join a game room
- `start_game`: Initialize game (host only)
- `submit_caption`: Submit caption text
- `submit_vote`: Cast vote for caption

#### Server → Client Events
- `room_state`: Complete room state snapshot
- `player_joined/left`: Player connection changes
- `round_start`: New round initialization
- `timer_tick`: Countdown updates
- `caption_submitted`: New caption available
- `vote_phase_start`: Switch to voting
- `vote_submitted`: New vote cast
- `round_end`: Round results
- `game_end`: Final game results

### State Synchronization

The server maintains authoritative game state and broadcasts changes to all connected clients. Clients maintain local state copies and update based on server events.

## Data Models

### Room Model
```javascript
{
  id: string,           // UUID
  code: string,         // 6-digit alphanumeric
  players: Player[],    // Connected players
  settings: {
    maxPlayers: number,
    rounds: number,
    captionTimer: number
  },
  gameState: GameState,
  createdAt: timestamp,
  lastActivity: timestamp
}
```

### Player Model
```javascript
{
  id: string,          // UUID
  name: string,        // Display name
  avatar: string,      // Emoji character
  joinedAt: timestamp
}
```

### GameState Model
```javascript
{
  phase: string,           // 'waiting', 'caption', 'vote', 'results', 'ended'
  currentRound: number,
  currentMeme: Meme,
  captions: Caption[],
  votes: Map<playerId, Vote>,
  scores: Map<playerId, number>,
  timer: number
}
```

### Caption Model
```javascript
{
  id: string,
  playerId: string,
  playerName: string,
  text: string,
  submittedAt: timestamp
}
```

## Game State Management

### Phase Transitions
```
waiting → caption → vote → results → caption (next round) → ended
```

### Timer Management
Each phase has a configurable timer that triggers automatic phase transitions:
- Caption phase: Players submit captions
- Vote phase: Players vote on captions
- Results phase: Brief display of round results

### Score Calculation
- Points = number of votes received for caption
- Cumulative scoring across all rounds
- Winner determined by highest total score

## Security & Moderation

### Input Validation
- Caption length limits (200 characters)
- Player name length limits (20 characters)
- Room code format validation

### Profanity Filter
Simple word-list based filtering on caption submission:
```javascript
function filterProfanity(text) {
  // Replace profane words with asterisks
}
```

### Rate Limiting
- One caption per player per round
- One vote per player per round
- Cannot vote for own caption

## Performance Considerations

### Memory Management
- In-memory storage for all game state
- Automatic cleanup of inactive rooms (15 minutes)
- Player cleanup on disconnect

### Scalability
- Single server instance supports ~100 concurrent rooms
- ~2000 concurrent WebSocket connections
- Stateless design allows horizontal scaling

### Latency Optimization
- Direct WebSocket communication
- Minimal data in broadcasts
- Client-side state caching

## Error Handling

### Client-Side
- Connection loss detection
- Automatic reconnection attempts
- Graceful degradation for network issues

### Server-Side
- Invalid room/player validation
- Graceful handling of malformed events
- Automatic cleanup of orphaned resources

## Deployment Architecture

### Development
```
Frontend (Vite dev server) :5173 ← Proxy → Backend (Node.js) :3001
```

### Production
```
Single Node.js server serving static files + WebSocket server
```

### Container Deployment
- Single container image
- Environment-based configuration
- Health check endpoints

## Monitoring & Logging

### Metrics to Track
- Active rooms count
- Connected players count
- Average game duration
- Caption submission rates
- Vote participation rates

### Logging
- Room creation/destruction
- Player connections/disconnections
- Game phase transitions
- Error conditions

## Future Enhancements

### Scalability Improvements
- Redis for shared state across instances
- Load balancer with sticky sessions
- Database persistence for game history

### Feature Extensions
- Spectator mode
- Custom meme uploads
- Advanced moderation tools
- Game replay system
- Tournament brackets

## Testing Strategy

### Unit Tests
- Game state transitions
- Score calculations
- Input validation
- Profanity filtering

### Integration Tests
- WebSocket event flows
- Multi-player scenarios
- Room lifecycle management

### Load Testing
- Concurrent room capacity
- WebSocket connection limits
- Memory usage under load

This architecture provides a solid foundation for real-time multiplayer gaming while maintaining simplicity and performance.