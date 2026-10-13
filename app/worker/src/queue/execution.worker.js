const { Worker } = require("bullmq");
const redis = require("../config/redis");
const createTempDir = require("../sandbox/createTempDir");
const writeFiles = require("../sandbox/writeFiles");
const cleanup = require("../sandbox/cleanup");
const runContainer = require("../docker/containerManager");
const { saveExecutionResult } = require("../services/execution.service");

const worker = new Worker(
    "executionQueue",

    async (job) => {
        const {
            language,
            code,
            stdin
        } = job.data;

        let tempDir;

        try {
            tempDir = await createTempDir(job.data.executionId);

            await writeFiles(tempDir, language, code, stdin);
            const result = await runContainer(language, tempDir);

            await saveExecutionResult(job.data.executionId, result);

            console.log("Execution Result:");
            console.log(result);

            return { success: true, result };
        }
        finally {
            if (tempDir) {
                await cleanup(tempDir);
            }
        }
    },

    { connection: redis }
);

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed`);
    console.error(err);
});