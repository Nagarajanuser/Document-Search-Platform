from langchain_huggingface import HuggingFaceEmbeddings
from backend.core.config import EMBEDDING_MODEL_VERSION
from backend.core.logger import logger

try:
    embedding_model = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL_VERSION,
        model_kwargs={"local_files_only": True},
        encode_kwargs={"normalize_embeddings": True}
    )
except Exception as e:
    logger.warning("Failed to load local cached embedding model, falling back to online fetch: %s", e)
    embedding_model = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL_VERSION,
        encode_kwargs={"normalize_embeddings": True}
    )
