import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [generationStatus, setGenerationStatus] = useState('idle');
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState(null);

    useEffect(() => {
        // Создаем WebSocket соединение с сервером
        const newSocket = io('http://localhost:5000', {
            transports: ['websocket'],
            autoConnect: true,
        });

        newSocket.on('connect', () => {
            console.log('Connected to server');
            setIsConnected(true);
            setGenerationStatus('ready');
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from server');
            setIsConnected(false);
            setGenerationStatus('disconnected');
        });

        newSocket.on('generation_started', () => {
            console.log('Generation started');
            setGenerationStatus('generating');
        });

        newSocket.on('generation_completed', (data) => {
            console.log('Generation completed:', data);
            setGenerationStatus('completed');
            if (data.video_url) {
                setGeneratedVideoUrl(data.video_url);
            }
        });

        newSocket.on('generation_error', (error) => {
            console.error('Generation error:', error);
            setGenerationStatus('error');
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    const startGeneration = async (imageFile, audioFile, options = {}) => {
        if (!isConnected) {
            console.error('Not connected to server');
            return false;
        }

        try {
            // Создаем FormData для отправки файлов
            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('audio', audioFile);

            // Добавляем опции генерации
            Object.keys(options).forEach(key => {
                formData.append(key, options[key]);
            });

            // Отправляем файлы через HTTP POST
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Upload successful:', result);

                // Уведомляем WebSocket о начале генерации
                if (socket) {
                    socket.emit('generation_started', { task_id: result.task_id });
                }

                return true;
            } else {
                const errorData = await response.json();
                console.error('Upload failed:', errorData);
                return false;
            }
        } catch (error) {
            console.error('Error starting generation:', error);
            return false;
        }
    };

    const value = {
        socket,
        isConnected,
        generationStatus,
        startGeneration,
        generatedVideoUrl,
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};
