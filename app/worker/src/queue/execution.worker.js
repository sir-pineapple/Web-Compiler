const { Worker } = require("bullmq");
const redis = require("../config/redis");

const worker = new Worker(
    "executionQueue",

    async (job) => {
        console.log("Job received:");

        console.log(job.data);

        return {
            success: true
        };
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