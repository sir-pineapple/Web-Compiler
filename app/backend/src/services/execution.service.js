const redis = require("../config/redis");

const saveExecutionResult = async (executionId, result) => {
    await redis.set(`execution:${executionId}`, JSON.stringify(result), "EX", 300);
};

const getExecutionResult = async (executionId) => {
    const result = await redis.get(`execution:${executionId}`);
    if (!result) {
        return null;
    }
    return JSON.parse(result);
};

module.exports = { saveExecutionResult, getExecutionResult };