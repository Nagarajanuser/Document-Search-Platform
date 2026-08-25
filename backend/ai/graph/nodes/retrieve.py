from backend.ai.graph.state import GraphState
from backend.ai.retriever.hybrid_search import hybrid_search
from backend.core.logger import logger

def retrieve_node(state: GraphState):
    logger.info("retrieve_node : Question: %s", state['question'].strip())
    logger.info("retrieve_node : Rewritten_question: %s", state['rewritten_question'].strip())

    if not state["is_valid"] or state["query_category"] == "OutOfScope":
        return {
            "retrieved_docs": []
        }

    metadata_filter = {
        "$and": [
            {"department": {"$eq": state["department"]}},
            {"country": {"$eq": state["country"]}},
            {"access_level": {"$eq": state["access_level"]}},
            {"category": {"$eq": state["query_category"]}}
        ]
    }

    try:
        results = hybrid_search(
            query=state["rewritten_question"],
            top_k=30,
            metadata_filter=metadata_filter
        )
        matches = results.get("matches", []) if isinstance(results, dict) else getattr(results, "matches", [])
        return {
            "retrieved_docs": matches
        }
    except Exception as e:
        logger.exception(f"Error retrieving documents: {e}")
        return {
            "retrieved_docs": []
        }
