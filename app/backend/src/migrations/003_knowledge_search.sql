CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_content_fts
ON knowledge_chunks
USING GIN (to_tsvector('simple', content));