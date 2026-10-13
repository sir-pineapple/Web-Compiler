const fs = require("fs-extra");

const cleanup = async (tempDir) => {
    try {
        await fs.remove(tempDir);
    }
    catch (err) {
        console.error("Cleanup failed", err);
    }
};

module.exports = cleanup;