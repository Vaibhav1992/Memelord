# Memelord - Real-time Multiplayer Meme Caption Game

A browser-based, real-time multiplayer game where players caption tech-centric memes and vote for their favorites.

## Features

- **Real-time Multiplayer**: Up to 20 players per room with WebSocket communication
- **Room Management**: Create rooms with shareable codes and customizable settings
- **Meme Captioning**: Players write captions for randomly selected memes
- **Voting System**: Vote for favorite captions (can't vote for your own)
- **Live Leaderboard**: Real-time score tracking across multiple rounds
- **Game Customization**: Configurable rounds (1-20), timer (15-120s), and player limits
- **Profanity Filter**: Basic content moderation
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express + Socket.IO
- **Real-time**: WebSocket communication via Socket.IO
- **Storage**: In-memory (no database required)

## Quick Start

### Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

This will start both the backend server (port 3001) and frontend dev server (port 5173).

### Production

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Game Flow

1. **Create/Join Room**: Players create a room or join with a 6-digit code
2. **Setup**: Configure game settings (rounds, timer, max players)
3. **Caption Phase**: Players write captions for the displayed meme (45s default)
4. **Voting Phase**: Players vote for their favorite captions (same timer)
5. **Results**: Points awarded based on votes received
6. **Repeat**: Continue for configured number of rounds
7. **Victory**: Highest scoring player wins with confetti celebration

## API Endpoints

### REST API
- `POST /api/rooms` - Create a new room
- `POST /api/rooms/:id/join` - Join a room
- `GET /api/rooms/:code/info` - Get room information

### WebSocket Events

**Client → Server:**
- `join_room` - Join a game room
- `start_game` - Start the game (host only)
- `submit_caption` - Submit a caption
- `submit_vote` - Vote for a caption

**Server → Client:**
- `room_state` - Full room state snapshot
- `round_start` - New round begins
- `timer_tick` - Timer countdown
- `caption_submitted` - New caption added
- `vote_phase_start` - Voting phase begins
- `vote_submitted` - New vote cast
- `round_end` - Round results
- `game_end` - Final game results

## Project Structure

```
├── server/
│   ├── index.js              # Express server + Socket.IO
│   └── assets/
│       └── memes/
│           ├── manifest.json  # Meme metadata
│           └── *.jpg         # Meme images
├── src/
│   ├── components/
│   │   ├── HomePage.jsx      # Landing page
│   │   ├── JoinRoom.jsx      # Room joining
│   │   ├── GameRoom.jsx      # Main game interface
│   │   ├── Timer.jsx         # Countdown timer
│   │   ├── MemeDisplay.jsx   # Meme image display
│   │   ├── CaptionInput.jsx  # Caption submission
│   │   ├── CaptionList.jsx   # Caption display & voting
│   │   ├── Leaderboard.jsx   # Score tracking
│   │   └── GameEndModal.jsx  # Victory screen
│   ├── App.jsx               # Main app component
│   └── main.jsx              # React entry point
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Environment Variables

No environment variables required for basic setup. The app works out of the box.

For production deployment, you may want to set:
- `PORT` - Server port (default: 3001)
- `NODE_ENV=production` - Production mode

## Deployment

### Docker
```bash
# Build image
docker build -t memelord .

# Run container
docker run -p 3001:3001 memelord
```

### Cloud Platforms
- **Fly.io**: `fly deploy`
- **Render**: Connect GitHub repo
- **Railway**: Connect GitHub repo
- **Heroku**: `git push heroku main`

## Adding Memes

1. Add image files to `server/assets/memes/`
2. Update `server/assets/memes/manifest.json` with metadata:

```json
{
  "id": "unique-id",
  "filename": "image.jpg",
  "title": "Meme Title",
  "description": "Brief description"
}
```

## Testing

Run the test suite:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Meme Attribution

All memes are used under fair use for educational/entertainment purposes. Original creators retain all rights to their content.