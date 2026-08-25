import os
import re
import uuid
from pathlib import Path

from unstructured.partition.pdf import partition_pdf
from langchain_huggingface import HuggingFaceEmbeddings

from backend.core.metadata import DOCUMENT_METADATA
from backend.core.logger import logger
from backend.core.config import PINECONE_API_KEY, INDEX_NAME, EMBEDDING_MODEL_VERSION
from backend.ai.embeddings.embedding_model import embedding_model as default_embedding_model
from backend.ai.retriever.pinecone import index as default_index

# ---------------------------------------------------
# Step 1 : Validate File
# ---------------------------------------------------
def validate_file(file_path: str) -> Path:
    logger.info("validate_file : %s", file_path)
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"{file_path} not found.")

    if path.suffix.lower() != ".pdf":
        raise ValueError("Only PDF files are supported.")

    return path


# ---------------------------------------------------
# Step 2 : Parse PDF
# ---------------------------------------------------
def parse_pdf(file_path: str):
    logger.info("parse_pdf : %s", file_path)
    elements = partition_pdf(
        filename=file_path,
        strategy="hi_res",
        infer_table_structure=True,
        languages=["eng"],
    )
    return elements


# ---------------------------------------------------
# Step 3 : Clean Text
# ---------------------------------------------------
def clean_text(text: str) -> str:
    logger.info("clean_text : %s", text)
    if not text:
        return ""

    text = text.replace("\x00", "")
    text = re.sub(r"[-=_]{3,}", "", text)
    text = re.sub(r"Page\s+\d+(\s+of\s+\d+)?", "", text, flags=re.I)  # removed pdf's page number
    text = re.sub(r"\n+", "\n", text)
    text = re.sub(r"\s+", " ", text)

    return text.strip()


# ---------------------------------------------------
# Step 4 : Clean Elements
# ---------------------------------------------------
def clean_elements(elements):
    allowed = {
        "Title",
        "NarrativeText",
        "ListItem",
        "Table",
        "TableChunk",
        "CompositeElement",
        "Text",
    }

    cleaned = []

    for element in elements:
        if type(element).__name__ not in allowed:
            continue

        text = clean_text(element.text)

        if not text:
            continue

        element.text = text
        cleaned.append(element)

    return cleaned


# ---------------------------------------------------
# Step 4.1 : merge table rows
# ---------------------------------------------------
def merge_table_rows(elements):
    """
    Merge table-like key/value pairs that FAST parser splits.

    Example:

    Working Days
    Monday to Friday

    becomes

    Working Days : Monday to Friday
    """
    merged = []
    i = 0

    while i < len(elements):
        current = elements[i]
        current_text = clean_text(current.text)

        if i + 1 < len(elements):
            nxt = elements[i + 1]
            next_text = clean_text(nxt.text)

            current_type = type(current).__name__
            next_type = type(nxt).__name__

            # Table-like labels
            if (
                current_type == "Title"
                and next_type in ("NarrativeText", "Title")
                and len(current_text.split()) <= 4
                and not re.match(r'^\d+\.', current_text)
            ):
                current.text = f"{current_text}: {next_text}"
                merged.append(current)
                i += 2
                continue

        merged.append(current)
        i += 1

    return merged


# ---------------------------------------------------
# Step 5 : Chunk Elements (Section-aware Chunking)
# ---------------------------------------------------
def should_skip(text: str) -> bool:
    text = text.strip()

    # Remove only exact standalone header text
    if text == "Attendance Policy":
        return True

    if text == "New Gen Software Solutions":
        return True

    if re.fullmatch(r"Version:\s*[\d.]+", text):
        return True

    if re.fullmatch(r"Effective Date:.*", text):
        return True

    return False


SECTION_HEADING_PATTERN = re.compile(
    r"^\d+(\.\d+)*\.\s+[A-Z]"
)


def is_heading(element):
    text = element.text.strip()
    if not text:
        return False

    # Only numbered headings start a new chunk
    return bool(SECTION_HEADING_PATTERN.match(text))


