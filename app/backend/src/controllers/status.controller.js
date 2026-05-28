const { getExecutionResult } = require("../services/execution.service");

const getExecution = async (req, res) => {
    const { id } = req.params;
    const result = await getExecutionResult(id);
    if (!result) {
        return res.json({
            status: "running"
        });
    }
    return res.json(result);
};

module.exports = { getExecution };