const { debugCode } = require("../services/debug.service");

const debug = async (req, res) => {
    try {
        const result = await debugCode(req.body);
        return res.json(result);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Debug failed" });
    }
};

module.exports = { debug };