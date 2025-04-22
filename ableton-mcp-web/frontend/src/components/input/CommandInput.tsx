import { useState, KeyboardEvent } from 'react';
import { useWebSocketContext } from '@/components/websocket/WebSocketProvider';

export const CommandInput = () => {
  const [input, setInput] = useState('');
  const { connected, sendMessage } = useWebSocketContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter command..."
          disabled={!connected}
          className={`
            flex-1 px-3 py-2 rounded-md bg-[#1e2533]
            focus:outline-none focus:ring-1 focus:ring-gray-400
            disabled:opacity-50 disabled:cursor-not-allowed
            text-sm
          `}
        />
        <button
          type="submit"
          disabled={!connected || !input.trim()}
          className={`
            px-4 py-2 rounded-md font-medium text-sm transition-colors
            ${!connected || !input.trim()
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gray-600 hover:bg-gray-500'
            }
          `}
        >
          Send
        </button>
      </div>
    </form>
  );
}; 