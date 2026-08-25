from typing import TypedDict, List, Dict

class GraphState(TypedDict):
    question: str
    session_id: str

    department: str
    country: str
    location: str
    access_level: str

    # Validation
    is_valid: bool
    validation_message: str

    # keyword-based classifier and LLM
    query_category: str
    query_intent: str

    # History-aware Query Rewriting 
    history_question: str

    # Query Rewriting
    rewritten_question: str

    # Intent Detection 
    intent_route: str
    detected_entities: dict

    # Cache status and answer
    cache_hit: bool
    cache_answer: str

    retrieved_docs: List[dict]
    reranked_docs: List[dict]

    context: str
    answer: str

    sources: List[dict]
