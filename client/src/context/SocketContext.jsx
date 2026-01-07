import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

const getSocketUrl = () => {
    const url = import.meta.env.VITE_SOCKET_URL;
    if (url) {
        return url.startsWith('http') ? url : `https://${url}`;
    }
    return 'http://localhost:5000';
}

const SOCKET_URL = getSocketUrl();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const newSocket = io(SOCKET_URL);

        newSocket.on('connect', () => {
            console.log('Socket connected');
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        });

        newSocket.on('connect_error', (err) => {
            console.error('Connection Error:', err);
            // Could trigger global toast here
        });

        setSocket(newSocket);

        // Cleanup
        return () => newSocket.close();
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
