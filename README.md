# Resilient Live Polling System

A real-time, resilient polling application designed for classrooms. It features separate personas for Teachers and Students, with robust handling of state recovery, page refreshes, and late joiners.

## Features

### 👨‍🏫 Teacher Persona
- **Create Polls**: Set questions, options, and duration.
- **Live Dashboard**: View real-time voting results as smooth progress bars.
- **Poll History**: Access a log of all previously conducted polls.
- **State Recovery**: Refreshing the browser does not lose the active poll state.

### 👨‍🎓 Student Persona
- **Instant Join**: Enter a name to join the session.
- **Real-time Sync**: Questions appear instantly when asked.
- **Smart Timer**: Timer automatically attempts to sync with the server. If you join 10 seconds late to a 60s question, your timer starts at 50s.
- **Voting**: Single vote per question enforced by both client and server.

### 🛡️ Resilience & Architecture
- **Source of Truth**: The server maintains the master state (Active Poll, Time Remaining).
- **Socket.io**: Used for instant bidirectional communication.
- **MongoDB**: Persists all polls and votes.
- **Graceful Error Handling**: The system handles database disconnects and connection drops without crashing the UI.

## Tech Stack

- **Frontend**: React (Vite), Socket.io-client, CSS Variables
- **Backend**: Node.js, Express, Socket.io
- **Database**: MongoDB (Atlas or Local)

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Connection String (Atlas or Local)

### Installation

1. **Clone the repository** (if you haven't already).
2. **Install dependencies** for both server and client:
   
   ```bash
   npm install && npm run install-all
   ```
   *(Or manually `npm install` in root, `server`, and `client` folders)*

3. **Configure Environment Variables**:
   Create a `.env` file in the `server/` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   CLIENT_URL=http://localhost:5173
   ```
   *(Note: A default `.env` with your Atlas URI is already set up)*

### Running the App

We have a convenient script to run both backend and frontend concurrently:

```bash
npm run dev
```

- **Server** runs on `http://localhost:5000`
- **Client** runs on `http://localhost:5173`

## Usage Workflow

1. **Open the App**: Go to `http://localhost:5173`.
2. **Teacher View**:
   - Click "Teacher" card.
   - If no poll is active, you will see the "Create Poll" form.
   - Create a poll (e.g., "What is 2+2?", Options: "3", "4", Duration: 60s).
   - Watch live results come in.
   - When time expires, you can create a new poll.
3. **Student View**:
   - Open a new tab/window at `http://localhost:5173` and click "Student".
   - Enter your name.
   - If a poll is active, you see it immediately. If not, you see a "Waiting..." screen.
   - Select an option to vote.
   - See the results once voting ends.