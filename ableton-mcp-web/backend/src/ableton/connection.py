import socket
import json
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

class AbletonConnection:
    def __init__(self, host: str = "localhost", port: int = 9877):
        self.host = host
        self.port = port
        self.socket: Optional[socket.socket] = None
        self.connected = False

    def connect(self) -> bool:
        """Establish connection to Ableton Remote Script"""
        if self.connected and self.socket:
            return True

        try:
            self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.socket.connect((self.host, self.port))
            self.connected = True
            logger.info(f"Connected to Ableton at {self.host}:{self.port}")
            return True
        except Exception as e:
            logger.error(f"Failed to connect to Ableton: {str(e)}")
            self.connected = False
            return False

    def disconnect(self):
        """Close connection to Ableton"""
        if self.socket:
            try:
                self.socket.close()
            except Exception as e:
                logger.error(f"Error disconnecting from Ableton: {str(e)}")
            finally:
                self.socket = None
                self.connected = False

    def send_command(self, command_type: str, params: Dict[str, Any] = None) -> Dict[str, Any]:
        """Send a command to Ableton and return the response"""
        if not self.connected and not self.connect():
            raise ConnectionError("Not connected to Ableton")

        command = {
            "type": command_type,
            "params": params or {}
        }

        try:
            # Send command
            self.socket.sendall(json.dumps(command).encode('utf-8'))
            
            # Receive response
            response = b""
            while True:
                chunk = self.socket.recv(8192)
                if not chunk:
                    break
                response += chunk
            
            return json.loads(response.decode('utf-8'))
        except Exception as e:
            logger.error(f"Error communicating with Ableton: {str(e)}")
            self.connected = False
            raise Exception(f"Communication error with Ableton: {str(e)}")

# Global connection instance
_ableton_connection = None

def get_ableton_connection() -> AbletonConnection:
    """Get or create a persistent Ableton connection"""
    global _ableton_connection
    
    if _ableton_connection is None:
        _ableton_connection = AbletonConnection()
    
    if not _ableton_connection.connected:
        _ableton_connection.connect()
    
    return _ableton_connection 