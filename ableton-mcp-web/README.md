# AbletonMCP Web

A web interface for controlling Ableton Live through the Model Context Protocol (MCP).

## Project Structure

```
ableton-mcp-web/
├── frontend/          # Next.js frontend application
└── backend/           # FastAPI backend server
```

## Prerequisites

- Node.js 18+ and pnpm
- Python 3.8+
- Ableton Live with the AbletonMCP Remote Script installed

## Setup

### Backend

1. Create and activate a virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Start the server:
```bash
uvicorn src.api.main:socket_app --reload
```

### Frontend

1. Install dependencies:
```bash
cd frontend
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

## Usage

1. Ensure Ableton Live is running with the AbletonMCP Remote Script loaded
2. Start the backend server
3. Start the frontend development server
4. Open http://localhost:3000 in your browser

## Development

### Backend

The backend is built with FastAPI and uses Socket.IO for real-time communication. Key components:

- `src/api/main.py`: FastAPI application and Socket.IO server
- `src/ableton/connection.py`: Ableton connection management
- `src/ableton/commands.py`: Command handling

### Frontend

The frontend is built with Next.js and TypeScript. Key components:

- `src/pages/`: Next.js pages
- `src/components/`: React components
- `src/utils/`: Utility functions

## License

MIT 