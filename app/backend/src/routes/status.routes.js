const express = require("express");
const router = express.Router();
const { getExecution } = require("../controllers/status.controller");

router.get("/:id", getExecution);

module.exports = router;