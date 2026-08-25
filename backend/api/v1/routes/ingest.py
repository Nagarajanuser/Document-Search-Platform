import os
import shutil
from typing import List
from fastapi import APIRouter, File, UploadFile, status
from backend.api.v1.schemas.ingest_schema import (
    IngestApiResponse,
    IngestResponseData,
    IngestedFileSummary,
    IngestErrorResponse,
)
from backend.ai.ingestion import process_pdf
from backend.core.logger import logger

router = APIRouter()

# Directory to store uploaded PDFs
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
PDF_SAVE_DIR = os.path.join(BASE_DIR, "pdfs")
os.makedirs(PDF_SAVE_DIR, exist_ok=True)


@router.post(
    "/ingest",
    response_model=IngestApiResponse,
    status_code=status.HTTP_200_OK,
)
async def ingest_pdf_files(files: List[UploadFile] = File(...)):
    logger.info("=" * 80)
    logger.info("Received /api/v1/ingest request for %d file(s)", len(files))

    if not files:
        return IngestApiResponse(
            success=False,
            data=None,
            error=IngestErrorResponse(
                code="NO_FILES_PROVIDED",
                message="No files were provided in the upload request."
            )
        )

    processed_summaries: List[IngestedFileSummary] = []

    try:
        for file in files:
            filename = file.filename or "uploaded_document.pdf"
            saved_path = os.path.join(PDF_SAVE_DIR, filename)

            # Save uploaded file content to disk
            with open(saved_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            logger.info("Saved file to '%s'. Starting RAG pipeline...", saved_path)

            # Process PDF through validate, parse, clean, chunk, embed & Pinecone upsert pipeline
            documents = process_pdf(saved_path)

            rel_saved_path = os.path.relpath(saved_path, start=BASE_DIR).replace("\\", "/")

            processed_summaries.append(
                IngestedFileSummary(
                    filename=filename,
                    status="Success",
                    total_chunks=len(documents),
                    saved_path=rel_saved_path
                )
            )

        return IngestApiResponse(
            success=True,
            data=IngestResponseData(
                message=f"Successfully processed and ingested {len(processed_summaries)} file(s).",
                processed_files=processed_summaries
            ),
            error=None
        )

    except Exception as e:
        logger.exception("Error occurred during document ingestion pipeline")
        return IngestApiResponse(
            success=False,
            data=None,
            error=IngestErrorResponse(
                code="INGESTION_ERROR",
                message=str(e)
            )
        )
