import os
from pinecone_text.sparse import BM25Encoder
from pinecone_text.hybrid import hybrid_convex_scale
from backend.ai.embeddings.embedding_model import embedding_model
from backend.ai.retriever.pinecone import index
from backend.core.logger import logger

# Multi-path discovery for bm25_values.json
possible_paths = [
    os.path.join(os.getcwd(), "bm25_values.json"),
    os.path.join(os.path.dirname(__file__), "..", "..", "..", "bm25_values.json"),
    os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "bm25_values.json"),
    os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "backend2", "bm25_values.json")
]

bm25 = None
for path in possible_paths:
    norm_path = os.path.normpath(path)
    if os.path.exists(norm_path):
        try:
            encoder = BM25Encoder()
            encoder.load(norm_path)
            bm25 = encoder
            logger.info("Successfully loaded BM25Encoder model from %s", norm_path)
            break
        except Exception as e:
            logger.warning("Failed to load bm25_values.json from %s: %s", norm_path, e)

if bm25 is None:
    try:
        bm25 = BM25Encoder.default()
        logger.info("bm25_values.json not found or failed to load. Initialized default pre-fitted BM25Encoder.")
    except Exception as e:
        logger.exception("Failed to initialize default BM25Encoder: %s", e)
        bm25 = BM25Encoder.default()

def hybrid_search(
    query: str,
    top_k: int = 30,
    alpha: float = 0.7,
    metadata_filter: dict | None = None
):
    dense = embedding_model.embed_query(query)
    sparse = bm25.encode_queries(query)

    dense, sparse = hybrid_convex_scale(
        dense,
        sparse,
        alpha=alpha
    )

    if index is None:
        logger.error("Pinecone index is not initialized.")
        return {"matches": []}

    response = index.query(
        vector=dense,
        sparse_vector=sparse,
        top_k=top_k,
        include_metadata=True,
        filter=metadata_filter
    )
    return response
