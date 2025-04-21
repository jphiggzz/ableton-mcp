from typing import Dict, Any
from ..connection import AbletonConnection

async def start_playback(ableton: AbletonConnection, params: Dict[str, Any]) -> Dict[str, Any]:
    """Start playback in Ableton Live"""
    return ableton.send_command("start_playback", params)

async def stop_playback(ableton: AbletonConnection, params: Dict[str, Any]) -> Dict[str, Any]:
    """Stop playback in Ableton Live"""
    return ableton.send_command("stop_playback", params)

# Register commands with the handler
from . import command_handler
command_handler.register_command("start_playback", start_playback)
command_handler.register_command("stop_playback", stop_playback) 