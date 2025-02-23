# Tic Tac Toe vs AI with Q-Learning

This project is a full-fledged web application built using Python Flask (backend) and a React/Next.js frontend. It allows users to play a game of Tic Tac Toe against an AI powered by a Q-learning agent. The application supports multiple users simultaneously by isolating each game session with unique session IDs and includes rate limiting to prevent abuse.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [How It Works](#how-it-works)
  - [Session Management](#session-management)
  - [Game Flow](#game-flow)
- [Q-Learning Agent](#q-learning-agent)
  - [Concept and Theory](#concept-and-theory)
  - [Agent Training and Decision Making](#agent-training-and-decision-making)
- [API Endpoints](#api-endpoints)
- [Running the Project](#running-the-project)
- [Future Improvements](#future-improvements)

## Project Overview

This application allows a human player to compete against an AI in a Tic Tac Toe game. The AI uses Q-learning—a reinforcement learning technique—to learn and improve its strategy over time. The backend handles game logic, session management, and state updates, while the frontend provides an interactive interface.

## Architecture

- **Backend:** Python Flask application with endpoints for game state, moves, reset, and session management. It uses Flask-Limiter for rate limiting and threading for concurrent request handling.
- **Frontend:** A React/Next.js application that communicates with the backend via REST APIs.
- **Q-Learning Agent:** Implements a simple Q-learning algorithm to select moves and learn from game outcomes based on experience.

## How It Works

### Session Management

1. **Session IDs:**  
   Each user is assigned a unique session ID (stored in `localStorage`) to maintain an individual game state and scoreboard.
2. **State Isolation:**  
   The backend stores game states, scoreboards, and game logs per session, ensuring that multiple users do not interfere with each other's games.
3. **Session Cleanup:**  
   When the user closes the tab, an endpoint is triggered to delete the session and its corresponding backend data.

### Game Flow

1. **Game Initialization:**  
   When the game starts, the backend initializes the board, sets the initial turn, and creates a new game logger for the session.
2. **Human Move:**  
   The frontend sends a move (with the session ID) to the backend. The move is validated and applied to the game board.
3. **Win/Draw Check:**  
   After the human move, the backend checks if the human has won or if the board is full (draw).
4. **AI Move:**  
   If the game continues, the Q-learning agent selects a move based on the current board state. The move is applied, and the backend checks if the AI wins or if the game ends in a draw.
5. **Score Update:**  
   The scoreboard is updated according to the result (human win, AI win, or draw). The game state and game logger are updated, and the Q-learning agent is trained using the recorded game log.
6. **Resetting the Game:**  
   Users can reset the board without resetting the scoreboard. The backend endpoint resets only the board and the game logger.

## Q-Learning Agent

### Concept and Theory

Q-learning is a type of reinforcement learning algorithm where an agent learns to take actions in an environment by maximizing a cumulative reward. Key concepts include:

- **State:**  
  The current configuration of the Tic Tac Toe board.
- **Action:**  
  A move (placing an 'X' or 'O') in an available cell.
- **Reward:**  
  Feedback received after each move (e.g., winning gives a positive reward, losing gives a negative reward).
- **Q-Value:**  
  The expected future reward for taking a certain action from a given state. The agent updates these Q-values over time based on its experience.
- **Exploration vs. Exploitation:**  
  The agent uses an epsilon-greedy strategy to balance between exploring new moves and exploiting known moves with high Q-values.

### Agent Training and Decision Making

1. **Initialization:**  
   The agent loads a pre-saved model (if available) at the start of each request.
2. **Choosing an Action:**  
   The agent examines the board state, evaluates available moves, and selects a move by balancing between exploration (random moves) and exploitation (best-known move).
3. **Learning from Experience:**  
   After each game, the game logger stores the moves and results. The agent uses this log to update its Q-values through the learning process.
4. **Model Persistence:**  
   The updated model is saved to disk so that the agent can retain its learning across sessions.

## API Endpoints

- **GET /health:**  
  Checks the health of the application.
- **GET /game?session_id=YOUR_SESSION_ID:**  
  Returns the current game state, including the board, result, and scoreboard.
- **POST /move:**  
  Submits a move. Requires a JSON payload with `move` and `session_id`.
- **GET /reset?session_id=YOUR_SESSION_ID:**  
  Resets the game board (preserving the scoreboard).
- **GET /delete_session?session_id=YOUR_SESSION_ID:**  
  Deletes the session data when the user closes the tab.

> **Rate Limiting:**  
> All endpoints are rate-limited using Flask-Limiter to prevent abuse. For example, the `/move` endpoint is limited to 60 requests per minute.

## Running the Project

1. **Backend Setup:**
   - Repo: https://github.com/pixelcaliber/q-learning
     - Install dependencies: `pip install -r requirements.txt`
     - Set up configuration (e.g., `Config.RATE_LIMIT_STORAGE_URL`, `MODEL_SAVE_PATH`).
     - Run the Flask app: `flask run`
2. **Frontend Setup:**  
   - Ensure the `NEXT_PUBLIC_API_URL` environment variable is set to the backend URL.
   - Install dependencies and start the Next.js development server: `npm install && npm run dev`

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
