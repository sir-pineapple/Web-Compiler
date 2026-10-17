require("dotenv").config();

const fs = require("fs/promises");
const path = require("path");

const {
    ingestMarkdownFile,
} = require("../src/services/knowledge/ingestion.service");

const KNOWLEDGE_ROOT = path.resolve(__dirname, "../knowledge");

const LANGUAGE_BY_DIRECTORY = {
    c: "C",
    cpp: "C++",
    java: "Java",
    python: "Python",
};

const discoverMarkdownFiles = async (directory) => {
    const entries = await fs.readdir(directory, {
        withFileTypes: true,
    });

    entries.sort((a, b) => a.name.localeCompare(b.name));

    const files = [];

    for (const entry of entries) {
        const absolutePath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            files.push(
                ...(await discoverMarkdownFiles(absolutePath))
            );
        } else if (
            entry.isFile() &&
            path.extname(entry.name).toLowerCase() === ".md"
        ) {
            files.push(absolutePath);
        }
    }

    return files;
};

const extractCategory = (content) => {
    const lines = content.split(/\r?\n/);

    for (let i = 0; i < lines.length; i += 1) {
        if (!/^#{1,6}\s+Category\s*#*\s*$/i.test(lines[i].trim())) {
            continue;
        }

        for (let j = i + 1; j < lines.length; j += 1) {
            const line = lines[j].trim();

            if (!line) {
                continue;
            }

            if (/^#{1,6}\s+/.test(line)) {
                return null;
            }

            return line;
        }
    }

    return null;
};

const inferLanguage = (relativePath) => {
    const firstDirectory = relativePath.split(path.sep)[0].toLowerCase();

    return LANGUAGE_BY_DIRECTORY[firstDirectory] ?? null;
};

const runIngestion = async () => {
    let files;

    try {
        files = await discoverMarkdownFiles(KNOWLEDGE_ROOT);
    } catch (error) {
        throw new Error(
            `Could not discover knowledge files in ${KNOWLEDGE_ROOT}: ${error.message}`
        );
    }

    if (files.length === 0) {
        throw new Error(
            `No Markdown knowledge documents found in ${KNOWLEDGE_ROOT}`
        );
    }

    console.log(`Discovered ${files.length} Markdown document(s).`);

    const summary = {
        discovered: files.length,
        created: 0,
        updated: 0,
        skipped: 0,
        failed: 0,
    };

    for (const absolutePath of files) {
        const relativePath = path.relative(
            KNOWLEDGE_ROOT,
            absolutePath
        );

        const displayPath = relativePath.split(path.sep).join("/");

        try {
            const content = await fs.readFile(absolutePath, "utf8");

            const result = await ingestMarkdownFile({
                relativePath: displayPath,
                language: inferLanguage(relativePath),
                category: extractCategory(content),
            });

            summary[result.status] += 1;

            console.log(
                `[${result.status.toUpperCase()}] ${displayPath}` +
                (result.chunkCount > 0
                    ? ` — ${result.chunkCount} chunk(s)`
                    : "")
            );
        } catch (error) {
            summary.failed += 1;

            console.error(
                `[FAILED] ${displayPath}: ${error.message}`
            );
        }
    }

    console.log("\nKnowledge ingestion summary:");
    console.log(JSON.stringify(summary, null, 2));

    return summary
};

module.exports = {
    runIngestion,
};

if (require.main === module) {
    runIngestion()
        .then((summary) => {
            if (summary.failed > 0) {
                process.exitCode = 1;
            }
        })
        .catch((error) => {
            console.error(
                `Knowledge ingestion aborted: ${error.message}`
            );
            process.exitCode = 1;
        });
}