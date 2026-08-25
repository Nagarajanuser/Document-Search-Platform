from langgraph.graph import StateGraph, START, END
from backend.ai.graph.state import GraphState
from backend.ai.graph.nodes.validation import validate_question_node
from backend.ai.graph.nodes.intent_detection import intent_detection_node, route_after_intent
from backend.ai.graph.nodes.api_nodes import leave_api_node, payroll_api_node, document_api_node
from backend.ai.graph.nodes.classification import classify_query_node
from backend.ai.graph.nodes.history_rewrite import history_query_rewrite_node
from backend.ai.graph.nodes.query_rewrite import query_rewrite_node
from backend.ai.graph.nodes.semantic_cache import semantic_cache_lookup_node, route_after_cache
from backend.ai.graph.nodes.retrieve import retrieve_node
from backend.ai.graph.nodes.rerank import rerank_node
from backend.ai.graph.nodes.answer import generate_node

builder = StateGraph(GraphState)

# Add Nodes
builder.add_node("validate_question", validate_question_node)
builder.add_node("intent_detection", intent_detection_node)
builder.add_node("classify_query", classify_query_node)
builder.add_node("history_query_rewrite", history_query_rewrite_node)
builder.add_node("query_rewrite", query_rewrite_node)
builder.add_node("semantic_cache_lookup", semantic_cache_lookup_node)
builder.add_node("retrieve", retrieve_node)
builder.add_node("rerank", rerank_node)
builder.add_node("generate", generate_node)
builder.add_node("leave_api", leave_api_node)
builder.add_node("payroll_api", payroll_api_node)
builder.add_node("document_api", document_api_node)

# Add Edges
builder.add_edge(START, "validate_question")
builder.add_edge("validate_question", "intent_detection")

builder.add_conditional_edges(
    "intent_detection",
    route_after_intent,
    {
        "generate": "generate",
        "classify_query": "classify_query",
        "leave_api": "leave_api",
        "payroll_api": "payroll_api",
        "document_api": "document_api"
    }
)

builder.add_edge("classify_query", "history_query_rewrite")
builder.add_edge("history_query_rewrite", "query_rewrite")
builder.add_edge("query_rewrite", "semantic_cache_lookup")

builder.add_conditional_edges(
    "semantic_cache_lookup",
    route_after_cache,
    {
        "generate": "generate",
        "retrieve": "retrieve"
    }
)

builder.add_edge("retrieve", "rerank")
builder.add_edge("rerank", "generate")
builder.add_edge("generate", END)
builder.add_edge("leave_api", END)
builder.add_edge("payroll_api", END)
builder.add_edge("document_api", END)

graph = builder.compile()
