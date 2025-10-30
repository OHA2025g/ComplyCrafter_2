from .adt1 import Adt1
from .ben2 import BEN2
from .pas3 import PAS3
from .dpt3 import DPT3
from .json_submission import (
    Aoc4Submission,
    Aoc4cfsSubmission,
    Mgt7aSubmission,
    MsmeSubmission,
    Msme1Submission,
    Ndh1Submission,
    Ndh2Submission,
)

# Export with both names for compatibility
ADT1 = Adt1

__all__ = [
    'Adt1',
    'ADT1',
    'BEN2',
    'PAS3',
    'DPT3',
    'Aoc4Submission',
    'Aoc4cfsSubmission',
    'Mgt7aSubmission',
    'MsmeSubmission',
    'Msme1Submission',
    'Ndh1Submission',
    'Ndh2Submission',
]
