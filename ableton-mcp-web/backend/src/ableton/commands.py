from typing import Dict, Any
from .connection import get_ableton_connection

async def handle_command(command_type: str, params: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Handle a command from the web interface and send it to Ableton
    
    Args:
        command_type: The type of command to execute
        params: Optional parameters for the command
        
    Returns:
        Dict containing the response from Ableton
    """
    try:
        ableton = get_ableton_connection()
        response = ableton.send_command(command_type, params)
        return {
            "status": "success",
            "data": response
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

# List of supported commands
SUPPORTED_COMMANDS = {
    "get_session_info": "Get information about the current Ableton session",
    "create_midi_track": "Create a new MIDI track",
    "set_tempo": "Set the session tempo",
    "start_playback": "Start playback",
    "stop_playback": "Stop playback"
}

def is_command_supported(command_type: str) -> bool:
    """Check if a command type is supported"""
    return command_type in SUPPORTED_COMMANDS 