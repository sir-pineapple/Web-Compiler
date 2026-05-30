const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const executeRoutes = require("./routes/execute.routes");
const statusRoutes = require("./routes/status.routes");
const projectRoutes = require("./routes/project.routes");
const authRoutes = require("./routes/auth.routes");
const metricsRoutes = require("./routes/metrics.routes");
const debugRoutes = require("./routes/debug.routes");
const { runMigrations } = require("./services/migrations.service");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

app.use("/execute", executeRoutes);
app.use("/execution", statusRoutes);
app.use("/projects", projectRoutes);
app.use("/auth", authRoutes);
app.use("/metrics", metricsRoutes);
app.use("/debug", debugRoutes);

const PORT = process.env.PORT;

const startServer = async () => {
    try {
        await runMigrations();
        app.listen(PORT, () => {
            console.log(`Backend running on port ${PORT}`);
        });
    }
    catch (err) {
        console.error("Startup failed:", err);
        process.exit(1);
    }
}

startServer();