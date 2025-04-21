'use client';

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; type: 'user' | 'system' }>>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:8000');
    
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
      addMessage('Connected to server', 'system');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
      addMessage('Disconnected from server', 'system');
    });

    newSocket.on('command_response', (response) => {
      console.log('Received response:', response);
      addMessage(JSON.stringify(response), 'system');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const addMessage = (text: string, type: 'user' | 'system') => {
    setMessages(prev => [...prev, { text, type }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !input.trim()) return;

    const command = {
      type: 'command',
      data: input.trim()
    };

    socket.emit('command', command);
    addMessage(input, 'user');
    setInput('');
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>AbletonMCP Web</h1>
        
        <div className={styles.status}>
          Status: {connected ? 'Connected' : 'Disconnected'}
        </div>

        <div className={styles.messages}>
          {messages.map((message, index) => (
            <div key={index} className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
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
