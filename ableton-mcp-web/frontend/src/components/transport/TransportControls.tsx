import { useWebSocketContext } from '@/components/websocket/WebSocketProvider';

export const TransportControls = () => {
  const { connected, isPlaying, sendTransportCommand } = useWebSocketContext();

  const handlePlay = () => {
    sendTransportCommand('start_playback');
  };

  const handleStop = () => {
    sendTransportCommand('stop_playback');
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handlePlay}
        disabled={!connected || isPlaying}
        className={`
          px-6 py-2 rounded-md font-medium transition-colors
          ${!connected || isPlaying
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-emerald-600 hover:bg-emerald-500'
          }
        `}
      >
        Play
      </button>
      <button
        onClick={handleStop}
        disabled={!connected || !isPlaying}
        className={`
          px-6 py-2 rounded-md font-medium transition-colors
          ${!connected || !isPlaying
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-gray-500 hover:bg-gray-400'
          }
        `}
      >
        Stop
      </button>
    </div>
  );
}; 