import json
from backend.ai.graph.state import GraphState
from backend.ai.llm.llm import llm
from backend.ai.prompts.classification_prompt import CLASSIFICATION_PROMPT
from backend.core.constants import HR_CATEGORIES, INTENTS
from backend.core.logger import logger

def classify_query_node(state: GraphState):
    logger.info("classify_query_node Reached")

    prompt = CLASSIFICATION_PROMPT.format(
        question=state["question"]
    )

    try:
        response = llm.invoke(prompt)
    except Exception as ex:
        logger.exception(f"LLM invoke failed in classify_query_node: {ex}")
        return {
            "query_category": "OutOfScope",
            "query_intent": "Unknown"
        }

    try:
        result = json.loads(response.content.strip())
        logger.info("Parsed classification result: %s", result)
    except Exception:
        result = {
            "category": "OutOfScope",
            "intent": "Unknown"
        }

    category = result.get("category", "OutOfScope")
    intent = result.get("intent", "Unknown")

    if category not in HR_CATEGORIES:
        category = "OutOfScope"

    if intent not in INTENTS:
        intent = "Unknown"

    return {
        "query_category": category,
        "query_intent": intent
    }
