const {
    debugCodeWithRag,
} = require("../services/debug/rag-debug.service");

const debug = async (req, res) => {
    try {
        const result = await debugCodeWithRag(req.body);
        return res.json(result);
    } catch (err) {
        console.error("RAG debug failed:", err.message);

        if (err instanceof TypeError || err instanceof RangeError) {
            return res.status(400).json({
                message: err.message,
            });
        }

        return res.status(500).json({
            message: "Debug failed",
        });
    }
};

module.exports = { debug };