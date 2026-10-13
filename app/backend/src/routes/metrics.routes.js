const express = require("express");
const router = express.Router();
const { metricsController } = require("../controllers/metrics.controller");

router.get("/", metricsController);

module.exports = router;