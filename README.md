# 🏢 Chat With Your Docs using  RAG


## 📄 User Query Flow

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
