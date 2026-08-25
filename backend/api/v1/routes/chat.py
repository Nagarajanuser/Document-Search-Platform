import uuid
from fastapi import APIRouter
from backend.api.v1.schemas.chat_schema import QuestionRequest, QuestionResponse, ApiResponse, ErrorResponse
from backend.ai.graph.graph import graph
from backend.core.database import save_chat_session, save_chat_message
from backend.core.constants import logged_in_user
from backend.core.logger import logger

router = APIRouter()

@router.post(
    "/ask",
    response_model=ApiResponse
)
def ask_question(request: QuestionRequest):
    logger.info("=" * 80)
    logger.info("New Request Received")
    logger.info("Question: %s", request.question)
    logger.info("Session ID: %s", request.session_id)

    if request.session_id is None:
        request.session_id = str(uuid.uuid4())
        logger.info("New Session Created : %s", request.session_id)
        save_chat_session(
            session_id=request.session_id,
            user_id=2
        )

    save_chat_message(
        session_id=request.session_id,
        role="user",
        message=request.question
    )

    try:
        result = graph.invoke(
            {
                "question": request.question,
                "session_id": request.session_id,
                "department": logged_in_user["department"],
                "country": logged_in_user["country"],
                "location": logged_in_user["location"],
                "access_level": logged_in_user["access_level"]
            }
        )
        answer = result.get("answer", "")
        save_chat_message(
            session_id=request.session_id,
            role="assistant",
            message=answer
        )
        return ApiResponse(
            success=True,
            data=QuestionResponse(
                question=request.question,
                session_id=result.get("session_id", request.session_id),
                answer=result.get("answer", ""),
                sources=result.get("sources", []),
            ),
            error=None
        )

    except Exception as e:
        logger.exception("Error while processing /api/v1/ask request")
        return ApiResponse(
            success=False,
            data=None,
            error=ErrorResponse(
                code="INTERNAL_SERVER_ERROR",
                message=str(e)
            )
        )
