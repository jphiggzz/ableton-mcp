import { useWebSocketContext } from '@/components/websocket/WebSocketProvider';
import { MessageItem } from '@/components/messages/MessageItem';

export const MessageList = () => {
  const { messages, clearMessages } = useWebSocketContext();

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium">Messages</h2>
        <button
          onClick={clearMessages}
          className="px-3 py-1 text-sm bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
        >
          Clear
        </button>
      </div>
      <div className="flex flex-col gap-2 h-[400px] overflow-y-auto p-4 bg-neutral-900 rounded-md">
        {messages.map((message, index) => (
          <MessageItem key={index} message={message} />
        ))}
      </div>
    </div>
  );
}; 