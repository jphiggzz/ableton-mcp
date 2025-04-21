from typing import Dict, Any
from ..connection import AbletonConnection

async def create_midi_track(ableton: AbletonConnection, params: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new MIDI track in the Ableton session"""
    index = params.get("index", -1)  # -1 = end of list
    return ableton.send_command("create_midi_track", {"index": index})

async def set_track_name(ableton: AbletonConnection, params: Dict[str, Any]) -> Dict[str, Any]:
    """Set the name of a track"""
    track_index = params.get("track_index")
    name = params.get("name")
    if track_index is None or name is None:
        raise ValueError("track_index and name are required")
    return ableton.send_command("set_track_name", {"track_index": track_index, "name": name})

async def get_track_info(ableton: AbletonConnection, params: Dict[str, Any]) -> Dict[str, Any]:
    """Get detailed information about a specific track"""
    track_index = params.get("track_index")
    if track_index is None:
        raise ValueError("track_index is required")
    return ableton.send_command("get_track_info", {"track_index": track_index})

# Register commands with the handler
from . import command_handler
command_handler.register_command("create_midi_track", create_midi_track)
command_handler.register_command("set_track_name", set_track_name)
command_handler.register_command("get_track_info", get_track_info) 