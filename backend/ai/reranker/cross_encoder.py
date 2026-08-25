from sentence_transformers import CrossEncoder

reranker = CrossEncoder(
    "BAAI/bge-reranker-base"
)

def rerank_documents(
    query: str,
    matches: list,
    top_k: int = 5
):
    """
    Rerank Pinecone matches using BAAI/bge-reranker-base
    """
    if not matches:
        return []

    pairs = [
        (
            query,
            match["metadata"]["text"]
        )
        for match in matches
    ]

    scores = reranker.predict(
        pairs,
        batch_size=16
    )

    ranked = []
    for match, score in zip(matches, scores):
        ranked.append({
            "id": match["id"],
            "rerank_score": float(score),
            "pinecone_score": match["score"],
            "text": match["metadata"]["text"],
            "source": match["metadata"].get("source"),
            "page": match["metadata"].get("page")
        })

    ranked.sort(
        key=lambda x: x["rerank_score"],
        reverse=True
    )

    return ranked[:top_k]
