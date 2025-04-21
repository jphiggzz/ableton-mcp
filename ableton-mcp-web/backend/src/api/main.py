from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio

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
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")

@sio.event
async def command(sid, data):
    print(f"Received command from {sid}: {data}")
    # TODO: Implement command handling
    return {"status": "received", "data": data}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"} 