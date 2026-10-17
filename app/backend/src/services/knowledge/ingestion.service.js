const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const {
    chunkMarkdown,
} = require("./chunking.service");

const {
    embedText,
    DIMENSIONS,
} = require("../debug/embedding.service");

const {
    saveDocumentWithChunks,
    findDocumentBySourceKey,
    EMBEDDING_DIMENSIONS,
} = require("./knowledge.repository");

const KNOWLEDGE_ROOT = path.resolve(__dirname, "../../../knowledge");

const sha256 = (content) =>
    crypto.createHash("sha256").update(content, "utf8").digest("hex");

const extractTitle = (content, relativePath) => {
    const heading = content.match(/^\s{0,3}#\s+(.+?)\s*#*\s*$/m);

    if (heading) {
        return heading[1].trim();
    }

    return path.basename(relativePath, path.extname(relativePath));
};

const resolveKnowledgePath = (relativePath) => {
    if (
        typeof relativePath !== "string" ||
        !relativePath.trim() ||
        path.isAbsolute(relativePath)
    ) {
        throw new TypeError(
            "relativePath must be a non-empty relative path"
        );
    }

    const absolutePath = path.resolve(KNOWLEDGE_ROOT, relativePath);
    const relativeToRoot = path.relative(KNOWLEDGE_ROOT, absolutePath);

    if (
        relativeToRoot === "" ||
        relativeToRoot === ".." ||
        relativeToRoot.startsWith(`..${path.sep}`) ||
        path.isAbsolute(relativeToRoot)
    ) {
        throw new Error("Knowledge document path is outside the knowledge directory");
    }

    if (path.extname(absolutePath).toLowerCase() !== ".md") {
        throw new Error("Only Markdown knowledge documents are supported");
    }

    return absolutePath;
};

const validateEmbeddingConfiguration = () => {
    if (DIMENSIONS !== EMBEDDING_DIMENSIONS) {
        throw new Error(
            `Embedding dimension mismatch: Gemini returns ${DIMENSIONS}, ` +
            `but the repository expects ${EMBEDDING_DIMENSIONS}`
        );
    }
};

const ingestMarkdownFile = async ({
    relativePath,
    language,
    category,
    sourceUrl = null,
}) => {
    validateEmbeddingConfiguration();

    const absolutePath = resolveKnowledgePath(relativePath);
    const content = await fs.readFile(absolutePath, "utf8");

    if (!content.trim()) {
        throw new Error(`Knowledge document is empty: ${relativePath}`);
    }

    const normalizedPath = relativePath
        .split(path.sep)
        .join("/");

    const sourceKey = normalizedPath;
    const contentHash = sha256(content);

    const existingDocument = await findDocumentBySourceKey(sourceKey);

    if (
        existingDocument &&
        existingDocument.content_hash === contentHash
    ) {
        return {
            status: "skipped",
            reason: "unchanged",
            sourceKey,
            documentId: existingDocument.id,
            chunkCount: 0,
        };
    }

    const chunks = chunkMarkdown({
        content,
        sourcePath: normalizedPath,
        language,
        category,
    });

    if (chunks.length === 0) {
        throw new Error(
            `Chunking produced no chunks for ${relativePath}`
        );
    }

    const embeddedChunks = [];

    // Keep requests sequential in v1 to make quota usage predictable.
    for (const chunk of chunks) {
        const embedding = await embedText(chunk.content);

        if (
            !Array.isArray(embedding) ||
            embedding.length !== EMBEDDING_DIMENSIONS ||
            !embedding.every(Number.isFinite)
        ) {
            throw new Error(
                `Invalid embedding for chunk ${chunk.chunkIndex} of ${relativePath}`
            );
        }

        embeddedChunks.push({
            ...chunk,
            embedding,
        });
    }

    const document = {
        sourceKey,
        title: extractTitle(content, normalizedPath),
        sourceType: "markdown",
        sourceUrl,
        language: language ?? null,
        contentHash,
        metadata: {
            category: category ?? null,
            relativePath: normalizedPath,
        },
    };

    const saved = await saveDocumentWithChunks({
        document,
        chunks: embeddedChunks,
    });

    return {
        status: existingDocument ? "updated" : "created",
        sourceKey,
        documentId: saved.documentId,
        chunkCount: saved.chunkCount,
        contentHash: saved.contentHash,
    };
};

module.exports = {
    ingestMarkdownFile,
};
