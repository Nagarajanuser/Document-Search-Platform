import re
from backend.ai.graph.state import GraphState
from backend.core.constants import BLOCKED_KEYWORDS, SQL_KEYWORDS
from backend.core.logger import logger

def validate_question_node(state: GraphState):
    question = state["question"].strip()
    logger.info("validate_question_node: question : %s", question)

    # Empty Question
    if not question:
        logger.warning("Validation Failed: Empty question")
        return {
            "is_valid": False,
            "validation_message": "Please enter a question."
        }

    # Very Short Question
    if len(question) < 1:
        logger.warning("Validation Failed: Question too short")
        return {
            "is_valid": False,
            "validation_message": "Please enter a more detailed question."
        }

    # Maximum Length
    if len(question) > 500:
        logger.warning("Validation Failed: Question exceeds 500 characters")
        return {
            "is_valid": False,
            "validation_message": "Question is too long."
        }

    # Multiple Spaces
    question = re.sub(r"\s+", " ", question)

    # Prompt Injection Keywords
    lower_question = question.lower()
    for keyword in BLOCKED_KEYWORDS:
        if keyword in lower_question:
            logger.warning("Validation Failed: Prompt injection detected")
            return {
                "is_valid": False,
                "validation_message": "Your question violates the HR Assistant usage policy."
            }

    # HTML Injection
    if "<script" in lower_question:
        logger.warning("Validation Failed: HTML script detected")
        return {
            "is_valid": False,
            "validation_message": "Invalid question."
        }

    # SQL Injection
    for keyword in SQL_KEYWORDS:
        if keyword in lower_question:
            logger.warning("Validation Failed: SQL injection detected")
            return {
                "is_valid": False,
                "validation_message": "Invalid question."
            }

    logger.info("Validation completed")
    return {
        "question": question,
        "is_valid": True,
        "validation_message": ""
    }
