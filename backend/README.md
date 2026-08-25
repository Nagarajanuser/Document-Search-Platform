

# RAG
# Pinecone vector databse
# FastAPI
# Langchain
# Langgraph

# Question Validation Node
# Hybrid Intent Detection ( Rule-based + Semantic)
# Hybrid Intent Detection Node with add_conditional_edges 
# Query Classification (LLM)
# History-aware query rewriting (Conversation Memory or Chat Memory)
# Hybrid Query Rewriting (Rule-Based Query Rewriting and LLM based) + Canonical Rewrite
# Semantic Cacher (Semantic)
# Hybrid Search (Semantic + Keword + meta data)
# Cross Encoder Reranking
# Metadata Filtering
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

# Langsmith
pip install langsmith


# RAGAS Evaluation
pip install ragas==0.2.15
pip install datasets

pip uninstall ragas

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


# To create index - create a index in pinecone vector database
python create_index.py

# To Delete index - Delete a index in pinecone vector database
python delete_index_data.py

# To Upload doc to pinecone vector database
python upload_doc.py


# To run API
uvicorn main:app --reload

# Ragas Evaluation
python evaluation/evaluate_ragas.py 



# History-aware Query Rewriting 
```text
User Question
      │
      ▼
History Rewrite Node
      │
      ▼
is_followup_question()
      │
      ├────────── False ──────────► history_question = original question
      │                                  │
      │                                  ▼
      │                           Hybrid Query Rewrite
      │
      └────────── True ───────────► Load Chat History
                                         │
                                         ▼
                                  History Rewrite LLM
                                         │
                                         ▼
                                 history_question
                                         │
                                         ▼
                                  Hybrid Query Rewrite
```

# My final RAG Application
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