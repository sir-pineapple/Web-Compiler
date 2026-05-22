const express = require("express");
const cors = require("cors");
require("dotenv").config();

const executeRoutes = require("./routes/execute.routes");
const statusRoutes = require("./routes/status.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

app.use("/execute", executeRoutes);
app.use("/execution", statusRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});