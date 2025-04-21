'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import styles from '../styles/Home.module.css';
import { ModeToggle } from '@/components/color-mode-toggle';

export default function Home() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; type: 'user' | 'system' }>>([]);
  const [input, setInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Initialize WebSocket connection
    console.log('Initializing WebSocket connection...');
    const ws = new WebSocket('ws://localhost:8765');
    
    ws.onopen = () => {
      console.log('WebSocket connection opened');
      setConnected(true);
      addMessage('Connected to server', 'system');
    };

    ws.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
      setConnected(false);
      addMessage('Disconnected from server', 'system');
      // Attempt to reconnect after a delay
      setTimeout(() => {
        console.log('Attempting to reconnect...');
        setSocket(new WebSocket('ws://localhost:8765'));
      }, 3000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error details:', error);
      addMessage('WebSocket error occurred', 'system');
    };

    ws.onmessage = (event) => {
      console.log('Received WebSocket message:', event.data);
      try {
        const response = JSON.parse(event.data);
        console.log('Parsed response:', response);
        addMessage(JSON.stringify(response), 'system');
      } catch (e) {
        console.error('Error parsing message:', e);
        addMessage('Error parsing message', 'system');
      }
    };

    setSocket(ws);
    console.log('WebSocket instance created and stored');

    // Only clean up on component unmount
    return () => {
      console.log('Cleaning up WebSocket connection');
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  const addMessage = (text: string, type: 'user' | 'system') => {
    setMessages((prev: Array<{ text: string; type: 'user' | 'system' }>) => [...prev, { text, type }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !input.trim()) return;

    const command = {
      type: 'command',
      command: input.trim(),
      params: {},
      id: Date.now().toString()
    };

    socket.send(JSON.stringify(command));
    addMessage(input, 'user');
    setInput('');
  };

  const sendTransportCommand = (command: string) => {
    if (!socket) return;

    const transportCommand = {
      type: 'command',
      command: command,
      params: {},
      id: Date.now().toString()
    };

    socket.send(JSON.stringify(transportCommand));
    addMessage(`Sent ${command} command`, 'system');
  };

  const handlePlay = () => {
    sendTransportCommand('start_playback');
    setIsPlaying(true);
  };

  const handleStop = () => {
    sendTransportCommand('stop_playback');
    setIsPlaying(false);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>AbletonMCP Web</h1>
        
        <div className={styles.status}>
          Status: {connected ? 'Connected' : 'Disconnected'}
        </div>

        <div className={styles.transport}>
          <button 
            onClick={handlePlay} 
            className={styles.transportButton}
            disabled={!connected || isPlaying}
          >
            Play
          </button>
          <button 
            onClick={handleStop} 
            className={styles.transportButton}
            disabled={!connected || !isPlaying}
          >
            Stop
          </button>
        </div>

        <div className={styles.messages}>
          {messages.map((message: { text: string; type: 'user' | 'system' }, index: number) => (
            <div key={index} className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={input}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            placeholder="Enter command..."
            className={styles.input}
          />
          <button type="submit" className={styles.button} disabled={!connected}>
            Send
          </button>
        </form>
      </main>
    </div>
  );
}
