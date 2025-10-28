"""Forms service package."""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LIBS_PY = ROOT.parent / "libs" / "python"
if str(LIBS_PY) not in sys.path:
    sys.path.append(str(LIBS_PY))
