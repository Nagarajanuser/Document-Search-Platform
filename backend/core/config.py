import os
from dotenv import load_dotenv

# Search for .env file across standard project paths
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
env_paths = [
    os.path.join(base_dir, "backend", ".env"),
    os.path.join(base_dir, ".env"),
    os.path.join(os.getcwd(), ".env"),
    os.path.join(os.getcwd(), "backend", ".env")
]

for env_path in env_paths:
    if os.path.exists(env_path):
        load_dotenv(env_path)
        break
else:
    load_dotenv()

# Pinecone Settings
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = os.getenv("INDEX_NAME") or os.getenv("PINECONE_INDEX_NAME")
INDEX_NAME_CACHE = os.getenv("INDEX_NAME_CACHE") or os.getenv("PINECONE_CACHE_INDEX_NAME")

# MySQL Configuration
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", "Nag@1234"),
    "database": os.getenv("DB_NAME", "hr_portal")
}

# Semantic Cache Settings
CACHE_THRESHOLD = float(os.getenv("CACHE_THRESHOLD", "0.90"))
CACHE_EXPIRY_DAYS = int(os.getenv("CACHE_EXPIRY_DAYS", "30"))
MODEL_VERSION = os.getenv("MODEL_VERSION", "qwen2.5:1.5b")
CACHE_VERSION = os.getenv("CACHE_VERSION", "1.5")
EMBEDDING_MODEL_VERSION = os.getenv("EMBEDDING_MODEL_VERSION", "BAAI/bge-small-en-v1.5")
SIMILARITY_THRESHOLD = float(os.getenv("SIMILARITY_THRESHOLD", "0.82"))
