import { io, Socket } from 'socket.io-client';
import { Command, CommandResponse } from '../types/socket';

const SOCKET_URL = 'http://localhost:8000';

let socket: Socket | null = null;

export const initializeSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL);
  }
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const sendCommand = (command: Command): Promise<CommandResponse> => {
  if (!socket) {
    throw new Error('Socket not initialized');
  }

  return new Promise((resolve, reject) => {
    socket!.emit('command', command, (response: CommandResponse) => {
      if (response.status === 'error') {
        reject(new Error(response.message));
      } else {
        resolve(response);
      }
    });
  });
};

export const isConnected = (): boolean => {
  return socket?.connected || false;
}; 