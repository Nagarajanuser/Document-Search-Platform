from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def home():
    return {
        "message": "HR Policy RAG API is running."
    }
