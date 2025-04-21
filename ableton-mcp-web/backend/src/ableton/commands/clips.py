from typing import Dict, Any, List, Union
from ..connection import AbletonConnection

async def create_clip(ableton: AbletonConnection, params: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new MIDI clip in the specified track and clip slot"""
    track_index = params.get("track_index")
    clip_index = params.get("clip_index")
    length = params.get("length", 4.0)
    
    if track_index is None or clip_index is None:
        raise ValueError("track_index and clip_index are required")
        
    return ableton.send_command("create_clip", {
        "track_index": track_index,
        "clip_index": clip_index,
        "length": length
    })

async def add_notes_to_clip(ableton: AbletonConnection, params: Dict[str, Any]) -> Dict[str, Any]:
    """Add MIDI notes to a clip"""
    track_index = params.get("track_index")
    clip_index = params.get("clip_index")
    notes = params.get("notes", [])
    
    if track_index is None or clip_index is None or not notes:
        raise ValueError("track_index, clip_index, and notes are required")
        
    return ableton.send_command("add_notes_to_clip", {
        "track_index": track_index,
        "clip_index": clip_index,
        "notes": notes
    })

async def set_clip_name(ableton: AbletonConnection, params: Dict[str, Any]) -> Dict[str, Any]:
    """Set the name of a clip"""
    track_index = params.get("track_index")
    clip_index = params.get("clip_index")
    name = params.get("name")
    
    if track_index is None or clip_index is None or name is None:
        raise ValueError("track_index, clip_index, and name are required")
        
    return ableton.send_command("set_clip_name", {
        "track_index": track_index,
        "clip_index": clip_index,
        "name": name
    })

# Register commands with the handler
from . import command_handler
command_handler.register_command("create_clip", create_clip)
command_handler.register_command("add_notes_to_clip", add_notes_to_clip)
command_handler.register_command("set_clip_name", set_clip_name) 