export type MessageType = 'user' | 'system';

export interface Message {
  text: string;
  type: MessageType;
  timestamp?: number;
}

export interface WebSocketState {
  socket: WebSocket | null;
  connected: boolean;
  messages: Message[];
  isPlaying: boolean;
}

export interface WebSocketContextType extends WebSocketState {
  sendMessage: (text: string) => void;
  sendTransportCommand: (command: string) => void;
  clearMessages: () => void;
} 