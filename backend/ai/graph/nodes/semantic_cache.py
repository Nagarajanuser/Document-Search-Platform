import uuid
from datetime import datetime, timezone, timedelta
from backend.ai.graph.state import GraphState
from backend.ai.embeddings.embedding_model import embedding_model
from backend.ai.retriever.pinecone import cache_index
from backend.core.config import CACHE_VERSION, MODEL_VERSION, EMBEDDING_MODEL_VERSION, CACHE_THRESHOLD, CACHE_EXPIRY_DAYS
from backend.core.logger import logger

def save_to_semantic_cache(state: GraphState, answer: str):
    logger.info("save_to_semantic_cache: rewritten_question: %s", state['rewritten_question'].strip())
    logger.info("save_to_semantic_cache: question: %s", state['question'].strip())

    if cache_index is None:
        logger.warning("cache_index is not initialized. Skipping semantic cache save.")
        return

    try:
        vector = embedding_model.embed_query(state["rewritten_question"])
        doc_id = str(uuid.uuid4())

        metadata = {
            "question": state["question"],
            "rewritten_question": state["rewritten_question"],
            "answer": answer,
            "department": state["department"],
            "country": state["country"],
            "location": state["location"],
            "access_level": state["access_level"],
            "query_category": state["query_category"],
            "query_intent": state["query_intent"],
            "cache_version": CACHE_VERSION,
            "model_version": MODEL_VERSION,
            "embedding_model": EMBEDDING_MODEL_VERSION,
            "created_at": datetime.now(timezone.utc).isoformat()
        }

        cache_index.upsert(
            vectors=[
                {
                    "id": doc_id,
                    "values": vector,
                    "metadata": metadata
                }
            ]
        )
        logger.info("CACHE SAVED : %s", doc_id)
    except Exception as e:
        logger.exception(f"Save to Semantic Cache Failed : {e}")

def semantic_cache_lookup_node(state: GraphState):
    logger.info("semantic_cache_lookup_node Reached : question :  %s", state['question'].strip())
    logger.info("semantic_cache_lookup_node Reached : rewritten_question : %s", state['rewritten_question'].strip())

    if cache_index is None:
        logger.info("CACHE MISS - cache_index not initialized")
        return {
            "cache_hit": False,
            "cache_answer": ""
        }

    vector = embedding_model.embed_query(state["rewritten_question"])

    metadata_filter = {
        "$and": [
            {"department": {"$eq": state["department"]}},
            {"country": {"$eq": state["country"]}},
            {"location": {"$eq": state["location"]}},
            {"access_level": {"$eq": state["access_level"]}},
            {"query_category": {"$eq": state["query_category"]}},
            {"cache_version": {"$eq": CACHE_VERSION}}
        ]
    }

    try:
        results = cache_index.query(
            vector=vector,
            top_k=1,
            include_metadata=True,
            filter=metadata_filter
        )

        if not results.matches:
            logger.info("CACHE MISS")
            return {
                "cache_hit": False,
                "cache_answer": ""
            }

        match = results.matches[0]
        similarity = match.score
        logger.info("semantic_cache_lookup_node similarity : %s", similarity)

        if similarity < CACHE_THRESHOLD:
            logger.info("CACHE MISS Low Confidence")
            return {
                "cache_hit": False,
                "cache_answer": ""
            }

        created = datetime.fromisoformat(match.metadata["created_at"])
        age = datetime.now(timezone.utc) - created

        if age > timedelta(days=CACHE_EXPIRY_DAYS):
            logger.info("CACHE EXPIRED")
            return {
                "cache_hit": False,
                "cache_answer": ""
            }

        logger.info("CACHE HIT")
        return {
            "cache_hit": True,
            "cache_answer": match.metadata["answer"]
        }
    except Exception as e:
        logger.exception(f"Error during semantic cache query: {e}")
        return {
            "cache_hit": False,
            "cache_answer": ""
        }

def route_after_cache(state: GraphState) -> str:
    logger.info("route_after_cache")
    if state["cache_hit"]:
        return "generate"
    return "retrieve"
