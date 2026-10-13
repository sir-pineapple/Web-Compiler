const { Queue } = require("bullmq");
const redis = require("../config/redis");

const executionQueue = new Queue("executionQueue", {
    connection: redis
});

module.exports = executionQueue;