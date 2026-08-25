from pinecone import Pinecone
from backend.core.config import PINECONE_API_KEY, INDEX_NAME, INDEX_NAME_CACHE
from backend.core.logger import logger

pc = None
index = None
cache_index = None

try:
    if PINECONE_API_KEY:
        pc = Pinecone(api_key=PINECONE_API_KEY)
        if INDEX_NAME:
            index = pc.Index(INDEX_NAME)
        if INDEX_NAME_CACHE:
            cache_index = pc.Index(INDEX_NAME_CACHE)
    else:
        logger.warning("PINECONE_API_KEY not found in environment settings.")
except Exception as e:
    logger.exception(f"Error initializing Pinecone client: {e}")
