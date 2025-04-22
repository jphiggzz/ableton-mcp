'use client';

import { WebSocketProvider } from '@/components/websocket/WebSocketProvider';
import { TransportControls } from '@/components/transport/TransportControls';
import { MessageList } from '@/components/messages/MessageList';
import { CommandInput } from '@/components/input/CommandInput';
import { ConnectionStatus } from '@/components/status/ConnectionStatus';
import { ModeToggle } from '@/components/color-mode-toggle';

export default function Home() {
  return (
    <WebSocketProvider>
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">AbletonMCP Web</h1>
            <div className="flex items-center gap-3">
              <ConnectionStatus />
              <ModeToggle />
            </div>
          </div>

          <TransportControls />
          
          <MessageList />
          
          <CommandInput />
        </div>
      </div>
    </WebSocketProvider>
  );
}
