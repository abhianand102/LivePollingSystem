# Manual Deployment Guide (Render Free Tier)

Since Blueprints can sometimes trigger paid plan warnings, here is the robust **Manual Method** to deploy completely for free.

## Part 1: Backend Deployment (Web Service)

1.  Log in to [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** and select **Web Service**.
3.  **Connect Repository**: Select `LivePollingSystem`.
4.  **Configure Instance**:
    *   **Name**: `live-polling-server` (or similar)
    *   **Region**: Choose closest to you (e.g., Singapore, Oregon).
    *   **Branch**: `main`
    *   **Root Directory**: `server` (Important!)
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node index.js`
    *   **Instance Type**: `Free`
5.  **Environment Variables** (Advanced -> Add Environment Variable):
    *   `MONGO_URI`: *[Paste your Atlas connection string]*
    *   `PORT`: `5000` (Optional, Render sets `PORT` automatically, but good to set).
    *   `CLIENT_URL`: `https://live-polling-client.onrender.com` (Note: You won't have this URL yet. temporarily put `*` or come back and update it after Part 2).
6.  Click **Create Web Service**.
7.  **Wait**: It will build. Once "Live", copy the URL at the top (e.g., `https://live-polling-server.onrender.com`).

## Part 2: Frontend Deployment (Static Site)

1.  Go back to Dashboard.
2.  Click **New +** and select **Static Site**.
3.  **Connect Repository**: Select `LivePollingSystem`.
4.  **Configure Instance**:
    *   **Name**: `live-polling-client`
    *   **Branch**: `main`
    *   **Root Directory**: `client` (Important!)
    *   **Build Command**: `npm install && npm run build`
    *   **Publish Directory**: `dist`
    *   **Instance Type**: `Free`
5.  **Environment Variables**:
    *   `VITE_SOCKET_URL`: *[Paste the Backend Server URL from Part 1]* (e.g., `https://live-polling-server.onrender.com`).
6.  Click **Create Static Site**.

## Part 3: Final Link

1.  Once the Frontend is live, copy its URL.
2.  Go back to your **Backend Service** -> **Environment**.
3.  Edit `CLIENT_URL` to be your actual frontend URL (no trailing slash).
4.  Save Changes (keeps CORS secure).

## Troubleshooting
- **Socket Error**: If the frontend says "Disconnected", check that `VITE_SOCKET_URL` in the Frontend Config matches your Backend URL exactly (including `https://`).
- **CORS Error**: If backend logs show CORS issues, check `CLIENT_URL` in Backend Config.
