from langchain_ollama import ChatOllama
from backend.core.config import MODEL_VERSION

llm = ChatOllama(
    model=MODEL_VERSION,
    temperature=0
)
