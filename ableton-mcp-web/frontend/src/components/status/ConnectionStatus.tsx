import { useWebSocketContext } from '@/components/websocket/WebSocketProvider';

export const ConnectionStatus = () => {
  const { connected } = useWebSocketContext();

  return (
    <div className="flex items-center gap-2">
      <div
        className={`
          w-3 h-3 rounded-full
          ${connected
            ? 'bg-green-500 animate-pulse'
            : 'bg-red-500'
          }
        `}
      />
      <span className="text-sm">
        {connected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );
}; 