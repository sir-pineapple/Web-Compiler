const client = require("prom-client");

const register = new client.Registry();

client.collectDefaultMetrics({ register });

const executionCounter = new client.Counter({
    name: "compiler_executions_total",
    help: "Total compiler executions",
    labelNames: ["language", "status"]
});

const executionDuration = new client.Histogram({
    name: "compiler_execution_duration_seconds",
    help: "Execution duration",
    buckets: [0.1, 0.5, 1, 2, 5, 10]
});

register.registerMetric(executionCounter);
register.registerMetric(executionDuration);

module.exports = { register, executionCounter, executionDuration };