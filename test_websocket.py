import asyncio
import websockets
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("WebSocketTest")

async def test_connection():
    uri = "ws://localhost:8765"
    
    try:
        # Connect to the WebSocket server
        async with websockets.connect(uri) as websocket:
            logger.info("Connected to WebSocket server")
            
            # Wait for initial connection message
            response = await websocket.recv()
            logger.info(f"Received initial message: {response}")
            
            # Send a test command
            test_command = {
                "type": "command",
                "command": "get_session_info",
                "params": {},
                "id": "test_1"
            }
            await websocket.send(json.dumps(test_command))
            logger.info("Sent test command")
            
            # Wait for response
            response = await websocket.recv()
            logger.info(f"Received response: {response}")
            
    except Exception as e:
        logger.error(f"Error during test: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_connection()) 