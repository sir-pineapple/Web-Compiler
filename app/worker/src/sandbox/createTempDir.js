const fs = require("fs-extra");
const path = require("path");

const createTempDir = async (executionId) => {
    const workerTemp = process.env.WORKER_TEMP;

    const tempDir = path.join(
        workerTemp,
        executionId
    );

    await fs.ensureDir(tempDir);

    return tempDir;
};

module.exports = createTempDir;