def chunk_elements(elements):
    chunks = []

    current_title = None
    current_content = []
    current_page = None

    skip_section = False

    for element in elements:
        text = clean_text(element.text)

        if not text:
            continue

        if should_skip(text):
            continue

        # Ignore everything after Employee Acknowledgement
        if text.lower().startswith("employee acknowledgement") \
           or text.lower().startswith("employee acknowledgment"):
            skip_section = True
            continue

        if skip_section:
            continue

        if is_heading(element):
            if current_title:
                chunks.append({
                    "title": current_title,
                    "text": current_title + "\n\n" + "\n".join(current_content),
                    "page": current_page
                })

            current_title = text
            current_content = []
            current_page = getattr(
                element.metadata,
                "page_number",
                None
            )
        else:
            current_content.append(text)

    if current_title:
        chunks.append({
            "title": current_title,
            "text": current_title + "\n\n" + "\n".join(current_content),
            "page": current_page
        })

    logger.info("Total Chunks: %d", len(chunks))

    for i, chunk in enumerate(chunks, start=1):
        logger.info("=" * 80)
        logger.info("Chunk %d", i)
        logger.info("Title : %s", chunk['title'])
        logger.info("Page  : %s", chunk['page'])
        logger.info("Characters : %d", len(chunk['text']))
        logger.info("Words      : %d", len(chunk['text'].split()))
        logger.info("Text      : %s", chunk['text'])

    return chunks


# ---------------------------------------------------
# Step 6 : Attach Metadata
# ---------------------------------------------------
def build_documents(chunks, file_path):
    source = os.path.basename(file_path)
    base_metadata = DOCUMENT_METADATA.get(source, {})
    documents = []

    for chunk in chunks:
        documents.append({
            "id": str(uuid.uuid4()),
            "text": chunk["text"],
            "metadata": {
                "source": source,
                "page": chunk["page"],
                "section": chunk["title"],
                **base_metadata
            }
        })

    return documents


# ---------------------------------------------------
# Step 7 : Create Embeddings
# ---------------------------------------------------
def create_embeddings(documents, model=None):
    """
    Generate embeddings for all document chunks in batch.
    Returns vectors ready for Pinecone upsert.
    """
    if not documents:
        return []

    if model is None:
        model = default_embedding_model

    texts = [doc["text"] for doc in documents]
    embeddings = model.embed_documents(texts)

    vectors = []

    for doc, embedding in zip(documents, embeddings):
        metadata = doc["metadata"].copy()

        # Store chunk text for retrieval
        metadata["text"] = doc["text"]
        vectors.append(
            (
                doc["id"],          # Reuse existing UUID
                embedding,
                metadata
            )
        )

    return vectors


# ---------------------------------------------------
# Step 8 : Upload to Pinecone
# ---------------------------------------------------
def upload_to_pinecone(target_index, vectors, batch_size=100):
    if not target_index:
        logger.warning("Pinecone index is not provided or initialized. Skipping upsert.")
        return

    total = len(vectors)
    for i in range(0, total, batch_size):
        batch = vectors[i:i + batch_size]
        try:
            target_index.upsert(vectors=batch)
            logger.info("Uploaded %d/%d vectors to Pinecone", min(i + batch_size, total), total)
        except Exception as e:
            logger.error("Upload to Pinecone failed: %s", e)
            raise


# ---------------------------------------------------
# Complete Pipeline
# ---------------------------------------------------
def process_pdf(file_path: str, target_index=None):
    validate_file(file_path)

    elements = parse_pdf(file_path)

    elements1 = clean_elements(elements)

    elements2 = merge_table_rows(elements1)

    chunks = chunk_elements(elements2)

    documents = build_documents(chunks, file_path)

    vectors = create_embeddings(documents)

    if target_index is None:
        target_index = default_index

    if target_index is not None:
        upload_to_pinecone(target_index, vectors)
    else:
        logger.warning("Pinecone index unavailable, processed PDF and generated embeddings without Pinecone upsert.")

    return documents
