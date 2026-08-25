import re
from backend.ai.graph.state import GraphState
from backend.ai.llm.llm import llm
from backend.ai.prompts.rewrite_prompt import QUERY_REWRITE_PROMPT
from backend.ai.graph.nodes.intent_detection import normalize_question
from backend.core.constants import QUERY_REWRITE_RULES, CANONICAL_QUERIES, AMBIGUOUS_WORDS
from backend.core.logger import logger

def rule_based_query_rewrite(question: str) -> str:
    rewritten = question
    for short_form, expanded in QUERY_REWRITE_RULES.items():
        rewritten = re.sub(
            rf"\b{re.escape(short_form)}\b",
            expanded,
            rewritten,
            flags=re.IGNORECASE
        )
    return rewritten

def should_use_llm_rewrite(question: str) -> bool:
    q = normalize_question(question)
    words = q.split()

    if len(words) <= 3:
        return True

    if "?" in question:
        return True

    if any(word in AMBIGUOUS_WORDS for word in words):
        return True

    if re.search(r"\bhow\b|\bwhat\b|\bwhy\b|\bwhere\b", q):
        return False

    if len(words) < 6:
        return True

    return False

def canonical_rewrite(query: str, category: str) -> str:
    query_lower = query.lower()
    rules = CANONICAL_QUERIES.get(category, [])

    for rule in rules:
        if any(pattern in query_lower for pattern in rule["patterns"]):
            return rule["canonical"]
    return query

def query_rewrite_node(state: GraphState):
    question = state["history_question"].strip()
    logger.info("query_rewrite_node : question: %s", question)

    rewritten = question

    # Step 1: Rule-Based Rewrite
    rewritten_after_rule = rule_based_query_rewrite(rewritten)
    if rewritten_after_rule != rewritten:
        logger.info("RULE REWRITE : %s", rewritten_after_rule)
    rewritten = rewritten_after_rule

    # Step 2: LLM Rewrite
    if should_use_llm_rewrite(rewritten):
        prompt = QUERY_REWRITE_PROMPT.format(question=rewritten)
        try:
            response = llm.invoke(prompt)
            llm_rewritten = response.content.strip()
            llm_rewritten = re.sub(
                r"^Rewritten Query\s*:\s*",
                "",
                llm_rewritten,
                flags=re.IGNORECASE
            )
            llm_rewritten = llm_rewritten.replace('"', "").strip()
            logger.info("LLM REWRITE : %s", llm_rewritten)
            rewritten = llm_rewritten
        except Exception as ex:
            logger.warning(f"LLM Rewrite Failed : {ex}")

    # Step 3: Canonical Rewrite
    canonical = canonical_rewrite(rewritten, state["query_category"])
    if canonical != rewritten:
        logger.info("CANONICAL : %s", canonical)
    rewritten = canonical

    return {
        "rewritten_question": rewritten
    }
