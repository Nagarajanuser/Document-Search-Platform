from backend.ai.graph.state import GraphState
from backend.ai.llm.llm import llm
from backend.ai.prompts.rewrite_prompt import HISTORY_REWRITE_PROMPT
from backend.ai.graph.nodes.intent_detection import normalize_question
from backend.core.constants import FOLLOWUP_PATTERNS
from backend.core.database import get_chat_history
from backend.core.logger import logger

def is_followup_question(question: str) -> bool:
    normalized = normalize_question(question)
    words = normalized.split()

    for pattern in FOLLOWUP_PATTERNS:
        if " " in pattern:
            if pattern in normalized:
                return True
        elif pattern in words:
            return True
    
    return False

def history_query_rewrite_node(state: GraphState):
    logger.info("history_query_rewrite_node Reached")
    question = state["question"]

    if not is_followup_question(question):
        logger.info("Standalone question detected. Skipping History Rewrite.")
        return {
            "history_question": question
        }

    history = get_chat_history(state["session_id"])
    history_lines = history.splitlines()

    if len(history_lines) < 2 or not history.strip():
        logger.info("Insufficient history for rewrite.")
        return {
            "history_question": state["question"]
        }

    prompt = HISTORY_REWRITE_PROMPT.format(
        history=history,
        question=state["question"]
    )

    try:
        response = llm.invoke(prompt)
        rewritten = response.content.strip()
        logger.info("History Rewrite Output : %s", rewritten)
        return {
            "history_question": rewritten
        }
    except Exception as e:
        logger.exception(f"Error in history_query_rewrite_node: {e}")
        return {
            "history_question": state["question"]
        }
