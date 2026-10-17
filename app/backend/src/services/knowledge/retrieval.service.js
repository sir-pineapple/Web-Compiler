const pool = require("../../config/db");
const {
    embedText,
    DIMENSIONS,
} = require("../debug/embedding.service");

const EMBEDDING_DIMENSIONS = 768;
const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 20;
const DEFAULT_CANDIDATE_LIMIT = 20;
const RRF_K = 60;

const validateInput = ({ query, language, limit }) => {
    if (typeof query !== "string" || !query.trim()) {
        throw new TypeError("query must be a non-empty string");
    }

    if (
        language != null &&
        (typeof language !== "string" || !language.trim())
    ) {
        throw new TypeError("language must be a non-empty string or null");
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
        throw new RangeError(
            `limit must be an integer between 1 and ${MAX_LIMIT}`
        );
    }
};

const validateEmbedding = (embedding) => {
    if (
        !Array.isArray(embedding) ||
        embedding.length !== EMBEDDING_DIMENSIONS ||
        !embedding.every(Number.isFinite)
    ) {
        throw new Error("Query embedding has an invalid dimension or values");
    }
};

const mergeRankedResults = (vectorRows, keywordRows, limit) => {
    const merged = new Map();

    const addRankedResults = (rows, rankField) => {
        rows.forEach((row, index) => {
            const key = String(row.chunk_id);
            const rank = index + 1;

            let entry = merged.get(key);

            if (!entry) {
                entry = {
                    ...row,
                    vectorRank: null,
                    keywordRank: null,
                    hybridScore: 0,
                };

                merged.set(key, entry);
            }

            entry[rankField] = rank;
            entry.hybridScore += 1 / (RRF_K + rank);
        });
    };

    addRankedResults(vectorRows, "vectorRank");
    addRankedResults(keywordRows, "keywordRank");

    return [...merged.values()]
        .sort((a, b) => b.hybridScore - a.hybridScore)
        .slice(0, limit)
        .map((row) => ({
            chunkId: row.chunk_id,
            chunkIndex: row.chunk_index,
            content: row.content,
            chunkMetadata: row.chunk_metadata,
            document: {
                id: row.document_id,
                sourceKey: row.source_key,
                title: row.title,
                sourceType: row.source_type,
                sourceUrl: row.source_url,
                language: row.language,
                metadata: row.document_metadata,
            },
            similarity:
                row.similarity == null ? null : Number(row.similarity),
            hybridScore: row.hybridScore,
            vectorRank: row.vectorRank,
            keywordRank: row.keywordRank,
        }));
};

const retrieveKnowledge = async ({
    query,
    language = null,
    limit = DEFAULT_LIMIT,
}) => {
    validateInput({ query, language, limit });

    if (DIMENSIONS !== EMBEDDING_DIMENSIONS) {
        throw new Error(
            `Embedding dimension mismatch: service returns ${DIMENSIONS}, ` +
            `but retrieval expects ${EMBEDDING_DIMENSIONS}`
        );
    }

    const normalizedQuery = query.trim();
    const normalizedLanguage = language?.trim() ?? null;

    const embedding = await embedText(normalizedQuery);
    validateEmbedding(embedding);

    const embeddingLiteral = `[${embedding.join(",")}]`;
    const candidateLimit = Math.max(DEFAULT_CANDIDATE_LIMIT, limit);

    const vectorQueryParams = [
        embeddingLiteral,
        normalizedLanguage,
        candidateLimit,
    ];

    const keywordQueryParams = [
        normalizedQuery,
        normalizedLanguage,
        candidateLimit,
    ];

    const vectorSearch = pool.query(
        `
            SELECT
                c.id AS chunk_id,
                c.chunk_index,
                c.content,
                c.metadata AS chunk_metadata,
                d.id AS document_id,
                d.source_key,
                d.title,
                d.source_type,
                d.source_url,
                d.language,
                d.metadata AS document_metadata,
                1 - (c.embedding <=> $1::vector) AS similarity
            FROM knowledge_chunks AS c
            INNER JOIN knowledge_documents AS d
                ON d.id = c.document_id
            WHERE ($2::text IS NULL OR d.language = $2)
            ORDER BY c.embedding <=> $1::vector ASC
            LIMIT $3
        `,
        vectorQueryParams
    );

    const keywordSearch = pool.query(
        `
            WITH search_query AS (
                SELECT websearch_to_tsquery('simple', $1) AS terms
            )
            SELECT
                c.id AS chunk_id,
                c.chunk_index,
                c.content,
                c.metadata AS chunk_metadata,
                d.id AS document_id,
                d.source_key,
                d.title,
                d.source_type,
                d.source_url,
                d.language,
                d.metadata AS document_metadata,
                ts_rank_cd(
                    to_tsvector('simple', c.content),
                    search_query.terms
                ) AS keyword_score
            FROM knowledge_chunks AS c
            INNER JOIN knowledge_documents AS d
                ON d.id = c.document_id
            CROSS JOIN search_query
            WHERE
                numnode(search_query.terms) > 0
                AND to_tsvector('simple', c.content) @@ search_query.terms
                AND ($2::text IS NULL OR d.language = $2)
            ORDER BY keyword_score DESC, c.id ASC
            LIMIT $3
        `,
        keywordQueryParams
    );

    const [vectorResult, keywordResult] = await Promise.all([
        vectorSearch,
        keywordSearch,
    ]);

    return mergeRankedResults(
        vectorResult.rows,
        keywordResult.rows,
        limit
    );
};

module.exports = {
    retrieveKnowledge,
    DEFAULT_LIMIT,
    MAX_LIMIT,
};