const DEFAULT_MAX_CHARS = 1800;
const DEFAULT_OVERLAP_CHARS = 200;

const splitIntoSections = (markdown) => {
    const lines = markdown.split(/\r?\n/);
    const sections = [];

    let currentTitle = "Introduction";
    let currentLines = [];
    let insideFence = false;
    let fenceMarker = null;

    const flush = () => {
        const content = currentLines.join("\n").trim();

        if (content) {
            sections.push({
                title: currentTitle,
                content,
            });
        }
    };

    for (const line of lines) {
        const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);

        if (!insideFence && !fenceMatch) {
            const headingMatch = line.match(/^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/);

            if (headingMatch) {
                flush();

                currentTitle = headingMatch[2].trim();
                currentLines = [line];
                continue;
            }
        }

        currentLines.push(line);

        if (fenceMatch) {
            if (!insideFence) {
                insideFence = true;
                fenceMarker = fenceMatch[1];
            } else if (
                fenceMatch[1][0] === fenceMarker[0] &&
                fenceMatch[1].length >= fenceMarker.length
            ) {
                insideFence = false;
                fenceMarker = null;
            }
        }
    }

    flush();

    return sections;
};

const splitIntoBlocks = (content) => {
    const lines = content.split("\n");
    const blocks = [];

    let current = [];
    let insideFence = false;
    let fenceMarker = null;

    const flush = () => {
        const block = current.join("\n").trim();

        if (block) {
            blocks.push(block);
        }

        current = [];
    };

    for (const line of lines) {
        const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);

        if (fenceMatch) {
            current.push(line);

            if (!insideFence) {
                insideFence = true;
                fenceMarker = fenceMatch[1];
            } else if (
                fenceMatch[1][0] === fenceMarker[0] &&
                fenceMatch[1].length >= fenceMarker.length
            ) {
                insideFence = false;
                fenceMarker = null;
                flush();
            }

            continue;
        }

        if (!insideFence && !line.trim()) {
            flush();
            continue;
        }

        current.push(line);
    }

    flush();

    return blocks;
};

const splitOversizedSection = (section, maxChars) => {
    const blocks = splitIntoBlocks(section.content);
    const fragments = [];

    let current = "";

    const append = (block) => {
        const candidate = current
            ? `${current}\n\n${block}`
            : block;

        if (candidate.length <= maxChars) {
            current = candidate;
            return;
        }

        if (current) {
            fragments.push(current);
            current = "";
        }

        if (block.length <= maxChars) {
            current = block;
            return;
        }

        // An indivisible block, such as a large fenced code example,
        // is preserved rather than cutting through its contents.
        fragments.push(block);
    };

    for (const block of blocks) {
        append(block);
    }

    if (current) {
        fragments.push(current);
    }

    return fragments.map((content) => ({
        title: section.title,
        content,
    }));
};

const packSections = (sections, maxChars) => {
    const chunks = [];
    let currentSections = [];
    let currentLength = 0;

    const flush = () => {
        if (!currentSections.length) {
            return;
        }

        chunks.push({
            content: currentSections
                .map((section) => section.content)
                .join("\n\n"),
            sectionTitles: currentSections.map(
                (section) => section.title
            ),
        });

        currentSections = [];
        currentLength = 0;
    };

    for (const section of sections) {
        const sectionLength = section.content.length;
        const separatorLength = currentSections.length ? 2 : 0;

        if (
            currentSections.length &&
            currentLength + separatorLength + sectionLength > maxChars
        ) {
            flush();
        }

        currentSections.push(section);
        currentLength +=
            section.content.length +
            (currentSections.length > 1 ? 2 : 0);
    }

    flush();

    return chunks;
};

const chunkMarkdown = ({
    content,
    sourcePath,
    language,
    category,
    maxChars = DEFAULT_MAX_CHARS,
    overlapChars = DEFAULT_OVERLAP_CHARS,
}) => {
    if (typeof content !== "string" || !content.trim()) {
        throw new TypeError("Markdown content must be a non-empty string");
    }

    if (!Number.isInteger(maxChars) || maxChars <= 0) {
        throw new RangeError("maxChars must be a positive integer");
    }

    if (
        !Number.isInteger(overlapChars) ||
        overlapChars < 0 ||
        overlapChars >= maxChars
    ) {
        throw new RangeError(
            "overlapChars must be non-negative and smaller than maxChars"
        );
    }

    const sections = splitIntoSections(content);
    const preparedSections = [];

    for (const section of sections) {
        if (section.content.length <= maxChars) {
            preparedSections.push(section);
            continue;
        }

        preparedSections.push(
            ...splitOversizedSection(section, maxChars)
        );
    }

    const packedChunks = packSections(preparedSections, maxChars);

    return packedChunks.map((chunk, chunkIndex) => ({
        chunkIndex,
        content: chunk.content,
        metadata: {
            sourcePath: sourcePath ?? null,
            language: language ?? null,
            category: category ?? null,
            sectionTitles: chunk.sectionTitles,
        },
    }));
};

module.exports = {
    chunkMarkdown,
    DEFAULT_MAX_CHARS,
    DEFAULT_OVERLAP_CHARS,
};
