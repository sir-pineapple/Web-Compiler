const redis = require("../config/redis");

const saveExecutionResult = async (executionId, result) => {
    await redis.set(`execution:${executionId}`, JSON.stringify(result), "EX", 300);
};

module.exports = { saveExecutionResult };