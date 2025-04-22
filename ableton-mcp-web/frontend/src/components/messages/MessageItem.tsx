import { Message } from '@/types/websocket';

interface MessageItemProps {
  message: Message;
}

export const MessageItem = ({ message }: MessageItemProps) => {
  const timestamp = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString()
    : '';

  return (
    <div
      className={`
        p-2 rounded-md break-words
        ${message.type === 'user'
          ? 'bg-neutral-800/50'
          : 'bg-neutral-700/50'
        }
      `}
    >
      <div className="text-xs text-neutral-400">{timestamp}</div>
      <div className="text-sm whitespace-pre-wrap">{message.text}</div>
    </div>
  );
}; 