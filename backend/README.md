

# RAG

# Question Validation Node
# Hybrid Intent Detection 
# Hybrid Intent Detection Node with add_conditional_edges 
# Query Classification 
# History-aware query rewriting 
# Hybrid Query Rewriting 
# Semantic Cacher
# Hybrid Search 
# Cross Encoder Reranking
# Answer Generation



py -3.10 -m venv venv
venv\Scripts\activate

# To install requirement file
pip install -r requirements.txt

# This will generate full requirements file:
pip freeze > requirements.txt


Handle Multiple Python version in Windows python
https://www.python.org/downloads/windows/


C:\Users\nraja>py -3.10 --version
Python 3.10.0

C:\Users\nraja>py --list
 -V:3.12 *        Python 3.12 (64-bit)
 -V:3.10          Python 3.10 (64-bit)


Install Dependencies

# Don't use this 
pip install pinecone-client   pip uninstall pinecone-client (dont use pinecone-client)- (Already pinecone-client deprecated)


# Requird Packages
# STEP 1
pip install python-dotenv
pip install langchain-huggingface
pip install sentence-transformers
pip install pinecone
pip install pinecone-text  (This package is separate from the pinecone SDK and is required for hybrid search features like BM25Encoder)

# STEP 2
pip install langchain
pip install langchain-community
pip install pypdf
pip install langchain-text-splitters

pip install langgraph
pip install langchain-ollama
pip install fastapi
pip install uvicorn



# To semantic cache
pip install langchain-pinecone

# For MYSQL Database connection
pip install mysql-connector-python


# Upload pdf
pip install "unstructured[pdf]"
pip install pymupdf
pip install pdfplumber
# install in my computer and added to environment variables
https://github.com/UB-Mannheim/tesseract/wiki


# To run API
uvicorn main:app --reload



# RAG 
```text
                    Start
                      │
                      ▼
            Question Validation
                      │
                      ▼
     Hybrid Intent Detection (Rule + Semantic)
          ├──────────────┬──────────────┬──────────────┐
          │              │              │              │
          ▼              ▼              ▼              ▼
   LLM Query      Leave API     Payroll API    Document API
 Classification         │              │              │
          │             │              │              │
          ▼             └─────── End ──┴────── End ───┘
 History-aware Query Rewrite
          │
          ▼
 Hybrid Query Rewrite
          │
          ▼
 Semantic Cache Lookup
     ┌───────────┴───────────┐
     │                       │
 Cache Hit              Cache Miss
     │                       │
     ▼                       ▼
Answer Generation      Hybrid Search
                             │
                             ▼
                 Cross-Encoder Reranking
                             │
                             ▼
                   Answer Generation
                             │
                             ▼
                            End
```