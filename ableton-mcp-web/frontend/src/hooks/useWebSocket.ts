import { useState, useEffect, useCallback } from 'react';
import { WebSocketState, Message } from '@/types/websocket';

export const useWebSocket = () => {
  const [state, setState] = useState<WebSocketState>({
    socket: null,
    connected: false,
    messages: [],
    isPlaying: false,
  });

  const addMessage = useCallback((text: string, type: 'user' | 'system') => {
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, { text, type, timestamp: Date.now() }],
    }));
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (!state.socket || !text.trim()) return;

    const command = {
      type: 'command',
      command: text.trim(),
      params: {},
      id: Date.now().toString(),
    };

    state.socket.send(JSON.stringify(command));
    addMessage(text, 'user');
  }, [state.socket, addMessage]);

  const sendTransportCommand = useCallback((command: string) => {
    if (!state.socket) return;

    const transportCommand = {
      type: 'command',
      command,
      params: {},
      id: Date.now().toString(),
    };

    state.socket.send(JSON.stringify(transportCommand));
    addMessage(`Sent ${command} command`, 'system');
    
    if (command === 'start_playback') {
      setState(prev => ({ ...prev, isPlaying: true }));
    } else if (command === 'stop_playback') {
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  }, [state.socket, addMessage]);

  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, messages: [] }));
  }, []);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8765');

    ws.onopen = () => {
      setState(prev => ({ ...prev, socket: ws, connected: true }));
      addMessage('Connected to server', 'system');
    };

    ws.onclose = () => {
      setState(prev => ({ ...prev, socket: null, connected: false }));
      addMessage('Disconnected from server', 'system');
      setTimeout(() => {
        setState(prev => ({ ...prev, socket: new WebSocket('ws://localhost:8765') }));
      }, 3000);
    };

    ws.onerror = () => {
      addMessage('WebSocket error occurred', 'system');
    };

    ws.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        addMessage(JSON.stringify(response), 'system');
      } catch (e) {
        addMessage('Error parsing message', 'system');
      }
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [addMessage]);

  return {
    ...state,
    sendMessage,
    sendTransportCommand,
    clearMessages,
  };
}; 