from backend.ai.graph.state import GraphState
from backend.core.logger import logger

def document_api_node(state: GraphState):
    logger.info("document_api_node reached")
    return {
        "answer": (
            "Your requested HR document is available.\n"
            "Please click the Download button in the HR Portal."
        ),
        "sources": []
    }

def leave_api_node(state: GraphState):
    logger.info("leave_api_node reached")
    leave_response = {
        "annual_leave": 12,
        "sick_leave": 5,
        "casual_leave": 2
    }

    return {
        "answer": (
            f"Your Leave Balance:\n"
            f"Annual Leave : {leave_response['annual_leave']}\n"
            f"Sick Leave : {leave_response['sick_leave']}\n"
            f"Casual Leave : {leave_response['casual_leave']}"
        ),
        "sources": []
    }

def payroll_api_node(state: GraphState):
    logger.info("payroll_api_node reached")
    payslip = {
        "month": "June 2026",
        "status": "Available"
    }

    return {
        "answer": (
            f"Your payslip for {payslip['month']} "
            f"is {payslip['status']}."
        ),
        "sources": []
    }
