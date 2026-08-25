from pydantic import BaseModel
from typing import Optional, List


class IngestedFileSummary(BaseModel):
    filename: str
    status: str
    total_chunks: int
    saved_path: str


class IngestResponseData(BaseModel):
    message: str
    processed_files: List[IngestedFileSummary]


class IngestErrorResponse(BaseModel):
    code: str
    message: str


class IngestApiResponse(BaseModel):
    success: bool
    data: Optional[IngestResponseData] = None
    error: Optional[IngestErrorResponse] = None
