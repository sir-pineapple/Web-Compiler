const pool = require("../../config/db");

const EMBEDDING_DIMENSIONS = 768;

const validateDocument = (document) => {
    if (!document || typeof document !== "object") {
        throw new TypeError("Document must be an object");
    }

    const requiredFields = [
        "sourceKey",
        "title",
        "sourceType",
        "contentHash",
    ];

    for (const field of requiredFields) {
        if (
            typeof document[field] !== "string" ||
            !document[field].trim()
        ) {
            throw new TypeError(
                `Document field '${field}' must be a non-empty string`
            );
        }
    }

    if (
        document.language != null &&
        typeof document.language !== "string"
    ) {
        throw new TypeError("Document language must be a string or null");
    }

    if (
        document.sourceUrl != null &&
        typeof document.sourceUrl !== "string"
    ) {
        throw new TypeError("Document sourceUrl must be a string or null");
    }

    if (
        document.metadata != null &&
        (
            typeof document.metadata !== "object" ||
            Array.isArray(document.metadata)
        )
    ) {
        throw new TypeError("Document metadata must be an object");
    }
};

const validateChunks = (chunks) => {
    if (!Array.isArray(chunks) || chunks.length === 0) {
        throw new TypeError("At least one knowledge chunk is required");
    }

    const indexes = new Set();

    for (const chunk of chunks) {
        if (!chunk || typeof chunk !== "object") {
            throw new TypeError("Each chunk must be an object");
        }

        if (
            !Number.isInteger(chunk.chunkIndex) ||
            chunk.chunkIndex < 0
        ) {
            throw new TypeError(
                "Chunk index must be a non-negative integer"
            );
        }

        if (indexes.has(chunk.chunkIndex)) {
            throw new Error(`Duplicate chunk index: ${chunk.chunkIndex}`);
        }

        indexes.add(chunk.chunkIndex);

        if (
            typeof chunk.content !== "string" ||
            !chunk.content.trim()
        ) {
            throw new TypeError("Chunk content must be a non-empty string");
        }

        if (
            !Array.isArray(chunk.embedding) ||
            chunk.embedding.length !== EMBEDDING_DIMENSIONS ||
            !chunk.embedding.every(Number.isFinite)
        ) {
            throw new TypeError(
                `Each embedding must contain exactly ${EMBEDDING_DIMENSIONS} finite numbers`
            );
        }

        if (
            chunk.metadata != null &&
            (
                typeof chunk.metadata !== "object" ||
                Array.isArray(chunk.metadata)
            )
        ) {
            throw new TypeError("Chunk metadata must be an object");
        }
    }
};

const saveDocumentWithChunks = async ({ document, chunks }) => {
    validateDocument(document);
    validateChunks(chunks);

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const documentResult = await client.query(
            `
                INSERT INTO knowledge_documents (
                    source_key,
                    title,
                    source_type,
                    source_url,
                    language,
                    content_hash,
                    metadata
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
                ON CONFLICT (source_key)
                DO UPDATE SET
                    title = EXCLUDED.title,
                    source_type = EXCLUDED.source_type,
                    source_url = EXCLUDED.source_url,
                    language = EXCLUDED.language,
                    content_hash = EXCLUDED.content_hash,
                    metadata = EXCLUDED.metadata,
                    updated_at = NOW()
                RETURNING id, content_hash
            `,
            [
                document.sourceKey,
                document.title,
                document.sourceType,
                document.sourceUrl ?? null,
                document.language ?? null,
                document.contentHash,
                JSON.stringify(document.metadata ?? {}),
            ]
        );

        const savedDocument = documentResult.rows[0];

        await client.query(
            "DELETE FROM knowledge_chunks WHERE document_id = $1",
            [savedDocument.id]
        );

        for (const chunk of chunks) {
            // pgvector accepts a bracketed vector literal.
            const embeddingLiteral = `[${chunk.embedding.join(",")}]`;

            await client.query(
                `
                    INSERT INTO knowledge_chunks (
                        document_id,
                        chunk_index,
                        content,
                        embedding,
                        metadata
                    )
                    VALUES ($1, $2, $3, $4::vector, $5::jsonb)
                `,
                [
                    savedDocument.id,
                    chunk.chunkIndex,
                    chunk.content,
                    embeddingLiteral,
                    JSON.stringify(chunk.metadata ?? {}),
                ]
            );
        }

        await client.query("COMMIT");

        return {
            documentId: savedDocument.id,
            chunkCount: chunks.length,
            contentHash: savedDocument.content_hash,
        };
    } catch (error) {
        try {
            await client.query("ROLLBACK");
        } catch (rollbackError) {
            console.error(
                "Failed to roll back knowledge transaction:",
                rollbackError.message
            );
        }

        throw error;
    } finally {
        client.release();
    }
};

const findDocumentBySourceKey = async (sourceKey) => {
    if (typeof sourceKey !== "string" || !sourceKey.trim()) {
        throw new TypeError("sourceKey must be a non-empty string");
    }

    const result = await pool.query(
        `
            SELECT
                id,
                source_key,
                title,
                source_type,
                source_url,
                language,
                content_hash,
                metadata,
                created_at,
                updated_at
            FROM knowledge_documents
            WHERE source_key = $1
        `,
        [sourceKey]
    );

    return result.rows[0] ?? null;
};

module.exports = {
    saveDocumentWithChunks,
    findDocumentBySourceKey,
    EMBEDDING_DIMENSIONS,
};
