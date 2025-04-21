from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio
from ableton.commands import command_handler
import logging

logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(title="AbletonMCP Web Server")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create Socket.IO server
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
socket_app = socketio.ASGIApp(sio, app)

# Socket.IO event handlers
@sio.event
async def connect(sid, environ):
    logger.info(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    logger.info(f"Client disconnected: {sid}")

@sio.event
async def command(sid, data):
    """Handle incoming commands from clients"""
    try:
        logger.info(f"Received command from {sid}: {data}")
        command_type = data.get("type")
        params = data.get("params", {})
        
        if not command_type:
            return {"status": "error", "message": "No command type specified"}
            
        response = await command_handler.execute(command_type, params)
        return response
    except Exception as e:
        logger.error(f"Error processing command: {str(e)}")
        return {"status": "error", "message": str(e)}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"} 