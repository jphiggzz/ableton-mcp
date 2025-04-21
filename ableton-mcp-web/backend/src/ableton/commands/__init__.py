from typing import Dict, Any, Callable
from ..connection import get_ableton_connection

class CommandError(Exception):
    """Base exception for command-related errors"""
    pass

class CommandHandler:
    def __init__(self):
        self.commands: Dict[str, Callable] = {}
        self._ableton = get_ableton_connection()

    def register_command(self, name: str, handler: Callable):
        """Register a new command handler"""
        self.commands[name] = handler

    async def execute(self, command_type: str, params: Dict[str, Any] = None) -> Dict[str, Any]:
        """Execute a command and return the response"""
        if command_type not in self.commands:
            raise CommandError(f"Unknown command: {command_type}")

        try:
            result = await self.commands[command_type](self._ableton, params or {})
            return {
                "status": "success",
                "data": result
            }
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }

# Create global command handler instance
command_handler = CommandHandler() 