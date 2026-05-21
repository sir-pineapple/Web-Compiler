const { v4:uuidv4 } = require("uuid");
const executionQueue = require("../queue/execution.queue");

const executeCode = async (req, res) => {
    try {
        const { language, code, stdin } = req.body;

        if (!language || !code) {
            return res.status(400).json({
                error: "language and code required"
            });
        }

        const executionId = uuidv4();

        await executionQueue.add("execute", {
            executionId,
            language,
            code,
            stdin: stdin || ""
        });

        return res.status(202).json({
            executionId,
            status: "queued"
        });
    }
    catch (err) {
        console.error(err);

        return res.status(500).json({
            error: "execution failed"
        });
    }
};

module.exports = { executeCode };