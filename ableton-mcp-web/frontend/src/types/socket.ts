export interface Command {
  type: string;
  data: string;
}

export interface CommandResponse {
  status: 'success' | 'error';
  data?: any;
  message?: string;
}

export interface Message {
  text: string;
  type: 'user' | 'system';
} 