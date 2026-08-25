from backend.ai.graph.state import GraphState
from backend.ai.llm.llm import llm
from backend.ai.prompts.answer_prompt import get_answer_prompt
from backend.ai.graph.nodes.semantic_cache import save_to_semantic_cache
from backend.core.logger import logger

INVALID_CACHE_RESPONSES = {
    "I couldn't find that information in the HR policy documents.",
    "I couldn't find any matching HR policy documents."
}

def generate_node(state: GraphState):
    logger.info("generate_node : retrieved_docs: %s", len(state.get("retrieved_docs", [])))
    logger.info("generate_node : reranked_docs: %s", len(state.get("reranked_docs", [])))

    # Cache Hit
    if state.get("cache_hit"):
        logger.info("Returning Cached Response")
        return {
            "answer": state["cache_answer"]
        }

    # Invalid Question
    if not state["is_valid"]:
        return {
            "answer": state["validation_message"]
        }

    # Intent-Based Routing Responses
    intent_route = state.get("intent_route")
    if intent_route == "GREETING":
        return {
            "answer": "Hello! I'm your HR Assistant. How can I help you today?"
        }

    if intent_route == "GOODBYE":
        return {
            "answer": "Thank you for contacting HR. Have a great day!"
        }

    if intent_route == "DOWNLOAD_DOCUMENT":
        return {
            "answer": "I found your requested HR document. Please use the download option provided by the portal."
        }

    if intent_route == "CHECK_BALANCE":
        return {
            "answer": "Your leave balance will be retrieved from the Leave Management System."
        }

    if intent_route == "PAYSLIP":
        return {
            "answer": "Your payslip will be retrieved from the Payroll System."
        }

    # Out Of Scope
    if state.get("query_category") == "OutOfScope":
        return {
            "answer": (
                "I'm an HR Policy Assistant. "
                "I can answer questions related to company HR policies, "
                "leave, attendance, payroll, insurance, travel, "
                "employee benefits, onboarding and other HR topics."
            )
        }

    # No Context Found
    if not state.get("context", "").strip():
        return {
            "answer": "I couldn't find any matching HR policy documents."
        }

    # Prompt generation & LLM call
    prompt = get_answer_prompt(state)
    try:
        response = llm.invoke(prompt)
        answer = response.content.strip()
    except Exception as e:
        logger.exception(f"Error invoking LLM in generate_node: {e}")
        answer = "An error occurred while processing your request."

    if answer not in INVALID_CACHE_RESPONSES and "error" not in answer.lower():
        logger.info("Saved to CACHE")
        save_to_semantic_cache(state=state, answer=answer)
    else:
        logger.info("CACHE SKIPPED : Invalid answer or error")

    return {
        "answer": answer
    }
