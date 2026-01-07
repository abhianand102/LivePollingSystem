# Deployment Guide (Render.com)

## The Easiest Way (Blueprint)

1.  **Push Code**: Ensure `render.yaml` is in your GitHub repo (it is now).
2.  **Dashboard**: Go to [Render Dashboard](https://dashboard.render.com/).
3.  **New Blueprint**: Click **New +** -> **Blueprint**.
4.  **Connect**: Select your `LivePollingSystem` repository.
5.  **Environment Variables**:
    *   Enter your `MONGO_URI` when prompted.
    *   Click **Apply**.
6.  **Done**: Render will deploy both Server and Client. The links will appear in your dashboard.

## Manual Way (Free Tier Specifics)

If you prefer to create them manually:

### 1. Backend (Web Service)
*   **Root**: `server`
*   **Build**: `npm install`
*   **Start**: `node index.js`
*   **Env Var**: `MONGO_URI` = ...
*   **Env Var**: `CLIENT_URL` = `https://your-client-app.onrender.com` (Add this later)

### 2. Frontend (Static Site)
*   **Root**: `client`
*   **Build**: `npm install && npm run build`
*   **Publish**: `dist`
*   **Env Var**: `VITE_SOCKET_URL` = `https://your-server-app.onrender.com`
