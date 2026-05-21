const fs = require("fs-extra");
const path = require("path");

const extensionMap = {
    cpp: "main.cpp",
    c: "main.c",
    java: "Main.java",
    python: "main.py"
};

const writeFiles = async (tempDir, language, code, stdin="") => {
    const filename = extensionMap[language];

    if (!filename) {
        throw new Error(
            `Unsupported language: ${language}`
        );
    }

    await fs.writeFile(path.join(tempDir, filename), code);

    await fs.writeFile(path.join(tempDir, "stdin.txt"), stdin);

    return filename;
};

module.exports = writeFiles;