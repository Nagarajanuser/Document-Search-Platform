from backend.ai.graph.state import GraphState
from backend.ai.reranker.cross_encoder import rerank_documents
from backend.core.logger import logger

def rerank_node(state: GraphState):
    logger.info("rerank_node")

    reranked = rerank_documents(
        query=state["rewritten_question"],
        matches=state["retrieved_docs"],
        top_k=5
    )

    if not reranked:
        return {
            "reranked_docs": [],
            "context": "",
            "sources": []
        }

    context = ""
    sources = []
    for doc in reranked:
        sources.append({
            "document": doc["source"],
            "page": doc["page"],
            "rerank_score": doc["rerank_score"],
            "pinecone_score": doc["pinecone_score"]
        })
        context += doc["text"] + "\n\n"

    return {
        "reranked_docs": reranked,
        "context": context,
        "sources": sources
    }
