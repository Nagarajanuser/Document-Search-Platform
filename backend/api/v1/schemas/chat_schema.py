from pydantic import BaseModel
from typing import Optional, List

class QuestionRequest(BaseModel):
    question: str
    session_id: Optional[str] = None

class Source(BaseModel):
    document: str
    page: int
    rerank_score: float
    pinecone_score: float

class QuestionResponse(BaseModel):
    question: str
    session_id: str
    answer: str
    sources: List[Source]

class ErrorResponse(BaseModel):
    code: str
    message: str

class ApiResponse(BaseModel):
    success: bool
    data: Optional[QuestionResponse]
    error: Optional[ErrorResponse]
