# Deployment Guide (Render.com)

This project is configured for easy deployment on Render using the `render.yaml` Blueprint.

## Steps

1.  **Push to GitHub**: Ensure your latest code (with `render.yaml`) is pushed to your GitHub repository.
2.  **Log in to Render**: Go to [dashboard.render.com](https://dashboard.render.com/).
3.  **Create Blueprint**:
    *   Click **New+** -> **Blueprint**.
    *   Connect your GitHub repository.
    *   Give it a name.
4.  **Configure Environment**:
    *   Render will detect the `render.yaml` file.
    *   It might ask you for `MONGO_URI`. Paste the same connection string you used locally (from `.env`).
    *   **Note**: `CLIENT_URL` and `VITE_SOCKET_URL` are automatically handled by the Blueprint magic!
5.  **Apply**: Click **Apply Setup**.

## Manual Setup (If Blueprint fails)

If you prefer manual control:

### 1. Backend Service
- Create a **Web Service**.
- **Root**: `server`
- **Build**: `npm install`
- **Start**: `node index.js`
- **Env Vars**:
    - `MONGO_URI`: (Your Atlas URL)
    - `CLIENT_URL`: (Add this *after* deploying the frontend, or use `*` temporarily)

### 2. Frontend Site
- Create a **Static Site**.
- **Root**: `client`
- **Build**: `npm install && npm run build`
- **Publish**: `dist`
- **Env Vars**:
    - `VITE_SOCKET_URL`: (The URL of your deployed Backend Service, e.g., `https://live-polling-server.onrender.com`)

## Docker?
You asked about Docker. For this project, **Docker is not required** and native deployment (as above) is simpler and faster. However, if you *really* want to use Docker, you would need to create a `Dockerfile` for the server, but Render's native Node.js environment is optimized for this exactly.
