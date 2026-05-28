const { register } = require("../services/metrics.service");

const metricsController = async (req, res) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
};

module.exports = { metricsController };