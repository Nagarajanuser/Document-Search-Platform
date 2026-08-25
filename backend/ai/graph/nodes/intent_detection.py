import re
import numpy as np
from backend.ai.graph.state import GraphState
from backend.ai.embeddings.embedding_model import embedding_model
from backend.core.constants import RULE_BASED_INTENTS, INTENT_EXAMPLES
from backend.core.config import SIMILARITY_THRESHOLD
from backend.core.logger import logger

# Pre-compute INTENT_VECTORS on load
INTENT_VECTORS = []
for intent, examples in INTENT_EXAMPLES.items():
    for text in examples:
        vector = embedding_model.embed_query(text)
        INTENT_VECTORS.append({
            "intent": intent,
            "text": text,
            "vector": np.array(vector)
        })

def normalize_question(question: str) -> str:
    question = question.lower()
    question = re.sub(r"[^a-z0-9 ]", " ", question)
    question = re.sub(r"\s+", " ", question)
    return question.strip()

def detect_rule_based(question: str):
    logger.info("detect_rule_based : question: %s", question)
    normalized = normalize_question(question)
    for intent, keywords in RULE_BASED_INTENTS.items():
        for keyword in keywords:
            if keyword in normalized:
                return intent
    return None

def semantic_intent_detection(question: str):
    logger.info("semantic_intent_detection : question: %s", question)
    query_vector = np.array(embedding_model.embed_query(question))
    best_intent = None
    best_score = -1
    for item in INTENT_VECTORS:
        score = np.dot(query_vector, item["vector"])
        if score > best_score:
            best_score = score
            best_intent = item["intent"]
    return best_intent, best_score

def hybrid_intent_detection(question: str) -> str:
    logger.info("hybrid_intent_detection : question: %s", question)
    intent = detect_rule_based(question)
    if intent is not None:
        return intent
    intent, score = semantic_intent_detection(question)
    if score >= SIMILARITY_THRESHOLD:
        return intent
    return "SEARCH_POLICY"

def intent_detection_node(state: GraphState):
    logger.info("intent_detection_node Reached")
    intent = hybrid_intent_detection(state["question"])
    return {
        "intent_route": intent,
        "detected_entities": {}
    }

def route_after_intent(state: GraphState) -> str:
    route = state["intent_route"]
    logger.info("route_after_intent : route: %s", route)

    if route in ["GREETING", "GOODBYE"]:
        return "generate"
    elif route == "CHECK_BALANCE":
        return "leave_api"
    elif route == "PAYSLIP":
        return "payroll_api"
    elif route == "DOWNLOAD_DOCUMENT":
        return "document_api"
    else:
        return "classify_query"
