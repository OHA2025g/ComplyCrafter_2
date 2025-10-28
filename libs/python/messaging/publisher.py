import json
from dataclasses import dataclass
from typing import Any, Dict


@dataclass
class MessagePublisher:
    """Placeholder publisher writing payloads to stdout until broker wiring is added."""

    topic: str

    def publish(self, payload: Dict[str, Any]) -> None:
        print(f"[PUBLISH] topic={self.topic} payload={json.dumps(payload)}")
