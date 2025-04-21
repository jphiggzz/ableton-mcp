import asyncio
import json
import logging
import websockets
from typing import Set, Dict, Any
from dataclasses import dataclass

# Configure logging
logger = logging.getLogger("AbletonMCPWebSocket")

@dataclass(frozen=True)
class WebSocketClient:
    websocket: websockets.WebSocketServerProtocol
    id: str

    def __hash__(self):
        return hash(self.id)

    def __eq__(self, other):
        if not isinstance(other, WebSocketClient):
            return False
        return self.id == other.id

class WebSocketServer:
    def __init__(self, host: str = "localhost", port: int = 8765):
        self.host = host
        self.port = port
        self.clients: Dict[str, WebSocketClient] = {}
        self.server = None
        self.state = {
            "connection_status": "disconnected",
            "ableton_state": {},
            "last_update": None
        }
        logger.info(f"WebSocketServer initialized with host={host}, port={port}")

    async def start(self):
        """Start the WebSocket server"""
        try:
            logger.info("Starting WebSocket server...")
            self.server = await websockets.serve(
                self.handle_client,
                self.host,
                self.port,
                process_request=self.process_request
            )
            logger.info(f"WebSocket server started on ws://{self.host}:{self.port}")
            return True
        except Exception as e:
            logger.error(f"Failed to start WebSocket server: {str(e)}")
            return False

    async def process_request(self, path, request_headers):
        """Process incoming WebSocket requests"""
        logger.info(f"Processing request for path: {path}")
        return None  # Accept all connections

    async def stop(self):
        """Stop the WebSocket server"""
        if self.server:
            self.server.close()
            await self.server.wait_closed()
            logger.info("WebSocket server stopped")

    async def handle_client(self, websocket: websockets.WebSocketServerProtocol):
        """Handle a new client connection"""
        logger.info("New connection attempt")
        try:
            client = WebSocketClient(websocket=websocket, id=str(id(websocket)))
            logger.info(f"Created WebSocketClient with id: {client.id}")
            
            self.clients[client.id] = client
            logger.info(f"Added client to dictionary. Total clients: {len(self.clients)}")

            try:
                # Send initial connection status
                await self.send_message(websocket, {
                    "type": "connection",
                    "status": "connected",
                    "message": "Connected to AbletonMCP server"
                })

                # Handle messages from client
                async for message in websocket:
                    try:
                        data = json.loads(message)
                        logger.info(f"Received message from {client.id}: {data}")
                        await self.handle_message(websocket, data)
                    except json.JSONDecodeError:
                        logger.error(f"Invalid JSON received from {client.id}")
                        await self.send_error(websocket, "invalid_json", "Invalid JSON message")
                    except Exception as e:
                        logger.error(f"Error handling message from {client.id}: {str(e)}")
                        await self.send_error(websocket, "message_error", str(e))

            except websockets.exceptions.ConnectionClosed:
                logger.info(f"Client {client.id} disconnected")
            finally:
                if client.id in self.clients:
                    del self.clients[client.id]
                    logger.info(f"Client {client.id} removed. Remaining clients: {len(self.clients)}")

        except Exception as e:
            logger.error(f"Error in handle_client: {str(e)}")
            raise

    async def handle_message(self, websocket: websockets.WebSocketServerProtocol, message: Dict[str, Any]):
        """Handle incoming messages from clients"""
        message_type = message.get("type")
        
        if message_type == "command":
            await self.handle_command(websocket, message)
        else:
            await self.send_error(websocket, "unknown_message_type", f"Unknown message type: {message_type}")

    async def handle_command(self, websocket: websockets.WebSocketServerProtocol, message: Dict[str, Any]):
        """Handle command messages"""
        command = message.get("command")
        params = message.get("params", {})
        
        logger.info(f"Handling command: {command} with params: {params}")
        
        try:
            # Get the MCP server instance and tools
            from .server import mcp, start_playback, stop_playback, get_session_info, get_track_info, create_midi_track, set_track_name, create_clip, add_notes_to_clip, set_clip_name, set_tempo, fire_clip, stop_clip, load_instrument_or_effect, get_browser_tree, get_browser_items_at_path, load_drum_kit
            from mcp.server.fastmcp import Context
            
            # Create a new context for this command
            ctx = Context()
            
            # Map command to the appropriate tool
            if command == "start_playback":
                result = start_playback(ctx)
            elif command == "stop_playback":
                result = stop_playback(ctx)
            elif command == "get_session_info":
                result = get_session_info(ctx)
            elif command == "get_track_info":
                result = get_track_info(ctx, params.get("track_index", 0))
            elif command == "create_midi_track":
                result = create_midi_track(ctx, params.get("index", -1))
            elif command == "set_track_name":
                result = set_track_name(ctx, params.get("track_index", 0), params.get("name", ""))
            elif command == "create_clip":
                result = create_clip(
                    ctx,
                    params.get("track_index", 0),
                    params.get("clip_index", 0),
                    params.get("length", 4.0)
                )
            elif command == "add_notes_to_clip":
                result = add_notes_to_clip(
                    ctx,
                    params.get("track_index", 0),
                    params.get("clip_index", 0),
                    params.get("notes", [])
                )
            elif command == "set_clip_name":
                result = set_clip_name(
                    ctx,
                    params.get("track_index", 0),
                    params.get("clip_index", 0),
                    params.get("name", "")
                )
            elif command == "set_tempo":
                result = set_tempo(ctx, params.get("tempo", 120.0))
            elif command == "fire_clip":
                result = fire_clip(
                    ctx,
                    params.get("track_index", 0),
                    params.get("clip_index", 0)
                )
            elif command == "stop_clip":
                result = stop_clip(
                    ctx,
                    params.get("track_index", 0),
                    params.get("clip_index", 0)
                )
            elif command == "load_instrument_or_effect":
                result = load_instrument_or_effect(
                    ctx,
                    params.get("track_index", 0),
                    params.get("uri", "")
                )
            elif command == "get_browser_tree":
                result = get_browser_tree(ctx, params.get("category_type", "all"))
            elif command == "get_browser_items_at_path":
                result = get_browser_items_at_path(ctx, params.get("path", ""))
            elif command == "load_drum_kit":
                result = load_drum_kit(
                    ctx,
                    params.get("track_index", 0),
                    params.get("rack_uri", ""),
                    params.get("kit_path", "")
                )
            else:
                raise Exception(f"Unknown command: {command}")
            
            # Send success response
            await self.send_message(websocket, {
                "type": "response",
                "id": message.get("id"),
                "status": "success",
                "data": result
            })
        except Exception as e:
            logger.error(f"Error executing command {command}: {str(e)}")
            await self.send_error(websocket, "command_error", str(e))

    async def send_message(self, websocket: websockets.WebSocketServerProtocol, message: Dict[str, Any]):
        """Send a message to a specific client"""
        try:
            await websocket.send(json.dumps(message))
        except websockets.exceptions.ConnectionClosed:
            logger.warning("Failed to send message: connection closed")

    async def send_error(self, websocket: websockets.WebSocketServerProtocol, code: str, message: str):
        """Send an error message to a client"""
        await self.send_message(websocket, {
            "type": "error",
            "code": code,
            "message": message
        })

    async def broadcast(self, message: Dict[str, Any]):
        """Broadcast a message to all connected clients"""
        for client in self.clients:
            await self.send_message(client.websocket, message) 